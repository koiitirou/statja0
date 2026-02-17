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
  const res = await fetch(`${server}/hospital/${hospital}_ssg.json`, { next: { revalidate: false } });
  if (!res.ok) return { title: '病院' };
  const ssg2 = await res.json();
  const hName = ssg2.def.hospital;
  return {
    title: `${hName}の治療実績と症例数ランキング・手術件数`,
    description: `${hName}の治療実績と症例数ランキング。入院患者数（症例数）・手術件数・在院日数を他の病院と比較。DPCオープンデータをもとにまとめています。`,
  };
}

export default async function HospitalDetailPage({ params }) {
  const { hospital } = await params;
  const res = await fetch(`${server}/hospital/${hospital}_ssg.json`, { next: { revalidate: false } });
  if (!res.ok) return <div>データが見つかりません</div>;
  const ssg2 = await res.json();

  return <HospitalDetailClient ssg2={ssg2} hospital1={hospital} />;
}
