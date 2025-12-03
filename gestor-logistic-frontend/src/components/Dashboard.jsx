import React from 'react';

export const Dashboard = ({ onViewChange }) => {
    return (
        <div className="container">
            <h2 style={{textAlign:'center', margin:'30px 0', color:'var(--primary-blue)'}}>
                Panel de Control
            </h2>
            
            <div className="dashboard-grid">
                
                {/* Tarjeta Clientes */}
                <div 
                    className="card" 
                    onClick={() => onViewChange('clientes')} 
                    style={{cursor:'pointer', borderTop:'6px solid var(--primary-blue)'}}
                >
                    {/* Icono */}
                    <div>👥</div>
                    
                    {/* Título y Texto (Controlados por CSS ahora) */}
                    <h3>Clientes</h3>
                    <p>Gestión de matrícula, RUT y documentos legales.</p>
                    
                    <button className="btn-secondary" style={{marginTop: 20}}>
                        Ingresar
                    </button>
                </div>

                {/* Tarjeta Operaciones */}
                <div 
                    className="card" 
                    onClick={() => onViewChange('operaciones')} 
                    style={{cursor:'pointer', borderTop:'6px solid var(--primary-blue)'}}
                >
                    {/* Icono */}
                    <div>📦</div>
                    
                    {/* Título y Texto */}
                    <h3>Operaciones (DO)</h3>
                    <p>Carga masiva de ítems, fotos y seguimiento.</p>
                    
                    <button className="btn-secondary" style={{marginTop: 20}}>
                        Ingresar
                    </button>
                </div>

            </div>
        </div>
    );
};