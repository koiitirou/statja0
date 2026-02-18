import { server } from '@/components/config';
import { notFound } from 'next/navigation';
import wor_path from '@/components/wor/wor_path.json';
import WorldCategoryClient from './WorldCategoryClient';

const cls1 = wor_path.country;

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  try {
    const res = await fetch(`${server}/wo2/${category}_ssg.json`);
    if (!res.ok) return { title: '世界ランキング' };
    const ssg1 = await res.json();
    const title1 = `${ssg1.def.idj}の世界ランキング${ssg1.def.tmn}〜${ssg1.def.tmx}年【国別順位】`;
    const unit1 = ssg1.def.utm;
    const description1 = ` ${ssg1.def.tmx}年の1位は${ssg1.def.rre[0]}で${Number(
      ssg1.def.ral[0],
    ).toLocaleString()}${unit1}、2位は${ssg1.def.rre[1]}で${Number(
      ssg1.def.ral[1],
    ).toLocaleString()}${unit1}、3位は${ssg1.def.rre[2]}で${Number(
      ssg1.def.ral[2],
    ).toLocaleString()}${unit1}でした。`;
    return {
      title: title1,
      description: description1,
      openGraph: { title: title1, description: description1 },
      alternates: { canonical: `https://statja.com/world/${category}` },
    };
  } catch (e) {
    return { title: '世界ランキング' };
  }
}

export default async function WorldCategoryPage({ params }) {
  const { category } = await params;
  const res = await fetch(`${server}/wo2/${category}_ssg.json`);
  if (!res.ok) notFound();
  const ssg1 = await res.json();

  const tml = Array.isArray(ssg1.def.tml) ? ssg1.def.tml : [ssg1.def.tml];
  const marks = [];
  for (let i = 0; i < tml.length; i++) {
    var thisYear = {};
    thisYear['value'] = tml[i];
    marks.push(thisYear);
  }
  // Pass raw columns without sortType (functions can't cross server/client boundary)
  const columns = ssg1.tab[ssg1.def.tmx].columns_ja;

  const graphList = [
    { value: 'r', label: '順位', unit: '位', rev: true },
    { value: 'v', label: `${ssg1.def.tlj}`, unit: `${ssg1.def.utm}`, rev: false },
    { value: 'd', label: '前年比', unit: '%', rev: false },
  ];
  const time_list2 = Array.isArray(ssg1.def.tml) ? ssg1.def.tml : [ssg1.def.tml];

  const title1 = `${ssg1.def.idj}の世界ランキング${ssg1.def.tmn}〜${ssg1.def.tmx}年【国別順位】`;
  const unit1 = ssg1.def.utm;
  const description1 = ` ${ssg1.def.tmx}年の1位は${ssg1.def.rre[0]}で${Number(
    ssg1.def.ral[0],
  ).toLocaleString()}${unit1}、2位は${ssg1.def.rre[1]}で${Number(
    ssg1.def.ral[1],
  ).toLocaleString()}${unit1}、3位は${ssg1.def.rre[2]}で${Number(
    ssg1.def.ral[2],
  ).toLocaleString()}${unit1}でした。`;

  return (
    <WorldCategoryClient
      did1={category}
      ssg1={ssg1}
      marks={marks}
      columns={columns}
      graphList={graphList}
      time_list2={time_list2}
      cls1={cls1}
      title1={title1}
      description1={description1}
    />
  );
}
