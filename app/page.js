import HomeClient from './HomeClient';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: '世界・都道府県・市区町村・医療のデータランキング',
  description:
    '世界と日本・都道府県・市区町村のデータランキング、人口ピラミッド、全国の病院治療実績ランキング、処方薬ランキング、特定健診データをまとめています。',
  openGraph: {
    title: '世界・都道府県・市区町村・医療のデータランキング | 統計リアル',
    description:
      '世界と日本・都道府県・市区町村のデータランキング、人口ピラミッド、全国の病院治療実績ランキング、処方薬ランキング、特定健診データをまとめています。',
  },
  alternates: {
    canonical: 'https://statja.com',
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '統計リアル',
          url: 'https://statja.com',
          description: '世界と日本の統計データをランキング形式で紹介するサイト',
          publisher: {
            '@type': 'Organization',
            name: '統計リアル',
          },
        }}
      />
      <HomeClient />
    </>
  );
}
