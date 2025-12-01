import React, { useState } from 'react';
import { apiService } from '../services/api';

export const CargaMasiva = ({ currentDoId }) => {
    const [doId, setDoId] = useState(currentDoId || '');
    
    // CSV State
    const [csvFile, setCsvFile] = useState(null);
    const [csvMessage, setCsvMessage] = useState('');
    
    // Fotos State
    const [photoFiles, setPhotoFiles] = useState([]);
    const [itemIds, setItemIds] = useState('1001,1002,1003'); // Placeholder for Items
    const [photoMessage, setPhotoMessage] = useState('');
    
    // PDF State
    const [pdfMessage, setPdfMessage] = useState('');

    const handleCsvSubmit = async (e) => {
        e.preventDefault();
        if (!csvFile || !doId) return;

        setCsvMessage('Procesando CSV...');
        try {
            const result = await apiService.cargarCSV(doId, csvFile);
            setCsvMessage(`✅ CSV Éxito: ${result.message}`);
        } catch (err) {
            setCsvMessage(`❌ CSV Error: ${err.error || err.details || 'Fallo al cargar CSV'}`);
        }
    };

    const handlePhotoSubmit = async (e) => {
        e.preventDefault();
        if (photoFiles.length === 0 || !doId) return;

        setPhotoMessage('Subiendo fotos...');

        try {
            const idsArray = itemIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            const result = await apiService.cargarFotos(doId, photoFiles, idsArray);
            setPhotoMessage(`✅ Fotos Éxito: ${result.message}`);
            setPhotoFiles([]);
            document.getElementById('photo-input').value = '';
        } catch (err) {
            setPhotoMessage(`❌ Fotos Error: ${err.error || err.details || 'Fallo al cargar fotos'}`);
        }
    };
    
    const handleGeneratePDF = async () => {
        if (!doId) return;
        setPdfMessage('Generando PDF...');

        try {
            const result = await apiService.generarPDF(doId);
            setPdfMessage(`✅ PDF Éxito: ${result.message || 'PDF generado correctamente. (Revisar consola para descarga)'}`);
            // En una app real, aquí se manejaría la descarga del Blob de respuesta.
        } catch (err) {
            setPdfMessage(`❌ PDF Error: ${err.error || 'Fallo al generar PDF'}`);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px', border: '1px solid #ccc' }}>
            <h3>2. Gestión de Documento Operativo (DO ID: {doId || 'N/A'})</h3>
            <input type="number" value={doId} onChange={(e) => setDoId(e.target.value)} placeholder="Ingresar ID del DO" required />

            {/* Carga CSV */}
            <div style={{ border: '1px solid #ddd', padding: '15px' }}>
                <h4>Carga de CSV/Excel (Proceso 4)</h4>
                <form onSubmit={handleCsvSubmit}>
                    <input type="file" accept=".csv, .xlsx" onChange={(e) => setCsvFile(e.target.files[0])} required />
                    <button type="submit" disabled={!csvFile || !doId}>Subir CSV para Ítems</button>
                    <p style={{ color: csvMessage.startsWith('❌') ? 'red' : 'green' }}>{csvMessage}</p>
                </form>
            </div>
            
            {/* Carga Fotos */}
            <div style={{ border: '1px solid #ddd', padding: '15px' }}>
                <h4>Carga Masiva de Fotos (Proceso 4)</h4>
                <form onSubmit={handlePhotoSubmit}>
                    <label>IDs de Ítems Asociados (separados por coma):</label>
                    <input type="text" value={itemIds} onChange={(e) => setItemIds(e.target.value)} placeholder="Ej: 1001, 1002" />

                    <input type="file" id="photo-input" accept="image/*" multiple onChange={(e) => setPhotoFiles(Array.from(e.target.files))} required />
                    <button type="submit" disabled={photoFiles.length === 0 || !doId}>Subir Fotos ({photoFiles.length})</button>
                    <p style={{ color: photoMessage.startsWith('❌') ? 'red' : 'green' }}>{photoMessage}</p>
                </form>
            </div>

            {/* Generación PDF */}
            <div style={{ border: '1px solid #ddd', padding: '15px' }}>
                <h4>Generar PDF para Revisión (Proceso 5)</h4>
                <button onClick={handleGeneratePDF} disabled={!doId}>Generar Documento Final</button>
                <p style={{ color: pdfMessage.startsWith('❌') ? 'red' : 'green' }}>{pdfMessage}</p>
            </div>
        </div>
    );
};