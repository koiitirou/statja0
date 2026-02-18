import { server } from '@/components/config';
import BedDetailClient from './BedDetailClient';
import path1Data from '@/public/comp/data/link/bed_path.json';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return path1Data.map((s) => ({
    bed: s.params.bed,
  }));
}

export async function generateMetadata({ params }) {
  const { bed } = await params;
  const path2 = path1Data.find((s) => s.params.bed === bed);
  const bedName = path2 ? path2.params.mdn : 'ランキング';
  return {
    title: `${bedName}ランキング【DPC】`,
    description: `全国・各都道府県の病院における${bedName}ランキングをDPCオープンデータをもとにまとめています。`,
    openGraph: {
      title: `${bedName}ランキング【DPC】`,
      description: `全国・各都道府県の病院における${bedName}ランキングをDPCオープンデータをもとにまとめています。`,
    },
    alternates: { canonical: `https://statja.com/bed/${bed}` },
  };
}

export default async function BedDetailPage({ params }) {
  const { bed } = await params;
  const res = await fetch(`${server}/rank/${bed}_.json`, { next: { revalidate: false } });
  if (!res.ok) return <div>データが見つかりません</div>;
  const ssg2 = await res.json();

  const path2 = path1Data.find((s) => s.params.bed === bed);
  if (!path2) return <div>データが見つかりません</div>;

  const columns1 = [...path2.params.columns];
  const category1 = path2.params.mdn;
  const category2 = path2.params.mdc;

  return (
    <BedDetailClient
      ssg2={ssg2}
      columns1={columns1}
      category1={category1}
      category2={category2}
      mdc1=''
      path2={path2}
    />
  );
}
