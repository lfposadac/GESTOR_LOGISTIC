import React from 'react';

export const Dashboard = ({ onViewChange }) => {
    const cardStyle = {
        padding: '40px', 
        borderRadius: '12px', 
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
        cursor: 'pointer',
        backgroundColor: 'white', 
        borderTop: '6px solid var(--primary-blue)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    };

    const handleHover = (e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    };
    const handleLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
    };

    return (
        <div className="container">
            <h2 style={{textAlign:'center', margin:'20px 0 40px 0', color:'var(--primary-blue)', fontSize:'2rem'}}>
                Panel de Control
            </h2>
            
            <div className="dashboard-grid">
                {/* Módulo Clientes */}
                <div style={cardStyle} onClick={() => onViewChange('clientes')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                    <div style={{fontSize:'50px', marginBottom:20}}>👥</div>
                    <h3 style={{color:'var(--primary-blue)', margin:0}}>Gestión de Clientes</h3>
                    <p style={{color:'#666', marginTop:10}}>Matrícula, RUT y Documentos.</p>
                    <button className="btn-secondary" style={{width:'100%', marginTop:20}}>Ingresar</button>
                </div>

                {/* Módulo Operaciones */}
                <div style={cardStyle} onClick={() => onViewChange('operaciones')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                    <div style={{fontSize:'50px', marginBottom:20}}>📦</div>
                    <h3 style={{color:'var(--primary-blue)', margin:0}}>Operaciones (DO)</h3>
                    <p style={{color:'#666', marginTop:10}}>Carga Masiva y Fotos.</p>
                    <button className="btn-secondary" style={{width:'100%', marginTop:20}}>Ingresar</button>
                </div>
            </div>
        </div>
    );
};