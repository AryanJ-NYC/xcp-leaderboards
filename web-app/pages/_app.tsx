import type { AppProps } from 'next/app';
import Link from 'next/link';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="px-8">
      <header className="py-12">
        <Link href="/">Home</Link>
      </header>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
