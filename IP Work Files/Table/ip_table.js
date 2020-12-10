var tabulate = function (data, columns) {
    var table = d3.select('#top10songs-table') // this is the solution
    // var table = d3.select('body').append('table') this was before the solution
    var thead = table.append('thead')
    var tbody = table.append('tbody')


    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (d) { return d })

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')

    var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })

    return table;
}

d3.csv("clean_data_all.csv", function (error, tableData) {
    //if (error) throw error;
    console.log(tableData)
    decadeID = '2000';
    decadeData = tableData.filter(d => d.Decade == decadeID);


    top10Songs = decadeData.slice().sort((a, b) => d3.descending(a.Popularity, b.Popularity)).slice(0, 10)
    console.log(top10Songs)

    const columns = ['Year', 'Artist', 'Song', 'Genre', 'Popularity']
    tabulate(top10Songs, columns)
});

// d3.csv('clean_data_all.csv')
//     .then(function (data) {
//         const columns = ['year', 'artists', 'name', 'genres']
//         tabulate(data, columns)
//     });




// d3.csv("clean_data_all.csv", function (getData) {
//     var tableData = getData;

//     // console.log(tableData)

//     decadeID = '1990';

//     decadeData = tableData.filter(d => d.decade == decadeID);
//     console.log(decadeData)

//     // Table body variables
//     var songTable = d3.select("#top10songs-table");
//     var songBody = songTable.select("tbody");

//     // tableData iteration and calling function for each item
//     decadeData.forEach(song => {
//         // creating rows for data
//         var rowSong = songBody.append('tr');
//         // array objects iteration to pick values
//         Object.entries(song).forEach(([key, value]) => {
//             // creating data cells and adding values
//             var entrySong = rowSong.append("td");
//             entrySong.text(value);
//         });
//     });
// });
    // var bandNameAll = [];
    // var songNameAll = [];
    // var songYearAll = [];
    // var songDecadeAll = [];
    // var songGenreAll = [];
    // var subIndex = [];

    // for (var i = 0; i < tableData.length; i++) {
    //     bandNameAll[i] = tableData[i].artists;
    //     songGenreAll[i] = tableData[i].genres;
    //     songNameAll[i] = tableData[i].name;
    //     songYearAll[i] = tableData[i].year;
    //     songDecadeAll[i] = tableData[i].decade;
    // }

    // for (var i = 0; i < tableData.length; i++) {
    //     if (songDecadeAll[i] == decadeID) {
    //         subIndex.push(i);
    //     }
    // }

    // var bandName = [];
    // var songName = [];
    // var songYear = [];
    // var songGenre = [];
    // var songDecade = [];

    // for (var i = 0; i < subIndex.length; i++) {
    //     bandName[i] = bandNameAll[subIndex[i]];
    //     songName[i] = songNameAll[subIndex[i]];
    //     songYear[i] = songYearAll[subIndex[i]];
    //     songGenre[i] = songGenreAll[subIndex[i]];
    //     songDecade[i] = songDecadeAll[subIndex[i]];
    //     // console.log(songName)
    // }

    // var top10 = [];

    // var counts = songName.reduce(function (map, fruit) {
    //     map[fruit] = (map[fruit] || 0) + 1;
    //     return map;
    // }, {});

    // var sorted = Object.keys(counts).sort(function (a, b) {
    //     return counts[b] - counts[a];
    // });

    // top10 = sorted.slice(0, 10);

    // console.log(top10)




// })


    // console.log(tableData);
    // var decSongCount = {};

    // tableData.forEach((data) => {
    //     if (!decSongCount[data.decade]) {
    //         decSongCount[data.decade] = {};
    //     }
    //     if (decSongCount[data.decade][data.name]) {
    //         decSongCount[data.decade][data.name] += 1;
    //     }
    //     else {
    //         decSongCount[data.decade][data.name] = 1;
    //     }
    // });

    // var decTop10Songs = {};

    // _.forEach(decSongCount, (value, key) => {
    //     var top10Songs = [];
    //     for (var i = 0; i < 10; i++) {
    //         var currentmax = Math.max(...Object.values(value));
    //         Object.keys(value).forEach((name) => {
    //             if (value[name] == currentmax) {
    //                 top10Songs.push(name);
    //                 value[name] = -1;
    //             }
    //         });
    //     }
    //     decTop10Songs[key] = top10Songs.slice(0, 10);
    // });


    // console.log(decSongCount);
    // console.log(decTop10Songs);