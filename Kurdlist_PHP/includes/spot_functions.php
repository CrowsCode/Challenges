
<?php
// spot variables
$id = 0;
$isEditingspot = false;
$approved = 0;
$title = "";
$coordinate = "";
$description = "";
$featured_image = "";


/* - - - - - - - - - - 
-  spot functions
- - - - - - - - - - -*/

// get all spots from DB
function getAllspots($city)
{
	global $conn;

	$sql = "SELECT * FROM spots";
	if ($city != "All" && $city != null) {
		$sql = "SELECT * FROM spots where city = '$city'  ORDER BY updated_at DESC LIMIT 15";
	}


	$result = mysqli_query($conn, $sql)  or trigger_error("Query Failed! SQL: $sql - Error: " . mysqli_error($conn), E_USER_ERROR);
	$spots = mysqli_fetch_all($result, MYSQLI_ASSOC);


	return $spots;

	return null;
}











/* - - - - - - - - - - 
-  spot actions
- - - - - - - - - - -*/
// if user clicks the create spot button
if (isset($_POST['create_spot'])) {

	createspot($_POST);
}
// if user clicks the Edit spot button
if (isset($_GET['edit-spot'])) {
	$isEditingspot = true;
	$id = $_GET['edit-spot'];
	editspot($id);
}
// if user clicks the update spot button
if (isset($_POST['update_spot'])) {
	updatespot($_POST);
}
// if user clicks the Delete spot button
if (isset($_GET['delete-spot'])) {
	$id = $_GET['delete-spot'];
	deletespot($id);
}

/* - - - - - - - - - - 
-  spot functions
- - - - - - - - - - -*/
function createspot($request_values)
{

	global $conn, $errors, $title, $featured_image, $city, $description, $approved, $coordinate;
	$title = esc_sql($request_values['title']);
	$coordinate = esc_sql($request_values['coordinate']);
	$description = htmlentities(esc_sql($request_values['description']));
	if (isset($request_values['city'])) {
		$city = esc_sql($request_values['city']);
	}
	if (isset($request_values['approved'])) {
		$approved = esc_sql($request_values['approved']);
	}

	// validate form
	if (empty($title)) {
		array_push($errors, "spot title is required");
	}
	if (empty($coordinate)) {
		array_push($errors, "spot coordinate is required");
	}
	if (empty($description)) {
		array_push($errors, "spot description is required");
	}
	if (empty($city)) {
		array_push($errors, "spot city is required");
	}
	// Get image name
	$featured_image = $_FILES['featured_image']['name'];
	if (empty($featured_image)) {
		array_push($errors, "Featured image is required");
	}
	// image file directory
	$target = "./static/images/" . basename($featured_image);
	if (!move_uploaded_file($_FILES['featured_image']['tmp_name'], $target)) {
		array_push($errors, "Failed to upload image. Please check file settings for your server");
	}

	// create spot if there are no errors in the form
	if (count($errors) == 0) {
		$query = "INSERT INTO spots ( title,coordinate,city, image, description, approved, created_at, updated_at) VALUES( '$title', '$coordinate','$city', '$featured_image', '$description', $approved, now(), now()) ";;

		$result = mysqli_query($conn, $query) or trigger_error("Query Failed! SQL: $query - Error: " . mysqli_error($conn), E_USER_ERROR);
		echo 33333;
		if ($result) { // if spot created successfully
			$inserted_id = mysqli_insert_id($conn);
			// create relationship between spot and city


			$_SESSION['message'] = "spot created successfully";
			header('location: spots.php');
			exit(0);
		} else {
			echo var_dump($errors);
		}
	}
}

/* * * * * * * * * * * * * * * * * * * * *
	* - Takes spot id as parameter
	* - Fetches the spot from database
	* - sets spot fields on form for editing
	* * * * * * * * * * * * * * * * * * * * * */
function editspot($role_id)
{
	global $conn, $title, $coordinate, $description, $approved, $featured_image, $city, $isEditingspot, $id;
	$sql = "SELECT * FROM spots WHERE id=$role_id LIMIT 1";
	$result = mysqli_query($conn, $sql)  or trigger_error("Query Failed! SQL: $sql - Error: " . mysqli_error($conn), E_USER_ERROR);
	$spot = mysqli_fetch_assoc($result);
	// set form values on the form to be updated
	$title = $spot['title'];
	$coordinate = $spot['coordinate'];
	$description = $spot['description'];
	$approved = $spot['approved'];
	$featured_image = $spot['image'];
	$city = $spot['city'];
}

function updatespot($request_values)
{
	global $conn, $errors, $id, $title, $coordinate, $featured_image, $city, $description, $approved;

	$title = esc_sql($request_values['title']);
	$coordinate = esc_sql($request_values['coordinate']);
	$description = esc_sql($request_values['description']);
	if (isset($request_values['approved'])) {
		// $approved = esc_sql($request_values['approved']);
		$approved = 1;
	} else {
		$approved = 1;
	}

	$id = esc_sql($request_values['id']);
	if (isset($request_values['city'])) {
		$city = esc_sql($request_values['city']);
	}


	if (empty($title)) {
		array_push($errors, "spot title is required");
	}
	if (empty($coordinate)) {
		array_push($errors, "spot coordinate is required");
	}
	if (empty($description)) {
		array_push($errors, "spot description is required");
	}
	// if new featured image has been provided
	if (isset($_POST['featured_image'])) {
		// Get image name
		$featured_image = $_FILES['featured_image']['name'];
		// image file directory
		$target = "./static/images/" . basename($featured_image);
		if (!move_uploaded_file($_FILES['featured_image']['tmp_name'], $target)) {
			array_push($errors, "Failed to upload image. Please check file settings for your server");
		}
	}

	// register city if there are no errors in the form
	if (count($errors) == 0) {
		$query = "UPDATE spots SET title='$title', coordinate='$coordinate', image='$featured_image', description='$description', approved=$approved, updated_at=now() WHERE id=$id";
		// attach city to spot on spot_city table
		$result = mysqli_query($conn, $query) or trigger_error("Query Failed! SQL: $query - Error: " . mysqli_error($conn), E_USER_ERROR);
		if ($result) { // if spot created successfully
			if (isset($city)) {
				$inserted_id = mysqli_insert_id($conn);

				$_SESSION['message'] = "spot created successfully";
				header('location: spots.php');
				exit(0);
			}
		}
		$_SESSION['message'] = "spot updated successfully";
		header('location: spots.php');
		exit(0);
	}
}

function deletespot($id)
{
	global $conn;
	$sql = "DELETE FROM spots WHERE id=$id";
	if (mysqli_query($conn, $sql)) {
		$_SESSION['message'] = "spot successfully deleted";
		header("location: spots.php");
		exit(0);
	}
}















// if user clicks the approve spot button
if (isset($_GET['approve']) || isset($_GET['unapprove'])) {
	$message = "";
	if (isset($_GET['approve'])) {
		$message = "spot approved successfully";
		$id = $_GET['approve'];
	} else if (isset($_GET['unapprove'])) {
		$message = "spot successfully unapproved";
		$id = $_GET['unapprove'];
	}
	toggleapprovespot($id, $message);
}
// delete blog spot
function toggleapprovespot($id, $message)
{
	global $conn;
	$sql = "UPDATE spots SET approved=!approved WHERE id=$id";

	if (mysqli_query($conn, $sql)) {
		$_SESSION['message'] = $message;
		header("location: spots.php");
		exit(0);
	}
}
