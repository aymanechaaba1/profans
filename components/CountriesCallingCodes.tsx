async function CountriesCallingCodes() {
  const res = await fetch(`https://restcountries.com/v3.1/all`);

  if (!res.ok) throw new Error(`something went wrong`);

  const data = await res.json();

  console.log(data);

  return <div>CountriesCallingCodes</div>;
}

export default CountriesCallingCodes;
