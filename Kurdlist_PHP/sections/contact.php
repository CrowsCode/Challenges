<?php

?>


<link rel="stylesheet" href="./includes/leaflet/leaflet.css" />
<script src="./includes/leaflet/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<style>
   #mapContact {
        height: 60vh;
        width: 50%;
    }
</style>
<!-- ======= Contact Section ======= -->
<section id="contact" class="contact">
  <div class="container">

    <div class="section-title">
      <h2>Contact</h2>
      <p></p>
    </div>
  </div>

  <div class="d-flex justify-content-center">
  <div id="mapContact"></div>
 </div>

  <div class="container">



        <div class="info d-flex justify-content-between align-items-baseline">
       

          <div class="address">
            <i class="ri-map-pin-line"></i>
            <h4>Location:</h4>
            <p>Block 1 Dormitory, Koya City, Erbil, Kurdistan</p>
          </div>

          <div class="email">
            <i class="ri-mail-line"></i>
            <h4>Email:</h4>
            <p>Balen.00001006@gmail.com</p>
            <p>Amir.00837136@gmail.com</p>
          </div>

          <div class="phone">
            <i class="ri-phone-line"></i>
            <h4>Call:</h4>
            <p>0750 197 7082</p>
            <p>0751 136 1819</p>
          </div>
       
      </div>



  </div>
</section><!-- End Contact Section -->

<script>
        $(function() {

            let mapOptions = {
                center: [36.09920258740333,44.65265838205292],
                zoom: 17
            }


            let map = new L.map('mapContact', mapOptions);

            L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            map.attributionControl.setPrefix(false);
            var icon = L.icon({
                        iconUrl: 'https://previews.123rf.com/images/gigisomplak/gigisomplak1709/gigisomplak170900646/86257203-funny-cat-face-at-transparent-effect-background.jpg',
                        iconSize: [50, 50]
                    });
                    marker = new L.marker([36.09920258740333,44.65265838205292],{
                        draggable: false,
                        icon: icon
                    });
    
            map.addLayer(marker);

        })
    </script>