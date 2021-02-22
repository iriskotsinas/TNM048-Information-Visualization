import '../App.css';
import React, {useEffect, useState} from 'react';
// import * as d3 from 'd3';
import { json } from 'd3';
// import data from '../data/country_vaccinations.csv';
import { feature } from "topojson-client";

const jsonUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

const useData = () => {
  const [data, setData] = useState(null);

  console.log(data);

  useEffect(() => {
    json(jsonUrl).then(topojsonData => {
      const { countries } = topojsonData.objects;
      setData(feature(topojsonData, countries));
    });
  }, []);

  // const newdata = JSON.parse(JSON.stringify(data))
  return (
    // <>
    //   {/* { data && data.products.map(home => <div>{home}</div>)} */}
    // </>
    data
  )};

export default useData;