<?php include('./config.php'); ?>
<?php
if ($_SESSION['user']['role'] != "Admin") {
	header("Location: " . BASE_URL . "index.php");
}
?>
<?php include(ROOT_PATH . '/includes/admin_functions.php'); ?>
<?php
// Get all admin users from DB
$admins = getAdminUsers();
$roles = ['Admin', 'User'];
?>


<!DOCTYPE html>
<html lang="en">

<head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
	<!-- ======= Head Links ======= -->
	<?php include("sections/headLinks.php") ?>
	<!-- End Head Links -->

	<style>
		#main {
			display: flex;
			flex-direction: column;
			height: 90vh;
			justify-content: space-between;
		}

		#footer {}

		.container {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

		}

		#main {
			margin-top: 10vh;
		}
	</style>
</head>

<body>
	<!-- ======= Header ======= -->
	<header id="header" class="fixed-top header-inner-pages">
		<?php include("sections/headerPages.php") ?>
	</header>
	<!-- End Header -->



	<main id="main">

		<div class="container content">
			<!-- Left side menu -->

			<!-- Middle form - to create and edit  -->
			<div class="action">
				<h1 class="page-title">Change User/Admin Status</h1>

				<form class="text-center" method="post" action="<?php echo BASE_URL . 'users.php'; ?>">


					<!-- if editing user, display the update button instead of create button -->
					<?php if ($isEditingUser === true) : ?>
						<!-- validation errors for the form -->
						<?php include(ROOT_PATH . '/includes/errors.php') ?>

						<!-- if editing user, the id is required to identify that user -->
						<?php if ($isEditingUser === true) : ?>
							<input type="hidden" name="admin_id" value="<?php echo $admin_id; ?>">
						<?php endif ?>

						<input disabled type="text" name="username" value="<?php echo $username; ?>" placeholder="Username">

						<select name="role">
							<option value="" selected disabled>Assign role</option>
							<?php foreach ($roles as $key => $role) : ?>
								<option value="<?php echo $role; ?>"><?php echo $role; ?></option>
							<?php endforeach ?>
						</select>

						<button type="submit" class="btn" name="update_admin">UPDATE</button>
					<?php else : ?>

					<?php endif ?>
				</form>
			</div>
			<!-- // Middle form - to create and edit -->

			<!-- Display records from DB-->
			<div class="table-div">
				<!-- Display notification message -->
				<?php include(ROOT_PATH . '/includes/messages.php') ?>

				<?php if (empty($admins)) : ?>
					<h1>No admins in the database.</h1>
				<?php else : ?>
					<table class="table">
						<thead>
							<th>N</th>
							<th>Admin</th>
							<th>Role</th>
							<th colspan="2">Action</th>
						</thead>
						<tbody>
							<?php foreach ($admins as $key => $admin) : ?>
								<tr>
									<td><?php echo $key + 1; ?></td>
									<td>
										<?php echo $admin['username']; ?>, &nbsp;
										<?php echo $admin['email']; ?>
									</td>
									<td><?php echo $admin['role']; ?></td>
									<td>
										<a class="fa fa-pencil btn edit" href="users.php?edit-admin=<?php echo $admin['id'] ?>">
										</a>
									</td>
									<td>
										<a class="fa fa-trash btn delete" href="users.php?delete-admin=<?php echo $admin['id'] ?>">
										</a>
									</td>
								</tr>
							<?php endforeach ?>
						</tbody>
					</table>
				<?php endif ?>
			</div>
			<!-- // Display records from DB -->
		</div>
		<!-- ======= Footer Section ======= -->
		<?php include("sections/footer.php") ?>
		<!-- End Footer -->
		</div>



</body>

</html>