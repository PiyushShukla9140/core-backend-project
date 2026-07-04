import { useEffect } from 'react'
import { getHealth } from "./services/health.service";


import './App.css'

function App() {
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getHealth();
        console.log("Backend Response:", response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHealth();
  }, []);

  return <h1>Frontend Connected Successfully</h1>;
}

export default App
