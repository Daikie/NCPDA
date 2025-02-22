window.addEventListener("load", function(event) {
	// 営業日
	const reqB = new XMLHttpRequest();
	let csvArrayB = [];
	reqB.open("GET", "./js/bd.csv", true);
	reqB.addEventListener("load", function() {
		const resB = reqB.responseText;
		let linesB = resB.split(/\r\n|\n/);
		for (let i = 0; i < linesB.length; i++) {
			let cellsB = linesB[i].split(",");
			if (cellsB.length != 1) {
				csvArrayB.push(cellsB);
				
			}
		}
	});
	reqB.send(null);

	// 臨時休業日
	const reqC = new XMLHttpRequest();
	let csvArrayC = [];
	reqC.open("GET", "./js/cd.csv", true);
	reqC.addEventListener("load", function() {
		const resC = reqC.responseText;
		let linesC = resC.split(/\r\n|\n/);
		for (let i = 0; i < linesC.length; i++) {
			let cellsC = linesC[i].split(",");
			if (cellsC.length != 1) {
				csvArrayC.push(cellsC);
				
			}
		}
		for(let j = 0; j < csvArrayC.length; j++) {
			if(csvArrayC[j][2] == "-") {
				if(csvArrayC[j][1] == "a") {
					console.log(csvArrayC[j][0] + "午前休診");
				} else {
					console.log(csvArrayC[j][0] + "午後休診");
				}
			} else {
				if(csvArrayC[j][1] == "a") {
					console.log(csvArrayC[j][0] + "午前" + csvArrayC[j][2] + "～" + csvArrayC[j][3]);
				} else {
					console.log(csvArrayC[j][0] + "午後" + csvArrayC[j][2] + "～" + csvArrayC[j][3]);
				}
			}
		}
	});
	reqC.send(null);

	// ID
	let csvArray = [];
	const req = new XMLHttpRequest();
	req.open("GET", "./js/id.csv", true);
	req.addEventListener("load", function() {
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
		var amStart;
		var amLast;
		var pmStart;
		var pmLast;
		var amLimit;
		var pmLimit;
		var today = new Date();
		var year = today.getFullYear();
      	var month = today.getMonth()+1;
      	var day = today.getDate();
		var weekday = today.getDay();
		for(let j = 0; j < csvArrayB.length; j++) {
			if(csvArrayB[j][0] == weekday) {
				if(csvArrayB[j][2] == "a") {
					amStart = csvArrayB[j][3];
					amLast = csvArrayB[j][4];
				} else {
					pmStart = csvArrayB[j][3];
					pmLast = csvArrayB[j][4];
				}
			}

		}
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
		amLimit = Math.floor(3.5 * 3600 / avgDur);
		pmLimit = Math.floor(3.5 * 3600 / avgDur);
		document.getElementById("today").innerHTML = year + "年" + month + "月" + day +"日";
		document.getElementById("duration").innerHTML = min + "分" + sec + "秒";
		document.getElementById("am-start").innerHTML = amStart;
		document.getElementById("am-last").innerHTML = amLast;
		document.getElementById("pm-start").innerHTML = pmStart;
		document.getElementById("pm-last").innerHTML = pmLast;
		document.getElementById("am-limit").innerHTML = amLimit + "人";
		document.getElementById("pm-limit").innerHTML = pmLimit + "人";
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
		
		
	});
	req.send(null);
});