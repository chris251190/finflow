import { FinancialDataProvider } from '../contexts/FinancialDataContext';
import { UploadsProvider } from '../contexts/UploadsContext';

import '../app/globals.css'; // Pfad zu Ihrer globals.css Datei
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";

function FinFlow({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <FinancialDataProvider>
        <UploadsProvider>
          <Component {...pageProps} />
        </UploadsProvider>
      </FinancialDataProvider>
    </SessionProvider>
  );
}

export default FinFlow;