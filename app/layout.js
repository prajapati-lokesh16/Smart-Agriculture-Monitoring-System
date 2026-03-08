export const metadata = {
  title: 'Smart Agriculture Monitoring',
  description: 'Professional IoT dashboard for farmers',
};

import { AuthProvider } from './context/AuthContext';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-green-50 via-white to-amber-50 min-h-screen">
        <ServiceWorkerRegister />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
