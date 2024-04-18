'use client';

import { useEffect, useState } from 'react';
import PhoneNumberInput from './PhoneNumberInput';
import { Label } from './ui/label';
import { cn, getCities } from '@/utils/helpers';
import { City } from '@/types/moroccan-cities';
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import useSession from '@/hooks/useSession';
import { updateProfile } from '@/actions/updateProfile';
import { toast } from 'sonner';

export type FormState = {
  errors: string[];
  message: string;
};

const initState: FormState = {
  errors: [],
  message: '',
};

function SignupSubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="col-span-2 bg-blue-500 text-white py-2 rounded-lg flex justify-center items-center"
    >
      {pending ? (
        <Loader2 className="animate-spin my-1" size={15} color="white" />
      ) : (
        'save changes'
      )}
    </button>
  );
}

function UpdateProfileForm() {
  const [cities, setCities] = useState<City[] | undefined>(undefined);
  const [formState, formAction] = useFormState(updateProfile, null);
  const { user } = useSession();
  const [birthdateDefaultVal, setBirthdateDefaultVal] = useState('');

  useEffect(() => {
    getCities().then((data) => setCities(data.results));

    formState?.message && toast(formState.message);

    if (user)
      setBirthdateDefaultVal(
        `${user.birthdate.getFullYear()}-${String(
          user.birthdate.getMonth() + 1
        ).padStart(2, '0')}-${String(user.birthdate.getDate()).padStart(
          2,
          '0'
        )}`
      );
  }, [formState, user]);

  return (
    <form
      action={formAction}
      className="grid grid-cols-2 items-center my-5 space-y-4"
    >
      <Label htmlFor="email">email</Label>
      <input
        type="email"
        name="email"
        autoComplete="off"
        defaultValue={user?.email}
        className={cn('border rounded-lg py-1 px-3', {
          'border-red-500': formState?.errors?.email,
        })}
        placeholder="name@contact.ma"
      />
      <Label htmlFor="gender">gender</Label>
      <select
        name="gender"
        className={cn(`border py-1 px-3 rounded-lg`, {
          'border border-red-500': formState?.errors?.gender,
        })}
        defaultValue={user?.gender}
      >
        <option value="" disabled>
          please select a gender
        </option>
        <option value="male">male</option>
        <option value={'female'}>female</option>
      </select>
      <Label htmlFor="firstname">firstname</Label>
      <input
        type="text"
        name="firstname"
        autoComplete="off"
        defaultValue={user?.firstname}
        className={cn('border rounded-lg py-1 px-3', {
          'border border-red-500': formState?.errors?.firstname,
        })}
      />
      <Label htmlFor="lastname">lastname</Label>
      <input
        type="text"
        name="lastname"
        autoComplete="off"
        defaultValue={user?.lastname}
        className={cn('border rounded-lg py-1 px-3', {
          'border border-red-500': false,
        })}
      />
      <Label htmlFor="cin">cin</Label>
      <input
        type="text"
        name="cin"
        autoComplete="off"
        defaultValue={user?.cin}
        className={cn('border rounded-lg py-1 px-3', {
          'border border-red-500': false,
        })}
      />
      <Label htmlFor="birthdate">birthdate</Label>
      <input
        type="date"
        name="birthdate"
        defaultValue={birthdateDefaultVal}
        className={cn('border rounded-lg py-1 px-3', {
          'border border-red-500': false,
        })}
      />
      <Label htmlFor="city">city</Label>
      <select
        name="city"
        className={cn('border rounded-lg py-1 px-3', {
          'border border-red-500': false,
        })}
        defaultValue={user?.city}
      >
        <option value="" disabled>
          please select a city
        </option>
        {cities?.map((city, i) => (
          <option key={i} value={city.name.toLowerCase()}>
            {city.name}
          </option>
        ))}
      </select>
      <PhoneNumberInput state={undefined} />
      <SignupSubmitBtn />
    </form>
  );
}

export default UpdateProfileForm;
