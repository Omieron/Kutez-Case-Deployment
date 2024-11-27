<?php

header("Content-Type: application/json");

require_once __DIR__ . "/api.php";
require_once __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] != "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Invalid Request Method (" . $_SERVER["REQUEST_METHOD"] . ")"]);
    exit;
} else {

    $getPrice = getPrice();
    $getDBData = readDataFromDB();

    if($getPrice != null)
        $getDBData = calculatePrice($getDBData, $getPrice);
    else
        $getDBData =calculatePrice($getDBData, 0);

    $data = popularityScore($getDBData); // for popularity range use this
    /*$data = priceScore($getDBData);*/ // for price range use this
    echo json_encode(['data' => $data]);
    exit;    
}

function popularityScore($dataJson){ 
    usort($dataJson, function ($a, $b) {
        return $b['popularityScore'] <=> $a['popularityScore']; // Büyükten küçüğe sıralama
    });
    return $dataJson;
}

function priceScore($dataJson){
    usort($dataJson, function ($a, $b) {
        return $b['price'] <=> $a['price']; // Büyükten küçüğe sıralama
    });
    return $dataJson;
}

function calculatePrice($objArr, $goldPrice){
    foreach($objArr as &$obj){
        $productPrice = ($obj['popularityScore'] + 1) * $obj['weight'] * $goldPrice;
        $productPrice = number_format($productPrice, 2);
        $obj['price'] = $productPrice;
    }
    return $objArr;
}

