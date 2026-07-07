console.log(d3.version);

d3.csv("data/processed/yearly_summary.csv", d => ({
  year: +d.year,
  total_songs: +d.total_songs,
  total_minutes: +d.total_minutes,
  unique_songs: +d.unique_songs,
  unique_artists: +d.unique_artists
})).then(function drawYearlyChart(data) {

  // Dimensions and margins
  const margin = { top: 40, right: 30, bottom: 50, left: 70 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create the SVG canvas inside #graphic
  const svg = d3.select("#graphic")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X scale: one band per year
  const x = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, width])
    .padding(0.2);

  // Y scale: 0 to max minutes
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total_minutes)])
    .nice()
    .range([height, 0]);

  // X axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Y axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.year))
    .attr("y", d => y(d.total_minutes))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.total_minutes))
    .attr("fill", "steelblue");
});