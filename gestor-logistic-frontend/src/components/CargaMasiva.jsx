import React, { useState } from 'react';
import { apiService } from '../services/api';

export const CargaMasiva = ({ currentDoId }) => {
    const [doId, setDoId] = useState(currentDoId || '');
    const [csvFile, setCsvFile] = useState(null);
    const [photos, setPhotos] = useState(null);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCsvUpload = async (e) => {
        e.preventDefault();
        if(!csvFile || !doId) return;
        setLoading(true);
        setMsg('Procesando Excel...');
        
        try {
            // El backend leerá las columnas nuevas (Marca, Serial, etc) automáticamente
            const res = await apiService.cargarCSV(doId, csvFile);
            setMsg(`✅ Importación exitosa: ${res.items} items procesados.`);
        } catch (err) {
            setMsg(`❌ Error: ${err.error || 'Fallo en carga'}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        e.preventDefault();
        if(!photos || !doId) return;
        setLoading(true);
        setMsg('Subiendo fotos...');

        try {
            const res = await apiService.cargarFotos(doId, photos);
            setMsg(`✅ Fotos subidas: ${res.processed} archivos.`);
        } catch (err) {
            setMsg(`❌ Error fotos: ${err.error || 'Fallo en subida'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{border:'1px solid #ddd', padding: 20}}>
            <h3>2. Gestión Operativa (DO)</h3>
            <div style={{marginBottom:15}}>
                <label>ID del Documento Operativo (DO): </label>
                <input type="number" value={doId} onChange={e=>setDoId(e.target.value)} style={{width:80}} required />
            </div>

            <div style={{display:'flex', gap:20}}>
                {/* Carga Excel */}
                <form onSubmit={handleCsvUpload} style={{flex:1, padding:10, background:'#f0f8ff'}}>
                    <h4>A. Cargar Ítems (Excel/CSV)</h4>
                    <p style={{fontSize:12}}>Asegúrese que el archivo incluya: Producto, Marca, Modelo, Serial.</p>
                    <input type="file" accept=".csv, .xlsx" onChange={e=>setCsvFile(e.target.files[0])} required />
                    <button type="submit" disabled={loading} style={{marginTop:10, display:'block'}}>Subir Plano</button>
                </form>

                {/* Carga Fotos */}
                <form onSubmit={handlePhotoUpload} style={{flex:1, padding:10, background:'#fff0f5'}}>
                    <h4>B. Evidencia Fotográfica</h4>
                    <input type="file" multiple accept="image/*" onChange={e=>setPhotos(e.target.files)} required />
                    <button type="submit" disabled={loading} style={{marginTop:10, display:'block'}}>Subir Fotos</button>
                </form>
            </div>
            <p style={{fontWeight:'bold', marginTop:10}}>{msg}</p>
        </div>
    );
};