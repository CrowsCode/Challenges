<?php require_once('config.php') ?>

<?php require_once(ROOT_PATH . '/includes/spot_functions.php'); ?>


<?php
if (isset($_POST["city"])) {
    $spots = getAllspots($_POST["city"]);
} else {
    $spots = getAllspots("All");
}





$_SESSION['user']['role'] == "Admin"; //deleteewe
?>


<link rel="stylesheet" href="./includes/leaflet/leaflet.css" />
<script src="./includes/leaflet/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<style>
    #travelspots {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        position: relative;
    }



    #map {
        height: 90vh;
        width: 100%;

    }



    #sidebar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 75vh;

        z-index: 400;
        position: absolute;
        right: 0;
    }



    .menu {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
    }



    .sidebar-options {
        display: flex;
        align-items: center;
        justify-content: space-between;

    }




    .sidebar-header {}




    .sidebar-cards,
    #create-form {
        display: flex;
        flex-direction: column;

        align-items: center;
        gap: 1em;
        overflow-y: scroll;
        height: 60vh;
    }

    #create-form {
        overflow-y: hidden;
        gap: 0.5em;
    }

    /* CONTENT */
    .content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        /* min-height: 60vh; */
        width: 100%;
    }

    .content .content-title {
        margin: 10px 0px;
        color: #374447;
        font-family: 'Averia Serif Libre', cursive;
    }

    .content .spot {
        width: 335px;
        margin: 9px;
        min-height: 320px;
        float: left;
        border-radius: 2px;
        border: 1px solid #b3b3b3;
        position: relative;
    }

    .content .spot .category {
        margin-top: 0px;
        padding: 3px 8px;
        color: #374447;
        background: white;
        display: inline-block;
        border-radius: 2px;
        border: 1px solid #374447;
        box-shadow: 3px 2px 2px;
        position: absolute;
        left: 5px;
        top: 5px;
        z-index: 3;
    }

    .content .spot .category:hover {
        box-shadow: 3px 2px 2px;
        color: white;
        background: #374447;
        transition: .4s;
        opacity: 1;
    }

    .content .spot .spot_image {
        height: 260px;
        width: 100%;

        background-size: 100%;
    }

    .content .spot .spot_image {
        width: 100%;
        height: 260px;
    }

    .content .spot .spot_info {
        height: 100%;
        padding: 0px 5px;
        font-weight: 200;
        font-family: 'Noto Serif', serif;
    }

    .content .spot .spot_info {
        color: #222;
    }

    .content .spot .spot_info span {
        color: #A6A6A6;
        font-style: italic;
    }

    .content .spot .spot_info span.read_more {
        position: absolute;
        right: 5px;
        bottom: 5px;
    }
</style>
</head>

<body>
    <div id="travelspots">


        <div id="map"></div>




        <div id="sidebar">
            <?php
            if ($_SESSION['user']['role'] == "Admin") { ?>
                <div class="menu">
                    <a class="btn btn-info" href="<?php echo BASE_URL . 'spots.php' ?>">Manage Spots</a>
                    <a class="btn btn-info" href="<?php echo BASE_URL . 'users.php' ?>">Manage Users</a>

                </div>

            <?php } ?>
            <br />

            <div id="option-buttons">
                <input value="list" checked type="radio" class="btn-check" name="action" id="action1" autocomplete="off">
                <label class="btn btn-primary" for="action1">List</label>

                <input value="create" type="radio" class="btn-check" name="action" id="action2" autocomplete="off">
                <label class="btn btn-primary" for="action2">Add Spot</label>



            </div>
            <div class="sidebar-header">








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
                            <input readOnly class="form-control" type="text" id="coordinateInput" name="coordinate" value="<?php echo $coordinate; ?>" placeholder="coordinate">
                        </div>
                        <div class="form-group">


                            <input class="form-control" type="file" id="formFile" name="featured_image">

                        </div>
                        <div class="form-group">
                            <textarea class="form-control" name="description" id="description" rows="4"><?php echo $description; ?></textarea>
                        </div>
                        <div class="form-group">
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
                            <button type="submit" name="create_spot" class="form-control btn btn-primary submit px-3">Add Spot</button>
                        </div>



                    </form>



                </section>



                <div id="list">
                    <div class="badge bg-success text-wrap" style="width: 6rem;">
                        filtering by <?php if (isset($_POST["city"])) {
                                            echo $_POST["city"];
                                        }   ?>
                    </div>

                    <form action="index.php#travelspots" method="POST">

                        <select class="form-select" name="city">
                            <option value="All" selected>All Cities</option>
                            <?php for ($i = 0; $i < count($allCities); $i++) : ?>
                                <option value="<?php echo $allCities[$i] ?>"><?php echo $allCities[$i] ?></option>
                            <?php endfor ?>
                        </select>
                        <input class="btn btn-secondary" type="submit" value="filter">
                    </form>



                    <div class="sidebar-cards">
                        <?php foreach ($spots as $spot) : ?>
                            <?php if ($spot["approved"] == "1") : ?>

                                <div class="card" style="width: 24rem;" id="spot-<?php echo $spot['coordinate']; ?>">
                                    <img src=" <?php echo BASE_URL . '/static/images/' . $spot['image']; ?>" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title"><?php echo $spot['title'] ?></h5>
                                        <p class="card-text"><?php echo $spot['description'] . substr(0, 20) . "..." ?></p>
                                        <p class="card-text"><?php echo date('F j, Y ', strtotime($spot['created_at'])); ?></p>
                                        <a href="single_spot.php?id=<?php echo $spot['id']; ?>" class="btn btn-primary">Go</a>
                                    </div>
                                </div>






                            <?php endif ?>
                        <?php endforeach ?>
                    </div>
                </div>



            </div>

        </div>


    </div>

    <script>
        $(function() {

            $("#create").hide();
            $('input[name="action"]').click(function() {
                var val = $(this).attr("value");
                if (val == "create") {
                    $("#create").show();
                    $("#list").hide();
                } else {
                    $("#create").hide();
                    $("#list").show();
                }

            });





            let mapOptions = {
                center: [36, 44],
                zoom: 8
            }


            let map = new L.map('map', mapOptions);

            L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            map.attributionControl.setPrefix(false);
            var marker = new L.marker([51.958, 9.141], {
                draggable: false
            });
            map.addLayer(marker);


            var ss;
            map.on('click', function(e) {
                var coord = e.latlng;
                var lat = coord.lat;
                var lng = coord.lng;
                document.getElementById("coordinateInput").value = lat + ":" + lng;

                if (ss == null) {
                    var icon = L.icon({
                        iconUrl: 'https://previews.123rf.com/images/gigisomplak/gigisomplak1709/gigisomplak170900646/86257203-funny-cat-face-at-transparent-effect-background.jpg',
                        iconSize: [50, 50]
                    });
                    ss = new L.marker([lat, lng], {
                        draggable: true,
                        icon: icon
                    });
                    map.addLayer(ss);
                } else {
                    ss.setLatLng([lat, lng]);
                }


            });








            var passedArray =
                <?php echo json_encode($spots); ?>;

            var popup = L.popup();
            for (let i = 0; i < passedArray.length; i++) {
                if (passedArray[i]["approved"] == "1") {
                    let coordinate = passedArray[i]["coordinate"].split(':')
                    marker = new L.marker([coordinate[0], coordinate[1]]).addTo(map);;


                    popupContent = document.createElement("div");
                    popupContent.onload = function() {
                        marker.openPopup();
                    };
                    popupContent.innerHTML = document.getElementById("spot-" + passedArray[i]["coordinate"]).innerHTML
                    popupContent.style.width = "200px"
                    //popupContent = '<img src="http://c4.staticflickr.com/1/691/21131215939_49601d06ef_b.jpg" />';
                    marker.bindPopup(popupContent, {
                        width: "200px",
                        height: "200px;"
                    });
                    // // map.addLayer(marker);
                    // marker.on('click', function() {
                    //     var win = L.control.window(map, {
                    //             title: 'Hello world!',
                    //             maxWidth: 200,
                    //             modal: true
                    //         })
                    //         .content(document.getElementById("spot-" + passedArray[i]["coordinate"]).innerHTML)
                    //         .prompt({
                    //             callback: function() {
                    //                 alert('This is called after OK click!')
                    //             }
                    //         })
                    //         .show()
                    // });
                }

            }












        })
    </script>