import { server, fetchOpts } from '@/components/config';
import MedicalClient from './MedicalClient';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { mid } = await params;
  try {
    const res2 = await fetch(`${server}/medical/${mid}.json`, fetchOpts);
    if (!res2.ok) return { title: `医科診療行為データ ${mid}` };
    const ssg2 = await res2.json();
    const con_name = ssg2.def.nm;
    return {
      title: `${con_name}の【算定回数】の推移`,
      description: `${con_name}の算定回数の推移データ。男女別・年齢別・都道府県別に分析。NDBオープンデータをもとに集計。`,
      openGraph: {
        title: `${con_name}の【算定回数】の推移`,
        description: `${con_name}の算定回数の推移データ。男女別・年齢別・都道府県別に分析。NDBオープンデータをもとに集計。`,
      },
      alternates: { canonical: `https://statja.com/medical/${mid}` },
    };
  } catch (e) {
    return { title: `医科診療行為データ ${mid}` };
  }
}

export default async function MedicalPage({ params }) {
  const { mid } = await params;

  let res2;
  try {
    const response = await fetch(`${server}/medical/${mid}.json`, fetchOpts);
    res2 = await response.json();
  } catch (e) {
    return <div>データが見つかりません。</div>;
  }

  const con_name = res2.def.nm;
  const breadcrumbItems = [
    { name: 'トップ', href: '/' },
    { name: '医科診療行為', href: '/medical' },
    { name: con_name },
  ];
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${con_name}の算定回数の推移`,
    description: `${con_name}の算定回数の推移データです。男女別・年齢別・都道府県別に分析。NDBオープンデータをもとに集計しています。`,
    url: `https://statja.com/medical/${mid}`,
    creator: { '@type': 'Organization', name: '統計リアル', url: 'https://statja.com' },
    license: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000177221_00016.html',
  };

  return (
    <>
      <JsonLd data={datasetJsonLd} />
      <MedicalClient mid={mid} res2={res2} con_name={con_name} breadcrumbItems={breadcrumbItems} />
    </>
  );
}
