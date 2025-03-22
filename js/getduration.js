function waitApi(ms) {
	return new Promise(function(resolve) {
		setTimeout(resolve, ms);
	});
}

function showStatus(l, t, amSmin, amLmin, pmSmin, pmLmin, avgDur) {
	var urlParam = location.search
	console.log(urlParam);
	if (urlParam !== "") {
		var param = urlParam.substring(1).split('&');
		t = Number(param[0].split('=')[1]);
		l = Number(param[1].split('=')[1]);
	}
	console.log("現在待ち人数：" + l);
	console.log("現在時刻(分)：" + t);
	if(t < amSmin) {			// 午前開始前
		rest = "--";
		console.log("Befor AM");
	} else if(t < amLmin) {		// 午前終了前
		if (l == -1) {			// 待ち人数表示されない
			rest = "e";
			console.log("No data");
		} else if (l == -2) {
			rest = "--";
			console.log("Stop");
		} else {
			rest = Math.floor((amLmin - t) * 60 / avgDur) - l;
			console.log("AM");
		}
	} else if(t < pmSmin) {		// 午後開始前
		rest = "--";
		console.log("Befor PM");
	} else if (t < pmLmin) {	// 午後終了前
		if (l == -1) {			// 待ち人数表示されない
			rest = "e";
			console.log("No data");
		} else if (l == -2) {
			rest = "--";
			console.log("Stop");
		} else {
			rest = Math.floor((pmLmin - t) * 60 / avgDur) - l;
			console.log("PM");
		}
	} else {
		rest = "--";
		console.log("After PM");
	}
	
	console.log("現在残り：" + rest);
	if (rest == "--") {
		document.getElementById("count-group").textContent = "待ち組数：--";
		document.getElementById("count-person").textContent = "待ち人数：--";
		document.getElementById("max-calling").textContent = "通知済み：--";
		document.getElementById("count-rest").innerHTML = "--";
	} else if (rest == "e") {
		// document.getElementById("count-group").textContent = "待ち組数：計算中...";
		// document.getElementById("count-person").textContent = "待ち人数：計算中...";
		// document.getElementById("max-calling").textContent = "通知済み：計算中...";
		document.getElementById("count-rest").innerHTML = "計算中...";
		queue = document.getElementById("queue");
		queue.getElementsByTagName("a")[0].setAttribute("href", "tel:03-3791-5761");
		queue.getElementsByTagName("a")[0].setAttribute("class", "active");
		queue.innerHTML = queue.innerHTML.replace("順番受付停止中", "電話で問い合わせ");
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

window.addEventListener("DOMContentLoaded", function(event) {
	// 営業日
	const reqB = new XMLHttpRequest();
	let csvArrayB = [];
	reqB.open("GET", "./js/bd.csv", true);
	reqB.addEventListener("load", function() {
		const resB = reqB.responseText;
		let linesB = resB.split(/\r\n|\n/);
		for (let ib = 0; ib < linesB.length; ib++) {
			let cellsB = linesB[ib].split(",");
			if (cellsB.length != 1) {
				csvArrayB.push(cellsB);
			}
		}
		// 祝日
		const reqH = new XMLHttpRequest();
		let csvArrayH = [];
		reqH.open("GET", "./js/hd.csv", true);
		reqH.addEventListener("load", function() {
			const resH = reqH.responseText;
			let linesH = resH.split(/\r\n|\n/);
			for (let ih = 0; ih < linesH.length; ih++) {
				let cellsH = linesH[ih].split(",");
				if (cellsH.length != 1) {
					csvArrayH.push(cellsH);
				}
			}
			// 臨時休業日
			const reqC = new XMLHttpRequest();
			let csvArrayC = [];
			reqC.open("GET", "./js/cd.csv", true);
			reqC.addEventListener("load", function() {
				const resC = reqC.responseText;
				let linesC = resC.split(/\r\n|\n/);
				for (let ic = 0; ic < linesC.length; ic++) {
					let cellsC = linesC[ic].split(",");
					if (cellsC.length != 1) {
						if (cellsC[0] != "*") {		// コメント行スキップ
							csvArrayC.push(cellsC);
						}
					}
				}
				var today = new Date();
				today.setHours(0, 0, 0);
				var year = today.getFullYear();
		      	var month = today.getMonth() + 1;
		      	var day = today.getDate();
		      	var todaystr = year + "-" + ("00" + month).slice(-2) + "-" + ("00" + day).slice(-2);
				var weekday = today.getDay();
				var youbi = "日月火水木金土".slice(weekday, weekday + 1);
				var cdate;
				var cmonth;
		      	var cday;
		      	var cweekday;
		      	var cyoubi;
		      	var udate;
				var umonth;
		      	var uday;
		      	var uweekday;
		      	var uyoubi;
				let elmA = document.getElementById("sideA");
				let elmB = document.getElementById("sideB");
				let elmC = document.getElementById("sideC");
				var switchA = false;
				var switchB = false;
				for(let jc = 0; jc < csvArrayC.length; jc++) {
					cdate = new Date(csvArrayC[jc][0]);
					cmonth = cdate.getMonth() + 1;
					cday = cdate.getDate();
					cweekday = cdate.getDay();
					cyoubi = "日月火水木金土".slice(cweekday, cweekday + 1);
					if (csvArrayC[jc][1] == "s") {	// 夏季休業
						udate = new Date(csvArrayC[jc][2]);
						if (udate >= today) {
							console.log(csvArrayC[jc][0] + "～" + csvArrayC[jc][2] + "夏季休業");
							udate = new Date(csvArrayC[jc][2]);
							umonth = udate.getMonth() + 1;
							uday = udate.getDate();
							uweekday = udate.getDay();
							uyoubi = "日月火水木金土".slice(uweekday, uweekday + 1);
							elmC.innerHTML += '<h3>夏季休業：</h3>';
							elmC.innerHTML += '<h3>&emsp;<span class="markR">' + cmonth + '月' + cday + '日(' + cyoubi + ')～' + umonth + '月' + uday + '日(' + uyoubi + ')</span></h3>';
						}
					} else if (csvArrayC[jc][1] == "n") {	// 年末年始休業
						udate = new Date(csvArrayC[jc][2]);
						if (udate >= today) {
							console.log(csvArrayC[jc][0] + "～" + csvArrayC[jc][2] + "年末年始休業");
							udate = new Date(csvArrayC[jc][2]);
							umonth = udate.getMonth() + 1;
							uday = udate.getDate();
							uweekday = udate.getDay();
							uyoubi = "日月火水木金土".slice(uweekday, uweekday + 1);
							elmC.innerHTML += '<h3>年末年始休業：</h3>';
							elmC.innerHTML += '<h3>&emsp;<span class="markR">' + cmonth + '月' + cday + '日(' + cyoubi + ')～' + umonth + '月' + uday + '日(' + uyoubi + ')</span></h3>';
						}
					} else if (cdate >= today) {
						if (cmonth < month + 2) {	// 来月までの臨時休業・時間変更を表示
							if (csvArrayC[jc][2] == "-") {	// 臨時休業
								if (switchA == false) {
									elmA.innerHTML += '<h3>臨時休業：</h3>';
								}
								if(csvArrayC[jc][1] == "a") {
									console.log(csvArrayC[jc][0] + "午前休診");
									elmA.innerHTML += '<h3>&emsp;<span class="markB">' + cmonth + '月' + cday + '日(' + cyoubi + ')午前</span></h3>';
								} else if(csvArrayC[jc][1] == "p") {
									console.log(csvArrayC[jc][0] + "午後休診");
									elmA.innerHTML += '<h3>&emsp;<span class="markB">' + cmonth + '月' + cday + '日(' + cyoubi + ')午後</span></h3>';
								} else if(csvArrayC[jc][1] == "w") {
									console.log(csvArrayC[jc][0] + "終日休診");
									elmA.innerHTML += '<h3>&emsp;<span class="markR">' + cmonth + '月' + cday + '日(' + cyoubi + ')終日</span></h3>';
								}
								switchA = true;
							} else {						// 時間変更
								if (switchB == false) {
									elmB.innerHTML += '<h3>時間変更：</h3>';
								}
								if(csvArrayC[jc][1] == "a") {
									console.log(csvArrayC[jc][0] + "午前" + csvArrayC[jc][2] + "～" + csvArrayC[jc][3]);
									elmB.innerHTML += '<h3>&emsp;<span class="markB">' + cmonth + '月' + cday + '日(' + cyoubi + ')午前' + csvArrayC[jc][2] + "～" + csvArrayC[jc][3] + '</span></h3>';
								} else if(csvArrayC[jc][1] == "p") {
									console.log(csvArrayC[jc][0] + "午後" + csvArrayC[jc][2] + "～" + csvArrayC[jc][3]);
									elmB.innerHTML += '<h3>&emsp;<span class="markB">' + cmonth + '月' + cday + '日(' + cyoubi + ')午後' + csvArrayC[jc][2] + "～" + csvArrayC[jc][3] + '</span></h3>';
								}
								switchB = true;
							}
						}
					}
				}
				if (switchA == false) {	// 臨時休業なし
					elmA.innerHTML += '<h3>臨時休業：なし</h3>';
				}
				if (switchB == false) {	// 時間変更なし
					elmB.innerHTML += '<h3>時間変更：なし</h3>';
				}
				
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
					var t = today.getHours() * 60 + today.getMinutes();
					var rest;
					for (let j = 0; j < csvArray.length; j++) {
						if (csvArray[j][1] == 1) {
							avgDur = csvArray[j][3];
						}
					}
					console.log(avgDur + "秒");
					min = String(Math.floor(avgDur / 60));
					sec = String(Math.floor(avgDur - min * 60));
					var amStart = "-";
					var amLast = "-";
					var pmStart = "-";
					var pmLast = "-";
					var amSmin = 570;
					var amLmin = 570;
					var pmSmin = 930;
					var pmLmin = 930;
					var amLimit, pmLimit;
					// 営業日を反映
					for (let k = 0; k < csvArrayB.length; k++) {
						if (csvArrayB[k][0] == weekday) {
							if (csvArrayB[k][2] == "a") {
								amStart = csvArrayB[k][3];
								amLast = csvArrayB[k][4];
							} else {
								pmStart = csvArrayB[k][3];
								pmLast = csvArrayB[k][4];
							}
						}
					}
					// 祝日を反映
					for (let m = 0; m < csvArrayH.length; m++) {
						if (csvArrayH[m][0] == todaystr) {
							amStart = "-";
							amLast = "-";
							pmStart = "-";
							pmLast = "-";
						}
					}
					// 臨時休業日を反映
					for (let n = 0; n < csvArrayC.length; n++) {
						if (csvArrayC[n][0] == todaystr) {
							if (csvArrayC[n][1] == "a") {
								amStart = csvArrayC[n][2];
								amLast = csvArrayC[n][3];
							} else if (csvArrayC[n][1] == "p"){
								pmStart = csvArrayC[n][2];
								pmLast = csvArrayC[n][3];
							} else if (csvArrayC[n][1] == "w"){
								amStart = csvArrayC[n][2];
								amLast = csvArrayC[n][3];
								pmStart = csvArrayC[n][2];
								pmLast = csvArrayC[n][3];
							}
						}
						// 夏季休業、年末年始休業を繁栄
						if (csvArrayC[n][1] == "s" || csvArrayC[n][1] == "n") {
							cdate = new Date(csvArrayC[n][0]);
							udate = new Date(csvArrayC[n][2]);
							if (today >= cdate && today <= udate) {
								amStart = "-";
								amLast = "-";
								pmStart = "-";
								pmLast = "-";
							}
						}
					}
					
					if (amStart == "-") {
						amLimit = "-";
					} else {
						amSmin = Number(amStart.split(":")[0]) * 60 + Number(amStart.split(":")[1]);
						amLmin = Number(amLast.split(":")[0]) * 60 + Number(amLast.split(":")[1]);
						amLimit = Math.floor((amLmin - amSmin) * 60 / avgDur) + 3;
						amLimit = amLimit + "人";
						console.log("午前開始：" + amSmin);
						console.log("午前終了：" + amLmin);
						console.log("午前残り" + amLimit);
					}
					if (pmStart == "-") {
						pmLimit = "-";
					} else {
						pmSmin = Number(pmStart.split(":")[0]) * 60 + Number(pmStart.split(":")[1]);
						pmLmin = Number(pmLast.split(":")[0]) * 60 + Number(pmLast.split(":")[1]);
						pmLimit = Math.floor((pmLmin - pmSmin) * 60 / avgDur) + 3;
						pmLimit = pmLimit + "人";
						console.log("午後開始：" + pmSmin);
						console.log("午後終了：" + pmLmin);
						console.log("午後残り" + pmLimit);
					}
					
					document.getElementById("today").innerHTML = month + "/" + day + youbi;
					document.getElementById("duration").innerHTML = min + "分" + sec + "秒";
					document.getElementById("am-start").innerHTML = amStart;
					document.getElementById("am-last").innerHTML = amLast;
					document.getElementById("pm-start").innerHTML = pmStart;
					document.getElementById("pm-last").innerHTML = pmLast;
					document.getElementById("am-limit").innerHTML = amLimit;
					document.getElementById("pm-limit").innerHTML = pmLimit;
					var countPerson;
					var l
					countPerson = document.getElementById("count-person").textContent;
					console.log("1回目：", countPerson);
					if (countPerson == "待ち人数：計算中...") {		// 待ち人数表示されない
						waitApi(1500).then(function () {
							countPerson = document.getElementById("count-person").textContent;
							console.log("2回目：", countPerson);
							if (countPerson == "待ち人数：計算中...") {
								l = -1;
								showStatus(l, t, amSmin, amLmin, pmSmin, pmLmin, avgDur);
							} else if (countPerson == "待ち人数：-") {		// 営業時間外
								l = -2;
								showStatus(l, t, amSmin, amLmin, pmSmin, pmLmin, avgDur);
							} else {										// 待ち人数表示中
								l = countPerson.replace(/[^0-9]/g, "");
								showStatus(l, t, amSmin, amLmin, pmSmin, pmLmin, avgDur);
							}	
						});
					} else if (countPerson == "待ち人数：-") {		// 営業時間外
						l = -2;
						showStatus(l, t, amSmin, amLmin, pmSmin, pmLmin, avgDur);
					} else {										// 待ち人数表示中
						l = countPerson.replace(/[^0-9]/g, "");
						showStatus(l, t, amSmin, amLmin, pmSmin, pmLmin, avgDur);
					}	
				});
				req.send(null);
			});
			reqC.send(null);
		});
		reqH.send(null);
	});
	reqB.send(null);
});