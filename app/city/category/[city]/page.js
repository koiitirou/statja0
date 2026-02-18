import CityCategoryClient from './CityCategoryClient';
import { server } from '@/components/config';
import cit_path from '@/components/cit_path/cit_path.json';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const res = await fetch(`${server}/citjson2/${city}_ssg.json`, { next: { revalidate: 3600 } });
  if (!res.ok) {
    return { title: '市区町村ランキング' };
  }
  const ssg1 = await res.json();

  const title1 = `${ssg1.def.tl1}の市区町村ランキング${ssg1.def.tmn}〜${ssg1.def.tmx}年【順位】`;
  const description1 = ` ${ssg1.def.tmx}年の1位は${
    ssg1.def.pre[0]
  }で${ssg1.def.val[0].toLocaleString()}${ssg1.def.ut1}、2位は${
    ssg1.def.pre[1]
  }で${ssg1.def.val[1].toLocaleString()}${ssg1.def.ut1}、3位は${
    ssg1.def.pre[2]
  }で${ssg1.def.val[2].toLocaleString()}${ssg1.def.ut1}でした。`;

  return {
    title: title1,
    description: description1,
    openGraph: {
      title: title1,
      description: description1,
    },
    alternates: { canonical: `https://statja.com/city/category/${city}` },
  };
}

export const revalidate = 3600;
export const dynamicParams = true;

export default async function CityCategoryPage({ params }) {
  const { city } = await params;

  const res = await fetch(`${server}/citjson2/${city}_ssg.json`, { next: { revalidate: 3600 } });
  if (!res.ok) {
    notFound();
  }
  const ssg1 = await res.json();

  const thisParams = cit_path.path.find((v) => v.params.city == city);
  const thisRef1 = cit_path.refs[thisParams?.params?.c1];

  return (
    <CityCategoryClient ssg1={ssg1} city={city} />
  );
}
