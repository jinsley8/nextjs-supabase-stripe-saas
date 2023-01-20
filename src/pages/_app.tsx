import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import UserProvider from "@/context/user";
import Nav from "@/components/nav";
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <main className={inter.className}>
        <Nav />
        <Component {...pageProps} />
      </main>
    </UserProvider>
  )
}