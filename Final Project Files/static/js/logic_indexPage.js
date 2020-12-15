// Load data from spotify.csv
d3.csv("../../clean_data_all.csv")
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
    var svgWidth = 1100;
    var svgHeight = 600;

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
      .select(".top5chart")
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
    var bottomAxis = d3.axisBottom(xscale).tickFormat(d3.format("d"));
    var leftAxis = d3.axisLeft(yscale).ticks(10);

    var artistimages = {
      "Taylor Swift":
        "https://upload.wikimedia.org/wikipedia/commons/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png",
      Drake:
        "https://static.billboard.com/files/2020/12/drake-top-boy-premiere-2019-billboard-1548-1607015933-compressed.jpg",
      "Lana Del Rey":
        "https://static.billboard.com/files/media/02-Lana-Del-Rey-cr-Neil-Krug-2017-press-photos-billboard-1548-compressed.jpg",
      "One Direction":
        "https://upload.wikimedia.org/wikipedia/commons/e/e1/One_Direction_2015.jpg",
      BTS:
        "https://api.time.com/wp-content/uploads/2020/11/GettyImages-1207834649.jpg",
      "George Strait":
        "https://www.gstatic.com/tv/thumb/persons/23503/23503_v9_bb.jpg",
      "Red Hot Chili Peppers":
        "https://consequenceofsound.net/wp-content/uploads/2020/10/Red-Hot-Chili-Peppers-with-John-Frusciante.jpg?quality=80&w=807",
      "Linkin Park":
        "https://townsquare.media/site/366/files/2020/07/Linkin-Park-Grammy-Vince-Bucci.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89",
      "John Mayer":
        "https://images.sk-static.com/images/media/profile_images/artists/442137/huge_avatar",
      Eminem:
        "https://i0.wp.com/nypost.com/wp-content/uploads/sites/2/2020/05/eminem-texting-01.jpg?quality=80&strip=all&ssl=1",
      "Green Day":
        "https://s1.ticketm.net/dam/a/a54/cc9d04b1-1562-4d01-bc8c-f8278a95aa54_1151101_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "2Pac":
        "https://e-cdns-images.dzcdn.net/images/artist/0df7c9931cdb8de51bb5de1db35116b8/500x500.jpg",
      Sublime:
        "https://upload.wikimedia.org/wikipedia/en/a/a0/Bud_Gaugh%2C_Eric_Wilson%2C_and_Brad_Nowell_of_Sublime_%281996%29.jpg",
      Nirvana: "https://townsquare.media/site/366/files/2014/11/Nirvana.jpg",
      "The Smiths":
        "https://cdn.britannica.com/17/23017-004-C0102DE8/The-Smiths.jpg",
      "The Cure":
        "https://static.billboard.com/files/media/the-cure-1992-650-430-compressed.jpg",
      Metallica:
        "https://www.nme.com/wp-content/uploads/2020/08/Metallica-2.jpg",
      U2:
        "https://consequenceofsound.net/wp-content/uploads/2017/01/u2-joke-album-release-format-itunes-funny.png?w=807",
      "Bob Marley & The Wailers":
        "https://i.pinimg.com/originals/a2/05/01/a2050153f2e28046742084f168fe427d.jpg",
      "Led Zeppelin":
        "https://upload.wikimedia.org/wikipedia/commons/4/49/LedZeppelinmontage.jpg",
      "Fleetwood Mac":
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Fleetwood_Mac_Billboard_1977.jpg/220px-Fleetwood_Mac_Billboard_1977.jpg",
      Queen:
        "https://images.ladbible.com/thumbnail?type=jpeg&url=https://www.unilad.co.uk/wp-content/uploads/2018/10/queen.jpg&quality=70&height=700",
      "The Rolling Stones":
        "https://www.rollingstone.com/wp-content/uploads/2019/04/rolling-stones-honk-review.jpg",
      "The Beatles":
        "https://cdn.britannica.com/18/136518-050-CD0E49C6/The-Beatles-Ringo-Starr-Paul-McCartney-George.jpg",
      "Bob Dylan":
        "https://c.files.bbci.co.uk/A7B8/production/_115863924_dlyanpa.jpg",
      "Frank Sinatra":
        "https://www.wrti.org/sites/wrti/files/styles/x_large/public/201512/Frank.jpg",
      "The Beach Boys":
        "https://i2.wp.com/liveforlivemusic.com/wp-content/uploads/2018/05/Beach-Boys-Web-Tile2.jpg?fit=1600%2C900&ssl=1",
      "Oscar Peterson":
        "https://assets.jazziz.com/2015/12/OscarPeterson-1024x689.jpg",
      "Lata Mangeshkar":
        "https://variety.com/wp-content/uploads/2020/09/lata-mangeshkar.jpg?w=1000",
      "Dean Martin":
        "https://m.media-amazon.com/images/M/MV5BMTI0NzgzMjg4OF5BMl5BanBnXkFtZTYwNzgyNzQ2._V1_UY1200_CR78,0,630,1200_AL_.jpg",
      "Miles Davis":
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPIDbuUnvOxI3vfIt3xLDouhwIoVU-3eoVQw&usqp=CAU",
      "Ella Fitzgerald":
        "https://www.gannett-cdn.com/presto/2020/06/25/PDTN/5c97574b-4cb8-41a3-afce-b5deda013023-Ella_Fitzgerald.jpg?crop=2175,1224,x0,y600&width=2175&height=1224&format=pjpg&auto=webp",
    };
    // Initialize tooltip
    var toolTip = d3
      .tip()
      .attr("class", "tooltip")
      .offset([0, -60])
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
        return `<img class="tooltipimage" src= "${artistimages[artistname]
          }">${artistname}<br>${minartistdecade} - ${maxartistdecade + 10}`;
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
      // .text("Artist")
      .attr("font-weight", "bold");
    // .attr("font-size", 20);

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
      .attr("height", 16)

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
