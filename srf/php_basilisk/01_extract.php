<?php

// Initalisieren der cURL-Session
$ch = curl_init();

// URL Endpunkt setzen
$url = "https://radio-basilisk.api.radiosphere.io/channels/87d0aaab-1db2-453b-af40-63bdde8cd1d1/track-history?limit=10&check-favorites=false&from=2024-05-02T22:00:00.000Z&to=2024-08-03T12:53:21.445Z";



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
$songList = $srfData['items'];
extractData($songList);
print_r($songList);

function extractData(&$data) {
    foreach ($data as &$item) {
        $item = [
            'start' => $item['start'],
            'title' => $item['track']['title'],
            'artistCredits' => $item['track']['artistCredits']
        ];
    }
}
?>