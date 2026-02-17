import { server } from '@/components/config';
import HospitalDetailClient from './HospitalDetailClient';
import array4 from '@/public/comp/data/link/hospital_ssg_list.json';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return array4.map((s) => ({
    hospital: s.params.hospital,
  }));
}

export async function generateMetadata({ params }) {
  const { hospital } = await params;
  const res = await fetch(`${server}/hospital3/${hospital}_ssg.json`, { next: { revalidate: false } });
  if (!res.ok) return { title: '病院' };
  const ssg2 = await res.json();
  const hName = ssg2.def.hospital;
  const title1 = `${hName}の手術件数・入院数・治療実績ランキング${ssg2.def.time_list2[0]}〜${ssg2.def.time_list2[ssg2.def.time_list2.length - 1]}`;
  const desc1 = `${hName}の入院数(月平均)・手術件数・治療実績・在院日数・その他基本情報をDPCオープンデータをもとにまとめています。ランキング順位は全国、都道府県別に集計しています。`;
  return {
    title: title1,
    description: desc1,
  };
}

export default async function HospitalDetailPage({ params }) {
  const { hospital } = await params;
  const res = await fetch(`${server}/hospital3/${hospital}_ssg.json`, { next: { revalidate: false } });
  if (!res.ok) return <div>データが見つかりません</div>;
  const ssg2 = await res.json();

  return <HospitalDetailClient ssg2={ssg2} hospital1={hospital} />;
}
