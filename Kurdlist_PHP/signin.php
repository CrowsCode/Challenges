<?php require_once('config.php') ?>

<?php require_once(ROOT_PATH . '/includes/registration_login.php') ?>
<?php require_once(ROOT_PATH . '/includes/admin_functions.php'); ?>
<?php require_once(ROOT_PATH . '/includes/spot_functions.php'); ?>



<?php
if (isset($_SESSION['user']['username'])) {
  header("Location: " . BASE_URL . "index.php");
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

    <section id="hero" class="d-flex flex-column justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-12">
            <h1>KurdList</h1>

            <section class="container" id="auth" class="login">

              <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                  <div class="login-wrap p-0">
                    <h3 class="mb-4 text-center">Sign In</h3>
                    <form action="signin.php" method="post">
                      <?php include(ROOT_PATH . '/includes/errors.php') ?>
                      <div class="form-group">
                        <input type="text" class="form-control" placeholder="Username" required name="username">
                      </div>
                      <div class=" form-group">
                        <input id="password-field" type="password" class="form-control" placeholder="Password" required name="password">
                        <span toggle=" #password-field" class="fa fa-fw fa-eye field-icon toggle-password"></span>
                      </div>
                      <div class="form-group">
                        <button type="submit" name="login_btn" class="form-control btn btn-primary submit px-3">Sign In</button>
                      </div>

                    </form>

                    <div class="social d-flex text-center">
                      <a href="signup.php" class="px-2 py-2 mr-md-1 rounded"><span class="ion-logo-facebook mr-2"></span>Not yet a member? <b>Sign up</b></a>

                    </div>
                  </div>
                </div>
              </div>
            </section>


          </div>
        </div>
      </div>
    </section>


    <?php include("sections/cta.php") ?>
    <?php include("sections/aboutUs.php") ?>

    <?php include("sections/counts.php") ?>
    <?php include("sections/faq.php") ?>
    <?php include("sections/contact.php") ?>









  </main><!-- End #main -->


  <!-- ======= Footer Section ======= -->
  <?php include("sections/footer.php") ?>
  <!-- End Footer -->


</body>

</html>