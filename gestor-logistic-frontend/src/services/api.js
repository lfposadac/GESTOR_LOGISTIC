import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api';
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' }});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const apiService = {
    solicitudOTP: async (email) => (await api.post('/auth/solicitud-otp', { email })).data,
    verificarOTP: async (email, codigo_otp) => {
        const res = await api.post('/auth/verificar-otp', { email, codigo_otp });
        localStorage.setItem('token', res.data.token);
        return res.data;
    },
    logout: () => localStorage.removeItem('token'),
    matricularCliente: async (data) => (await api.post('/clientes/matricula', data)).data,
    cargarCSV: async (doId, file) => {
        const fd = new FormData(); fd.append('file', file);
        return (await api.post(`/do/${doId}/carga-csv`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
    },
    cargarFotos: async (doId, files) => {
        const fd = new FormData(); 
        for(let i=0; i<files.length; i++) fd.append('fotos', files[i]);
        return (await api.post(`/do/${doId}/fotos`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
    },
    // NUEVO: Obtener lista de clientes
    getClientes: async () => {
        const response = await api.get('/clientes');
        return response.data;
    },

    // NUEVO: Obtener DOs de un cliente
    getDOsPorCliente: async (clienteId) => {
        const response = await api.get(`/clientes/${clienteId}/dos`);
        return response.data;
    }
};