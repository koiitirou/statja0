import { server } from '@/components/config';
import CheckupCidClient from './CheckupCidClient';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { cid } = await params;
  try {
    const res1 = await fetch(`${server}/ph2/${cid}_mean.json`, { next: { revalidate: false } });
    if (!res1.ok) return { title: `特定健診データ ${cid}` };
    const ssg1 = await res1.json();
    return {
      title: `${ssg1.def.i_0}の平均値・区分割合の推移【特定健診データ】`,
      description: `${ssg1.def.i_0}の特定健診（健康診査）データの平均値の推移。都道府県別・年齢別・性別に分析。`,
      openGraph: {
        title: `${ssg1.def.i_0}の平均値・区分割合の推移【特定健診データ】`,
        description: `${ssg1.def.i_0}の特定健診（健康診査）データの平均値の推移。都道府県別・年齢別・性別に分析。`,
      },
      alternates: { canonical: `https://statja.com/ndb/checkup/${cid}` },
    };
  } catch (e) {
    return { title: `特定健診データ ${cid}` };
  }
}

export default async function CheckupCidPage({ params }) {
  const { cid } = await params;

  let ssg1, ssg2;
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${server}/ph2/${cid}_mean.json`, { next: { revalidate: false } }),
      fetch(`${server}/kub/${cid}_kubun.json`, { next: { revalidate: false } }),
    ]);
    ssg1 = await res1.json();
    ssg2 = await res2.json();
  } catch (e) {
    return <div>データが見つかりません。</div>;
  }

  return <CheckupCidClient cid={cid} ssg1={ssg1} ssg2={ssg2} />;
}
