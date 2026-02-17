import { server } from '@/components/config';
import array3 from '@/components/path_ndb/sum_prescription_path.json';
import NdbEidClient from './NdbEidClient';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { eid } = await params;
  try {
    const res1 = await fetch(`${server}/shohou/${eid}_ind_ssg.json`, { next: { revalidate: false } });
    if (!res1.ok) return { title: `処方薬ランキング ${eid}` };
    const ssg1 = await res1.json();
    return {
      title: `${ssg1.def.enm}の処方薬ランキング【売上・処方数・薬価】`,
      description: `${ssg1.def.enm}の治療薬ランキング一覧です。くすりの処方数・売上・前年比の推移を比較。`,
    };
  } catch (e) {
    return { title: `処方薬ランキング ${eid}` };
  }
}

export default async function NdbEidPage({ params }) {
  const { eid } = await params;
  const kbn1 = { nai: '内服', gai: '外用', tyu: '注射' };

  let ssg1, ssg2;
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${server}/shohou/${eid}_ind_ssg.json`, { next: { revalidate: false } }),
      fetch(`${server}/shohou/${eid}_gen_ssg.json`, { next: { revalidate: false } }),
    ]);
    ssg1 = await res1.json();
    ssg2 = await res2.json();
  } catch (e) {
    return <div>データが見つかりません。</div>;
  }

  const graphList = [
    { value: 'rnk', label: '順位', unit: '位', rev: true },
    { value: 'sum', label: `処方数`, unit: `${ssg1.def.unt}`, rev: false },
    { value: 'dpf', label: '前年比(処方数)', unit: '%', rev: false },
    { value: 'dp2', label: '薬価', unit: '', rev: false },
    { value: 'sls', label: '売上', unit: '円', rev: false },
  ];

  const graphList2 = [
    { value: 'rnk', label: '順位', unit: '位', rev: true },
    { value: 'sum', label: `処方数`, unit: '', rev: false },
    { value: 'dpf', label: '前年比(処方数)', unit: '%', rev: false },
    { value: 'sls', label: '売上', unit: '円', rev: false },
    { value: 'gum', label: '後発率', unit: '%', rev: false },
  ];

  return (
    <NdbEidClient
      eid={eid}
      ssg1={ssg1}
      ssg2={ssg2}
      kbn1={kbn1}
      graphList={graphList}
      graphList2={graphList2}
    />
  );
}

