import React, { useState, useEffect } from 'react';

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
        // Handle successful registration here (e.g., redirecting the user)
      } else {
        console.error('Registration failed', data.message);
        // Handle registration failure here (e.g., showing an error message)
      }
    } catch (error) {
      console.error('An error occurred during registration', error);
      // Handle network error here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto my-8 shadow-lg rounded-lg">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
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