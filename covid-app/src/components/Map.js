//import { geoMiller, geoEquirectangular, geoNaturalEarth1, geoPath, geoGraticule } from 'd3';
import * as d3 from "d3";
import { useEffect, useState } from "react";
import statistics from "../data/2020.csv";

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
    if (!myData) return;
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
    if (i.properties) {
      countrydata = getCountryByID(i.properties.name);
      content += i.properties.name + "</p>";
    } else {
      countrydata = i;
      content += i["Country name"] + "</p>";
    }

    // let date, tot_vac,tot_vac_percent;
    let hap_score = "No Data",
      life_exp = "No Data",
      freedom = "No Data",
      gdp = "No Data",
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
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3
      .select(".scatter_plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear().domain([6, 12]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear().domain([2, 8]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    var radiusScale = d3.scaleLinear().domain([50, 90]).range([5, 15]);
    let colorScale = d3
      .scaleThreshold()
      .domain([3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5])
      .range([
        "#045071",
        "#066792",
        "#1881AF",
        "#3993BA",
        "#5FABCB",
        "#FFB570",
        "#FF9E45",
        "#FF8719",
        "#E76F00",
        "#B45600",
        "#833F00",
      ]);

    // Add dots
    var g = svg
      .append("g")
      .selectAll("dot")

      .data(myData)
      .enter()
      .append("circle")
      .attr("class", "scatter")
      .attr("id", function (d, i) {
        return (
          "circle-" + d["Country name"].split(".").join("").split(" ").join("")
        );
      })
      .attr("cx", function (d) {
        return x(d["Logged GDP per capita"]);
      })
      .attr("cy", function (d) {
        return y(d["Ladder score"]);
      })
      .attr("r", (d) => {
        return radiusScale(d["Healthy life expectancy"]);
      })
      .style("fill", function (d) {
        return colorScale(d["Ladder score"]);
      })
      // .style("opacity", 0.8)
      .on("mouseover", function (d, i) {
        d3.select(this).attr("r", 20);
        tooltipData(d, i);
        d3.select(
          "#map-" + i["Country name"].split(".").join("").split(" ").join("")
        ).attr("fill", "black");
      })
      .on("mouseout", function (d, i) {
        d3.selectAll(".country")
          // .transition()
          // .duration(200)
          .attr("fill", function (d) {
            let countrydata = getCountryByID(d.properties.name);
            // console.log(countrydata)
            return countrydata
              ? colorScale(countrydata["Ladder score"])
              : "darkgrey";
          });

        d3.select(this)
          .transition()
          .duration(300)
          .attr("r", radiusScale(i["Healthy life expectancy"]));
      });

    // svg.call(
    //   d3.zoom().on("zoom", function (event) {
    //     g.attr("transform", event.transform);
    //   })
    // )
  };
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

    // console.log(land);
    //const tooltip = d3.select(".world_map").append("div").attr("class", "tooltip");
    // create a tooltip

    let colorScale = d3
      .scaleThreshold()
      .domain([3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5])
      .range([
        "#045071",
        "#066792",
        "#1881AF",
        "#3993BA",
        "#5FABCB",
        "#FFB570",
        "#FF9E45",
        "#FF8719",
        "#E76F00",
        "#B45600",
        "#833F00",
      ]);

    let countries = g
      .selectAll("path")
      .data(land)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("id", function (d) {
        let countrydata = getCountryByID(d.properties.name);

        if (countrydata)
          return (
            "map-" +
            countrydata["Country name"].split(".").join("").split(" ").join("")
          );
      })
      .attr("d", path)
      .attr("fill", (d) => {
        let countrydata = getCountryByID(d.properties.name);
        return countrydata
          ? colorScale(countrydata["Ladder score"])
          : "darkgrey";
      })
      .on("mouseover", function (d, i) {
        // d3.selectAll(".country")
        //   .transition()
        //   .duration(20)
        //   .style("opacity", 0.5);
        d3.select(this).transition().duration(100).attr("fill", "black");
        var countrydata = getCountryByID(i.properties.name);

        if (countrydata) {
          console.log(
            countrydata,
            "#circle-" +
              countrydata["Country name"]
                .split(".")
                .join("")
                .split(" ")
                .join("")
          );
          d3.select(
            "#circle-" +
              countrydata["Country name"]
                .split(".")
                .join("")
                .split(" ")
                .join("")
          )
            // .attr("r", 20)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .bringElementAsTopLayer();
        }
        tooltipData(d, i);
      })
      .on("mouseout", function (d, i) {
        d3.selectAll(".scatter").style("stroke", "transparent");

        d3.selectAll(".country")
          .transition()
          .duration(20)
          .attr("fill", function (d) {
            let countrydata = getCountryByID(d.properties.name);
            return countrydata
              ? colorScale(countrydata["Ladder score"])
              : "darkgrey";
          });
      });

    d3.selection.prototype.bringElementAsTopLayer = function () {
      return this.each(function () {
        this.parentNode.appendChild(this);
      });
    };
    d3.selection.prototype.pushElementAsBackLayer = function () {
      return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
        }
      });
    };
    // g.selectAll("text")
    //   .data(land)
    //   .enter()
    //   .append("text")
    //   .text(function (d) {
    //     let countrydata = getCountryByID(d.properties.iso_a3);

    //     return d.properties.iso_a3;
    //   })
    //   .attr("x", function (d) {
    //     return path.centroid(d)[0];
    //   })
    //   .attr("y", function (d) {
    //     return path.centroid(d)[1];
    //   })
    //   .attr("class", "labels")
    //   .style("font-size", 5);

    const ticks = d3.scaleLinear().domain([2.5, 8]).range([0, 280]);

    const xAxis = d3
      .axisBottom(ticks)
      .tickSize(10)
      .tickValues(colorScale.domain());

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(70, 370)")
      .call(xAxis);

    // legend.select(".domain")
    //     .remove();

    const legendColors = function (legendColor) {
      let d = colorScale.invertExtent(legendColor);
      if (!d[0]) d[0] = ticks.domain()[0];
      if (!d[1]) d[1] = ticks.domain()[1];
      return d;
    };

    legend
      .selectAll("rect")
      .data(colorScale.range().map((legendColor) => legendColors(legendColor)))
      .enter()
      .insert("rect", ".legend-tick")
      .attr("height", 10)
      .attr("x", function (d) {
        return ticks(d[0]);
      })
      .attr("width", function (d) {
        return ticks(d[1]) - ticks(d[0]);
      })
      .attr("fill", function (d) {
        return colorScale(d[0]);
      });

    const noDataLegend = svg
      .append("g")
      .attr("class", "noDataLegend")
      .attr("transform", "translate(70, 350)")
      .insert("rect")
      .attr("height", 10)
      .attr("width", 25)
      .attr("fill", "darkgrey");

    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 360)
      .text("No Data")
      .style("font-size", 12);

    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 380)
      .text("Legend")
      .style("font-size", 12);
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
