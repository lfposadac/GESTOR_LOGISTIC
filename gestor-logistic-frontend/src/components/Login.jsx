import React, { useState } from 'react';
import { apiService } from '../services/api';

export const Login = ({ onLoginSuccess }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [msg, setMsg] = useState('');

    const reqOTP = async (e) => {
        e.preventDefault();
        try {
            await apiService.solicitudOTP(email);
            setMsg('Código enviado (ver consola servidor)');
            setStep(2);
        } catch { setMsg('Error enviando código'); }
    };

    const verOTP = async (e) => {
        e.preventDefault();
        try {
            await apiService.verificarOTP(email, otp);
            onLoginSuccess(true);
        } catch { setMsg('Código inválido'); }
    };

    return (
        <div style={{padding: 20, maxWidth: 350, margin: '50px auto', border:'1px solid #ddd'}}>
            <h3>Acceso Corporativo</h3>
            {step === 1 ? (
                <form onSubmit={reqOTP}>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required style={{width:'100%', marginBottom:10}}/>
                    <button type="submit" style={{width:'100%'}}>Solicitar Token</button>
                </form>
            ) : (
                <form onSubmit={verOTP}>
                    <p>Enviado a {email}</p>
                    <input type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Código 6 dígitos" required style={{width:'100%', marginBottom:10}}/>
                    <button type="submit" style={{width:'100%'}}>Entrar</button>
                </form>
            )}
            <p style={{color:'red'}}>{msg}</p>
        </div>
    );
};
