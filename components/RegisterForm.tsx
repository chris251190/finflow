import React, { useState, useEffect } from 'react';
import '../app/globals.css';


interface RegisterFormProps {
  // Hier können Sie zusätzliche Props definieren, falls benötigt
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    // Implementieren Sie hier die Logik zur Registrierung
    console.log('Registering', email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;