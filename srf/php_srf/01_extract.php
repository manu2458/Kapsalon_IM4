<?php

// Initalisieren der cURL-Session
$ch = curl_init();

// URL Endpunkt setzen
$url = "https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/dd0fa1ba-4ff6-4e1a-ab74-d7e49057d96f?from=2024-05-03T00%3A00%3A00%2B02%3A00&to=2024-08-03T23%3A59%3A00%2B02%3A00&pageSize=250";



// cURL-Optionen setzen
curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 

// Execute cURL request and get the response
$response = curl_exec($ch); // Execute cURL session, fetch the JSON respone

// Check for errors
if(curl_errno($ch)){
    // If there is an error, handle it here
    echo 'Error: ' . curl_error($ch);
}

// Close cURL session
curl_close($ch);

// Decode JSON response
$srfData = json_decode($response, true);

// Accessing the 'songList' array
$songList = $srfData['songList'];
extractData($songList);

function extractData(&$data) {
    foreach ($data as &$item) {
        $item = [
            'date' => $item['date'],
            'duration' => $item['duration'],
            'title' => $item['title'],
            'artist' => $item['artist']['name']
        ];
    }
}

?>