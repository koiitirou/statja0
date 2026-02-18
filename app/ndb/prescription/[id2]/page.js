import { server } from '@/components/config';
import PrescriptionClient from './PrescriptionClient';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { id2 } = await params;
  try {
    const res2 = await fetch(`${server}/prescription/${id2}.json`, { next: { revalidate: false } });
    if (!res2.ok) return { title: `処方薬データ ${id2}` };
    const ssg2 = await res2.json();
    const con_name = ssg2.def.dn2;
    return {
      title: `${con_name}の【処方数・売上・薬価】の推移`,
      description: `${con_name}の処方数・売上高・薬価の推移データ。男女別・年齢別・都道府県別に分析。`,
      openGraph: {
        title: `${con_name}の【処方数・売上・薬価】の推移`,
        description: `${con_name}の処方数・売上高・薬価の推移データ。男女別・年齢別・都道府県別に分析。`,
      },
      alternates: { canonical: `https://statja.com/ndb/prescription/${id2}` },
    };
  } catch (e) {
    return { title: `処方薬データ ${id2}` };
  }
}

export default async function PrescriptionPage({ params }) {
  const { id2 } = await params;

  let res2;
  try {
    const response = await fetch(`${server}/prescription/${id2}.json`, { next: { revalidate: false } });
    res2 = await response.json();
  } catch (e) {
    return <div>データが見つかりません。</div>;
  }

  const con_name = res2.def.dn2;

  return <PrescriptionClient id2={id2} res2={res2} con_name={con_name} />;
}
