import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FinFlowDashboard from '../components/FinFlowDashboard';
import { signOut } from 'next-auth/react';
import EarningsAndExpensesForm from '@/components/EarningsAndExpensesForm';


const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
        router.push('/login');
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <FinFlowDashboard />
      <EarningsAndExpensesForm />
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
};

export default DashboardPage;