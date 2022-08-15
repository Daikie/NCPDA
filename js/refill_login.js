window.addEventListener("load", function(event) {
	var urlParam = location.search.substring(1);
	if(urlParam) {
		var param = urlParam.split('=');
		if(param[0] = "ID") {
			var ida = [];
			for(i=0; i<param[1].length; i++) {
				ida[i] = Number(param[1].substr(i, 1));
			}
			var enc = String(ida[1]);
			var chk = 0;
			var idb = [];
			idb[0] = ida[1];
			for(j=1; j<ida.length-1; j++) {
				idb[j] = (idb[j-1] + ida[j+1]) % 10;
				enc = enc.concat(idb[j]);
				chk = chk + Number(ida[j+1]);
			}
		}
		var today = new Date();
		var frmdate = new Date(Number(enc.substr(0,4)), Number(enc.substr(4,2))-1, Number(enc.substr(6,2)));
		var duedate = new Date(Number(enc.substr(0,4)), Number(enc.substr(4,2))-1, Number(enc.substr(6,2)));
		frmdate.setDate(frmdate.getDate());
		duedate.setMonth(duedate.getMonth()+2);
		if (enc.length == 8) {	// Old Advance
			var grade = 0;
		} else {				// Novel Advance
			var grade = enc.substr(8,1);
		}
		
		var req = new XMLHttpRequest();
		req.open("GET", "https://daikie.github.io/NCPDA/unavailable.txt", true);
		req.onload = function() {
			var htm = "";
			htm += "<h2>西小山クリニック　アドバンス再診予約</h2>";
			htm += "<p>数日前から予約を取得されたい方のための予約ページです。</p>";
			if(chk % 10 == ida[0]) {
				htm += "<p>この予約ページの有効期間：<font color=#00f><br>"
				// htm += frmdate.getFullYear()+"年"+(frmdate.getMonth()+1)+"月"+frmdate.getDate()+"日から<br>";
				htm += duedate.getFullYear()+"年"+(duedate.getMonth()+1)+"月"+duedate.getDate()+"日まで</font></p>";
				duedate.setDate(duedate.getDate()+1);
				if(today <= duedate) {
					htm += "<p>予約受付期間：<br>"
					htm += "ご希望受診日の<font color=#f00>3日前19時から</font><br>";
					htm += "ご希望受診日の<font color=#f00>前日19時まで</font>";
					if(grade == 0) {
						htm += "<h2 id='reserve'><a href='https://airrsv.net/nishicli/calendar?schdlId=s00004880D', target='_blank'>予約ページに行く</a></h2>";
					} else if(grade == 1) {
						htm += "<h2 id='reserve'><a href='https://airrsv.net/nishicli/calendar?schdlId=s0000752D1', target='_blank'>予約ページに行く</a></h2>";
					} else if(grade == 2) {
						htm += "<h2 id='reserve'><a href='https://airrsv.net/nishicli/calendar?schdlId=s0000752F0', target='_blank'>予約ページに行く</a></h2>";
					}
					htm += "<p>※予約が埋まり次第受付終了となります。</p>"
					htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
				} else {
					htm += "<p>受付期間外です。";
					htm += "<br>期間内にも関わらず予約ページが表示されない場合は更新ボタンを押してください。</p>";
					htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
				}
			} else {
				htm += "<p>パラメーターの指定が間違っています。";
				htm += "<br>QRコードの再読み込みをお願いします。</p>";
				htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
			}
			document.getElementById("main-content").innerHTML = htm;
		}
		req.send(null);
	} else {
		alert("パラメーターがありません。");
	}
});
