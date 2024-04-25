import { getOrders } from '@/actions/geOrders';
import AccountTabs from '@/components/AccountTabs';
import { getUser } from '@/lib/utils';
import { unstable_cache } from 'next/cache';

async function AccountPage() {
  const user = await getUser();

  let orders: any = [];
  if (user)
    orders = await getOrders({
      userId: user.id,
    });

  if (user)
    return (
      <div className="container">
        <AccountTabs userClaims={user.claims} userOrders={orders} />
      </div>
    );
}

export default AccountPage;
