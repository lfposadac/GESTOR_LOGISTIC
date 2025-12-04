import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- INTERCEPTOR: Inyecta el Token en cada petición automáticamente ---
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const apiService = {
    // ==========================================
    // 1. AUTENTICACIÓN
    // ==========================================
    
    solicitudOTP: async (email) => {
        const response = await api.post('/auth/solicitud-otp', { email });
        return response.data;
    },

    verificarOTP: async (email, codigo_otp) => {
        const response = await api.post('/auth/verificar-otp', { email, codigo_otp });
        // Guardamos el token para futuras peticiones
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    // ==========================================
    // 2. GESTIÓN DE CLIENTES (Lectura y Escritura)
    // ==========================================

    // Obtener lista de todos los clientes
    getClientes: async () => {
        const response = await api.get('/clientes');
        return response.data;
    },

    // Crear cliente nuevo con Archivos adjuntos (Multipart)
    matricularCliente: async (clienteData, documentosData) => {
        const formData = new FormData();

        // A. Preparamos los datos estructurados (JSON)
        // Convertimos fechas y limpiamos el objeto 'file' del JSON, ya que va por separado
        const payload = {
            cliente: { 
                ...clienteData, 
                fecha_matricula: new Date().toISOString() 
            },
            documentos: documentosData.map(d => ({
                tipo_documento: d.tipoDocumento,
                fecha_vencimiento: d.fechaVencimiento ? new Date(d.fechaVencimiento).toISOString() : new Date().toISOString(),
                ruta_archivo: "" // El backend llenará esto al guardar el archivo físico
            }))
        };

        // B. Agregamos el JSON como un campo de texto llamado 'data'
        formData.append('data', JSON.stringify(payload));

        // C. Agregamos los archivos binarios reales
        documentosData.forEach((doc, index) => {
            if (doc.file) {
                // La clave 'doc_0', 'doc_1' debe coincidir con la lógica del Backend
                formData.append(`doc_${index}`, doc.file);
            }
        });

        // D. Enviamos como multipart/form-data
        const response = await api.post('/clientes/matricula', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ==========================================
    // 3. OPERACIONES (DOs)
    // ==========================================

    // Listar DOs de un cliente específico
    getDOsPorCliente: async (clienteId) => {
        const response = await api.get(`/clientes/${clienteId}/dos`);
        return response.data;
    },

    // Carga Masiva de Items (Excel/CSV)
    cargarCSV: async (doId, file) => {
        const formData = new FormData();
        formData.append('file', file); // 'file' es el nombre que espera el backend

        const response = await api.post(`/do/${doId}/carga-csv`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Carga Masiva de Fotos (Múltiples archivos)
    cargarFotos: async (doId, fileList) => {
        const formData = new FormData();
        // fileList es un objeto FileList, hay que iterarlo
        for (let i = 0; i < fileList.length; i++) {
            formData.append('fotos', fileList[i]); // 'fotos' es el nombre que espera el backend
        }

        const response = await api.post(`/do/${doId}/fotos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};