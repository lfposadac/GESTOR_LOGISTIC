import React, { useState } from 'react';
import { apiService } from '../services/api';

const defaultCliente = { nit: '', nombreLegal: '', representanteLegal: '', usuarioPrueba: '' };
const defaultDoc = { tipoDocumento: 'RUT', fechaVencimiento: '', rutaArchivo: '' };

export const MatriculaCliente = ({ onMatriculaSuccess }) => {
    const [cliente, setCliente] = useState(defaultCliente);
    const [documentos, setDocumentos] = useState([defaultDoc]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClienteChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleDocChange = (index, e) => {
        const newDocs = documentos.map((doc, i) => {
            if (i === index) {
                // Asegura que la fecha sea en formato YYYY-MM-DD para Go
                const value = e.target.name === 'fechaVencimiento' ? e.target.value : e.target.value;
                return { ...doc, [e.target.name]: value };
            }
            return doc;
        });
        setDocumentos(newDocs);
    };

    const addDocumento = () => {
        setDocumentos([...documentos, { ...defaultDoc, tipoDocumento: 'Cámara de Comercio' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const clienteFinal = { 
            ...cliente, 
            fechaMatricula: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
        };
        
        try {
            const result = await apiService.matricularCliente({
                cliente: clienteFinal,
                documentos: documentos,
            });
            setMessage(`✅ Cliente matriculado (ID: ${result.cliente_id}).`);
            onMatriculaSuccess(result.cliente_id); // Notificar al padre
            setCliente(defaultCliente);
            setDocumentos([defaultDoc]);
        } catch (err) {
            setMessage(`❌ Error: ${err.error || err.details || 'Fallo de conexión'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '30px' }}>
            <h3>1. Matrícula de Cliente y Documentos</h3>
            <form onSubmit={handleSubmit}>
                {/* ... (Campos del Cliente) ... */}
                <input name="nit" value={cliente.nit} onChange={handleClienteChange} placeholder="NIT" required />
                <input name="nombreLegal" value={cliente.nombreLegal} onChange={handleClienteChange} placeholder="Nombre Legal" required />
                <input name="representanteLegal" value={cliente.representanteLegal} onChange={handleClienteChange} placeholder="Representante Legal" />

                <h4 style={{ marginTop: '20px' }}>Documentos para Alertas</h4>
                {documentos.map((doc, index) => (
                    <div key={index} style={{ border: '1px dotted #eee', padding: '10px', margin: '10px 0' }}>
                        <select name="tipoDocumento" value={doc.tipoDocumento} onChange={(e) => handleDocChange(index, e)}>
                            <option value="RUT">RUT</option>
                            <option value="Cámara de Comercio">Cámara de Comercio</option>
                            <option value="Cédula Representante">Cédula Representante</option>
                        </select>
                        <input type="date" name="fechaVencimiento" value={doc.fechaVencimiento} onChange={(e) => handleDocChange(index, e)} required />
                        {/* Puedes implementar la subida de archivo real aquí, pero por ahora usamos la ruta */}
                        <input name="rutaArchivo" value={doc.rutaArchivo} onChange={(e) => handleDocChange(index, e)} placeholder="Ruta/URL del archivo" />
                    </div>
                ))}
                
                <button type="button" onClick={addDocumento} disabled={loading}>+ Agregar Documento</button>
                <button type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
                    {loading ? 'Matriculando...' : 'Matricular Cliente'}
                </button>
                <p style={{ color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>
            </form>
        </div>
    );
};