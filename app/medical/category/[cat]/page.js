import { server, fetchOpts } from '@/components/config';
import CategoryClient from './CategoryClient';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { cat } = await params;
  try {
    const res = await fetch(`${server}/medical_cat/${cat}.json`, fetchOpts);
    if (!res.ok) return { title: `医科診療行為カテゴリ ${cat}` };
    const ssg = await res.json();
    const sec = ssg.def.sec;
    return {
      title: `${sec}の算定回数ランキング・推移【医科診療行為】`,
      description: `${sec}に分類される医科診療行為の算定回数ランキングと推移。回数・点数・売上（点数×10円）・前年比を比較。NDBオープンデータをもとに集計。`,
      openGraph: {
        title: `${sec}の算定回数ランキング・推移【医科診療行為】`,
        description: `${sec}に分類される医科診療行為の算定回数ランキングと推移。回数・点数・売上・前年比を比較。`,
      },
      alternates: { canonical: `https://statja.com/medical/category/${cat}` },
    };
  } catch (e) {
    return { title: `医科診療行為カテゴリ ${cat}` };
  }
}

export default async function CategoryPage({ params }) {
  const { cat } = await params;
  let res;
  try {
    const response = await fetch(`${server}/medical_cat/${cat}.json`, fetchOpts);
    res = await response.json();
  } catch (e) {
    return <div>データが見つかりません。</div>;
  }

  const sec = res.def.sec;
  const breadcrumbItems = [
    { name: 'トップ', href: '/' },
    { name: '医科診療行為', href: '/medical' },
    { name: sec },
  ];
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${sec}の算定回数ランキング・推移`,
    description: `${sec}に分類される医科診療行為の算定回数ランキングと推移データです。回数・点数・売上・前年比を比較。NDBオープンデータをもとに集計しています。`,
    url: `https://statja.com/medical/category/${cat}`,
    creator: { '@type': 'Organization', name: '統計リアル', url: 'https://statja.com' },
    license: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000177221_00016.html',
  };

  return (
    <>
      <JsonLd data={datasetJsonLd} />
      <CategoryClient res={res} sec={sec} breadcrumbItems={breadcrumbItems} />
    </>
  );
}
