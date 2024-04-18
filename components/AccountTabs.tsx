'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpdateProfileForm from './UpdateProfileForm';
import { CirclePlus, CirclePlusIcon, Loader2, PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { addClaim } from '@/actions/addClaim';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import ClaimsTab from './ClaimsTab';
import { claims, orders } from '@/drizzle/schema';
import OrdersTab from './OrdersTab';
import { getOrders } from '@/actions/geOrders';

function AccountTabs({
  userClaims,
  userOrders,
}: {
  userClaims: (typeof claims.$inferSelect)[];
  userOrders: Awaited<ReturnType<typeof getOrders>>;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [state, formAction] = useFormState(addClaim, null);

  useEffect(() => {
    state?.message && toast(state.message);
    state?.success && setShowDialog(false);
  }, [state]);

  return (
    <Tabs defaultValue="account" className="">
      <TabsList className="">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="claims">Claims</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* <UpdateProfileForm /> */}
          </CardContent>
        </Card>
      </TabsContent>
      <OrdersTab userOrders={userOrders} />
      <ClaimsTab
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        formAction={formAction}
        userClaims={userClaims}
      />
    </Tabs>
  );
}

export default AccountTabs;
