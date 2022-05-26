<?php include('./config.php'); ?>
<?php
if ($_SESSION['user']['role'] != "Admin") {
	header("Location: " . BASE_URL . "index.php");
}
?>
<?php include(ROOT_PATH . '/includes/admin_functions.php'); ?>
<?php include(ROOT_PATH . '/includes/spot_functions.php'); ?>


<!-- Get all admin spots from DB -->
<?php $spots = getAllspots("All"); ?>

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


			<!-- Display records from DB-->
			<div class="table-div" style="width: 80%;">
				<!-- Display notification message -->
				<?php include(ROOT_PATH . '/includes/messages.php') ?>

				<?php if (empty($spots)) : ?>
					<h1 style="text-align: center; margin-top: 20px;">No spots in the database.</h1>
				<?php else : ?>
					<table class="table">
						<thead>
							<th>N</th>
							<th>Title</th>
							<th>City</th>

							<!-- Only Admin can publish/unpublish spot -->
							<?php if ($_SESSION['user']['role'] == "Admin") : ?>
								<th><small>Publish</small></th>
							<?php endif ?>
							<th><small>Edit</small></th>
							<th><small>Delete</small></th>
						</thead>
						<tbody>
							<?php foreach ($spots as $key => $spot) : ?>
								<tr>
									<td><?php echo $key + 1; ?></td>
									<td><?php echo $spot['title']; ?></td>
									<td><?php echo $spot['city']; ?></td>
									<!-- Only Admin can publish/unpublish spot -->
									<?php if ($_SESSION['user']['role'] == "Admin") : ?>
										<td>
											<?php if ($spot['approved'] == true) : ?>
												<p class="fa fa-check btn unpublish"> </p>
											<?php else : ?>
												<p class="fa fa-times btn publish"> </p>
											<?php endif ?>
										</td>
									<?php endif ?>

									<td>
										<a class="fa fa-pencil btn edit" href="edit_spot.php?edit-spot=<?php echo $spot['id'] ?>">
										</a>
									</td>
									<td>
										<a class="fa fa-trash btn delete" href="spots.php?delete-spot=<?php echo $spot['id'] ?>">
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