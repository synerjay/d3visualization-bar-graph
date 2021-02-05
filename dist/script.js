const tooltip = document.getElementById('tooltip');

fetch(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").

then(response => response.json()) // data becomes an object
.then(response => {
  const { data } = response; // we get the data array from the object response

  makeBarGraph(data.map(d => [d[0], d[1], d[0].split("-")[0]]));
});


function makeBarGraph(data) {
  const w = 900;
  const h = 500;
  const padding = 70;
  const barWidth = (w - 2 * padding) / data.length;

  //putting X-axis into scale using scaleTime instead of scaleLinear
  const xScale = d3.scaleTime().
  domain([d3.min(data, d => new Date(d[0])), d3.max(data, d => new Date(d[0]))])
  /*  .scaleLinear()
    .domain([
      d3.min(data, (d) => parseInt(d[2])),
      d3.max(data, (d) => parseInt(d[2]))
    ]) */.
  range([padding, w - padding]);

  //putting Y-axis into scale
  const yScale = d3.
  scaleLinear().
  domain([0, d3.max(data, d => d[1])]).
  range([h - padding, padding]);

  const svg = d3.
  select("#container").
  append("svg").
  style("width", w).
  style("height", h);

  svg.
  selectAll("rect").
  data(data).
  enter().
  append("rect").
  attr("class", "bar").
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  attr('x', d => xScale(new Date(d[0]))).
  attr("y", d => yScale(d[1])).
  attr("width", barWidth).
  attr("height", d => h - yScale(d[1]) - padding).
  on('mouseover', (d, i) => {
    tooltip.classList.add('show');
    tooltip.style.left = data.indexOf(i) * barWidth + padding + 'px';
    tooltip.style.top = h - padding * 4 + 'px';
    tooltip.setAttribute('data-date', i[0]);

    tooltip.innerHTML = `<small>${i[0]}</small>
      $${i[1]} billions`;
  }).on('mouseout', () => {
    tooltip.classList.remove('show');
  });

  svg.append("text").
  attr("class", "y label").
  attr("text-anchor", "end").
  attr("x", -80).
  attr("y", 80).
  attr("dy", ".75em").
  attr("transform", "rotate(-90)").
  text("Gross Domestic Product");

  // learn more about making axis labels here: https://stackoverflow.com/questions/11189284/d3-axis-labeling#:~:text=Axis%20labels%20aren't%20built,adding%20an%20SVG%20text%20element.

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.
  append("g").
  attr("transform", `translate(0, ${h - padding})`).
  attr("id", "x-axis").
  call(xAxis);

  svg.
  append("g").
  attr("transform", `translate(${padding}, 0)`).
  attr("id", "y-axis").
  call(yAxis);
}