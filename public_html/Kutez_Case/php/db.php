<?php

header("Content-Type: application/json");
$productDataPath = __DIR__ . '/../db/products.json';

function readDataFromDB(){
    global $productDataPath;  
    if (file_exists($productDataPath)) {
        $db = file_get_contents($productDataPath); 
        if ($db) {
            $decodedProductData = json_decode($db, true); 
            if (json_last_error() == JSON_ERROR_NONE) {
               return $decodedProductData; 
            } else {
                return ['error' => 'Invalid JSON format'];  
            }
        } else {
            return ['error' => 'Unable to read file'];  
        }
    } else {
        return ['error' => 'JSON file cannot be found'];  
    }
}

?>