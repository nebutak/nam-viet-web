import { Nunito, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

// import { AuthProvider } from '@/components/providers/AuthProvider';
import { SidebarProvider } from '@/context/SidebarContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  variable: '--font-nunito',
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: '--font-playfair',
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
    metadataBase: new URL('https://namviet.com'),
    title: {
        default: 'Công ty Sản xuất & Thương mại Nam Việt',
        template: '%s | Nam Việt',
    },
    description: 'Nam Việt - Chuyên cung cấp các sản phẩm chất lượng cao, đáp ứng nhu cầu sản xuất và thương mại trong nước và quốc tế.',
    keywords: ['Nam Việt', 'sản xuất', 'thương mại', 'hàng hóa', 'thanh phẩm', 'vật liệu'],
    openGraph: {
      title: 'Công ty Sản xuất & Thương mại Nam Việt',
      description: 'Chuyên cung cấp các sản phẩm chất lượng cao, đáp ứng nhu cầu sản xuất và thương mại trong nước và quốc tế.',
      url: 'https://namviet.com',
      siteName: 'Nam Việt',
      locale: 'vi_VN',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://namviet.com',
    },
    authors: [{ name: 'Nam Việt' }],
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
}

export const viewport = {
  themeColor: '#12b76a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} ${playfair.variable} ${cormorant.variable} font-sans bg-white`}>
        {/* ✅ AuthProvider MUST wrap everything */}
        {/* Removed AuthProvider since authentication is no longer used */}
          <QueryProvider>
            <SidebarProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </SidebarProvider>
          </QueryProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
