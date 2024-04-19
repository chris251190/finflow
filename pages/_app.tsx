import { FinancialDataProvider } from '../contexts/FinancialDataContext';
import { UploadsProvider } from '../contexts/UploadsContext';
import { SessionProvider, useSession } from 'next-auth/react'; 
import { signOut } from 'next-auth/react';
import '../app/globals.css';
import type { AppProps } from 'next/app';

function FinFlow({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <FinancialDataProvider>
        <UploadsProvider>
          <nav>
            <AuthButton />
          </nav>
          <Component {...pageProps} />
        </UploadsProvider>
      </FinancialDataProvider>
    </SessionProvider>
  );
}

// Definieren Sie eine separate Komponente für den Auth-Button
const AuthButton = () => {
  const { data: session } = useSession();

  if (session) {
    return <button onClick={() => signOut()}>Logout</button>;
  }
  return null; // oder Login-Button, falls gewünscht
};

export default FinFlow;