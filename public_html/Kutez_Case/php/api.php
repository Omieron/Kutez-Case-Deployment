<?php

function getPrice(){
    $result = getDataFromAPI();
    if(strpos($result, 'Error:') === 0){
        return 1;
    } else {
        $decodedResult = json_decode($result,true);
        if(json_last_error() == JSON_ERROR_NONE){
            return $decodedResult['price_gram_24k'];
        } else {
            return 12;
        }  
    }
}

// GOLD API data alıyor
function getDataFromAPI(){
    $apiKey = "goldapi-3rqqhism3zuvk45-io"; // it is second api, remain 97 attempt
    $symbol = "XAU";
    $curr = "USD";
    $date = "";
    $myHeaders = array(
        'x-access-token: ' . $apiKey,
        'Content-Type: application/json'
    );
    $curl = curl_init();
    $url = "https://www.goldapi.io/api/{$symbol}/{$curr}/{$date}";
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER => $myHeaders
    ));
    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);
    if ($error) {
        return 'Error: ' . $error;
    } else {
        return $response;
    }
}

?>