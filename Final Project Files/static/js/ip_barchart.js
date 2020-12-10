function updateBar(band){
    d3.csv("clean_data_all.csv", function (getData) {
        var songData = [];
        songData = getData;
        console.log(songData)

        bandID = band;
        //console.log(bandID);

        var bandNameAll = [];
        var songNamesAll = [];
        var songYearsAll = [];
        var subjectIndex = [];

        for (var i = 0; i < songData.length; i++) {
            bandNameAll[i] = songData[i].Artist;
            songNamesAll[i] = songData[i].Song;
            songYearsAll[i] = songData[i].Year;
        }

        //console.log(songYearsAll);

        for (var i = 0; i < songData.length; i++) {
            if (bandNameAll[i] == bandID) {
                subjectIndex.push(i);
            }
        }
        //console.log(bandNameAll);
        var bandName = [];
        // var songNames = [];
        var songYears = [];
        var songCount = [];

        for (var i = 0; i < subjectIndex.length; i++) {
            bandName[i] = bandNameAll[subjectIndex[i]];
            // songNames[i] = songNamesAll[subjectIndex[i]];
            songYears[i] = songYearsAll[subjectIndex[i]];
            // console.log(songNames)
        }

        for (var i = 0; i < songYears.length; i++) {
            songCount[songYears[i]] = (songCount[songYears[i]] || 0) + 1;
        }

        //console.log(songCount)

        var xLabels = Object.keys(songCount);
        var yValues = Object.values(songCount);

        new Chart(document.getElementById("bar-chart-track"), {
            type: 'bar',
            data: {
                labels: xLabels,
                datasets: [
                    {
                        label: "Songs",
                        backgroundColor: "#1DB954",
                        // borderColor: "2e6bee",
                        // borderWidth: 1,
                        data: yValues
                    }
                ]
            },
            options: {
                responsive: true,
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
                    bodyFontSize: 16,
                    displayColors: false,
                  },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fontColor: "#000",
                            fontSize: 14
                        },
                    }],
                    yAxes: [{
                        gridLines: {
                            display: true,
                            color: "#d4d4d4"
                        },
                        ticks: {
                            fontColor: "#000",
                            fontSize: 14
                        },
                    }]
                },
                legend: { display: false },
                title: {
                    display: true,
                    text: [bandName[0]],
                    fontColor: "Black",
                    fontSize: 30
                },
                animation: {
                    duration: 2000,
                },
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50
                    }
                }
            }
        });
    });
};