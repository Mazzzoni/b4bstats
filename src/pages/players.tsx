import type { GetServerSideProps } from 'next';
export default function LegacyPage() {
  return null;
}
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (typeof value === 'string') params.set(key, value);
  return { redirect: { destination: '/' + (params.size ? '?' + params : ''), permanent: false } };
};
