<?php
// Admin user variables
$admin_id = 0;
$isEditingUser = false;
$username = "";
$role = "";
$email = "";
// general variables



// if user clicks the Edit admin button
if (isset($_GET['edit-admin'])) {
    $isEditingUser = true;
    $admin_id = $_GET['edit-admin'];
    editAdmin($admin_id);
}
// if user clicks the update admin button
if (isset($_POST['update_admin'])) {
    updateAdmin($_POST);
}
// if user clicks the Delete admin button
if (isset($_GET['delete-admin'])) {
    $admin_id = $_GET['delete-admin'];
    deleteAdmin($admin_id);
}


function editAdmin($admin_id)
{
    global $conn, $username, $role, $isEditingUser, $admin_id, $email;

    $sql = "SELECT * FROM users WHERE id=$admin_id LIMIT 1";
    $result = mysqli_query($conn, $sql);
    $admin = mysqli_fetch_assoc($result);

    // set form values ($username and $email) on the form to be updated
    $username = $admin['username'];
    $email = $admin['email'];
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* - Receives admin request from form and updates in database
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function updateAdmin($request_values)
{
    global $conn, $errors, $role, $isEditingUser, $admin_id;
    // get id of the admin to be updated
    $admin_id = $request_values['admin_id'];
    // set edit state to false
    $isEditingUser = false;



    if (isset($request_values['role'])) {
        $role = $request_values['role'];
    }
    // register user if there are no errors in the form
    if (count($errors) == 0) {
        //encrypt the password (security purposes)


        $query = "UPDATE users SET  role='$role' WHERE id=$admin_id";
        mysqli_query($conn, $query);

        $_SESSION['message'] = "Admin user updated successfully";
        header('location: users.php');
        exit(0);
    }
}
// delete admin user 
function deleteAdmin($admin_id)
{
    global $conn;
    $sql = "DELETE FROM users WHERE id=$admin_id";
    if (mysqli_query($conn, $sql)) {
        $_SESSION['message'] = "User successfully deleted";
        header("location: users.php");
        exit(0);
    }
}








function getAdminUsers()
{
    global $conn, $roles;
    $sql = "SELECT * FROM users WHERE role IS NOT NULL";
    $result = mysqli_query($conn, $sql);
    $users = mysqli_fetch_all($result, MYSQLI_ASSOC);

    return $users;
}
