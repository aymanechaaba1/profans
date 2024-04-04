type PlaceType =
  | 'country'
  | 'region'
  | 'postcode'
  | 'district'
  | 'place'
  | 'locality'
  | 'neighborhood'
  | 'address'
  | 'poi';

type Feature = {
  place_name: string;
  text: string;
};

export type MapboxReverseGeocodingData = {
  features: Feature[];
};
