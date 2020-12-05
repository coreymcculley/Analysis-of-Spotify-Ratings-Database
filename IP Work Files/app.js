// HTML Table header

/*  <div id="table-area" class="">
        <table id="songs-table" class="table table-striped">
            <thead>
                <tr>
                    <th class="table-head">Decade</th>
                    <th class="table-head">Artist</th>
                    <th class="table-head">Song</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div> */

///////////////////////////////////////////////////////////////////

// Data acquisition
var tableData = data;

// Table body variables
var songTable = d3.select("#songs-table");
var songBody = songTable.select("tbody");

// tableData iteration and calling function for each item
tableData.forEach(song => {
    // creating rows for data
    var rowSong = songBody.append('tr');
    // array objects iteration to pick values
    Object.entries(song).forEach(([key, value]) => {
        // creating data cells and adding values
        var entrySong = rowSong.append("td");
        entrySong.text(value);
    });
});

// Creating listener
var button = d3.select("#filter-btn");
var form = d3.select("form");
button.on("click", runSearch);
form.on("submit", runSearch);

// Filtering table
function runSearch() {
    // Preventing HTML events
    d3.event.preventDefault();
    // Filtering inputs
    var inputType = d3.select("#datetime");
    var inputVal = inputType.property("value");
    var filterTable = tableData.filter(datapoint => datapoint.datetime === inputVal);
    console.log(filterTable);
    // Delete previous table data
    ufoBody.selectAll("tr").remove();
    // Looping in filtered data and update table
    filterTable.forEach(function (ufo) {
        var rowNew = ufoBody.append("tr");
        Object.entries(ufo).forEach(function ([key, value]) {
            var cellNew = rowNew.append("td");
            cellNew.text(value);
        });
    });
};