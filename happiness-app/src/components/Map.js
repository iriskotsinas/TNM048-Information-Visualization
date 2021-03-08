import * as d3 from "d3";
import React from 'react';
import { useEffect, useState } from "react";
import s2015 from "../data/2015.csv";
import s2016 from "../data/2016.csv";
import s2017 from "../data/2017.csv";
import s2018 from "../data/2018.csv";
import s2019 from "../data/2019.csv";
import Select from "react-select";
import { Slider } from "rsuite";
import "react-dropdown/style.css";
import "rsuite/dist/styles/rsuite-default.css";
import { optionArray, sizeLegend, trimString, round } from "./helper";

const collection = {
  2015: s2015,
  2016: s2016,
  2017: s2017,
  2018: s2018,
  2019: s2019,
};

const projection = d3
  .geoMercator()
  .center([0, 20]) // long and lat starting position
  .scale((window.innerHeight+ window.innerWidth)/20) // starting zoom position
  .rotate([10, 0]); // where world split occurs

const path = d3.geoPath(projection);

const Map = ({ data: { land } }) => {
  const [myData, setData] = useState(null);
  const [options, setOptions] = useState(optionArray[0]);
  const [year, setYear] = useState(2015);

  const loadData = () => {
    d3.csv(collection[year]).then((stats) => {
      setData(stats);
    });
  };

  useEffect(() => {
    loadData();
  }, [year]);

  useEffect(() => {
    if (!myData) return;
    clearContent();
    renderMap();
    renderScatter();
  }, [myData]);

  useEffect(() => {
    if (!myData) return;
    clearContent();
    renderMap();
    renderScatter();
  }, [options]);

  const clearContent = () => {
    d3.selectAll("svg").remove();
  };

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

    let hap_score = "No Data",
      life_exp = "No Data",
      freedom = "No Data",
      gdp = "No Data";

    if (countrydata != null) {
      hap_score = countrydata["Ladder score"];
      life_exp = countrydata["Healthy life expectancy"];
      freedom = countrydata["Freedom to make life choices"];
      gdp = countrydata["Logged GDP per capita"];
    }

    content += "<p><strong> Happiness score: </strong>: ";
    content += round(hap_score) + "</p>";
    content += "<p><strong> Healthy life expectancy: </strong>: ";
    content += round(life_exp) + "</p>";
    content += "<p><strong> Freedom to make life choices: </strong>: ";
    content += round(freedom) + "</p>";
    content += "<p><strong> GDP per capita: </strong>: ";
    content += round(gdp) + "</p>";
    d3.select(".infoPanel").html("").append("text").html(content);
  };

  const renderScatter = () => {
    var margin = { top: 10, right: 30, bottom: 80, left: 80 },
      width = window.innerWidth / 2 - margin.left - margin.right,
      height = window.innerHeight / 2 - margin.top - margin.bottom;

    var svg = d3
      .select(".scatter_plot")
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      // .attr("preserveAspectRatio", "xMinYMin meet")
      // .attr("viewBox", "0 0 1000 400")
      // //class to make it responsive
      // .classed("svg-content-responsive", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("preserveAspectRatio", "xMinYMin meet");

    // Add X axis
    var x = d3.scaleLinear().domain([0, 2.2]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear().domain([2, 8]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
    var range = [8, 11, 14, 17].map(function(x) {return x * Math.abs(Math.log(window.innerHeight/window.innerWidth))});
    var radiusScale = d3
      .scaleLinear()
      .domain([0.5, 1, 1.5, 2])
      .range(range);
    let colorScale = d3
      .scaleThreshold()
      .domain(options.domain)
      .range(options.range);

    // Add dots
    svg
      .append("g")
      .selectAll("dot")

      .data(myData)
      .enter()
      .append("circle")
      .attr("class", "scatter")
      .attr("id", function (d, i) {
        return "circle-" + trimString(d["Country name"]);
      })
      .attr("cx", function (d) {
        return x(d["Logged GDP per capita"]);
      })
      .attr("cy", function (d) {
        return y(d["Ladder score"]); //change?
      })
      .attr("r", (d) => {
        return radiusScale(d["Healthy life expectancy"]);
      })
      .style("fill", function (d) {
        return colorScale(d[options.data]);
      })

      .on("mouseover", function (d, i) {
        d3.select(this).attr("r", 15);
        tooltipData(d, i);
        d3.select("#map-" + trimString(i["Country name"])).attr(
          "fill",
          "black"
        );
      })

      .on("mouseout", function (d, i) {
        d3.selectAll(".country").attr("fill", function (d) {
          let countrydata = getCountryByID(d.properties.name);

          return countrydata
            ? colorScale(countrydata[options.data])
            : "darkgrey";
        });

        d3.select(this)
          .transition()
          .duration(300)
          .attr("r", radiusScale(i["Healthy life expectancy"]));
      });

    // text label for the x axis
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text("GDP per capita");

    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Happiness score");

    const sizeMax = 12;
    const sizeScale = d3
      .scaleLinear()
      .range([8, 11, 14, 17])
      .domain([0.5, 1, 1.5, 2]);

    sizeLegend(svg, {
      sizeScale: radiusScale,
      positionX: 750,
      positionY: 200,
      ticks: 3,
      tickFill: "grey",
      tickSpacing: 35,
      tickPadding: 16,
      label: "Healthy life expectancy",
      labelX: -20,
      labelY: -30,
    });
  };

  const renderMap = () => {
    console.log("rendering map...");
    const height= (window.innerHeight / 2)*0.9;
    const width = window.innerWidth / 2;
    const svg = d3
      .select(".world_map")
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      // .attr("preserveAspectRatio", "xMinYMin meet")
      // .attr("viewBox", "0 0 1000 400")
      // //class to make it responsive
      // .classed("svg-content-responsive", true)
      .attr("width", width)
      .attr("height", height)
      .style("margin-top", window.innerHeight * 0.05)
      .style("margin-left", window.innerWidth * 0.05)
      .call(
        d3.zoom().on("zoom", function (event) {
          g.attr("transform", event.transform);
        })
      );

    var g = svg.append("g");

    let colorScale = d3
      .scaleThreshold()
      .domain(options.domain)
      .range(options.range);

    g.selectAll("path")
      .data(land)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("id", function (d) {
        let countrydata = getCountryByID(d.properties.name);

        if (countrydata)
          return "map-" + trimString(countrydata["Country name"]);
      })
      .attr("d", path)
      .attr("fill", (d) => {
        let countrydata = getCountryByID(d.properties.name);
        return countrydata ? colorScale(countrydata[options.data]) : "darkgrey";
      })

      .on("mouseover", function (d, i) {
        d3.select(this).transition().duration(100).attr("fill", "black");
        var countrydata = getCountryByID(i.properties.name);

        if (countrydata) {
          d3.select(
            "#circle-" +
              countrydata["Country name"]
                .split(".")
                .join("")
                .split(" ")
                .join("")
          )
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
              ? colorScale(countrydata[options.data])
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

    const ticks = d3
      .scaleLinear()
      .domain([options.domain[0], options.domain[9]])
      .range([0, 280]);

    const xAxis = d3
      .axisBottom(ticks)
      .tickSize(10)
      .tickValues(colorScale.domain());
    const legend_container = svg
      .append("g")
      .attr("class", "legend_container")
      .attr("transform", `translate(70, ${height*0.9})`);
    const legend = legend_container
      .append("g")
      .attr("class", "legend")
      .call(xAxis);

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

    legend_container
      .append("g")
      .attr("class", "noDataLegend")
      .attr("transform", "translate(0, -20)")
      .insert("rect")
      .attr("height", 10)
      .attr("width", 25)
      .attr("fill", "darkgrey");

    legend_container
      .append("text")
      .attr("x", -50)
      .attr("y", -10)
      .text("No Data")
      .style("font-size", 12);

    legend_container
      .append("text")
      .attr("x", -50)
      .attr("y", 10)
      .text("Legend")
      .style("font-size", 12);
  };

  const handleChange = (op) => {
    setOptions(op);
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
            <strong>GDP per capita: </strong>
          </p>
        </div>

        <div className="spacer">
          <Select
            options={optionArray}
            value={options}
            onChange={handleChange}
            placeholder="Select an option"
          />
           <div className="spacer"/>
          <Slider
            className="slider"
            graduated={true}
            min={2015}
            max={2019}
            defaultValue={2015}
            renderMark={(mark) => {
              if ([2015, 2016, 2017, 2018, 2019].includes(mark)) {
                return <span>{mark}</span>;
              }
              return null;
            }}
            value={year}
            onChange={(d) => {
              setYear(d);
            }}
          />
          <div className="spacer"/>
          <div className="spacer"/>
          <h2>Visualization of The World Happiness</h2>
          <p>
            The data visualized on this website is collected from The Happiness Reports
            of 2015-2019. The report is a landmark survey of the state of global happiness 
            that ranks 156 countries by how happy their inhabitants perceive themselves to be. 
            The World Happiness Report is a publication of the Sustainable Development 
            Solutions Network, powered by data from the Gallup World Poll.
          </p>
          <p>
            The map visualizes the option chosen in the drop-down menu. 
            If you want to change which data is displayed in the map, 
            please choose another option in the menu.
          </p>
          <p>
            The scatter plot visualizes the correlation between GDP per 
            capita and the happiness score, where each point represents a country. 
            The size of the point represents the healthy life expectancy of the country.
          </p>
          <p>
            The gradient colors in the map are connected to the colors of the points 
            in the scatter plot.
          </p>
          <p>
            You can use the slider to visualize data from another year.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Map;
