import ThemeRegistry from '@/components/ThemeRegistry';
import GoogleAnalytics from '@/components/googleanalytics';
import './own.css';

export const metadata = {
  metadataBase: new URL('https://statja.com'),
  title: {
    template: '%s | 統計リアル',
    default: '統計リアル',
  },
  openGraph: {
    images: [
      {
        url: 'https://www.statja.com/img/twt/fav1.png',
        width: 300,
        height: 300,
      },
    ],
    type: 'website',
    locale: 'ja_JP',
    siteName: '統計リアル',
  },
  twitter: {
    card: 'summary',
    site: '@youtubetoday1',
    creator: '@youtubetoday1',
  },
  icons: {
    icon: '/fa1.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='ja'>
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
