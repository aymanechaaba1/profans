import { getOrders } from '@/actions/geOrders';
import AccountTabs from '@/components/AccountTabs';
import BreadCrumb from '@/components/BreadCrumb';
import UpdateProfileForm from '@/components/UpdateProfileForm';
import { getUser } from '@/lib/utils';

async function AccountPage() {
  const user = await getUser();

  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  if (user) orders = await getOrders({ userId: user.id });

  if (user)
    return (
      <div className="container">
        <AccountTabs userClaims={user.claims} userOrders={orders} />
      </div>
    );
}

export default AccountPage;
