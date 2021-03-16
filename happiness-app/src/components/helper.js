// Array with the different factors
export const optionArray = [
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

// Function for scatter plot legend for the size of the scatter points
export function sizeLegend(selection, props) {
  const sizeScale = props.sizeScale;
  const positionX = props.positionX;
  const positionY = props.positionY;
  const ticksCount = props.ticks;
  const tickFill = props.tickFill;
  const tickSpacing = props.tickSpacing;
  const tickPadding = props.tickPadding;
  const label = props.label;
  const labelX = props.labelX;
  const labelY = props.labelY;
  
  let legendG = selection
    .selectAll(".legend--size")
    .data([null]);

  legendG = legendG
    .enter().append("g")
    .attr("class", "legend legend--size")
    .merge(legendG)
    .attr("transform", `translate(${positionX}, ${positionY})`);
  
  const legendLabel = legendG
    .selectAll(".legend__label")
    .data([null]);

  legendLabel
    .enter().append("text")
    .attr("class", "legend__label")
    .merge(legendLabel)
    .attr("x", labelX)
    .attr("y", labelY)
    .text(label);
  
  const ticks = legendG
    .selectAll(".tick")
    .data(sizeScale.ticks(ticksCount).filter(d => d));
  
  const ticksEnter = ticks
    .enter().append("g")
    .attr("class", "tick");

  ticksEnter
    .merge(ticks)
    .attr("transform", (d, i) => `translate(0, ${i * tickSpacing})`);

  ticks.exit().remove();
  
  ticksEnter
    .append("circle")
    .merge(ticks.select("circle"))
    .attr("r", sizeScale)
    .attr("fill", tickFill);
  
  ticksEnter
    .append("text")
    .merge(ticks.select("text"))
    .attr("x", tickPadding)
    .text(d => d);
}

// Trim string
export const trimString = (str) => {
  return str.split(".").join("").split(" ").join("");
}

// Round number
export const round = (num) => {
  return Math.round(num * 100) / 100;
}