import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import './App.css';

import InfoBox from './InfoBox';

function App() {
  //https://disease.sh/v3/covid-19/countries

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
            .then(response => response.json())
            .then(data => {
                const countries = data.map(country => ({
                  name: country.country,
                  value: country.countryInfo.iso2
                }));
                setCountries(countries);
            });

    }
    getCountriesData();
  }, [])

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  }
  return (
    <div className="app">
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
       <FormControl className="app__dropdown">
         <Select
           variant="outlined"
           onChange={onCountryChange}
           value={country}
         >
        <MenuItem value="Worldwide">Worldwide</MenuItem>
        {
          countries.map( country => <MenuItem value={country.value}>{country.name}</MenuItem>)
        }
         </Select>
       </FormControl>
      </div>
     
      <div className="app__stats">
      <InfoBox title="Coronavirus Cases" cases={123} total={10000} />
      <InfoBox title="Recovered" cases={123} total={5000} />
      <InfoBox title="Deaths" cases={123} total={4000} />
      </div>
      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
