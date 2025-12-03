import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export const ListaDOs = ({ cliente, onBack, onGestionarDO }) => {
    const [dos, setDos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(cliente) loadData();
    }, [cliente]);

    const loadData = async () => {
        try {
            const data = await apiService.getDOsPorCliente(cliente.id);
            setDos(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div style={{marginBottom:20}}>
                <button className="btn-secondary btn-sm" onClick={onBack}>← Volver a Clientes</button>
            </div>
            
            <h3 style={{color:'var(--primary-blue)'}}>Operaciones: {cliente.nombre_legal}</h3>
            <p style={{marginBottom:20}}>NIT: {cliente.nit}</p>

            {loading ? <p>Cargando...</p> : (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Código DO</th>
                                <th>Fecha Creación</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dos.length === 0 ? (
                                <tr><td colSpan="4" style={{textAlign:'center'}}>Este cliente no tiene operaciones.</td></tr>
                            ) : (
                                dos.map(d => (
                                    <tr key={d.id}>
                                        <td><strong>{d.codigo_do}</strong></td>
                                        <td>{new Date(d.fecha_creacion).toLocaleDateString()}</td>
                                        <td><span style={{
                                            padding:'4px 8px', borderRadius:'10px', fontSize:'0.8rem',
                                            backgroundColor: d.estado === 'ABIERTO' ? '#e3f2fd' : '#eee',
                                            color: d.estado === 'ABIERTO' ? '#002B5C' : '#666'
                                        }}>{d.estado}</span></td>
                                        <td>
                                            <button 
                                                className="btn-primary btn-sm"
                                                onClick={() => onGestionarDO(d.id)}
                                            >
                                                Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};