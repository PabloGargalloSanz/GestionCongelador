import styles from './InputField.module.css';

const InputField = ({ label, type, value, onChange, required }) => (
  <div className={styles.grupoInput}>
    <label className={styles.label}>{label}</label>
    <input 
      type={type} 
      className={styles.input}
      value={value}
      onChange={onChange}
      required={required} 
    />
  </div>
);

export default InputField;