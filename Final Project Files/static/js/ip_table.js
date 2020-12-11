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

function makeTable(decade){
  d3.csv("../data/clean_data_all.csv", function (tableData) {
    //if (error) throw error;
    console.log(tableData)
    decadeID = decade;
    decadeData = tableData.filter(d => d.Decade == decadeID);


    top10Songs = decadeData.slice().sort((a, b) => d3.descending(a.Popularity, b.Popularity)).slice(0, 10)
    console.log(top10Songs)

    const columns = ['Year', 'Artist', 'Song', 'Genre', 'Popularity']
    tabulate(top10Songs, columns)
  })
};

function clearTable(){
  var tableHeaderRowCount = 0;
  var table = document.getElementById('top10songs-table');
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
      table.deleteRow(tableHeaderRowCount);
  }
  
};