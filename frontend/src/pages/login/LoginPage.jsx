import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css'; 
import { loginUser } from '../../services/authService.js';

import InputField from '../../components/ui/InputField';
import PrimaryButton from '../../components/ui/PrimaryButton';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser({ email, pass });
      console.log("¡Login exitoso!", data);
      
      // Guardamos el usuario o token (opcional)
      localStorage.setItem('user', JSON.stringify(data));
      
      // Navegamos al Dashboard
      navigate('/dashboard'); 
    } catch (err) {
      console.log(err);
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contenedorLogin}>
        <h2 className={styles.titulo}>Gestión Congelador</h2>
        
        <form onSubmit={handleSubmit}>
          <InputField 
            label="Email:" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <InputField 
            label="Contraseña:" 
            type="password" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            required 
          />

          {error && <p className={styles.errorText}>{error}</p>}

          <PrimaryButton type="submit">Entrar</PrimaryButton>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;