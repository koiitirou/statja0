export const metadata = {
  title: '都道府県データランキング',
  description:
    '日本全国の都道府県データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。',
  openGraph: {
    title: '都道府県データランキング',
    description:
      '日本全国の都道府県データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。',
  },
  alternates: {
    canonical: 'https://statja.com/prefecture',
  },
};

export default function PrefectureLayout({ children }) {
  return children;
}
