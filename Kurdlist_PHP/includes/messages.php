<?php if (isset($_SESSION['message'])) : ?>
    <div class="container text-center">
        <h3 class="text-light bg-success">
            <?php
            echo $_SESSION['message'];
            unset($_SESSION['message']);
            ?>
        </h3>
    </div>
<?php endif ?>