<?php include('./config.php'); ?>

<?php
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $result = mysqli_query($conn, "SELECT * FROM spots WHERE id='$id' LIMIT 1");
    $spot = mysqli_fetch_assoc($result);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    <!-- ======= Head Links ======= -->
    <?php include("sections/headLinks.php") ?>
    <!-- End Head Links -->

    <style>

    </style>
</head>

<body>
    <!-- ======= Header ======= -->
    <header id="header" class="fixed-top header-inner-pages">
        <?php include("sections/headerPages.php") ?>
    </header>
    <!-- End Header -->


    <main id="main">


        <!-- ======= Breadcrumbs ======= -->
        <section id="breadcrumbs" class="breadcrumbs">
            <div class="container">

                <ol>
                    <li><a href="index.php">Home</a></li>
                    <li>Spot Details</li>
                </ol>
                <h2><?php echo $spot['title'] ?></h2>

            </div>
        </section><!-- End Breadcrumbs -->


        <!-- ======= Portfolio Details Section ======= -->
        <section id="portfolio-details" class="portfolio-details">
            <div class="container">

                <div class="row gy-4">

                    <div class="col-lg-8">
                        <div class="portfolio-details-slider swiper">
                            <div class="swiper-wrapper align-items-center">

                                <div class="swiper-slide">
                                    <img src="<?php echo BASE_URL . '/static/images/' . $spot['image']; ?>" class="spot_image" alt="">

                                </div>

                                <div class="swiper-slide">
                                    <img src="<?php echo BASE_URL . '/static/images/' . $spot['image']; ?>" class="spot_image" alt="">

                                </div>


                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="portfolio-info">
                            <h3>Project information</h3>
                            <ul>

                                <li><strong>City</strong>: <?php $spot['city']; ?></li>
                                <li><strong>Approval</strong>:
                                    <?php if ($spot['approved'] == true) { ?> Approved <?php } else { ?> Not Approved <?php } ?>
                                </li>
                                <li><strong>Spot creation date</strong>: <?php echo date("F j, Y ", strtotime($spot["created_at"])); ?></li>
                                <li><strong>Spot update date</strong>: <?php echo date("F j, Y ", strtotime($spot["updated_at"])); ?></li>
                            </ul>
                        </div>
                        <div class="portfolio-description">
                            <h2><?php echo $spot['title'] ?> Description</h2>
                            <p><?php echo $spot['description'] ?></p>
                        </div>
                    </div>

                </div>

            </div>
        </section><!-- End Portfolio Details Section -->

    </main><!-- End #main -->




    <!-- ======= Footer Section ======= -->
    <?php include("sections/footer.php") ?>
    <!-- End Footer -->
    </div>



</body>

</html>