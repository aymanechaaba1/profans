export type Idd = {
  root: string;
  suffixes: string[];
};

export type RestCountry = {
  area: number;
  flag: string;
  idd: Idd;
  name: {
    common: string;
  };
};
