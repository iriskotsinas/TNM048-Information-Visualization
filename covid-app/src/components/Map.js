//import { geoMiller, geoEquirectangular, geoNaturalEarth1, geoPath, geoGraticule } from 'd3';
import * as d3 from "d3";
import { useEffect, useState } from "react";
import statistics from "../data/country_vaccinations.csv";
import * as topojson from "topojson-client";
import Info from "./Info";
// const projection = d3.geoEquirectangular();
const projection = d3
  .geoMercator()
  .center([0, 70]) //long and lat starting position
  .scale(200) //starting zoom position
  .rotate([10, 0]); //where world split occurs
const path = d3.geoPath(projection);
const graticule = d3.geoGraticule();

const Map = ({ data: { land, borders } }) => {
  const [covidData, setCovidData] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

  const loadData = () => {
    d3.csv(statistics).then((stats) => {
      setCovidData(stats);
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  const renderMap = () => {
    const getCountryByID = (id) => {
      return covidData.find(
        (d) => d.iso_code === id && d.date === "2021-01-10"
      );
    };

    const width = window.innerWidth * 0.9,
      height = window.innerHeight * 0.9; //1600, height = 1000;

    // const redraw = () => {
    //     svg.attr("transform",d3.event.transform);// "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    // }

    const svg = d3
      .select(".world_map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("margin-top", window.innerHeight * 0.05)
      .style("margin-left", window.innerWidth * 0.05);
    // .call(
    //   d3.zoom().on("zoom", redraw)
    // )
    var g = svg.append("g");

    // console.log(covidData);
    // console.log(land);
    //const tooltip = d3.select(".world_map").append("div").attr("class", "tooltip");
    // create a tooltip


    let colorScale = d3
      .scaleLinear()
      .domain([0, 100000])
      .range(d3.schemeBlues[9]);

    let countries = g
      .selectAll("path")
      .data(land)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", (d) => {
        //console.log(d.properties.iso_a3)
        let countrydata = getCountryByID(d.properties.iso_a3);

        return countrydata
          ? colorScale(countrydata.total_vaccinations)
          : "white";
      })
      .on("mouseover", function (d, i) {
        // console.log(d3.select(this));
        // d3.selectAll(".country")
        //   .transition()
        //   .duration(20)
        //   .style("opacity", 0.5);
        d3.select(this)
          .transition()
          .duration(20)
          .attr("opacity", 1)
          .style("stroke", "red")
          .style("stroke-width", 4.0);

        console.log(i.properties.iso_a3)
        setTooltipData(i.properties);
      })
      .on("mouseleave", function () {
        // d3.selectAll(".country")
        //   .transition()
        //   .duration(20)
        //   .style("opacity", 1.0)
        //   .style("stroke", "gray");
        d3.select(this)
          .transition()
          .duration(20)
          .style("stroke", "gray")
          .style("opacity", 1.0)
          .style("stroke-width", 1.0);
      });

    // g.selectAll("text")
    //   .data(land)
    //   .enter()
    //   .append("text")
    //   .text(function (d) {
    //     //console.log(d);
    //     let countrydata = getCountryByID(d.properties.iso_a3);

    //     return countrydata ? countrydata.total_vaccinations : "";
    //   })
    //   .attr("x", function (d) {
    //     return path.centroid(d)[0];
    //   })
    //   .attr("y", function (d) {
    //     return path.centroid(d)[1];
    //   })
    //   .attr("class", "labels");

    // g.append("path")
    //     .attr("class","borders")
    //     .attr("d", path(borders));
  };

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

  renderMap();
  return (<div><div className="world_map"></div><Info tooltipData={tooltipData}/></div>);
};

export default Map;
