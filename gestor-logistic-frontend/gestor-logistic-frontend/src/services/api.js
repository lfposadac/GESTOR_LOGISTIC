import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiService = {
    // Proceso 1: Matricular cliente y documentos
    matricularCliente: async (clienteData) => {
        try {
            const response = await api.post('/clientes/matricula', clienteData);
            return response.data;
        } catch (error) {
            // Manejo de errores que captura el detalle enviado por el backend Go
            throw error.response?.data || error;
        }
    },

    // Proceso 4: Cargar CSV para ítems
    cargarCSV: async (doId, file) => {
        const formData = new FormData();
        formData.append('file', file); // 'file' debe coincidir con c.FormFile("file") en Go
        
        try {
            const response = await api.post(`/do/${doId}/carga-csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Proceso 4: Cargar Múltiples Fotos
    cargarFotos: async (doId, files, itemIds) => {
        const formData = new FormData();
        
        // Adjuntar cada archivo bajo el campo 'fotos'
        for (let i = 0; i < files.length; i++) {
            formData.append('fotos', files[i]);
        }
        
        // Nota: En Go, se necesitaría un handler adicional para JSON.parse(item_ids) 
        // ya que formData.append solo envía strings.
        formData.append('item_ids', JSON.stringify(itemIds)); 

        try {
            const response = await api.post(`/do/${doId}/fotos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Proceso 5: Obtener PDF Final (Simulación de descarga)
    generarPDF: async (doId) => {
        // En una implementación real, esto descargaría un archivo blob
        try {
             const response = await api.get(`/do/${doId}/generar-pdf`);
             return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};