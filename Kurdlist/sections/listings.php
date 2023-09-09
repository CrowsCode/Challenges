<?php
//$allCities 
$cities = [];
foreach ($allCities as $key => $value) {
  $cities[$value] = getAllspots($value);
  // echo var_dump($cities[$value]);
}

?>

<section id="listings" class="portfolio">
  <div class="container">

    <div class="section-title">
      <h2>listings</h2>
      <p>لیستی شوێنە گەشتیاری کانی هەر ٥ پارێزگاکەی کوردستانی باشوور</p>
    </div>

    <div class="row">
      <div class="col-lg-12 d-flex justify-content-center">
        <ul id="portfolio-flters">
          <li data-filter="*" class="filter-active">All</li>
          <?php foreach ($allCities as $key => $value) { ?>
            <li data-filter=".filter-<?php echo $value ?>"><?php echo $value ?></li>
          <?php } ?>
        </ul> 
      </div>
    </div>

    <div class="row portfolio-container">

      <?php foreach ($allCities as $key => $city) { ?>
        <?php for ($i = 0; $i < count($cities[$city]); $i++) { ?>
          <div class="col-lg-4 col-md-6 portfolio-item filter-<?php echo $cities[$city][$i]["city"] ?>">
            <img src="<?php echo BASE_URL . '/static/images/' . $cities[$city][$i]["image"]; ?>" class=" img-fluid" alt="">
            <div class="portfolio-info">
              <h4><?php echo $cities[$city][$i]["title"] ?></h4>
              <p><?php echo $cities[$city][$i]["description"] . substr(0, 20) . "..." ?></p>
              <a href="<?php echo BASE_URL . '/static/images/' . $cities[$city][$i]["image"]; ?>" 
              data-gallery="portfolioGallery" class="portfolio-lightbox preview-link" title="<?php echo $cities[$city][$i]["title"] ?>"><i class="bx bx-plus"></i></a>
              <a href="single_spot.php?id=<?php echo $cities[$city][$i]["id"] ?>" class="details-link" title="More Details"><i class="bx bx-link"></i></a>
            </div>
          </div>

        <?php } ?>
      <?php } ?>

    </div>

  </div>
</section><!-- End Portfolio Section -->