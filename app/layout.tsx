import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/utils/helpers';
import { fontSans } from '@/lib/fonts';
import AuthProvider from '@/providers/AuthProvider';
import { getSession } from '@/actions/getSession';
import { getUser } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tadakir.net Clone',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <AuthProvider user={user}>
      <html lang="en">
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 my-5">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
