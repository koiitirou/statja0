import PrefectureLnkClient from './PrefectureLnkClient';
import { server } from '@/components/config';
import pr2_path from '@/components/pr2_path/pr2_path.json';
import yasai_path from '@/components/pr2_path/yasai_path.json';

var array4 = [];
Object.keys(pr2_path.refs).forEach((v, i) => {
  array4.push(pr2_path.refs[v]);
});
Object.keys(yasai_path.refs).forEach((v, i) => {
  array4.push(yasai_path.refs[v]);
});

export async function generateStaticParams() {
  return array4.map((item) => ({
    lnk: item.params.lnk,
  }));
}

export async function generateMetadata({ params }) {
  const { lnk } = await params;
  const ref1 = array4.find((v) => v.params.lnk === lnk);
  const name1 = ref1 ? ref1.params.nam : lnk;
  return {
    title: name1 + '統計の都道府県ランキング一覧',
    description:
      name1 +
      '統計に関する都道府県ランキング・データを1ページに総まとめ。推移や前年比が一目で分かる表とグラフがあります。',
    openGraph: {
      title: name1 + '統計の都道府県ランキング一覧',
      description:
        name1 +
        '統計に関する都道府県ランキング・データを1ページに総まとめ。推移や前年比が一目で分かる表とグラフがあります。',
    },
    alternates: { canonical: `https://statja.com/prefecture/${lnk}` },
  };
}

export const revalidate = 86400;
export const dynamicParams = true;

export default async function PrefectureLnkPage({ params }) {
  const { lnk } = await params;

  const res1 = await fetch(`${server}/pr2cur/${lnk}.json`, { next: { revalidate: 86400 } });
  const json1 = await res1.json();

  return (
    <PrefectureLnkClient json1={json1} lnk={lnk} array4={array4} />
  );
}
