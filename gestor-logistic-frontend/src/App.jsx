import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { apiService } from './services/api';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => { if (localStorage.getItem('token')) setIsLoggedIn(true); }, []);

    if (!isLoggedIn) return <Login onLoginSuccess={setIsLoggedIn} />;

    return (
        <div style={{padding: 20}}>
            <h2>Gestor Logístico - IntegraComex</h2>
            <button onClick={()=>{apiService.logout(); setIsLoggedIn(false)}}>Salir</button>
            <hr/>
            <h3>Carga de Archivo (DO #1)</h3>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <button onClick={async () => {
                if(file) alert((await apiService.cargarCSV(1, file)).message);
            }}>Subir</button>
        </div>
    );
}

export default App;