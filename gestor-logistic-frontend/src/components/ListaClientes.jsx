import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export const ListaClientes = ({ onSelectCliente, onNuevoCliente }) => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await apiService.getClientes();
            setClientes(data || []);
        } catch (error) {
            alert('Error cargando clientes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <h3 style={{margin:0, color:'var(--primary-blue)'}}>Directorio de Clientes</h3>
                <button className="btn-primary btn-sm" onClick={onNuevoCliente}>+ Nuevo Cliente</button>
            </div>

            {loading ? <p>Cargando...</p> : (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>NIT</th>
                                <th>Razón Social</th>
                                <th>Representante</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length === 0 ? (
                                <tr><td colSpan="4" style={{textAlign:'center'}}>No hay clientes registrados.</td></tr>
                            ) : (
                                clientes.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.nit}</td>
                                        <td>{c.nombre_legal}</td>
                                        <td>{c.representante_legal}</td>
                                        <td>
                                            <button 
                                                className="btn-secondary btn-sm"
                                                onClick={() => onSelectCliente(c)}
                                            >
                                                Ver DOs
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