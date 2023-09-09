<?php
?>


<div class="container-fluid">

  <div class="row justify-content-center">
    <div class="col-xl-9 d-flex align-items-center justify-content-lg-between">
      <h1 class="logo me-auto me-lg-0"><a href="index.php">KurdList</a></h1>
      <!-- Uncomment below if you prefer to use an image logo -->
      <!-- <a href="index.html" class="logo me-auto me-lg-0"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

      <nav id="navbar" class="navbar order-last order-lg-0">
        <ul>
          <li><a class="nav-link scrollto active" href="index.php">Home</a></li>

          <?php if (isset($_SESSION['user']['username'])) { ?>
            <li><a class="nav-link" href="./includes/signout.php"><?php echo $_SESSION['user']['username'] ?> Sign Out </a></li>
          <?php } else { ?>
            <li><a class="nav-link" href="./signin.php">Sign in</a></li>
          <?php } ?>

        </ul>
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav><!-- .navbar -->


    </div>
  </div>

</div>