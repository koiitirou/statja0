import { server } from '@/components/config';
import ZaiinClient from './ZaiinClient';
import path0 from '@/public/comp/data/link/path1.json';

export const dynamic = 'force-static';
export const dynamicParams = true;

var path1 = [
  {
    params: {
      mdc: 'm00',
      mdn: '全疾患',
    },
  },
];
path1.push(...path0);

export async function generateStaticParams() {
  return path1.map((s) => ({
    mdc: s.params.mdc,
  }));
}

export async function generateMetadata({ params }) {
  const { mdc } = await params;
  const thisMdc = path1.find((s) => s.params.mdc === mdc);
  const mdcName = thisMdc ? thisMdc.params.mdn : '';
  return {
    title: `${mdcName}の在院日数ランキング【DPC】`,
    description: `全国・各都道府県の病院における、${mdcName}の在院日数ランキングをDPCオープンデータをもとにまとめています。`,
    openGraph: {
      title: `${mdcName}の在院日数ランキング【DPC】`,
      description: `全国・各都道府県の病院における、${mdcName}の在院日数ランキングをDPCオープンデータをもとにまとめています。`,
    },
    alternates: { canonical: `https://statja.com/zaiin/${mdc}` },
  };
}

export default async function ZaiinPage({ params }) {
  const { mdc } = await params;
  const this_path1 = path1.filter((s) => s.params.mdc === mdc);
  const res = await fetch(`${server}/rank/zaiin_${mdc}.json`, { next: { revalidate: false } });
  if (!res.ok) return <div>データが見つかりません</div>;
  const ssg2 = await res.json();

  const columns1 = [
    { Header: '都道府県', accessor: 'shn' },
    { Header: '病院', accessor: 'hs2' },
    {
      Header: '在院日数',
      columns: [
        { Header: '平均', accessor: 'me0' },
        { Header: '全国平均', accessor: 'me1' },
        { Header: '補正平均', accessor: 'me2' },
      ],
    },
    { Header: '患者数', accessor: 'num' },
    { Header: '患者構成指標', accessor: 'in0' },
    { Header: '在院日数指標', accessor: 'in1' },
  ];

  return (
    <ZaiinClient
      ssg2={ssg2}
      columns1={columns1}
      category1='在院日数'
      category2='zaiin'
      mdc1={mdc}
      path1={path1}
      this_path1={this_path1}
    />
  );
}
