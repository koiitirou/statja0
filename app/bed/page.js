import { server } from '@/components/config';
import BedIndexClient from './BedIndexClient';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return {
    title: '病床数ランキング【DPC】',
    description:
      '全国・各都道府県の病院における病床数ランキングをDPCオープンデータをもとにまとめています。',
  };
}

export default async function BedPage() {
  const res = await fetch(`${server}/rank/bed_.json`, { next: { revalidate: false } });
  if (!res.ok) return <div>データが見つかりません</div>;
  const ssg2 = await res.json();

  const columns1 = [
    { Header: '順位', accessor: 'bnk' },
    { Header: '都道府県', accessor: 'shn' },
    { Header: '病院名', accessor: 'hs2' },
    {
      Header: '病床数(ベッド数)',
      columns: [
        { Header: '総病床', accessor: 'bll' },
        { Header: 'DPC病床', accessor: 'dpb' },
        { Header: 'リハビリ', accessor: 'bre' },
        { Header: '地域包括', accessor: 'bti' },
        { Header: '精神科', accessor: 'bps' },
        { Header: '療養', accessor: 'bry' },
        { Header: '結核', accessor: 'bke' },
      ],
    },
  ];

  return (
    <BedIndexClient
      ssg2={ssg2}
      columns1={columns1}
      category1='病床数'
      category2='bed'
      mdc1=''
    />
  );
}
