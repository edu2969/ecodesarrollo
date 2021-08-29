import d3 from '/client/utils/d3'

const initChart = () => {
  const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

  const height = 500
  const width = 500

  const svg = d3.select("#chart-wraper").append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const lineC = d3.line()
    .defined(d => !isNaN(d.compost))
    .x(d => x(d.date))
    .y(d => y(d.compost));

  const lineP = d3.line()
    .defined(d => !isNaN(d.plastico))
    .x(d => x(d.date))
    .y(d => y(d.plastico));

  const lineO = d3.line()
    .defined(d => !isNaN(d.otros))
    .x(d => x(d.date))
    .y(d => y(d.otros));

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.compost)]).nice()
    .range([height - margin.bottom, margin.top])

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", lineC);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "yellow")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", lineP);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "limegreen")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", lineO);
}

Template.mundocorazones.rendered = () => {
  initChart()
}

const data = [{
  "date": new Date("2019-07-01T00:00:00.000Z"),
  "compost": 13.24,
  "plastico": 25.10,
  "otros": 22.90,
}, {
  "date": new Date("2019-08-01T00:00:00.000Z"),
  "compost": 33.24,
  "plastico": 45.10,
  "otros": 12.90,
}, {
  "date": new Date("2019-09-01T00:00:00.000Z"),
  "compost": 33.24,
  "plastico": 35.10,
  "otros": 22.90,
}, {
  "date": new Date("2019-10-01T00:00:00.000Z"),
  "compost": 43.24,
  "plastico": 15.10,
  "otros": 2.90,
}, {
  "date": new Date("2019-11-01T00:00:00.000Z"),
  "compost": 32.9,
  "plastico": 15.10,
  "otros": 26.90,
}, {
  "date": new Date("2019-12-01T00:00:00.000Z"),
  "compost": 93.24,
  "plastico": 35.10,
  "otros": 22.90,
}, {
  "date": new Date("2019-13-01T00:00:00.000Z"),
  "compost": 23.24,
  "plastico": 75.10,
  "otros": 37.90,
}, {
  "date": new Date("2019-14-01T00:00:00.000Z"),
  "compost": 66.24,
  "plastico": 65.10,
  "otros": 55.90,
}, {
  "date": new Date("2019-15-01T00:00:00.000Z"),
  "compost": 13.24,
  "plastico": 25.10,
  "otros": 92.90,
}, {
  "date": new Date("2019-16-01T00:00:00.000Z"),
  "compost": 110.24,
  "plastico": 4.10,
  "otros": 17.90,
}, {
  "date": new Date("2019-17-01T00:00:00.000Z"),
  "compost": 23.24,
  "plastico": 35.10,
  "otros": 42.90,
}, {
  "date": new Date("2019-18-01T00:00:00.000Z"),
  "compost": 13.24,
  "plastico": 25.10,
  "otros": 3.90,
}]

