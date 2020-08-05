import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, CardContent, Card } from '@material-ui/core';
import './App.css';

import InfoBox from './InfoBox';
import Map from './Map';

function App() {
  //https://disease.sh/v3/covid-19/countries

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});

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

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url = countryCode == 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
          .then(response => response.json())
          .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
          });
  }
  return (
    <div className="app">

      <div className="app__left">
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
       <FormControl className="app__dropdown">
         <Select
           variant="outlined"
           onChange={onCountryChange}
           value={country}
         >
        <MenuItem value="worldwide">Worldwide</MenuItem>
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
      <Map/>
      </div>

      <div className="app__right">
        {/* Table */}
        <Card>
          <CardContent>
            <h1>Worldwide Live cases</h1>
          </CardContent>
        </Card>
      {/* Graph */}
      </div>
      
    </div>
  );
}

export default App;
