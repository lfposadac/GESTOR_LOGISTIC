import React, { useState } from 'react';
import { apiService } from '../services/api';
// Logo COLOR para fondo blanco
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
            setMsg('Código enviado (revise consola/email).');
            setStep(2);
        } catch (err) { setMsg('Error: Usuario no encontrado.'); }
        setLoading(false);
    };

    const verOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.verificarOTP(email, otp);
            onLoginSuccess(true);
        } catch (err) { setMsg('Código inválido.'); }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logoColor} alt="Integra Comex" style={{ height: '70px', marginBottom: '25px', maxWidth:'100%' }} />
                <h2 style={{color:'var(--primary-blue)', marginBottom:25}}>Acceso Corporativo</h2>
                
                {step === 1 ? (
                    <form onSubmit={reqOTP}>
                        <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Corporativo" required />
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Enviando...' : 'Solicitar Código'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verOTP}>
                        <p>Enviado a: <strong>{email}</strong></p>
                        <input className="form-input" type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="000000" maxLength="6" style={{textAlign:'center', fontSize:'1.2rem', letterSpacing:5}} required />
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Verificando...' : 'Ingresar'}
                        </button>
                        <button type="button" onClick={()=>setStep(1)} style={{marginTop:20, background:'none', border:'none', color:'var(--primary-blue)', textDecoration:'underline', cursor:'pointer'}}>Volver</button>
                    </form>
                )}
                <p style={{marginTop:15, color: msg.includes('Error')?'red':'green'}}>{msg}</p>
            </div>
        </div>
    );
};