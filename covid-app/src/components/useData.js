import '../App.css';
import React, {useEffect, useState} from 'react';
// import * as d3 from 'd3';
import * as d3 from 'd3';
import topomap from '../data/world_countries.json';
import worldmap from '../data/map.json';
import statistics from '../data/country_vaccinations.csv';
import test from '../data/test.json';

import { feature, mesh } from "topojson-client";
console.log(worldmap);
const jsonUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';
// const jsonUrl = 'https://gist.githubusercontent.com/d3noob/5193723/raw/world-110m2.json';

const useData = () => {
  const [data, setData] = useState(null);
  const [covidData, setCovidData] = useState(null);


  useEffect(() => {
      console.log(worldmap);
      //const { countries, land } = topomap.features;
      setData({
        land: worldmap.features
        //borders: mesh(topomap, countries, (a, b) => a !== b)
      });
      //setData(topology);
    // json(topomap).then((topology) => {
    //   setData(topology);
    // });

    // csv(statistics).then(stats => {
    //   setCovidData(stats);
    // });
    return () => undefined;
  }, []);

  return data;
};

export default useData;