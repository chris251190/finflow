import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn for logging in the user

interface RegisterFormProps {
  // Hier können Sie zusätzliche Props definieren, falls benötigt
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageColor, setMessageColor] = useState<string>('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (message) {
      timeoutId = setTimeout(() => {
        setMessage('');
        setMessageColor('');
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [message, messageColor]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful', data);
        setMessage('Registrierung erfolgreich!');
        setMessageColor('green');
        // Log the user in after successful registration
        signIn('credentials', { email, password, redirect: false });
      } else {
        console.error('Registration failed', data.message);
        setMessage('Registrierung fehlgeschlagen: ' + data.message);
        setMessageColor('red');
        // Handle registration failure here (e.g., showing an error message)
      }
    } catch (error) {
      console.error('An error occurred during registration', error);
      setMessage('Ein Fehler ist bei der Registrierung aufgetreten.');
      setMessageColor('red');
      // Handle network error here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto my-8 shadow-lg rounded-lg">
      <h2>Registrierung</h2>
      {message && <div style={{color: messageColor, transition: 'opacity 1s', opacity: message ? 1 : 0}}>{message}</div>}
      <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
      />
      <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Register</button>
    </form>
  );
};

export default RegisterForm;