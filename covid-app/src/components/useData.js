import '../App.css';
import React, {useEffect, useState} from 'react';
// import * as d3 from 'd3';
import { json } from 'd3';
import data from '../data/country_vaccinations.csv';
import { feature, mesh } from "topojson-client";

const jsonUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

const useData = () => {
  const [data, setData] = useState(null);
  console.log(data);

  useEffect(() => {
    json(jsonUrl).then(topology => {
      const { countries, land } = topology.objects;
      setData({
        land: feature(topology, land),
        interiors: mesh(topology, countries, (a, b) => a !== b)
      });
    });
  }, []);

  return data;
};

export default useData;