import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  // Estado para guardar el ID del último cliente matriculado para la demostración
    const [currentClientId, setCurrentClientId] = useState(null);
    // Estado para simular el ID del DO que se va a trabajar
    const [currentDoId, setCurrentDoId] = useState(1); // Usamos 1 como DO de prueba inicial

    const handleMatriculaSuccess = (clientId) => {
        setCurrentClientId(clientId);
        // Simulación de la creación del DO (Proceso 2) después de la matrícula exitosa
        // En una app real, habría una llamada a apiService.crearDO(clientId, ...) aquí.
        // Asumimos que el primer DO creado tendrá ID 1.
        alert(`Cliente ID ${clientId} matriculado. Usando DO ID ${currentDoId} para la carga.`);
    };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Sistema de Gestión de Clientes y DOs (Frontend React)</h1>
            <p style={{ color: currentClientId ? 'green' : 'red' }}>
                {currentClientId ? `✅ Último Cliente Matriculado ID: ${currentClientId}` : '🛑 Matricular un cliente para empezar.'}
            </p>
            <hr />
            
            <MatriculaCliente onMatriculaSuccess={handleMatriculaSuccess} />
            <hr />

            <CargaMasiva currentDoId={currentDoId} />
        </div>
    );
}

export default App
