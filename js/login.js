window.addEventListener("load", function(event) {
	var urlParam = location.search.substring(1);
	if(urlParam) {
		var param = urlParam.split('=');
		if(param[0] = "ID") {
			var ida = [];
			for(let i=0; i<param[1].length; i++) {
				ida[i] = Number(param[1].substr(i, 1));
			}
			var enc = String(ida[1]);
			var chk = 0;
			var idb = [];
			idb[0] = ida[1];
			for(let j=1; j<ida.length-1; j++) {
				idb[j] = (idb[j-1] + ida[j+1]) % 10;
				enc = enc.concat(idb[j]);
				chk = chk + Number(ida[j+1]);
			}
		}
		var req = new XMLHttpRequest();
		req.open("GET", "https://daikie.github.io/NCPDA/unavailable.txt", true);
		req.onload = function() {
			var paths = req.responseText.split("\n");
			for(let ln=0; ln<paths.length; ln++) {
				if(enc == paths[ln]) {
					chk = chk + 1;
					break;
				}
			}
			if(enc.length == 8) {
				var today = new Date();
				var encdate = new Date(Number(enc.substr(0,4)), Number(enc.substr(4,2))-1, Number(enc.substr(6,2)));
				encdate.setDate(encdate.getDate()+8);
				var htm = "";
				htm += "<h2>西小山クリニック　ワンタイム予約ページ</h2>";
				htm += "<p>近日中の受診を希望される方のための予約ページです。</p>";
				htm += "<p>このページは<font color=#00f>"+encdate.getFullYear()+"年"+(encdate.getMonth()+1)+"月"+encdate.getDate()+"日まで</font>使用できます。</p>";
				encdate.setDate(encdate.getDate()+1);
				if(chk % 10 == ida[0] && today<=encdate) {
					htm += "<p>ご希望受診日の<font color=#f00>7日前19時から前日19時まで</font>予約が可能です。</p>";
					htm += "<h2 id='reserve'><a href='https://airrsv.net/nishicli/calendar?schdlId=s00008E234', target='_blank'>予約ページに行く</a></h2>";
					htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
				} else {
					htm += "<p>受付期間外です。</p>";
					htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
				}
				document.getElementById("main-content").innerHTML = htm;
			} else {
				let csvArray = [];
				const csvReq = new XMLHttpRequest();
				csvReq.open("GET", "./js/id.csv", true);
				csvReq.onload = function() {
					const csvRes = csvReq.responseText;
					let lines = csvRes.split(/\r\n|\n/);
					for (let k = 0; k < lines.length; k++) {
						let cells = lines[k].split(",");
						if (cells.length != 1) {
							csvArray.push(cells);
						}
					}
					console.log(csvArray[1][1])
					var htm = "";
					htm += "<h2>西小山クリニック　処置予約ページ</h2>";
					htm += "<p>継続的な通院が必要な処置の方のための予約ページです。</p>"
					if(chk % 10 == ida[0]) {
						for(let l = 0; l < csvArray.length; l++) {
							if(enc == Number(csvArray[l][1])) {
								var durt = Number.parseFloat(csvArray[l][3]) + Number.parseFloat(csvArray[l][4]);
								break;
							}
						}
						htm += "<p>ご利用中の処置予約ページは<span class='markR'>カルテ番号" + enc + "の方専用</span>です。</p>";
						htm += "<p>30日後までの予約が可能です。" + durt + "</p>";
						htm += "<p>直前キャンセル、遅延、無断キャンセルが計3回以上生じた場合や、<br>予約システムの乱用が見られた場合は処置予約をご利用になれなくなります。</p>";
						htm += "<h2 id='reserve'><a href='https://airrsv.net/nishicli/calendar?schdlId=s0000234AB', target='_blank'>予約ページに行く</a></h2>";
						htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
					} else {
						htm += "<p>現在処置予約を取得する権限がありません。</p>";
						htm += "<p>原因は以下の可能性があります。</p>";
						htm += "<ul><li>IDの入力間違い</li><li>処置が終了した</li><li>予約の無断キャンセル、複数予約取得などの規約違反</li></ul>";
						htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
					}
					document.getElementById("main-content").innerHTML = htm;
				}
				csvReq.send(null);
			}
		}	
		req.send(null);
	} else {
		alert("パラメーターがありません。");
	}
});
