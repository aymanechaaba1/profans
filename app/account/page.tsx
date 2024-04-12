import AccountTabs from '@/components/AccountTabs';
import BreadCrumb from '@/components/BreadCrumb';
import UpdateProfileForm from '@/components/UpdateProfileForm';
import { getUser } from '@/lib/utils';

async function AccountPage() {
  const user = await getUser();

  if (user)
    return (
      <>
        <AccountTabs userClaims={user.claims} />
      </>
    );
}

export default AccountPage;
