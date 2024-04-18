import '../app/globals.css'; // Pfad zu Ihrer globals.css Datei
import type { AppProps } from 'next/app';

function FinFlow({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default FinFlow;