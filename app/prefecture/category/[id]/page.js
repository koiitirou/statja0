import CategoryClient from './CategoryClient';
import { server } from '@/components/config';
import pr2_path from '@/components/pr2_path/pr2_path.json';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return pr2_path.path.map((item) => ({
    id: item.params.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await fetch(`${server}/pr2json2/${id}_ssg.json`, { next: { revalidate: 3600 } });
  if (!res.ok) {
    return { title: '都道府県ランキング' };
  }
  const ssg1 = await res.json();

  const title1 = `${
    ssg1.def.tl1 +
    'の都道府県ランキング【' +
    ssg1.def.tmn +
    '〜' +
    ssg1.def.tmx +
    '】'
  }`;

  let description1 = `${ssg1.def.tmx}年の${ssg1.def.tl1}の都道府県ランキング`;
  ssg1.def.ran.forEach((v, i) => {
    description1 = `${description1}${ssg1.def.rnk[i]}位は${
      ssg1.def.pre[i]
    }で${ssg1.def.val[i].toLocaleString()}${ssg1.def.ut1}（${ssg1.def.lpr[i] >= 0 ? '+' : ''}${
      ssg1.def.lpr[i]
    }%）`;
    if (i != ssg1.def.ran.length - 1) {
      description1 = `${description1}、`;
    }
  });
  description1 = `${description1}でした。`;

  return {
    title: title1,
    description: description1,
    openGraph: {
      title: title1,
      description: description1,
    },
    alternates: { canonical: `https://statja.com/prefecture/category/${id}` },
  };
}

export const revalidate = 3600;
export const dynamicParams = true;

export default async function CategoryPage({ params }) {
  const { id } = await params;

  const res = await fetch(`${server}/pr2json2/${id}_ssg.json`, { next: { revalidate: 3600 } });
  if (!res.ok) {
    notFound();
  }
  const ssg1 = await res.json();

  const thisParams = pr2_path.path.find((v) => v.params.id == id);
  const thisRef0 = Object.entries(pr2_path.refs);
  const thisRef1 = pr2_path.refs[thisParams.params.c1];
  const thisRef2 = { ...thisRef1.params.c2s[thisParams.params.c2] };
  thisRef2.url = Array.isArray(thisRef2.url) ? thisRef2.url : [thisRef2.url];
  const thisRelated = thisRef2.url.map((v) => {
    return pr2_path.path.find((s) => s.params.id == v);
  });

  return (
    <CategoryClient
      ssg1={ssg1}
      id={id}
      thisRef0={thisRef0}
      thisRef1={thisRef1}
      thisRef2={thisRef2}
      thisRelated={thisRelated}
    />
  );
}
