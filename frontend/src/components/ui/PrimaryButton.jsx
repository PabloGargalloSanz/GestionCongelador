import styles from './PrimaryButton.module.css';

const PrimaryButton = ({ children, type = "button", disabled }) => (
  <button type={type} className={styles.boton} disabled={disabled}>
    {children}
  </button>
);

export default PrimaryButton;