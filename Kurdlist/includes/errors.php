<?php if (count($errors) > 0) : ?>
	<div class="message  text-center">
		<?php foreach ($errors as $error) : ?>
			<p class="text-light bg-danger"><?php echo $error ?></p>
		<?php endforeach ?>
		<p class="bg-info">la regai session error aka hall nagirawa, balku la regai array akai global'waya</p>
	</div>
<?php endif ?>