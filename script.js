// Set dimensions
const margin = { top: 40, right: 20, bottom: 120, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load CSV
d3.csv("maricopa_heat_deaths_2025.csv").then(data => {

    // Group and count deaths by race
    const raceCounts = d3.rollups(
        data,
        v => v.length,
        d => d.race
    );

    // Convert to objects
    const formattedData = raceCounts.map(d => ({
        race: d[0],
        count: d[1]
    }));

    // Sort descending
    formattedData.sort((a, b) => b.count - a.count);

    // X scale
    const x = d3.scaleBand()
        .domain(formattedData.map(d => d.race))
        .range([0, width])
        .padding(0.2);

    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.count)])
        .nice()
        .range([height, 0]);

    // X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

    // Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll(".bar")
        .data(formattedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.race))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count));

    // Y-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Number of Deaths");

    // X-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .text("Race");

});