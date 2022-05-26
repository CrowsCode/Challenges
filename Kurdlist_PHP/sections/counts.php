<?php
//$allCities 
$cities = [];
foreach ($allCities as $key => $value) {
  $cities[$value] = getAllspots($value);
  // echo var_dump($cities[$value]);
}

?>
<!-- ======= Counts Section ======= -->
<section id="counts" class="counts">
  <div class="container">

    <div class="text-center title">
      <h3>All Added Travel Spots</h3>
      <p>ژمارەی شوێنە گەشتیاریە زیادکراوەکان بە پێی شار</p>
    </div>

    <div class="row counters position-relative">
      <?php foreach ($allCities as $key => $value) { ?>
        <div class="col-lg-4 col-6 text-center">
          <span data-purecounter-start="0" data-purecounter-end="<?php echo count($cities[$value]) ?>" data-purecounter-duration="3" class="purecounter"></span>
          <p><?php echo  $value ?></p>
        </div>
      <?php } ?>



    </div>

  </div>
</section><!-- End Counts Section -->