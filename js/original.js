// Close navbar when clicked outside
$(function() {
	$(".navbar-toggler").blur(function(event) {
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$(".navbar-collapse").collapse('hide');
		}
	});
});
