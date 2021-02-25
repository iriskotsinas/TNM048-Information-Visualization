//import { geoMiller, geoEquirectangular, geoNaturalEarth1, geoPath, geoGraticule } from 'd3';
import * as d3 from "d3";
import { useEffect, useState } from 'react';
import statistics from '../data/country_vaccinations.csv';
import * as topojson from 'topojson-client';

// const projection = d3.geoEquirectangular();
const projection = d3.geoMercator()
    .center([0, 70]) //long and lat starting position
    .scale(200) //starting zoom position
    .rotate([10,0]); //where world split occurs
const path = d3.geoPath(projection);
const graticule = d3.geoGraticule();

const Map = ({ data: {land, borders}} ) => {
  const [covidData, setCovidData] = useState(null);

  useEffect(() => {
    d3.csv(statistics).then(stats => {
      setCovidData(stats);
    });
  }, []);

  useEffect(() => {
    renderMap();
  }, [covidData]);

  const renderMap = () =>  {
    const width = window.innerWidth * 0.9, height = window.innerHeight * 0.9; //1600, height = 1000;

    // const redraw = () => { 
    //     svg.attr("transform",d3.event.transform);// "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    // }
    
    const svg = d3.select(".world_map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin-top", window.innerHeight * 0.05)
    .style("margin-left", window.innerWidth * 0.05);
    // .call(
    //   d3.zoom().on("zoom", redraw)
    // )
     var g = svg.append("g");

     console.log(covidData);

    g.selectAll("path")
        .data(land)
        .enter()
        .append("path")
        .attr("class","continent")
        .attr("d", path);

    // g.append("path")
    //     .attr("class","borders")
    //     .attr("d", path(borders));
  }

  // console.log(land);
  // console.log(borders);
  // return (<g className="marks">
  //   <path className="sphere" d={path({ type: 'Sphere' })} />

  //   <path className="graticules" d={path(graticule())} />

  //   {land.features.map((feature,i) => (
  //     <path className="land" key={i} d={path(feature)} />
  //   ))}
  //   <path className="borders" d={path(borders)} />
  // </g>);
  return (

    <div className="world_map" ></div>

  )
};

export default Map;