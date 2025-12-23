import { useState } from 'react';
import styles from '../styles/Login.module.css'; 
import { loginUser } from '../services/authService.js';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores viejos

    try {
      console.log("Enviando datos...", { email, pass });
      
      const data = await loginUser({ email, pass });
      
      console.log("¡Login exitoso!", data);
      
      // REEDIRECCION AQUI
      
    } catch (err) {
      console.error("Error en login:", err);
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className={styles.contenedorLogin}>
      <h2 className={styles.titulo}>Gestión Congelador</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.grupoInput}>
          <label className={styles.etiqueta}>Email:</label>
          <input 
            type="email" 
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className={styles.grupoInput}>
          <label className={styles.etiqueta}>Contraseña:</label>
          <input 
            type="password" 
            className={styles.input}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required 
          />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <button type="submit" className={styles.boton}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;