import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, CardContent, Card } from '@material-ui/core';
import './App.css';
import '../node_modules/leaflet/dist/leaflet.css'


import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';

// Utitlity 
import {sortData, prettyPrintStat} from './util';

function App() {
  //https://disease.sh/v3/covid-19/countries

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)

  const [mapCountries, setMapCountries] = useState([]);
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data)
    });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
            .then(response => response.json())
            .then(data => {
                const countries = data.map(country => ({
                  name: country.country,
                  value: country.countryInfo.iso2
                }));
                const sortedData = sortData(data);
                setMapCountries(data);
                setTableData(sortedData);
                setCountries(countries);
            });

    }
    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
          .then(response => response.json())
          .then(data => {
            setCountry(countryCode);
            setCountryInfo(data);
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(5);
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
      <InfoBox title="Coronavirus Cases" casesType={casesType} active={casesType === 'cases'} onClick={ (e) => setCasesType('cases') } cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
      <InfoBox title="Recovered" casesType={casesType} active={casesType === 'recovered'} onClick={ (e) => setCasesType('recovered') }  cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
      <InfoBox title="Deaths" casesType={casesType} active={casesType === 'deaths'} onClick={ (e) => setCasesType('deaths') }  cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
      </div>
      <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom}/>
      </div>

        <Card className="app__right">
          <CardContent>
            <h3>Live cases by country</h3>
              <Table countries={tableData}/>
            <h3>Worldwide New {casesType}</h3>
              <LineGraph className="app__graph" casesType={casesType}/>
          </CardContent>
        </Card>
      
    </div>
  );
}

export default App;
