d3.csv("clean_data.csv", function (importedData) {
  var artistData = importedData;

  var songID = 5;
  var bandID = 'AC/DC';

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

  for (var i = 0; i < artistData.length; i++) {
    if (bandNameAll[i] == bandID) {
      subjectindex.push(i);
    }
  }

  var bandName = [];
  var songNames = [];
  var songValence = [];
  var songAcousticness = [];
  var songDanceability = [];
  var songEnergy = [];
  var songExplicit = [];
  var songLiveness = [];
  var songLoudness = [];
  var songPopularity = [];
  var songSpeechiness = [];
  var songTempo = [];

  for (var i = 0; i < subjectindex.length; i++) {
    bandName[i] = bandNameAll[subjectindex[i]];
    songNames[i] = songNamesAll[subjectindex[i]];
    songValence[i] = songValenceAll[subjectindex[i]];
    songAcousticness[i] = songAcousticnessAll[subjectindex[i]];
    songDanceability[i] = songDanceabilityAll[subjectindex[i]];
    songEnergy[i] = songEnergyAll[subjectindex[i]];
    songExplicit[i] = songExplicitAll[subjectindex[i]];
    songLiveness[i] = songLivenessAll[subjectindex[i]];
    songLoudness[i] = songLoudnessAll[subjectindex[i]];
    songPopularity[i] = songPopularityAll[subjectindex[i]];
    songSpeechiness[i] = songSpeechinessAll[subjectindex[i]];
    songTempo[i] = songTempoAll[subjectindex[i]];
  }

var xLabels = ["Valence", "Acousticness", "Danceability", "Energy", "Explicit", "Liveness", "Loudness", "Popularity", "Tempo"];
var yValues = [songValence[songID], songAcousticness[songID], songDanceability[songID], songEnergy[songID], songExplicit[songID], songLiveness[songID], (-songLoudness[songID] + 20) / 50, songPopularity[songID] / 100, songTempo[songID] / 200 ];

new Chart(document.getElementById("bar-chart"), {
  type: 'bar',
  data: {
    labels: xLabels,
    datasets: [
      {
        label: "Value",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: yValues
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Selected Songs Spotify Data'
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