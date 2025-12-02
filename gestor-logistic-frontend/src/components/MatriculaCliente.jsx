import React, { useState } from 'react';
import { apiService } from '../services/api';

const defaultCliente = { nit: '', nombreLegal: '', representanteLegal: '', usuarioPrueba: '' };
const defaultDoc = { tipoDocumento: 'RUT', fechaVencimiento: '', rutaArchivo: '' };

export const MatriculaCliente = ({ onMatriculaSuccess }) => {
    const [cliente, setCliente] = useState(defaultCliente);
    const [documentos, setDocumentos] = useState([defaultDoc]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClienteChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleDocChange = (index, e) => {
        const newDocs = documentos.map((doc, i) => {
            if (i === index) return { ...doc, [e.target.name]: e.target.value };
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
        setMsg('');

        // Preparamos los datos con formato de fecha ISO para Go
        const clientePayload = {
            ...cliente,
            // Go espera formato RFC3339 (Ej: 2023-11-20T00:00:00Z)
            fecha_matricula: new Date().toISOString()
        };

        const docsPayload = documentos.map(d => ({
            tipo_documento: d.tipoDocumento,
            ruta_archivo: d.rutaArchivo, // En un caso real, aquí iría la URL de S3 tras subir el archivo
            // Convertir la fecha del input date (YYYY-MM-DD) a ISO
            fecha_vencimiento: d.fechaVencimiento ? new Date(d.fechaVencimiento).toISOString() : new Date().toISOString()
        }));

        try {
            const res = await apiService.matricularCliente({
                cliente: clientePayload,
                documentos: docsPayload
            });
            setMsg(`✅ Cliente creado con ID: ${res.cliente_id}`);
            if (onMatriculaSuccess) onMatriculaSuccess(res.cliente_id);
            setCliente(defaultCliente);
            setDocumentos([defaultDoc]);
        } catch (err) {
            setMsg(`❌ Error: ${err.error || 'Fallo de conexión'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{border:'1px solid #ddd', padding: 20, marginBottom: 20}}>
            <h3>1. Matricular Cliente</h3>
            <form onSubmit={handleSubmit}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                    <input name="nit" value={cliente.nit} onChange={handleClienteChange} placeholder="NIT" required />
                    <input name="nombreLegal" value={cliente.nombreLegal} onChange={handleClienteChange} placeholder="Razón Social" required />
                    <input name="representanteLegal" value={cliente.representanteLegal} onChange={handleClienteChange} placeholder="Rep. Legal" />
                    <input name="usuarioPrueba" value={cliente.usuarioPrueba} onChange={handleClienteChange} placeholder="Usuario Prueba" />
                </div>
                
                <h4>Documentos (Vencimientos)</h4>
                {documentos.map((doc, i) => (
                    <div key={i} style={{marginBottom:10, padding:10, background:'#f9f9f9'}}>
                        <select name="tipoDocumento" value={doc.tipoDocumento} onChange={(e)=>handleDocChange(i,e)}>
                            <option>RUT</option>
                            <option>Cámara de Comercio</option>
                            <option>Cédula</option>
                        </select>
                        <input type="date" name="fechaVencimiento" value={doc.fechaVencimiento} onChange={(e)=>handleDocChange(i,e)} required title="Fecha Vencimiento"/>
                        <input name="rutaArchivo" value={doc.rutaArchivo} onChange={(e)=>handleDocChange(i,e)} placeholder="Link del archivo" />
                    </div>
                ))}
                <button type="button" onClick={addDocumento} style={{marginRight:10}}>+ Otro Doc</button>
                <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Matricular'}</button>
            </form>
            <p>{msg}</p>
        </div>
    );
};