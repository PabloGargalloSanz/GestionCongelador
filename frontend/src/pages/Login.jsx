import { useState } from 'react';
import styles from './Login.module.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className={styles.contenedorLogin}>
      <h2 className={styles.titulo}>Gestión Congelador</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.grupoInput}>
          <label className={styles.partes}>Email:</label>
          <input 
            type="email" 
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            required 
          />
        </div>
        
        <div className={styles.grupoInput}>
          <label className={styles.partes}>Contraseña:</label>
          <input 
            type="password" 
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className={styles.enviar}> Entrar </button>
      </form>
    </div>
  );
}

export default Login;