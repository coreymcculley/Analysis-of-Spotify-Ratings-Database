//function init() {
d3.csv("clean_data.csv", function (importedData) {
  var song = "Pinball Wizard";
  var bandID = "The Who";

  artistData = [];
  var artistData = importedData; //.filter(function(d){ return  (d.artists == bandID)});
  //console.log(artistData);

  songUpdate(song); //bandID, song, artistData
  // var filterData = artistData.filter(function(d){ return  (d.artists == bandID)});
  // console.log(filterData);

  //Get input from the text box, filter for the matching dates and output table of results.
  //Also include an error popup if searched data does not match the anything in the provided data.
  var button = d3.select("#search-btn");
  //filter data based on user input
  button.on("click", function () {

    d3.event.preventDefault();
    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#artist-search");
    // Get the value property of the input element
    var inputValue = inputElement.property("value");
    console.log(inputValue);

    var filteredData = [];
    for (var i = 0; i < artistData.length; i++) {
      filteredData[i] = artistData[i].artists;
    }
    var filterIndex = [];
    for (var i = 0; i < artistData.length; i++) {
      if (filteredData[i] == inputValue) {
        filterIndex.push(i);
      }
    }
    var filteredDB = [];
    var songList = [];
    for (var i = 0; i < filterIndex.length; i++) {
      filteredDB[i] = artistData[filterIndex[i]];
      songList[i] = artistData[filterIndex[i]].name;
    }
    //console.log(songList);
    removeOptions(document.getElementById("selDataset"));
    buildDropDown(songList);
    updateBar(inputValue);

    if (Object.keys(filterIndex).length === 0) {
      errorPopup();
    }
  });
});

// var dropdownButton = d3.select("#selDataset").append("select");

// // When the button is changed, run the updateChart function
// dropdownButton.on("change", function (d) {
//   d3.csv("clean_data.csv", function (importedData) {
//     // recover the option that has been chosen
//     var songValue = d3.select(this).property("value");
//     console.log(songValue);
//     var artistData = importedData;

//     //get band name
//     var bandElement = d3.select("#artist-search");
//     // Get the value property of the input element
//     var band = bandElement.property("value");
//     // run the updateChart function with this selected option
//     console.log(band);
//     songUpdate(band, songValue, artistData);
//   });
// });

/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function RadarChart(id, data, options) {
  var cfg = {
    w: 600, //Width of the circle
    h: 600, //Height of the circle
    margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
    levels: 4, //How many levels or inner circles should there be drawn
    maxValue: 0.0, //What is the value that the biggest circle will represent
    labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 5, //The size of the colored circles of each blog
    opacityCircles: 0.1, //The opacity of the circles of each blob
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scale.category10(), //Color function
  };

  //Put all of the options into a variable called cfg
  if ("undefined" !== typeof options) {
    for (var i in options) {
      if ("undefined" !== typeof options[i]) {
        cfg[i] = options[i];
      }
    } //for i
  } //if

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = 1;
  // Math.max(
  //   cfg.maxValue,
  //   d3.max(data, function (i) {
  //     return d3.max(
  //       i.map(function (o) {
  //         return o.value;
  //       })
  //     );
  //   })
  // );

  var allAxis = data[0].map(function (i, j) {
      return i.axis;
    }), //Names of each axis
    total = allAxis.length, //The number of different axes
    radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
    Format = d3.format("%"), //Percentage formatting
    angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

  //Scale for the radius
  var rScale = d3.scale.linear().range([0, radius]).domain([0, maxValue]);

  /////////////////////////////////////////////////////////
  //////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////

  //Remove whatever chart with the same id/class was present before
  d3.select(id).select("svg").remove();

  //Initiate the radar chart SVG
  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr("class", "radar" + id);
  //Append a g element
  var g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (cfg.w / 2 + cfg.margin.left) +
        "," +
        (cfg.h / 2 + cfg.margin.top) +
        ")"
    );

  /////////////////////////////////////////////////////////
  ////////// Glow filter for some extra pizzazz ///////////
  /////////////////////////////////////////////////////////

  //Filter for the outside glow
  var filter = g.append("defs").append("filter").attr("id", "glow"),
    feGaussianBlur = filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur"),
    feMerge = filter.append("feMerge"),
    feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
    feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) {
      return (radius / cfg.levels) * d;
    })
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  //Text indicating at what % each level is
  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) {
      return (-d * radius) / cfg.levels;
    })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#737373")
    .text(function (d, i) {
      return Format((maxValue * d) / cfg.levels);
    });

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  var axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  //Append the lines
  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y2", function (d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("y", function (d, i) {
      return (
        rScale(maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - Math.PI / 2)
      );
    })
    .text(function (d) {
      return d;
    })
    .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  var radarLine = d3.svg.line
    .radial()
    .interpolate("linear-closed")
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return i * angleSlice;
    });

  if (cfg.roundStrokes) {
    radarLine.interpolate("cardinal-closed");
  }

  //Create a wrapper for the blobs
  var blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("fill", function (d, i) {
      return cfg.color(i);
    })
    .style("fill-opacity", cfg.opacityArea)
    .on("mouseover", function (d, i) {
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
    })
    .on("mouseout", function () {
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function (d, i) {
      return cfg.color(i);
    })
    .style("fill", "none")
    .style("filter", "url(#glow)");

  //Append the circles
  blobWrapper
    .selectAll(".radarCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", function (d, i, j) {
      return cfg.color(j);
    })
    .style("fill-opacity", 0.8);

  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////

  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function (d, i) {
      newX = parseFloat(d3.select(this).attr("cx")) - 10;
      newY = parseFloat(d3.select(this).attr("cy")) - 10;

      tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(Format(d.value))
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  //Set up the small tooltip for when you hover over a circle
  var tooltip = g.append("text").attr("class", "tooltip").style("opacity", 0);

  /////////////////////////////////////////////////////////
  /////////////////// Helper Function /////////////////////
  /////////////////////////////////////////////////////////

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  } //wrap
} //RadarChart

function calcAverage(array) {
  var i = 0,
    sum = 0,
    len = array.length;
  while (i < len) {
    sum = sum + +array[i++];
  }
  return sum / len;
}

//init();
function errorPopup() {
  alert("Date does not match artist in the database");
}

function buildDropDown(list) {
  //BuildDropdown
  // Select the dropdown and build the Subject ID dropdown
  const subjectselect = d3.select("#selDataset");

  list.forEach((namevalue) => {
    var option = subjectselect.append("option");
    option.text(namevalue);
    option.attr("value", namevalue);
  });
}

function removeOptions(selectElement) {
  var i,
    L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

//FUNCTION TO DRAW RADAR AND BAR CHART
function songUpdate(song) {
  d3.csv("clean_data.csv", function (importedData) {
    // Select the band
    var inputElement = d3.select("#artist-search");
    // Get the value property of the input element
    var band = inputElement.property("value");
    //console.log(band);

    // //Select Song
    // var dropdownButton = d3.select("#selDataset").append("select");
    // var song = d3.select("#selDataset").property("value");

    var bandID = band;
    var songName = song;
    var artistData = importedData;

    var bandNameAll = [];
    var songNamesAll = [];
    var songValenceAll = [];
    var songAcousticnessAll = [];
    var songDanceabilityAll = [];
    var songEnergyAll = [];
    var songExplicitAll = [];
    var songLivenessAll = [];
    var songLoudnessAll = [];
    var songPopularityAll = [];
    var songSpeechinessAll = [];
    var songTempoAll = [];
    var subjectindex = [];
    var subjectindexAll = [];

    var bandNameAvg = [];
    var songNamesAvg = [];
    var songValenceAvg = [];
    var songAcousticnessAvg = [];
    var songDanceabilityAvg = [];
    var songEnergyAvg = [];
    var songExplicitAvg = [];
    var songLivenessAvg = [];
    var songLoudnessAvg = [];
    var songPopularityAvg = [];
    var songSpeechinessAvg = [];
    var songTempoAvg = [];
    var subjectindex = [];
    var subjectindexAll = [];

    for (var i = 0; i < artistData.length; i++) {
      bandNameAll[i] = artistData[i].artists;
      songNamesAll[i] = artistData[i].name;
      songValenceAll[i] = artistData[i].energy;
      songAcousticnessAll[i] = artistData[i].acousticness;
      songDanceabilityAll[i] = artistData[i].danceability;
      songEnergyAll[i] = artistData[i].energy;
      songExplicitAll[i] = artistData[i].explicit;
      songLivenessAll[i] = artistData[i].liveness;
      songLoudnessAll[i] = artistData[i].loudness;
      songPopularityAll[i] = artistData[i].popularity;
      songSpeechinessAll[i] = artistData[i].speechiness;
      songTempoAll[i] = artistData[i].tempo;
    }
    //console.log(songNamesAll.length);

    for (var i = 0; i < artistData.length; i++) {
      if (songNamesAll[i] == songName && bandNameAll[i] == bandID) {
        subjectindex.push(i);
        i = artistData.length;
      }
    }

    //console.log(subjectindex);

    for (var i = 0; i < artistData.length; i++) {
      if (bandNameAll[i] == bandID) {
        subjectindexAll.push(i);
      }
    }

    //console.log(subjectindexAll);

    bandName = bandNameAll[subjectindex];
    songNames = songNamesAll[subjectindex];
    songValence = songValenceAll[subjectindex];
    songAcousticness = songAcousticnessAll[subjectindex];
    songDanceability = songDanceabilityAll[subjectindex];
    songEnergy = songEnergyAll[subjectindex];
    songExplicit = songExplicitAll[subjectindex];
    songLiveness = songLivenessAll[subjectindex];
    songLoudness = songLoudnessAll[subjectindex];
    songPopularity = songPopularityAll[subjectindex];
    songSpeechiness = songSpeechinessAll[subjectindex];
    songTempo = songTempoAll[subjectindex];

    for (var i = 0; i < subjectindexAll.length; i++) {
      bandNameAvg[i] = bandNameAll[subjectindexAll[i]];
      songNamesAvg[i] = songNamesAll[subjectindexAll[i]];
      songValenceAvg[i] = songValenceAll[subjectindexAll[i]];
      songAcousticnessAvg[i] = songAcousticnessAll[subjectindexAll[i]];
      songDanceabilityAvg[i] = songDanceabilityAll[subjectindexAll[i]];
      songEnergyAvg[i] = songEnergyAll[subjectindexAll[i]];
      songExplicitAvg[i] = songExplicitAll[subjectindexAll[i]];
      songLivenessAvg[i] = songLivenessAll[subjectindexAll[i]];
      songLoudnessAvg[i] = songLoudnessAll[subjectindexAll[i]];
      songPopularityAvg[i] = songPopularityAll[subjectindexAll[i]];
      songSpeechinessAvg[i] = songSpeechinessAll[subjectindexAll[i]];
      songTempoAvg[i] = songTempoAll[subjectindexAll[i]];
    }
    //console.log(songDanceability);
    //console.log(songDanceabilityAvg);
    //////////////////////////////////////////////////////////////
    //////////////////////// Set-Up //////////////////////////////
    //////////////////////////////////////////////////////////////

    var margin = { top: 90, right:  200, bottom: 60, left: 90 },
      legendPosition = { x: 0, y: 0 },
      width =
        Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
      height = Math.min(
        width,
        window.innerHeight - margin.top - margin.bottom - 20
      );

    //////////////////////////////////////////////////////////////
    ////////////////////////// Data //////////////////////////////
    //////////////////////////////////////////////////////////////

    //console.log(songNames);

    var data = [
      [
        //Average
        { axis: "Valence", value: calcAverage(songValenceAvg) },
        { axis: "Acousticness", value: calcAverage(songAcousticnessAvg) },
        { axis: "Danceability", value: calcAverage(songDanceabilityAvg) },
        { axis: "Energy", value: calcAverage(songEnergyAvg) },
        { axis: "Explicit", value: calcAverage(songExplicitAvg) },
        { axis: "Liveness", value: calcAverage(songLivenessAvg) },
        { axis: "Loudness", value: (-calcAverage(songLoudnessAvg) + 20) / 50 },
        { axis: "Popularity", value: calcAverage(songPopularityAvg) / 100 },
        //{ axis: "Speechiness", value: calcAverage(songSpeechinessAvg) },
        { axis: "Tempo", value: calcAverage(songTempoAvg) / 200 },
      ],
      [
        //Song
        { axis: "Valence", value: songValence },
        { axis: "Acousticness", value: songAcousticness },
        { axis: "Danceability", value: songDanceability },
        { axis: "Energy", value: songEnergy },
        { axis: "Explicit", value: songExplicit },
        { axis: "Liveness", value: songLiveness },
        { axis: "Loudness", value: (-songLoudness + 20) / 50 },
        { axis: "Popularity", value: songPopularity / 100 },
        //{ axis: "Speechiness", value: songSpeechiness },
        { axis: "Tempo", value: songTempo / 200 },
      ],
    ];
    //////////////////////////////////////////////////////////////
    //////////////////// Draw the Chart //////////////////////////
    //////////////////////////////////////////////////////////////

    //console.log(data);

    var color = d3.scale.ordinal().range(["#342ca8", "#1DB954"]);

    var radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      legendPosition: legendPosition,
      maxValue: 1,
      levels: 5,
      roundStrokes: true,
      color: color,
    };

    //Call function to draw the Radar chart
    RadarChart(".radarChart", data, radarChartOptions);

    var xLabels = [
      "Valence",
      "Acousticness",
      "Danceability",
      "Energy",
      "Explicit",
      "Liveness",
      "Loudness",
      "Popularity",
      "Tempo",
    ];
    var yValues = [
      Math.round(100 * songValence) / 100,
      Math.round(100 * songAcousticness) / 100,
      Math.round(100 * songDanceability) / 100,
      Math.round(100 * songEnergy) / 100,
      Math.round(100 * songExplicit) / 100,
      Math.round(100 * songLiveness) / 100,
      Math.round((100 * (-songLoudness + 20)) / 50) / 100,
      Math.round((100 * songPopularity) / 100) / 100,
      Math.round((100 * songTempo) / 200) / 100,
    ];

    //console.log(yValues);

    var ctx = document.getElementById("bar-chart");
    ctx.height = 500;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: xLabels,
        datasets: [
          {
            label: "Value",
            backgroundColor: [
              "#1DB954",
              "#1DB954",
              "#1DB954",
              "#1DB954",
              "#1DB954",
              "#1DB954",
              "#1DB954",
              "#1DB954",
              "#1DB954",
            ],
            data: yValues,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return data["datasets"][0]["data"][tooltipItem["index"]];
            },
          },
          backgroundColor: "#FFF",
          titleFontSize: 16,
          titleFontColor: "#0066ff",
          bodyFontColor: "#000",
          bodyFontSize: 10,
          displayColors: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: "#000",
                fontSize: 14,
                beginAtZero: true,
                max: 1,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: "#d4d4d4",
              },
              ticks: {
                fontColor: "#000",
                fontSize: 14,
              },
            },
          ],
        },
        legend: { display: false },
        title: {
          display: true,
          text: "",
          fontColor: "#000",
          fontSize: 14,
        },
        animation: {
          duration: 2000,
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
      },
    });
  });
}
