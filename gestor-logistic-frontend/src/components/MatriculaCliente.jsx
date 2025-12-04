import React, { useState } from 'react';
import { apiService } from '../services/api';

const defCli = { nit: '', nombreLegal: '', representanteLegal: '', usuarioPrueba: '' };
// Agregamos propiedad 'file' null al inicio
const defDoc = { tipoDocumento: 'RUT', fechaVencimiento: '', rutaArchivo: '', file: null };

export const MatriculaCliente = ({ onSuccess }) => {
    const [cliente, setCliente] = useState(defCli);
    const [docs, setDocs] = useState([defDoc]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const hChange = e => setCliente({...cliente, [e.target.name]: e.target.value});
    
    // Cambio: Manejo especial para inputs de texto vs archivos
    const dChange = (i, e) => {
        const n = [...docs];
        if (e.target.name === 'file') {
            // Guardamos el objeto File real
            n[i].file = e.target.files[0];
            // Ponemos el nombre del archivo en la ruta visualmente
            n[i].rutaArchivo = e.target.files[0] ? e.target.files[0].name : '';
        } else {
            n[i][e.target.name] = e.target.value;
        }
        setDocs(n);
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Enviamos todo al servicio (Cliente + Docs + Archivos)
            const res = await apiService.matricularCliente(cliente, docs);
            setMsg(`✅ Cliente creado ID: ${res.cliente_id}`);
            if(onSuccess) onSuccess(res.cliente_id);
            setCliente(defCli); 
            setDocs([defDoc]);
        } catch(err) { 
            console.error(err);
            setMsg('❌ Error al guardar'); 
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h3 style={{marginTop:0, color:'var(--primary-blue)'}}>Matricular Cliente</h3>
            <form onSubmit={submit}>
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
                        
                        {/* AQUI EL CAMBIO: Input tipo FILE */}
                        <div style={{gridColumn: '1 / -1'}}>
                            <label style={{display:'block', marginBottom:5, fontSize:'0.9rem'}}>Subir Archivo (PDF/Imagen):</label>
                            <input 
                                type="file" 
                                name="file" 
                                className="form-input" 
                                accept=".pdf,.jpg,.png,.jpeg"
                                onChange={e=>dChange(i,e)} 
                                required // Obligatorio seleccionar archivo
                            />
                        </div>
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