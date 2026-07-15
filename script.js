// ============================================================
// Setup: one SVG canvas, shared dimensions 
// ============================================================
const margin = {top: 30, right: 100, bottom: 50, left: 70};
const width = 900;
const height = 450;

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .attr("viewBox", [0, 0, width, height]);

// Clear and redraw: every chart function starts from an empty canvas ----
function resetCanvas() {
  svg.selectAll("*").remove();
  return svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
}

// ============================================================
// Load all data up front 
// ============================================================
Promise.all([
  d3.csv("data/processed/yearly_summary.csv", d => ({
    year: +d.year,
    total_songs: +d.total_songs,
    total_minutes: +d.total_minutes,
    unique_songs: +d.unique_songs,
    unique_artists: +d.unique_artists
  })),
  d3.csv("data/processed/monthly_summary.csv", d => ({
    year: +d.year, 
    month: +d.month, 
    total_minutes: +d.total_minutes
  })),
  d3.csv("data/processed/daily_summary.csv", d => ({
    doy: +d.doy,
    year: +d.year,
    total_minutes: +d.total_minutes
  }))
]).then(([yearly, monthly, daily]) => {

  console.log(
    "yearly rows:", yearly.length, 
    "monthly rows:", monthly.length, 
    "daily rows:", daily.length
  );

// ============================================================
// Chart 1: total minutes by year 
// ============================================================
function drawYearlyMinutes() {
  const g = resetCanvas();
    
  // X scale ----
  const x = d3.scaleBand()
    .domain(yearly.map(d => d.year))
    .range([0, innerWidth])
    .padding(0.2);

  // Y scale ----
  const y = d3.scaleLinear()
    .domain([0, d3.max(yearly, d => d.total_minutes)])
    .nice()
    .range([innerHeight, 0]);

  // Gridlines ----
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y)
      .tickSize(-innerWidth)
      .tickFormat(""));

  // X axis ----
  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Y axis ----
  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format(",")));

  // Axis labels ----
  g.append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 45)
    .attr("text-anchor", "middle")
    .text("Year");

  g.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .text("Total minutes listened");

  // Bars ----
  g.selectAll("rect.bar")
    .data(yearly)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.total_minutes))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight - y(d.total_minutes));
  }

// ============================================================
// Chart 2: monthly heatmap 
// ============================================================
function drawMonthlyHeatmap() {
  const g = resetCanvas();

  // X scale ----
  const x = d3.scaleBand()
    .domain(d3.range(1, 13))
    .range([0, innerWidth])
    .padding(0);

  // Y scale ----
  const y = d3.scaleBand()
    .domain([...new Set(monthly.map(d => d.year))].sort(d3.descending))
    .range([0, innerHeight])
    .padding(0.05);

  // Matrix ----
  const maxMinutes = d3.max(monthly, d => d.total_minutes);

  const fill = d3.scaleSequential()
    .domain([0, Math.sqrt(maxMinutes)])
    .interpolator(d3.interpolateMagma);

  const fillOf = v => fill(Math.sqrt(v));

  const monthMids = [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];
  const monthAbb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // X axis ----
  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x)
      .tickFormat(d => monthAbb[d - 1])
      .tickSize(0));

  // Y axis ----
  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).tickFormat(d3.format("d")).tickSize(0));

  // Axis labels ----
  g.append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 45)
    .attr("text-anchor", "middle")
    .text("Month");

  g.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .text("Year");

  g.selectAll("rect.tile")
    .data(monthly)
    .join("rect")
      .attr("class", "tile")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.year))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => fillOf(d.total_minutes));

  // Legend gradient ----
  const legendWidth = 15;
  const legendHeight = 150;

  const gradient = svg.append("defs")
    .append("linearGradient")
      .attr("id", "magma-gradient")
      .attr("x1", "0%").attr("y1", "100%")
      .attr("x2", "0%").attr("y2", "0%");

  gradient.selectAll("stop")
    .data(d3.range(0, 1.01, 0.05))
    .join("stop")
      .attr("offset", d => `${d * 100}%`)
      .attr("stop-color", d => fillOf(d * maxMinutes));

  const legend = g.append("g")
    .attr("transform", `translate(${innerWidth + 25},0)`);

  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", "url(#magma-gradient)");

  const legendScale = d3.scaleLinear()
    .domain([0, Math.sqrt(maxMinutes)])
    .range([legendHeight, 0]);

  legend.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${legendWidth},0)`)
    .call(d3.axisRight(legendScale)
      .tickValues([0, 1000, 2000, 4000, 6000, 8000].map(Math.sqrt))
      .tickFormat(d => d3.format(",")(Math.round(d * d)))
      .tickSize(3));

  legend.append("text")
    .attr("class", "axis-label")
    .attr("y", -10)
    .text("Minutes");
  }

  // ============================================================
  // Chart 3 
  // ============================================================
  function drawChartThree() {
    const g = resetCanvas();
    // TODO
  }

  // ============================================================
  // Chart 4 
  // ============================================================
  function drawChartFour() {
    const g = resetCanvas();
    // TODO
  }

  // ============================================================
  // Chart 5 
  // ============================================================
  function drawChartFive() {
    const g = resetCanvas();
    // TODO
  }

  // ============================================================
  // Step -> chart mapping 
  // ============================================================
  const steps = [
    drawYearlyMinutes,   // step 1
    drawMonthlyHeatmap,  // step 2
    drawChartThree,      // step 3
    drawChartFour,       // step 4
    drawChartFive        // step 5
  ];

  // ============================================================
  // Scrollama 
  // ============================================================
  const scroller = scrollama();

  function handleStepEnter(response) {
    d3.selectAll(".step").classed("is-active", (d, i) => i === response.index);
    steps[response.index]();
  }

  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.55,
      debug: false
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", scroller.resize);

  // Draw the first chart so the canvas isn't blank on load ----
  drawYearlyMinutes();

}).catch(error => {
  console.error("CSV load failed:", error);
});