// src/components/Login.jsx
import React, { useState } from 'react';
import { apiService } from '../services/api';
import logo from '../assets/logo_integra.png'; // Asegúrate de que la ruta sea correcta

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
            setMsg('Código enviado (revise consola del backend)');
            setStep(2);
        } catch (err) { setMsg('Error solicitando código'); }
        setLoading(false);
    };

    const verOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.verificarOTP(email, otp);
            onLoginSuccess(true);
        } catch (err) { setMsg('Código inválido o expirado'); }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: 'var(--bg-light)' 
        }}>
            <div style={{ 
                backgroundColor: 'var(--white)', 
                padding: '40px', 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center'
            }}>
                <img src={logo} alt="Integra Comex Logo" style={{ height: '80px', marginBottom: '20px' }} />
                <h2 style={{ color: 'var(--primary-blue)', marginBottom: '30px' }}>Acceso Seguro</h2>
                
                {step === 1 ? (
                    <form onSubmit={reqOTP}>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e=>setEmail(e.target.value)} 
                            placeholder="Correo electrónico corporativo" 
                            required 
                            style={inputStyle}
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Enviando...' : 'Solicitar Código de Acceso'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verOTP}>
                        <p style={{marginBottom: '20px', color: 'var(--text-dark)'}}>
                            Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
                        </p>
                        <input 
                            type="text" 
                            value={otp} 
                            onChange={e=>setOtp(e.target.value)} 
                            placeholder="Ingrese Código OTP" 
                            required 
                            maxLength="6"
                            style={{...inputStyle, textAlign: 'center', letterSpacing: '5px', fontSize: '24px'}}
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                             {loading ? 'Verificando...' : 'Iniciar Sesión'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} style={{background:'none', border:'none', color:'var(--primary-blue)', marginTop:'15px', cursor:'pointer', textDecoration:'underline'}}>
                            Volver / Solicitar nuevo código
                        </button>
                    </form>
                )}
                <p style={{ color: msg.includes('Error') || msg.includes('inválido') ? 'red' : 'green', marginTop: '20px' }}>
                    {msg}
                </p>
            </div>
        </div>
    );
};