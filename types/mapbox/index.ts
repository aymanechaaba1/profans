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
  id: string;
  type: string;
  place_type: PlaceType[];
  relevance: number;
  address: string;
  place_name: string;
  text: string;
};

export type ReverseGeocodingResponse = {
  features: Feature[];
};
