

// function to initially populate the page with the first subject ID
function initialDecade() {

  // Get a reference to the subject ID dropdown
  var decadeDropdown = d3.select("#selDataset");

  // // Populate the Subject ID dropdown
  // d3.csv("clean_data_all.csv").then(function(decadeData) {
  var decadesList = ["2020", "2010", "2000", "1990", "1980", "1970", "1960", "1950", "1940", "1930", "1920"];
  //   var decadesList = decadeData.decade;
  // console.log(decadeData.decade);

  decadesList.forEach((row) => {
    decadeDropdown
      .append("option")
      .text(row)
      .property("value", row);
  });

  var decade = decadesList[0];
  charts(decade);
  // });
};

// function to handle a change in the decade dropdown 
function optionChanged(chosenDecade) {
  charts(chosenDecade);
};

// function used for updating x-scale var upon click on axis label
function xScale(decadeData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(decadeData, d => d[chosenXAxis]) * 0.8,
    d3.max(decadeData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "danceability") {
    var label = "Danceability";
  }
  else if (chosenXAxis === "energy") {
    var label = "Energy";
  }
  else {
    var label = "Tempo";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.artists}<br>${d.name}<br>Popularity: ${d.popularity}<br>${label}: ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
function charts(inputDecade) {
  chartGroup.html("");

  d3.csv("clean_data_all.csv").then(function (decadeData) {


    // var decades = decadeData.decade;

    var filteredDecades = decadeData.filter(decadeRange => decadeRange.decade == inputDecade);
    console.log(filteredDecades);
    var filtered = filteredDecades[0];

    // var decadeDrop = d3.select("#selDataset")

    // parse data
    filteredDecades.forEach(function (data) {
      data.decade = +data.decade;
      data.popularity = +data.popularity;
      data.danceability = +data.danceability;
      data.energy = +data.energy;
      data.tempo = +data.tempo;
    });

    // data.decade = filtered.decade;
    // data.popularity = filtered.popularity;
    // data.danceability = filtered.danceability;
    // data.energy = filtered.energy;
    // data.tempo = filtered.tempo;


    // xLinearScale function above csv import
    var xLinearScale = xScale(filteredDecades, chosenXAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(filteredDecades, d => d.popularity)])
      .range([chartHeight, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(filteredDecades)
      .enter()
      .append("circle")
      // .filter(function(d) {return d.popularity >= 70 })
      // .filter(function(d) {return d.decade == 2010 })
      // .filter(function(d) {return d.decade == chosenDecade })
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.popularity))
      .attr("r", 5)
      .attr("fill", "green")
      .attr("opacity", ".5");

    // Create group for  3 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var danceabilityLengthLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "danceability") // value to grab for event listener
      .classed("active", true)
      .text("Danceability");

    var energyLengthLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "energy") // value to grab for event listener
      .classed("inactive", true)
      .text("Energy");

    var tempoLengthLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "tempo") // value to grab for event listener
      .classed("inactive", true)
      .text("Tempo");

    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Popularity");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function () {

        console.log(chosenXAxis)

        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(filteredDecades, chosenXAxis);

          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "danceability") {
            danceabilityLengthLabel
              .classed("active", true)
              .classed("inactive", false);
            energyLengthLabel
              .classed("active", false)
              .classed("inactive", true);
            tempoLengthLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "energy") {
            danceabilityLengthLabel
              .classed("active", false)
              .classed("inactive", true);
            energyLengthLabel
              .classed("active", true)
              .classed("inactive", false);
            tempoLengthLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            danceabilityLengthLabel
              .classed("active", false)
              .classed("inactive", true);
            energyLengthLabel
              .classed("active", false)
              .classed("inactive", true);
            tempoLengthLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }).catch(function (error) {
    console.log(error);
  });
};

// space for the chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#schart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "danceability";

// // Initial load of the charts and metadata panel based on 1st subject ID
initialDecade();