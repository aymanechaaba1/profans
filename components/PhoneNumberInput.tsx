'use client';

import { cn } from '@/utils/helpers';
import { SignUpFormState } from './SignUpForm';
import useSWR from 'swr';
import { Loader, Loader2 } from 'lucide-react';
import { Idd, RestCountry } from '@/types/rest-countries';
import { Label } from './ui/label';
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { MapboxReverseGeocodingData } from '@/types/mapbox';
import useSession from '@/hooks/useSession';
import { Input } from './ui/input';

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
  const [country, setCountry] = useState<string>('');
  const [idd, setIdd] = useState<Idd | undefined>(undefined);
  const { user } = useSession();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    let currentCountryIdd = countries?.find(
      (c) => c.name.common.toLowerCase() === country
    )?.idd;
    setIdd(currentCountryIdd);
  }, [countries, country]);

  function onSuccess(pos: GeolocationPosition) {
    let {
      coords: { latitude, longitude },
    } = pos;

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}&types=country`
    )
      .then((res) => res.json())
      .then((data: MapboxReverseGeocodingData) => {
        setCountry(data.features[0].place_name.toLowerCase());
      });
  }

  function onError() {
    toast('location rejected');
  }

  if (error) return toast('something went wrong!');

  return (
    <>
      <Label htmlFor="phone">phone number</Label>
      {isLoading && <Loader2 className="animate-spin" size={15} />}
      {countries && (
        <div className="grid grid-cols-2 md:gap-x-4">
          <Select name="calling_code" defaultValue={`+212`}>
            <SelectTrigger className="w-[80px] md:w-full text-xs md:text-base">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries?.map(
                (country, i) =>
                  country.idd.root &&
                  country.idd.suffixes?.[0] && (
                    <SelectItem
                      key={`${i}-${uuidv4()}`}
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
            defaultValue={user?.phone.slice(4)}
            className={cn(
              'outline-none bg-transparent border rounded-lg px-3 text-xs md:text-base flex-1',
              {
                'border-red-500': state?.errors?.phone,
              }
            )}
            placeholder="615875849"
          />
        </div>
      )}
    </>
  );
}

export default PhoneNumberInput;
