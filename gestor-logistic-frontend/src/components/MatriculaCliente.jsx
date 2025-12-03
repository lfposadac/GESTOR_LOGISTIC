import React, { useState } from 'react';
import { apiService } from '../services/api';

const defCli = { nit: '', nombreLegal: '', representanteLegal: '', usuarioPrueba: '' };
const defDoc = { tipoDocumento: 'RUT', fechaVencimiento: '', rutaArchivo: '' };

export const MatriculaCliente = ({ onSuccess }) => {
    const [cliente, setCliente] = useState(defCli);
    const [docs, setDocs] = useState([defDoc]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const hChange = e => setCliente({...cliente, [e.target.name]: e.target.value});
    const dChange = (i, e) => {
        const n = [...docs]; n[i][e.target.name] = e.target.value; setDocs(n);
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiService.matricularCliente({
                cliente: { ...cliente, fecha_matricula: new Date().toISOString() },
                documentos: docs.map(d => ({...d, fecha_vencimiento: new Date(d.fechaVencimiento).toISOString()}))
            });
            setMsg(`✅ Cliente creado ID: ${res.cliente_id}`);
            if(onSuccess) onSuccess(res.cliente_id);
            setCliente(defCli); setDocs([defDoc]);
        } catch(err) { setMsg('❌ Error al guardar'); }
        setLoading(false);
    };

    return (
        <div className="card">
            <h3 style={{marginTop:0, color:'var(--primary-blue)'}}>Matricular Cliente</h3>
            <form onSubmit={submit}>
                {/* GRID RESPONSIVE */}
                <div className="form-grid-2">
                    <input className="form-input" name="nit" value={cliente.nit} onChange={hChange} placeholder="NIT" required />
                    <input className="form-input" name="nombreLegal" value={cliente.nombreLegal} onChange={hChange} placeholder="Razón Social" required />
                    <input className="form-input" name="representanteLegal" value={cliente.representanteLegal} onChange={hChange} placeholder="Rep. Legal" />
                    <input className="form-input" name="usuarioPrueba" value={cliente.usuarioPrueba} onChange={hChange} placeholder="Usuario Prueba" />
                </div>

                <h4 style={{marginBottom:10, color:'var(--primary-blue)'}}>Documentos</h4>
                {docs.map((d, i) => (
                    <div key={i} className="form-grid-2" style={{background:'#f9f9f9', padding:15, borderRadius:8, marginBottom:15}}>
                        <select className="form-input" name="tipoDocumento" value={d.tipoDocumento} onChange={e=>dChange(i,e)}>
                            <option>RUT</option><option>Cámara de Comercio</option><option>Cédula</option>
                        </select>
                        <input className="form-input" type="date" name="fechaVencimiento" value={d.fechaVencimiento} onChange={e=>dChange(i,e)} required />
                        <input className="form-input" name="rutaArchivo" value={d.rutaArchivo} onChange={e=>dChange(i,e)} placeholder="Link del archivo" style={{gridColumn: '1 / -1'}} />
                    </div>
                ))}
                
                <div style={{display:'flex', gap:10}}>
                    <button type="button" className="btn-secondary" onClick={()=>setDocs([...docs, defDoc])}>+ Documento</button>
                    <button type="submit" className="btn-primary" disabled={loading}>{loading?'Guardando...':'Guardar Cliente'}</button>
                </div>
            </form>
            <p style={{marginTop:15, fontWeight:'bold'}}>{msg}</p>
        </div>
    );
};