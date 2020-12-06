// Load data from spotify.csv
d3.csv("df_all_data_w_decades.csv")
  .then(function (musicData) {
    var artistcountbydecade = {};
    musicData.forEach((data) => {
      let artistname = data.artists;
      artistname = artistname.replaceAll("['", "");
      artistname = artistname.replaceAll("']", "");
      if (["Unspecified"].includes(artistname)) {
        return;
      }
      if (!artistcountbydecade[data.decade]) {
        artistcountbydecade[data.decade] = {};
      }
      if (artistcountbydecade[data.decade][artistname]) {
        artistcountbydecade[data.decade][artistname] += 1;
      } else {
        artistcountbydecade[data.decade][artistname] = 1;
      }
    });

    var toptenartistsbydecade = {};

    _.forEach(artistcountbydecade, (value, key) => {
      var toptenartists = [];
      for (var i = 0; i < 5; i++) {
        var currentmax = Math.max(...Object.values(value));
        Object.keys(value).forEach((artists) => {
          if (value[artists] == currentmax) {
            toptenartists.push(artists);
            value[artists] = -1;
          }
        });
      }
      toptenartistsbydecade[key] = toptenartists.slice(0, 5);
    });

    delete toptenartistsbydecade[1920];
    delete toptenartistsbydecade[1930];
    delete toptenartistsbydecade[1940];
    delete toptenartistsbydecade[2020];

    console.log(artistcountbydecade);
    console.log(toptenartistsbydecade);

    // Define SVG area dimensions
    var svgWidth = 1060;
    var svgHeight = 860;

    // Define the chart's margins as an object
    var chartMargin = {
      top: 30,
      right: 30,
      bottom: 50,
      left: 150,
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    console.log(chartWidth, chartHeight);

    // Select body, append SVG area to it, and set the dimensions
    var svg = d3
      .select("body")
      .append("svg")
      .attr("height", svgHeight)
      .attr("class", "chartsvg")
      .attr("width", svgWidth);

    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    var chartGroup = svg
      .append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xscale = d3.scaleLinear().domain([1950, 2020]).range([0, chartWidth]);
    var allartists = [];
    Object.values(toptenartistsbydecade).forEach((topartists) => {
      allartists = allartists.concat(topartists);
    });

    allartists = _.uniq(allartists);

    // Create a linear scale for the vertical axis.
    var yscale = d3.scaleBand().domain(allartists).range([chartHeight, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xscale);
    var leftAxis = d3.axisLeft(yscale).ticks(10);

    // Initialize tooltip
    var toolTip = d3
      .tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        var maxartistdecade = 0;
        var minartistdecade = 2030;
        Object.keys(toptenartistsbydecade).forEach((decade) => {
          if (
            toptenartistsbydecade[decade].find((artists) => {
              return artists == d;
            })
          ) {
            if (Number(decade) > maxartistdecade) {
              maxartistdecade = Number(decade);
            }
            if (Number(decade) < minartistdecade) {
              minartistdecade = Number(decade);
            }
          }
        });
        let artistname = d;
        artistname = artistname.replaceAll("['", "");
        artistname = artistname.replaceAll("']", "");
        return `${artistname}<br>${minartistdecade} - ${maxartistdecade + 10}`;
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g").call(leftAxis);

    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    svg
      .append("text")
      .text("Decade")
      .attr("x", chartWidth / 2 + chartMargin.left)
      .attr("y", svgHeight - 10)
      .attr("font-weight", "bold");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("x", (-1 * chartHeight) / 2)
      // .attr("dy", "1em")
      .attr("class", "axisText")
      .style("text-anchor", "middle")
      .text("Artist")
      .attr("font-weight", "bold");

    // Create one SVG rectangle per piece of musicData
    // Use the linear and band scales to position each rectangle within the chart
    chartGroup
      .selectAll(".bar")
      .data(allartists)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => {
        var minartistdecade = 2030;
        Object.keys(toptenartistsbydecade).forEach((decade) => {
          if (
            toptenartistsbydecade[decade].find((artists) => {
              return artists == d;
            })
          ) {
            if (Number(decade) < minartistdecade) {
              minartistdecade = Number(decade);
            }
          }
        });
        return xscale(Number(minartistdecade));
      })

      .attr("y", (d) => yscale(d))
      .attr("width", (d) => {
        var maxartistdecade = 0;
        var minartistdecade = 2030;
        Object.keys(toptenartistsbydecade).forEach((decade) => {
          if (
            toptenartistsbydecade[decade].find((artists) => {
              return artists == d;
            })
          ) {
            if (Number(decade) > maxartistdecade) {
              maxartistdecade = Number(decade);
            }
            if (Number(decade) < minartistdecade) {
              minartistdecade = Number(decade);
            }
          }
        });
        return (
          xscale(Number(maxartistdecade) + 10) - xscale(Number(minartistdecade))
        );
      })
      .attr("height", 20)

      .on("mouseover", function (data) {
        toolTip.show(data, this);
      })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
  })
  .catch(function (error) {
    console.log(error);
  });
