//import { geoMiller, geoEquirectangular, geoNaturalEarth1, geoPath, geoGraticule } from 'd3';
import * as d3 from "d3";
import { useEffect, useState } from "react";
import statistics from "../data/2020.csv";
import * as topojson from "topojson-client";
import Info from "./Info";
// const projection = d3.geoEquirectangular();
const projection = d3
  .geoMercator()
  .center([0, 20]) //long and lat starting position
  .scale(150) //starting zoom position
  .rotate([10, 0]); //where world split occurs
const path = d3.geoPath(projection);
const graticule = d3.geoGraticule();

const Map = ({ data: { land, borders } }) => {
  const [myData, setData] = useState(null);
  // const [tooltipData, setTooltipData] = useState(null);
  console.log("rendering");
  const loadData = () => {
    d3.csv(statistics).then((stats) => {
      setData(stats);
    });
  };
  useEffect(() => {
    loadData();
    
  }, []);
  useEffect(() => {
    if(!myData) return;
    renderMap();
    renderScatter();
  }, [myData]);

  const getCountryByID = (id) => {
    return myData.find((d) => d["Country name"] === id);
  };
  const tooltipData = (d, i) => {
    let countrydata;
    var content = "";
    content += "<p><strong> Country: </strong>: ";
    if(i.properties)
    {
      countrydata = getCountryByID(i.properties.name);
      content += i.properties.name + "</p>";
    }
    else{
      countrydata = i;
      content += i["Country name"] + "</p>";
    }
    
    console.log(i, countrydata);

    // let date, tot_vac,tot_vac_percent;
    let hap_score,
      life_exp,
      freedom,
      gdp,
      soc_sup = "No Data";
    if (countrydata != null) {
      hap_score = countrydata["Ladder score"];
      life_exp = countrydata["Healthy life expectancy"];
      freedom = countrydata["Freedom to make life choices"];
      gdp = countrydata["Logged GDP per capita"];
      soc_sup = countrydata["Social support"];
    }

    content += "<p><strong> Happiness score: </strong>: ";
    content += hap_score + "</p>";
    content += "<p><strong> Healthy life expectancy: </strong>: ";
    content += life_exp + "</p>";
    content += "<p><strong> Freedom to make life choices: </strong>: ";
    content += freedom + "</p>";
    content += "<p><strong> GDP per capita: </strong>: ";
    content += gdp + "</p>";
    content += "<p><strong> Social Support: </strong>: ";
    content += soc_sup + "</p>";
    // content += "<p><strong> Total Vaccinations: </strong>: "
    // content += tot_vac + "</p>";
    // content += "<p><strong> Total Vaccinations (%): </strong>: "
    // content += tot_vac_percent + "</p>";

    d3.select(".infoPanel").html("").append("text").html(content);
    // console.log(i.properties);
  };
  const renderScatter = () => {

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3
      .select(".scatter_plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear().domain([0, 15]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    var radiusScale = d3.scaleLinear().domain([40, 100]).range([0.1, 10]);
    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(myData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        console.log(d[["Logged GDP per capita"]]);
        return x(d["Logged GDP per capita"]);
      })
      .attr("cy", function (d) {
        return y(d["Ladder score"]);
      })
      .attr("r", d => {
        return radiusScale(d["Healthy life expectancy"]);
      })
      .style("fill", "#69b3a2")
      .style("opacity", 0.6)
      .on("mouseover",  function (d, i) {
        console.log(d, i);
        tooltipData(d, i);
      })
    }
  const renderMap = () => {
    console.log("rendering map...");

    
    // const width = window.innerWidth * 0.9,
    //   height = window.innerHeight * 0.9; //1600, height = 1000;
    // const width = d3.select(".container").style('width').slice(0, -2)
    // const height = d3.select(".container").style('height').slice(0, -2)

    const svg = d3
      .select(".world_map")
      .append("svg")
      .attr("width", "1000")
      .attr("height", "400px")
      .style("margin-top", window.innerHeight * 0.05)
      .style("margin-left", window.innerWidth * 0.05)
      .call(
        d3.zoom().on("zoom", function (event) {
          g.attr("transform", event.transform);
        })
      );
    var g = svg.append("g");

    console.log(myData);
    // console.log(land);
    //const tooltip = d3.select(".world_map").append("div").attr("class", "tooltip");
    // create a tooltip

    let colorScale = d3
      .scaleLinear()
      .domain([2.0, 8.0])
      .range(d3.schemeBlues[5]);

    let countries = g
      .selectAll("path")
      .data(land)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", (d) => {
        //console.log(d.properties.iso_a3)
        let countrydata = getCountryByID(d.properties.name);
        // console.log(countrydata)
        return countrydata ? colorScale(countrydata["Ladder score"]) : "white";
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

        tooltipData(d, i);

        //  setTooltipData(i.properties);
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
  };


  return (
    <div className="container">
      <div>
        <div className="world_map"></div>
        <div className="scatter_plot"></div>
      </div>
      <div>
        <div className="infoPanel">
          <p>
            <strong>Country: </strong>
          </p>
          <p>
            <strong>Happiness score: </strong>
          </p>
          <p>
            <strong>Healthy life expectancy: </strong>
          </p>
          <p>
            <strong>Freedom to make life choices: </strong>
          </p>
          <p>
            <strong>Social Support: </strong>
          </p>
          <p>
            <strong>GDP per capita: </strong>
          </p>
        </div>

      </div>
      {/* <Info tooltipData={tooltipData} /> */}
    </div>
  );
};

export default Map;
