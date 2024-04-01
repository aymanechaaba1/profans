import { getSession } from '@/actions/getSession';
import db from '@/drizzle/seed';
import { redirect } from 'next/navigation';

export default async function Home() {
  return <main>Landing Page</main>;
}
