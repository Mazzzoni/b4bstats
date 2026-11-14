import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function PlayerIndex() {
  const router = useRouter();
  useEffect(() => {
    void router.replace('/');
  }, [router]);
  return null;
}
