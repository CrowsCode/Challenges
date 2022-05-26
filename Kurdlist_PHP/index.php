<?php require_once('config.php') ?>

<?php require_once(ROOT_PATH . '/includes/registration_login.php') ?>
<?php require_once(ROOT_PATH . '/includes/admin_functions.php'); ?>
<?php require_once(ROOT_PATH . '/includes/spot_functions.php'); ?>



<!-- Get all admin spots from DB -->
<?php

$cities = [];
foreach ($allCities as $key => $value) {
  $cities[$value] = getAllspots($value);
  // echo var_dump($cities[$value]);
}



?>

<!DOCTYPE html>
<html lang="en">

<head>
  <!-- ======= Head Links ======= -->
  <?php include("sections/headLinks.php") ?>
  <!-- End Head Links -->


  <style>
    #main {
      width: 100%;
    }

    #footer {
      width: 100%;
    }
  </style>
</head>

<body>

  <!-- ======= Header ======= -->
  <header id="header" class="fixed-top ">
    <?php include("sections/header.php") ?>
  </header>

  <!-- End Header -->



  <!-- ======= Hero Section ======= -->

  <!-- End Hero -->

  <main id="main">
    <?php if (isset($_SESSION['user']['username'])) { ?>
      <?php include("sections/hero.php") ?>
      <?php include('sections/map.php') ?>
      <?php include("sections/cta.php") ?>
      <?php include("sections/aboutUs.php") ?>

      <?php include("sections/counts.php") ?>
      <?php include("sections/listings.php") ?>
      <?php include("sections/faq.php") ?>
      <?php include("sections/contact.php") ?>
    <?php } else { ?>
      <?php header("Location: " . BASE_URL . "signin.php"); ?>
    <?php } ?>








  </main><!-- End #main -->


  <!-- ======= Footer Section ======= -->
  <?php include("sections/footer.php") ?>
  <!-- End Footer -->


</body>

</html>