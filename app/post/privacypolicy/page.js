export const metadata = {
  title: 'プライバシーポリシー',
  description:
    '診断病名一覧から、全国・各都道府県の病院の診療実績（症例数、手術数、在院日数）を比較することができます。',
  openGraph: {
    title: 'プライバシーポリシー',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}

import PrivacyPolicyClient from './PrivacyPolicyClient';
