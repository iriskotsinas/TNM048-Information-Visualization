import '../App.css';
import {useEffect, useState} from 'react';
// import * as d3 from 'd3';
import worldmap from '../data/map.json';
// import { feature, mesh } from "topojson-client";
// const jsonUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';
// const jsonUrl = 'https://gist.githubusercontent.com/d3noob/5193723/raw/world-110m2.json';

const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
      //const { countries, land } = topomap.features;
    setData({
      land: worldmap.features
        //borders: mesh(topomap, countries, (a, b) => a !== b)
    });
      //setData(topology);
    // json(topomap).then((topology) => {
    //   setData(topology);
    // });

    return () => undefined;
  }, []);

  return data;
};

export default useData;