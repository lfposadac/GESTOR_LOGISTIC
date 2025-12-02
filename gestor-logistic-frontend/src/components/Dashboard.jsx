// src/components/Dashboard.jsx
import React from 'react';

export const Dashboard = ({ onViewChange }) => {
    
    const cardStyle = {
        backgroundColor: 'var(--white)',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        borderTop: '5px solid var(--primary-blue)'
    };

    const cardHoverStyle = e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderTopColor = 'var(--accent-orange)';
    };

    const cardLeaveStyle = e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        e.currentTarget.style.borderTopColor = 'var(--primary-blue)';
    };

    return (
        <div className="container">
            <h2 style={{textAlign: 'center', marginBottom: '40px', fontSize: '2rem'}}>
                Bienvenido al Gestor Logístico
            </h2>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '30px',
                padding: '20px'
            }}>
                
                {/* Botón Proceso 1: Clientes */}
                <div 
                    style={cardStyle}
                    onMouseEnter={cardHoverStyle}
                    onMouseLeave={cardLeaveStyle}
                    onClick={() => onViewChange('clientes')}
                >
                    <div style={{ fontSize: '50px', color: 'var(--primary-blue)', marginBottom: '20px' }}>
                        👥
                    </div>
                    <h3>Gestión de Clientes</h3>
                    <p>Matrícula de empresas y carga de documentos soporte (RUT, Cámara de Comercio).</p>
                    <button className="btn-secondary" style={{marginTop: '20px'}}>Acceder</button>
                </div>

                {/* Botón Proceso 2: Operaciones DO */}
                <div 
                    style={cardStyle}
                    onMouseEnter={cardHoverStyle}
                    onMouseLeave={cardLeaveStyle}
                    onClick={() => onViewChange('operaciones')}
                >
                     <div style={{ fontSize: '50px', color: 'var(--primary-blue)', marginBottom: '20px' }}>
                        📦
                    </div>
                    <h3>Operaciones (DO)</h3>
                    <p>Gestión de Documentos Operativos, carga masiva de ítems (CSV) y fotos.</p>
                    <button className="btn-secondary" style={{marginTop: '20px'}}>Acceder</button>
                </div>

                 {/* Botón Futuro: Reportes */}
                 <div 
                    style={{...cardStyle, opacity: 0.6, cursor: 'not-allowed'}}
                >
                     <div style={{ fontSize: '50px', color: 'gray', marginBottom: '20px' }}>
                        📊
                    </div>
                    <h3 style={{color: 'gray'}}>Reportes y PDF</h3>
                    <p>Generación de documentos finales y reportes gerenciales (Próximamente).</p>
                </div>

            </div>
        </div>
    );
};