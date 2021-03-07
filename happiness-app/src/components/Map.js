//import { geoMiller, geoEquirectangular, geoNaturalEarth1, geoPath, geoGraticule } from 'd3';
import * as d3 from "d3";
import { useEffect, useState } from "react";
import s2015 from "../data/2015.csv";
import s2016 from "../data/2016.csv";
import s2017 from "../data/2017.csv";
import s2018 from "../data/2018.csv";
import s2019 from "../data/2019.csv";
import s2020 from "../data/2020.csv";
import Select from "react-select";
import { Slider, RangeSlider } from 'rsuite';
import "react-dropdown/style.css";
import 'rsuite/dist/styles/rsuite-default.css';

const collection = {
  "2015" : s2015,
  "2016" : s2016,
  "2017" : s2017,
  "2018" : s2018,
  "2019" : s2019
}

// const projection = d3.geoEquirectangular();
const projection = d3
  .geoMercator()
  .center([0, 20]) //long and lat starting position
  .scale(150) //starting zoom position
  .rotate([10, 0]); //where world split occurs
const path = d3.geoPath(projection);
const graticule = d3.geoGraticule();
const optionArray = [
  {
    value: 1,
    label: "Happiness score",
    data: "Ladder score",
    domain: [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5],
    range: [
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
    ],
  },
  {
    value: 2,
    label: "Healthy life expectancy",
    data: "Healthy life expectancy",
    domain: [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.96, 1.08, 1.2],
    range: [
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
    ],
  },
  {
    value: 3,
    label: "Freedom to make life choices",
    data: "Freedom to make life choices",
    domain: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    range: [
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
    ],
  },
  {
    value: 4,
    label: "GDP per capita",
    data: "Logged GDP per capita",
    domain: [0, 0.22, 0.44, 0.66, 0.88, 1.1, 1.32, 1.54, 1.76, 1.98, 2.2],
    range: [
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
    ],
  }
];
//`s${year}`
const Map = ({ data: { land, borders } }) => {
  const [myData, setData] = useState(null);
  const [options, setOptions] = useState(optionArray[0]);
  const [year, setYear] = useState(2015);
  console.log(collection);
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
  }


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
  const trimString = (str) => {
    return str.split(".").join("").split(" ").join("");
  }
  const round = (num) => {
    return Math.round(num * 100) / 100;
  }
  const renderScatter = () => {
    var margin = { top: 10, right: 30, bottom: 80, left: 80 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var svg = d3
      .select(".scatter_plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear().domain([0, 2.2]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear().domain([2, 8]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    var radiusScale = d3.scaleLinear().domain([0, 1.2]).range([5, 15]);
    let colorScale = d3
      .scaleThreshold()
      .domain(options.domain)
      .range(options.range);

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
          "circle-" + trimString(d["Country name"])
        );
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
      // .style("opacity", 0.8)
      .on("mouseover", function (d, i) {
        d3.select(this).attr("r", 20);
        tooltipData(d, i);
        d3.select(
          "#map-" + trimString(i["Country name"])
        ).attr("fill", "black");
      })
      .on("mouseout", function (d, i) {
        d3.selectAll(".country")
          // .transition()
          // .duration(200)
          .attr("fill", function (d) {
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
  };
  const renderMap = () => {
    console.log("rendering map...");

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

    let colorScale = d3
      .scaleThreshold()
      .domain(options.domain)
      .range(options.range);

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
            trimString(countrydata["Country name"])
          );
      })
      .attr("d", path)
      .attr("fill", (d) => {
        let countrydata = getCountryByID(d.properties.name);
        return countrydata ? colorScale(countrydata[options.data]) : "darkgrey";
      })
      .on("mouseover", function (d, i) {
        // d3.selectAll(".country")
        //   .transition()
        //   .duration(20)
        //   .style("opacity", 0.5);
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
    console.log([options.domain[0], options.domain[9]]);
    const ticks = d3
      .scaleLinear()
      .domain([options.domain[0], options.domain[9]])
      .range([0, 280]);

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
        <Select
          options={optionArray}
          value={options}
          onChange={handleChange}
          placeholder="Select an option"
        />

        <div className="spacer"><Slider
          className="slider"
          graduated={true}
          min={2015}
          max={2019}
          defaultValue={2015}
          renderMark={mark => {
            if ([2015, 2016, 2017, 2018, 2019].includes(mark)) {
              return <span>{mark}</span>;
            }
            return null;
          }}
          value={year}
          onChange={(d) => {setYear(d)}}
        /></div>


      </div>
      {/* <Info tooltipData={tooltipData} /> */}
    </div>
  );
};

export default Map;
