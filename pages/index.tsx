import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import FileUpload from '../components/FileUpload';
import FinFlowDashboard from '../components/FinFlowDashboard';
import EarningsAndExpensesForm from '@/components/EarningsAndExpensesForm';

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setShowLogin(false);
    }
  }, [session]);

  if (session) {
    return (
      <div>
        <FinFlowDashboard />
        <EarningsAndExpensesForm />
        <FileUpload />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to FinFlow!</h1>
      <nav>
        <button onClick={() => setShowLogin(true)} className="mr-4">Login</button>
        <button onClick={() => setShowLogin(false)}>Register</button>
      </nav>
      {showLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}