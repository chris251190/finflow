import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Importieren Sie useRouter
import '../app/globals.css';

interface LoginFormProps {
  // Hier können Sie zusätzliche Props definieren, falls benötigt
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter(); // Initialisieren Sie den Router

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful', data);
        router.push('/dashboard'); // Umleitung zur Dashboard-Seite
      } else {
        console.error('Login failed', data.message);
        // Handle login failure here (e.g., showing an error message)
      }
    } catch (error) {
      console.error('An error occurred during login', error);
      // Handle network error here
    }
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;