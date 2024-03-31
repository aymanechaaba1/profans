import { getSession } from '@/actions/getSession';
import db from '@/drizzle/seed';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getSession();
  if (!session || !session.user) redirect('/login');

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.user!.id),
  });

  console.log(currentUser);

  return <main>Landing Page</main>;
}
