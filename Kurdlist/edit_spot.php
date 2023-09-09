<?php include('./config.php'); ?>
<?php
if ($_SESSION['user']['role'] != "Admin") {
	header("Location: " . BASE_URL . "index.php");
}
?>
<?php include(ROOT_PATH . '/includes/admin_functions.php'); ?>
<?php include(ROOT_PATH . '/includes/spot_functions.php'); ?>


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




		<section class="container" id="create">



			<form id="create-form" method="POST" enctype="multipart/form-data" action="<?php echo BASE_URL . 'index.php'; ?>">

				<?php include(ROOT_PATH . '/includes/errors.php') ?>


				<?php if ($isEditingspot === true) : ?>
					<div class=" form-group">
						<input class="form-control" type="hidden" name="id" value="<?php echo $id; ?>">
					</div>
				<?php endif ?>

				<div class="form-group">
					<input class="form-control" type="text" name="title" value="<?php echo $title; ?>" placeholder="Title">
				</div>
				<div class="form-group">
					<input class="form-control" type="text" id="coordinateInput" name="coordinate" value="<?php echo $coordinate; ?>" placeholder="coordinate">
				</div>
				<div class="form-group text-center">

					<img width="100px" src="<?php echo BASE_URL . '/static/images/' . $featured_image; ?>" class=" img-fluid" alt="">
					<input class="form-control" type="file" id="formFile"" name=" featured_image">

				</div>
				<div class="form-group">
					<textarea class="form-control" name="description" id="description" rows="4"></textarea>
				</div>
				<div class="form-group">
					<h4>Chosen: <b><?php echo $city; ?></b></h4>
					<select name="city" class="form-select">
						<option value="" selected disabled>Choose city</option>
						<?php foreach ($allCities as $city) : ?>

							<option value="<?php echo $city; ?>">
								<?php echo $city; ?>
							</option>
						<?php endforeach ?>
					</select>
				</div>

				<?php if ($_SESSION['user']['role'] == "Admin") : ?>
					<div class="form-group">
						<label for="approved">
							approve
							<input type="checkbox" value="1" name="approved">&nbsp;
						</label>
					</div>
				<?php endif ?>

				<div class="form-group">
					<button type="submit" name="create_spot" class="form-control btn btn-primary submit px-3">Save Spot</button>
				</div>



			</form>



		</section>
		</div>

		<!-- ======= Footer Section ======= -->
		<?php include("sections/footer.php") ?>
		<!-- End Footer -->
		</div>



</body>

</html>