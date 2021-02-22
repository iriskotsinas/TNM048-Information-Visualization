import { geoEqualEarth, geoPath } from 'd3';

const projection = geoEqualEarth();
const path = geoPath(projection);

const Marks = ({ data }) => (
  <g className="marks">
    {data.features.map((feature, i) => (
      <path key={i} d={path(feature)} />
    ))}
    {/* <path 
      fill="none"
      stroke="black"
      d={line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(curveNatural)(data)}
    /> */}
  </g>
);

export default Marks;