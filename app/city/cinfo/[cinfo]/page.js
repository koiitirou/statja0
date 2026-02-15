import CityInfoClient from './CityInfoClient';
import { server } from '@/components/config';
import cit_path from '@/components/cit_path/cit_path.json';
import { notFound } from 'next/navigation';

const ref2 = cit_path.pref;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { cinfo } = await params;
  const th_prefec = ref2[cinfo];
  if (!th_prefec) return { title: '市区町村統計ランキング' };
  const title1 = th_prefec.jln + 'の統計ランキング';
  const description1 =
    th_prefec.jln +
    'の統計データランキング・年次推移をまとめました。データの詳細・順位・前年比がわかるページへリンクしています。';
  return {
    title: title1,
    description: description1,
    openGraph: {
      title: title1,
    },
  };
}

export const revalidate = 86400;
export const dynamicParams = true;

export default async function CityInfoPage({ params }) {
  const { cinfo } = await params;

  let res2 = [];
  try {
    const res1 = await fetch(`${server}/citinf2/${cinfo}.json`, { next: { revalidate: 86400 } });
    if (!res1.ok) {
      notFound();
    }
    res2 = await res1.json();
  } catch (e) {
    console.error('Failed to fetch citinf2:', e);
    notFound();
  }

  return <CityInfoClient cinfo={cinfo} res2={res2} />;
}
