import React, { useState } from 'react';
import { apiService } from '../services/api';
// IMPORTANTE: Logo a Color para fondo blanco
import logoColor from '../assets/logo_color.png'; 

export const Login = ({ onLoginSuccess }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const reqOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.solicitudOTP(email);
            setMsg('Código enviado (verifique consola backend).');
            setStep(2);
        } catch (err) { setMsg('❌ Usuario no encontrado o error de conexión.'); }
        setLoading(false);
    };

    const verOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.verificarOTP(email, otp);
            onLoginSuccess(true);
        } catch (err) { setMsg('❌ Código inválido o expirado.'); }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logoColor} alt="Integra Comex" style={{ height: '70px', marginBottom: '25px' }} />
                <h2 style={{color:'var(--primary-blue)', marginBottom:25}}>Acceso Corporativo</h2>
                
                {step === 1 ? (
                    <form onSubmit={reqOTP}>
                        <div style={{textAlign:'left', marginBottom:5, fontSize:'0.9rem', fontWeight:'bold', color:'#555'}}>Correo Electrónico</div>
                        <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ejemplo@integracomex.com.co" required />
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Enviando...' : 'Solicitar Código de Acceso'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verOTP}>
                        <p style={{marginBottom:20}}>Hemos enviado un código de 6 dígitos a:<br/><strong>{email}</strong></p>
                        <input className="form-input" type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="000000" maxLength="6" style={{textAlign:'center', fontSize:24, letterSpacing:8, fontWeight:'bold'}} required />
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Verificando...' : 'Iniciar Sesión'}
                        </button>
                        <button type="button" onClick={()=>setStep(1)} style={{marginTop:20, background:'none', border:'none', color:'var(--primary-blue)', textDecoration:'underline', cursor:'pointer', fontSize:'0.9rem'}}>
                            Volver / Corregir correo
                        </button>
                    </form>
                )}
                <p style={{color:msg.includes('❌')?'red':'green', marginTop:20, fontWeight:'500'}}>{msg}</p>
            </div>
        </div>
    );
};