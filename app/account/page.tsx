import { getOrders } from '@/actions/geOrders';
import AccountTabs from '@/components/AccountTabs';
import { getUser } from '@/lib/utils';
import { unstable_cache } from 'next/cache';

async function AccountPage() {
  const user = await getUser();

  let getCachedOrders = unstable_cache(getOrders, ['orders'], {
    tags: ['orders'],
    revalidate: 60,
  });
  let cachedOrders: any = [];
  if (user)
    cachedOrders = await getCachedOrders({
      userId: user.id,
    });

  if (user)
    return (
      <div className="container">
        <AccountTabs userClaims={user.claims} userOrders={cachedOrders} />
      </div>
    );
}

export default AccountPage;
