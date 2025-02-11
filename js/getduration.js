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
		var today = new Date();
		var t = today.getHours() * 60 + today.getMinutes();
		var rest;
		for(let j = 0; j < csvArray.length; j++) {
			if(csvArray[j][1] == 1) {
				avgDur = csvArray[j][3];
			}
		}
		console.log(avgDur + "秒");
		min = String(Math.floor(avgDur / 60));
		sec = String(Math.floor(avgDur - min * 60));
		am = Math.floor(3.5 * 3600 / avgDur);
		pm = Math.floor(3.5 * 3600 / avgDur);
		document.getElementById("duration").innerHTML += min + "分" + sec + "秒";
		document.getElementById("am").innerHTML += am + "人";
		document.getElementById("pm").innerHTML += pm + "人";
		var countPerson = document.getElementById("count-person").textContent;
		var l = countPerson.replace(/[^0-9]/g, "");
		console.log(l);
		if (l == "") {
			rest = "--";
		} else {
			console.log(t);
			if(t < 570) {			// 9:30
				rest = "--";
			} else if(t < 750) {	// 12:30
				rest = Math.floor((750 - t) * 60 / avgDur) - l;
			} else if(t < 930) {	// 15:30
				rest = "--";
			} else if (t < 1110) {	// 18:30
				rest = Math.floor((1110 - t) * 60 / avgDur) - l;
			} else {
				rest = "--";
			}
		}
		console.log(rest);
		if (rest == "--") {
			document.getElementById("count-group").textContent = "待ち組数：--";
			document.getElementById("count-person").textContent = "待ち人数：--";
			document.getElementById("max-calling").textContent = "通知済み：--";
			document.getElementById("count-rest").innerHTML = "--";
		} else if (rest <= 0) {
			document.getElementById("count-group").textContent += "組";
			document.getElementById("count-person").textContent += "人";
			document.getElementById("max-calling").textContent += "番の方まで";
			document.getElementById("count-rest").innerHTML = "残り0人";
		} else {
			document.getElementById("count-group").textContent += "組";
			document.getElementById("count-person").textContent += "人";
			document.getElementById("max-calling").textContent += "番の方まで";
			document.getElementById("count-rest").innerHTML = "残り" + rest + "人";
			queue = document.getElementById("queue");
			queue.getElementsByTagName("a")[0].setAttribute("href", "https://airwait.jp/WCSP/storeDetail?storeNo=AKR9456100837");
			queue.getElementsByTagName("a")[0].setAttribute("class", "active");
			queue.innerHTML = queue.innerHTML.replace("受付停止中", "を取得する");
		}
		
		
	}
	req.send(null);
});