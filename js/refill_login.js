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
		frmdate.setDate(frmdate.getDate()+14);
		duedate.setMonth(duedate.getMonth()+2);

		var req = new XMLHttpRequest();
		req.open("GET", "https://daikie.github.io/NCPDA/unavailable.txt", true);
		req.onload = function() {
			var htm = "";
			htm += "<h2>西小山クリニック　常用薬再診予約</h2>";
			htm += "<p>普段ご使用の薬を続けて処方してもらいたい方のための予約ページです。</p>";
			htm += "<p>このページは<font color=#00f>"+frmdate.getFullYear()+"年"+(frmdate.getMonth()+1)+"月"+frmdate.getDate()+"日から";
			htm += duedate.getFullYear()+"年"+(duedate.getMonth()+1)+"月"+duedate.getDate()+"日まで</font>使用できます。</p>";
			duedate.setDate(duedate.getDate()+1);
			if(chk % 10 == ida[0] && today>=frmdate && today<=duedate) {
				htm += "<p>ご希望受診日の<font color=#f00>3日前19時から前日19時まで</font>予約が可能です。</p>";
				htm += "<h2 id='reserve'><a href='https://airrsv.net/nishicli/calendar?schdlId=s00004880D', target='_blank'>予約ページに行く</a></h2>";
				htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
			} else {
				htm += "<p>受付期間外です。";
				htm += "<br>期間内にも関わらず予約ページが表示されない場合は更新ボタンを押してください。</p>";
				htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
			}
			document.getElementById("main-content").innerHTML = htm;
		}
		req.send(null);
	} else {
		alert("パラメーターがありません。");
	}
});
