import { server, fetchOpts } from '@/components/config';
import SubClient from './SubClient';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { sub } = await params;
  try {
    const res = await fetch(`${server}/medical_sub/${sub}.json`, fetchOpts);
    if (!res.ok) return { title: `医科診療行為 分類 ${sub}` };
    const ssg = await res.json();
    const bnm = ssg.def.bnm;
    return {
      title: `${bnm}（${sub}）の算定回数ランキング・推移【医科診療行為】`,
      description: `${bnm}（分類コード${sub}・${ssg.def.sec}）に含まれる医科診療行為の算定回数ランキングと推移。回数・点数・売上・前年比を比較。NDBオープンデータをもとに集計。`,
      openGraph: {
        title: `${bnm}（${sub}）の算定回数ランキング・推移【医科診療行為】`,
        description: `${bnm}（${ssg.def.sec}）の医科診療行為の算定回数ランキングと推移。`,
      },
      alternates: { canonical: `https://statja.com/medical/sub/${sub}` },
    };
  } catch (e) {
    return { title: `医科診療行為 分類 ${sub}` };
  }
}

export default async function SubPage({ params }) {
  const { sub } = await params;
  let res;
  try {
    const response = await fetch(`${server}/medical_sub/${sub}.json`, fetchOpts);
    res = await response.json();
  } catch (e) {
    return <div>データが見つかりません。</div>;
  }

  const { bnm, sec, cat } = res.def;
  const breadcrumbItems = [
    { name: 'トップ', href: '/' },
    { name: '医科診療行為', href: '/medical' },
    { name: sec, href: cat ? `/medical/category/${cat}` : '/medical' },
    { name: `${sub} ${bnm}` },
  ];
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${bnm}（${sub}）の算定回数ランキング・推移`,
    description: `${bnm}（${sec}）に含まれる医科診療行為の算定回数ランキングと推移データです。回数・点数・売上・前年比を比較。NDBオープンデータをもとに集計しています。`,
    url: `https://statja.com/medical/sub/${sub}`,
    creator: { '@type': 'Organization', name: '統計リアル', url: 'https://statja.com' },
    license: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000177221_00016.html',
  };

  return (
    <>
      <JsonLd data={datasetJsonLd} />
      <SubClient res={res} bnm={bnm} sub={sub} breadcrumbItems={breadcrumbItems} />
    </>
  );
}
