window.addEventListener("load", function(event) {
	let csvArray = [];
	const req = new XMLHttpRequest();
	req.open("GET", "./js/id.csv", true);
	req.onload = function() {
		const res = req.responseText;
		let lines = res.split(/\r\n|\n/);
		for (let i = 0; i < lines.length; i++) {
			let cells = lines[i].split(",");
			if (cells.length != 1) {
				csvArray.push(cells);
			}
		}
		var avgDur;
		var min;
		var sec;
		var am;
		var pm;
		for(let j = 0; j < csvArray.length; j++) {
			if(csvArray[j][1] == 1) {
				avgDur = csvArray[j][3];
			}
		}
		console.log(avgDur + "秒");
		min = String(Math.floor(avgDur / 60));
		sec = String(Math.floor(avgDur - min * 60));
		am = Math.floor(3.5 * 3600 / avgDur);
		document.getElementById("duration").innerHTML += min + "分" + sec + "秒";
		document.getElementById("am").innerHTML += am + "人";
	}
	req.send(null);
});