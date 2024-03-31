'use client';

import { cn } from '@/utils/helpers';
import { SignUpFormState } from './SignUpForm';
import useSWR from 'swr';
import { Loader } from 'lucide-react';
import { RestCountry } from '@/types/rest-countries';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

function PhoneNumberInput({
  state,
}: {
  state: SignUpFormState | undefined | null;
}) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const {
    data: countries,
    error,
    isLoading,
  } = useSWR<RestCountry[], any>('https://restcountries.com/v3.1/all', fetcher);

  let morocco = countries?.find((country) => country.flag === '🇲🇦');

  if (error) return toast('something went wrong!');

  return (
    <>
      <Label htmlFor="phone">phone number</Label>
      <div
        className={cn('flex items-center gap-x-4', {
          'border border-red-500': state?.errors?.birthdate,
        })}
      >
        {isLoading && <Loader className="animate-spin" size={15} />}
        {countries && (
          <>
            <Select
              name="calling_code"
              defaultValue={`${morocco?.idd.root}${morocco?.idd.suffixes?.[0]}`}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map(
                  (country, i) =>
                    country.idd.root &&
                    country.idd.suffixes?.[0] && (
                      <SelectItem
                        key={i}
                        className="flex"
                        value={`${country.idd.root}${country.idd.suffixes?.[0]}`}
                      >
                        {`${country.idd.root}${country.idd.suffixes?.[0]}`}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
            <input
              type="phone"
              name="phone"
              autoComplete="off"
              className="outline-none bg-transparent flex-1"
              placeholder="615875849"
            />
          </>
        )}
      </div>
    </>
  );
}

export default PhoneNumberInput;
