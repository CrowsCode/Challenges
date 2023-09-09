
<?php

session_start();
// connect to database
$conn = mysqli_connect("localhost", "root", "", "tourist");

if (!$conn) {
	die("Error connecting to database: " . mysqli_connect_error());
}
// define global constants
define('ROOT_PATH', realpath(dirname("C:/wamp64(1)/www/b/kurdlist/kurdlist")));
define('BASE_URL', 'http://localhost:8085/b/kurdlist/');

$allCities = array(0 => "Sulaymaniyah", 1 => "Hawler", 2 => "Kerkuk", 3 => "Duhok", 4 => "Halabja");


$errors = array();
?>

