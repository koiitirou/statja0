import { server } from '@/components/config';
import yasai_path from '@/components/pr2_path/yasai_path.json';
import VegetableClient from './VegetableClient';

const array4 = yasai_path.path;

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return array4.map((s) => ({
    yasai: s.params.yasai,
  }));
}

export async function generateMetadata({ params }) {
  const { yasai } = await params;
  try {
    const res = await fetch(`${server}/yasaijson/${yasai}_ssg.json`, { next: { revalidate: false } });
    const ssg1 = await res.json();
    const title1 = `${ssg1.def.tl1}収穫量の都道府県ランキング【${ssg1.def.tmn}〜${ssg1.def.tmx}】`;
    const unit1 = ssg1.def.ut0;
    let description1 = `${ssg1.def.tmx}年の${ssg1.def.tl1}の収穫量は日本全国で${ssg1.def.sum}${unit1}で、都道府県別に`;
    ssg1.def.rnk.forEach((v, i) => {
      description1 = `${description1}${ssg1.def.rnk[i]}位は${ssg1.def.pre[i]}で${ssg1.def.val[i].toLocaleString()}${unit1}（${ssg1.def.vlr[i] >= 0 ? '+' : ''}${ssg1.def.vlr[i]}%）`;
    });
    description1 = `${description1}でした。`;
    return {
      title: title1,
      description: description1,
      openGraph: { title: title1, description: description1 },
      alternates: { canonical: `https://statja.com/prefecture/vegetable/${yasai}` },
    };
  } catch (e) {
    return { title: '野菜統計' };
  }
}

export default async function VegetablePage({ params }) {
  const { yasai } = await params;
  const res = await fetch(`${server}/yasaijson/${yasai}_ssg.json`, { next: { revalidate: false } });
  const ssg1 = await res.json();

  return <VegetableClient ssg1={ssg1} yasai={yasai} />;
}
