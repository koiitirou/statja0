import PrefecInfoClient from './PrefecInfoClient';
import pr2_path from '@/components/pr2_path/pr2_path.json';
import yasai_path from '@/components/pr2_path/yasai_path.json';
import ref2 from '@/components/prefecture_list2.json';

const server = 'https://storage.googleapis.com/statapi1';

var ref3 = { ...pr2_path.refs };
Object.keys(yasai_path.refs).forEach((v1) => {
  ref3[v1] = yasai_path.refs[v1];
});

var pref1 = {};
Object.keys(ref2).forEach((v) => {
  if (v != 's00') {
    pref1[v] = ref2[v];
  }
});

export async function generateStaticParams() {
  const array6 = [];
  Object.keys(pref1).forEach((v0) => {
    Object.keys(pr2_path.refs).forEach((v1) => {
      array6.push({ prefec: [v0, pr2_path.refs[v1].params.lnk] });
    });
  });
  Object.keys(pref1).forEach((v0) => {
    Object.keys(yasai_path.refs).forEach((v1) => {
      array6.push({ prefec: [v0, yasai_path.refs[v1].params.lnk] });
    });
  });
  return array6;
}

export async function generateMetadata({ params }) {
  const { prefec } = await params;
  const th_prefec = pref1[prefec[0]];
  if (!th_prefec) return { title: '都道府県情報' };
  const lnk = prefec[1];
  const refKey = Object.keys(ref3).find((k) => ref3[k].params.lnk === lnk);
  const th_res = refKey ? ref3[refKey].params : null;
  const title1 = th_prefec.tln + 'の統計ランキング' + (th_res ? '【' + th_res.nam + '】' : '');
  const description1 =
    th_prefec.tln +
    'の統計データランキング・年次推移をまとめました。' +
    (th_res ? th_res.nam + '統計の詳細・順位・前年比がわかるページへリンクしています。' : '');
  return {
    title: title1,
    description: description1,
    openGraph: { title: title1, description: description1 },
    alternates: { canonical: `https://statja.com/prefecture/info/${prefec.join('/')}` },
  };
}

export default async function PrefecInfoPage({ params }) {
  const { prefec } = await params;
  let res2 = [];
  try {
    const res1 = await fetch(`${server}/pr2info/${prefec[0]}_${prefec[1]}.json`, {
      next: { revalidate: 86400 },
    });
    if (res1.ok) {
      res2 = await res1.json();
    }
  } catch (e) {
    console.error('Failed to fetch pr2info:', e);
  }

  return <PrefecInfoClient prefec={prefec} res2={res2} ref3={ref3} pref1={pref1} />;
}
