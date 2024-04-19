import { FinancialDataProvider } from '../contexts/FinancialDataContext';
import '../app/globals.css'; // Pfad zu Ihrer globals.css Datei
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";

function FinFlow({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <FinancialDataProvider>
        <Component {...pageProps} />
      </FinancialDataProvider>
    </SessionProvider>
  );
}

export default FinFlow;