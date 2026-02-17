'use client';
import { Typography, Box } from '@mui/material';
import { Layout } from '@/components/layout';
import Link from 'next/link';

const PrivacyPolicyClient = () => {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Typography variant='h1'>プライバシーポリシー</Typography>
        <Typography variant='body1'>
          「統計リアル」(以下、当サイト)の利用者は、以下に記載する項目に同意したものとみなします。
        </Typography>
        <Typography variant='h2'>個人情報の収集について</Typography>
        <Typography variant='body1'>
          利用者は匿名のままで、当サイトを自由に閲覧する事ができます。お問合せ等、場合によっては、利用者の氏名やメールアドレスなどの個人情報の開示をお願いする事があります。しかし、利用者の個人情報を利用者の許可なく、当サイトから第三者へ開示・共有する事はありません。
        </Typography>
        <Typography variant='h2'>アクセス解析ツールについて</Typography>
        <Typography variant='body1'>
          当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
          このGoogleアナリティクスはトラフィックデータの収集のためにCookie
          を使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能は
          Cookie
          を無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくは
          <Link
            prefetch={false}
            href='https://marketingplatform.google.com/about/analytics/terms/jp/'
          >
            「Googleアナリティクス利用規約」
          </Link>
          をご覧ください。
        </Typography>
        <Typography variant='h2'>免責事項</Typography>
        <Typography variant='body1'>
          当サイトでは掲載情報の内容について誤りがないようにできるだけ注意を払っていますが、利用者が当サイトを参照した事によって何かしらの損害を被った場合でも、当サイト管理者は責任を負いません。また当サイトから外部サイトにリンクしている場合がありますが、当サイト以外のウェブサイトの内容に関して、当サイトの個人情報の保護についての諸条件は適用されません。
          当サイト以外のウェブサイトの内容及び、個人情報の保護に関しても、一切責任を負いかねますのでご了承ください。当サイトで引用している文章や画像について、著作権は引用もとにあります。
        </Typography>
        <Typography variant='h2'>お問い合わせ窓口</Typography>
        <Typography variant='body1'>
          本ポリシーに関するお問い合わせは，下記の窓口までお願いいたします。
        </Typography>
      </Box>
    </Layout>
  );
};

export default PrivacyPolicyClient;
