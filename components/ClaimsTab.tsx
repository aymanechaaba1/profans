import React, { Dispatch, SetStateAction } from 'react';
import { TabsContent } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { CirclePlus, Loader2 } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import ClaimsTable from './ClaimsTable';
import { claims } from '@/drizzle/schema';

function SubmitClaimButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="flex justify-center">
      {pending ? <Loader2 className="animate-spin" /> : <span>Add Claim</span>}
    </Button>
  );
}

function ClaimsTab({
  showDialog,
  setShowDialog,
  formAction,
  userClaims,
}: {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  formAction: (payload: FormData) => void;
  userClaims: (typeof claims.$inferSelect)[];
}) {
  return (
    <TabsContent value="claims">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Claims</CardTitle>
            <Dialog
              onOpenChange={(open) => {
                setShowDialog(open);
              }}
              open={showDialog}
            >
              <DialogTrigger asChild>
                <CirclePlus className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>New Claim</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4" action={formAction}>
                  <Label htmlFor="subject" className="">
                    Subject
                  </Label>
                  <Input name="subject" className="" />
                  <Label htmlFor="message" className="">
                    Message
                  </Label>
                  <Textarea name="message" className="" />
                  <SubmitClaimButton />
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <ClaimsTable userClaims={userClaims} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default ClaimsTab;
