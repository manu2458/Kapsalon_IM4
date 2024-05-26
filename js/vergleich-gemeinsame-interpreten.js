let apiUrl = ['../php_srf/srf_api.php', '../php_basilisk/04_unload.php'];
let barChart;

async function fetchData(url, filter) {
    // Netzwerkanfrage an die API senden und Daten abrufen
    let response = await fetch(`${url}?filter=${filter}`);
    // Fehler abfangen, falls die Netzwerkanfrage nicht erfolgreich ist
    if (!response.ok) throw new Error('Netzwerkantwort war nicht erfolgreich');
    // Antwort als JSON zurückgeben
    return response.json();
  }

  function processSongData(songList, index) {
    let artistCounts = {};
    // Durchlaufe die Liste der Songs und zähle die Anzahl der Wiedergaben für jeden Künstler
    songList.forEach(song => {
      let artist = index === 0 ? song.artist : song.artistCredits;
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    });
    // Gib das Objekt mit den Künstlerzählungen zurück
    return artistCounts;
  }

  function fetchAndDisplayTopArtists(channel) {
    // Bestimme den anderen Kanal (1 für 2 und 2 für 1)
    let otherChannel = channel === 1 ? 2 : 1;
    // Filter für den Abruf der Daten definieren (immer für die letzten 30 Tage)
    let filter = '1m';
    // Parallele Netzwerkanfragen an beide APIs senden
    Promise.all([fetchData(apiUrl[channel - 1], filter), fetchData(apiUrl[otherChannel - 1], filter)])
      .then(([songList, otherSongList]) => {
        // Verarbeite die Daten für beide Kanäle
        let [artistCounts, otherArtistCounts] = [processSongData(songList, channel - 1), processSongData(otherSongList, otherChannel - 1)];
        // Filtere die Künstler, die in beiden Kanälen vorkommen
        let commonArtists = Object.keys(artistCounts).filter(artist => artistCounts[artist] && otherArtistCounts[artist]);
        // Sortiere die gemeinsamen Künstler nach Anzahl der Wiedergaben in absteigender Reihenfolge
        commonArtists.sort((a, b) => artistCounts[b] - artistCounts[a]);
        // Begrenze die Anzahl der angezeigten Datenpunkte basierend auf der Bildschirmgrösse
        let maxDataPoints = window.innerWidth < 768 ? 10 : 20;
        commonArtists = commonArtists.slice(0, maxDataPoints);
        // Erstelle die Daten für das Diagramm
        let labels = commonArtists,
          data = labels.map(artist => artistCounts[artist]),
          otherData = labels.map(artist => otherArtistCounts[artist]);
        // Aktualisiere das Diagramm mit den neuen Daten
        barChart.data.labels = labels;
        barChart.data.datasets[channel - 1].data = data;
        barChart.data.datasets[otherChannel - 1].data = otherData;
        barChart.update();
      })
      .catch(error => console.error('Error:', error));
  }

  // Konfiguration für das Balkendiagramm
let config = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        { label: 'Radio SRF 3', data: [], backgroundColor: '#D1D6DC', borderColor: '#728098', borderWidth: 1 },
        { label: 'Radio Basilisk', data: [], backgroundColor: '#FECACD', borderColor: '#ED3842', borderWidth: 1 }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: false }, x: { min: 0, max: 20 } },
      plugins: {
        legend: { align: 'end', position: 'bottom', labels: { color: '#666666', font: { size: 14 } } }
      }
    }
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