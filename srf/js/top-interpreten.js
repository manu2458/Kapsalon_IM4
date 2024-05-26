const apiSrf = '../php_srf/srf_api.php';
const apiBasilisk = '../php_basilisk/04_unload.php';
let currentChannel = 'Radio SRF 3';
let currentFilter = '24h';

// Funktion zum Abrufen von Songdaten mit Filter
async function fetchSongDataWithFilter(url, filter) {
    return fetch(`${url}?filter=${filter}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Fehler:', error);
        });
}

// Funktion zum Verarbeiten von Songdaten und Generieren von Tabellendaten
function processSongData(songList, channelName) {
    let artistData = {};
    songList.forEach(song => {
        const artist = song.artist || song.artistCredits;
        const date = channelName === 'Radio SRF 3' ? song.date : song.start;

        if (artistData[artist]) {
            artistData[artist].count++;
            if (new Date(date) > new Date(artistData[artist].lastPlayed)) {
                artistData[artist].lastPlayed = date;
            }
        } else {
            artistData[artist] = { count: 1, lastPlayed: date };
        }
    });

    const sortedArtists = Object.entries(artistData)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 100);

    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    sortedArtists.forEach(([artist, data], index) => {
        const row = document.createElement('tr');
        const rankCell = document.createElement('td');
        const artistCell = document.createElement('td');
        const countCell = document.createElement('td');
        const lastPlayedCell = document.createElement('td');
        
        rankCell.textContent = index + 1; // Rank starts from 1
        artistCell.textContent = artist;
        countCell.textContent = data.count;
        lastPlayedCell.textContent = moment(data.lastPlayed).locale('de-ch').calendar();
        
        row.appendChild(rankCell);
        row.appendChild(artistCell);
        row.appendChild(countCell);
        row.appendChild(lastPlayedCell);
        
        tableBody.appendChild(row);
    });

    document.getElementById('selectedFilterBtn').textContent = `${currentFilter === '24h' ? '24 Stunden' : currentFilter === '7d' ? '7 Tage' : '30 Tage'}`;
}

// Event-Listener für Filterbuttons hinzufügen
document.getElementById('filter24h').addEventListener('click', () => {
    currentFilter = '24h';
    fetchSongDataWithFilter(currentChannel === 'Radio SRF 3' ? apiSrf : apiBasilisk, '24h')
        .then(songList => {
            processSongData(songList, currentChannel);
        });
});

document.getElementById('filter7d').addEventListener('click', () => {
    currentFilter = '7d';
    fetchSongDataWithFilter(currentChannel === 'Radio SRF 3' ? apiSrf : apiBasilisk, '7d')
        .then(songList => {
            processSongData(songList, currentChannel);
        });
});

document.getElementById('filter1m').addEventListener('click', () => {
    currentFilter = '1m';
    fetchSongDataWithFilter(currentChannel === 'Radio SRF 3' ? apiSrf : apiBasilisk, '1m')
        .then(songList => {
            processSongData(songList, currentChannel);
        });
});

// Event-Listener für den Kanalwechselbutton hinzufügen
document.getElementById('channel1Btn').addEventListener('click', () => {
    currentChannel = 'Radio SRF 3';
    document.getElementById('channel1Btn').disabled = true;
    document.getElementById('channel2Btn').disabled = false;
    
    fetchSongDataWithFilter(apiSrf, currentFilter)
        .then(songList => {
            processSongData(songList, currentChannel);
        });
});

document.getElementById('channel2Btn').addEventListener('click', () => {
    currentChannel = 'Radio Basilisk';
    document.getElementById('channel1Btn').disabled = false;
    document.getElementById('channel2Btn').disabled = true;
    
    fetchSongDataWithFilter(apiBasilisk, currentFilter)
        .then(songList => {
            processSongData(songList, currentChannel);
        });
});

// Standardmäßig Daten für Radio SRF 3 mit Filter 24h anzeigen
fetchSongDataWithFilter(apiSrf, '24h')
    .then(songList => {
        processSongData(songList, 'Radio SRF 3');
        document.getElementById('channel1Btn').disabled = true;
    });

function toggleDropdown() {
    var dropdown = document.getElementById("myDropdown");
    if (dropdown.style.display === "flex") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "flex";
    }
}

function selectFilter(filter) {
    currentFilter = filter;
    // Text des ausgewählten Filterbuttons aktualisieren
    document.getElementById("selectedFilterBtn").textContent = document.getElementById("filter" + filter).textContent;

    // Dropdown schließen, nachdem eine Option ausgewählt wurde
    document.getElementById("myDropdown").style.display = "none";

    // Daten mit dem ausgewählten Filter abrufen
    fetchSongDataWithFilter(currentChannel === 'Radio SRF 3' ? apiSrf : apiBasilisk, filter)
        .then(songList => {
            processSongData(songList, currentChannel);
        });
}

// Dropdown schließen, wenn der Benutzer außerhalb davon klickt
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "flex") {
                openDropdown.style.display = "none";
            }
        }
    }
}

// Funktion zum Umschalten der aktiven Klasse zwischen den Schaltflächen
function toggleActive(buttonId) {
  document.querySelectorAll('.basierend').forEach(button => {
    button.classList.toggle('active', button.id === buttonId);
  });
}
