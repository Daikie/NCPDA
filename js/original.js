(function (global) {
	// Set up a namespace for our utility
	var ajaxUtils = {};
	// Returns an HTTP request object
	function getRequestObject() {
		if (global.XMLHttpRequest) {
			return (new XMLHttpRequest());
		} else if (global.ActiveXObject) { // For very old IE browsers
			return (new ActiveXObject("Microsoft.XMLHTTP"));
		} else {
			global.alert("Ajax is not supported in your browser.");
			return(null);
		}
	}
	// Makes an Ajax GET request to 'requestUrl'
	ajaxUtils.sendGetRequest = function(requestUrl, responseHandler) {
			var request = getRequestObject();
			request.onreadystatechange =
				function() {
					handleResponse(request, responseHandler);
				};
			request.open("GET", requestUrl, true);
			request.send(null);
		}
	// Only calls user provided 'responseHandler' function if response is ready and not an error
	function handleResponse(request, responseHandler) {
		if ((request.readyState == 4) && (request.status == 200)) {
			responseHandler(request);
	 	}
	}
	// Expose utility to the global object
	global.$ajaxUtils = ajaxUtils;
})(window);

document.addEventListener("DOMContentLoaded", function (event) {
	document.querySelector(".btn-success").addEventListener("click", function () {
		document.querySelector(".btn-success").style.display = "none";
		document.querySelector("img").style.display = "none";
		// Call server to get the name
		$ajaxUtils.sendGetRequest("snippet.txt", function (request) {
			var name = request.responseText;
			document.querySelector(".content").innerHTML = name;
			});
		});
	});

