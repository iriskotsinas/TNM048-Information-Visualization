import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3';
import * as d3 from "d3";

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

const Map = ({ data: {land, interiors} }) => {

  function renderMap() {
    const width = window.innerWidth * 0.9, height = window.innerHeight * 0.9; //1600, height = 1000;

    // const redraw = () => { 
    //     svg.attr("transform",d3.event.transform);// "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    // }

    const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin-top", window.innerHeight * 0.05)
    .style("margin-left", window.innerWidth * 0.05)
    .style("background-color","#eee");
    // .call(
    //   d3.zoom().on("zoom", redraw)
    // )
    var g = svg.append("g");

    g.selectAll("path")
        .data(land.features)
        .enter()
        .append("path")
        .attr("class","continent")
        .attr("d", path);

    g.append("path")
        .attr("class","interiors")
        .attr("d", path(interiors));
  }

  console.log(land);
  console.log(interiors);
  // return (<g className="marks">
  //   <path className="sphere" d={path({ type: 'Sphere' })} />

  //   <path className="graticules" d={path(graticule())} />

  //   {land.features.map((feature,i) => (
  //     <path className="land" key={i} d={path(feature)} />
  //   ))}
  //   <path className="interiors" d={path(interiors)} />
  // </g>);
  return (
  <div>
    <div id = "world_map"></div>
    {renderMap()}
  </div>
  )
};

export default Map;