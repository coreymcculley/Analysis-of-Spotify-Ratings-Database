d3.csv("clean_data_all.csv", function (getData) {
    var songData = getData;
    // console.log(songData)

    bandID = 'Metallica';

    var bandNameAll = [];
    var songNamesAll = [];
    var songYearsAll = [];
    var subjectIndex = [];

    for (var i = 0; i < songData.length; i++) {
        bandNameAll[i] = songData[i].Artist_Band;
        songNamesAll[i] = songData[i].Song;
        songYearsAll[i] = songData[i].Release_Year;
    }

    for (var i = 0; i < songData.length; i++) {
        if (bandNameAll[i] == bandID) {
            subjectIndex.push(i);
        }
    }

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

    console.log(bandName)

    var xLabels = Object.keys(songCount);
    var yValues = Object.values(songCount);

    new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: "Songs",
                    backgroundColor: "darkgrey",
                    // borderColor: "2e6bee",
                    // borderWidth: 1,
                    data: yValues
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 10
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: false,
                        color: "grey"
                    },
                    ticks: {
                        fontColor: "white",
                        fontSize: 10
                    },
                }]
            },
            legend: { display: false },
            title: {
                display: true,
                text: [bandName[0]],
                fontColor: "white",
                fontSize: 16
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
})