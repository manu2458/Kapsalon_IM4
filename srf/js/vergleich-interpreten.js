// Array mit den API-Endpunkten
let apiUrl = ['../php_srf/srf_api.php', '../php_basilisk/04_unload.php'];
// Globale Variable für das Diagramm
let barChart;

// Funktion zur Verarbeitung der Songdaten
function processSongData(songList, index) {
  let artistCounts = {};
  songList.forEach(song => {
    let artist = index === 0 ? song.artist : song.artistCredits;
    artistCounts[artist] = (artistCounts[artist] || 0) + 1;
  });
  return artistCounts;
}

// Funktion zum Abrufen und Anzeigen der Top-Künstler
function fetchAndDisplayTopArtists(channel) {
  let otherChannel = channel === 1 ? 2 : 1;

  // Define the filter for fetching data (always fetch for the last 30 days)
  let filter = '1m';

  Promise.all([
    fetchData(apiUrl[channel - 1], filter),
    fetchData(apiUrl[otherChannel - 1], filter)
  ])
    .then(([songList, otherSongList]) => {
      let [artistCounts, otherArtistCounts] = [
        processSongData(songList, channel - 1),
        processSongData(otherSongList, otherChannel - 1)
      ];

      // Combine the keys from both artistCounts and otherArtistCounts
      let allArtists = Array.from(
        new Set([...Object.keys(artistCounts), ...Object.keys(otherArtistCounts)])
      );

      // Sort artists by the number of plays in the current channel in descending order
      allArtists.sort((a, b) => (artistCounts[b] || 0) - (artistCounts[a] || 0));

      // Limit the number of displayed data points based on screen size
      let maxDataPoints = window.innerWidth < 768 ? 10 : 20;
      allArtists = allArtists.slice(0, maxDataPoints);

      let labels = allArtists,
        data = labels.map(artist => artistCounts[artist] || 0),
        otherData = labels.map(artist => otherArtistCounts[artist] || 0);
      barChart.data.labels = labels;
      barChart.data.datasets[channel - 1].data = data;
      barChart.data.datasets[otherChannel - 1].data = otherData;
      barChart.update();
    })
    .catch(error => console.error('Error:', error));
}

// Funktion zur Modifikation des Filters für Groß-/Kleinschreibung und Ersetzung von '/' durch '&'
function modifyFilterForComparison(filter) {
  // Convert the filter to lowercase to make it case-insensitive
  filter = filter.toLowerCase();
  // Replace '/' with '&' in the filter globally
  filter = filter.replace(/\//g, ' & ');
  
  return filter;
}
// Funktion zum Abrufen von Daten von der API
async function fetchData(url, filter) {
  // Modify the filter only for comparison
  let modifiedFilter = modifyFilterForComparison(filter);
  let response = await fetch(`${url}?filter=${modifiedFilter}`);
  if (!response.ok) throw new Error('Netzwerkantwort war nicht erfolgreich');
  return response.json();
}

// Konfiguration für das Diagramm
let config = {
  type: 'bar',
  data: { labels: [], datasets: [{ label: 'Radio SRF 3', data: [], backgroundColor: '#D1D6DC', borderColor: '#728098', borderWidth: 1 }, { label: 'Radio Basilisk', data: [], backgroundColor: '#FECACD', borderColor: '#ED3842', borderWidth: 1 }] },
  options: { maintainAspectRatio: false, scales: { y: { beginAtZero: false }, x: { min: 0, max: 20 } }, plugins: { legend: { align: 'end', position: 'bottom', labels: { color: '#666666', font: { size: 14 } } } } }
};

// Diagramm erstellen
let ctx = document.getElementById('barChart').getContext('2d');
barChart = new Chart(ctx, config);

// Die Top-Künstler für Radio SRF 3 anzeigen
fetchAndDisplayTopArtists(1);

// Funktion zum Umschalten der aktiven Klasse zwischen den Schaltflächen
function toggleActive(buttonId) {
  document.querySelectorAll('.basierend').forEach(button => {
    button.classList.toggle('active', button.id === buttonId);
  });
}
