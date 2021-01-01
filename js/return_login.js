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
		var encdate = new Date(Number(enc.substr(0,4)), Number(enc.substr(4,2))-1, Number(enc.substr(6,2)));
		encdate.setDate(encdate.getDate()+8);
		var req = new XMLHttpRequest();
		req.open("GET", "https://daikie.github.io/NCPDA/unavailable.txt", true);
		req.onload = function() {
			var htm = "";
			htm += "<h2>西小山クリニック　短期再診予約</h2>";
			htm += "<p>1週間以内に受診され、同じ相談内容で受診される方のための予約ページです。</p>"
			if(chk % 10 == ida[0] && today<encdate) {
				htm += "<p>このページは" + encdate.toLocaleDateString('ja-JP') + "まで使用できます。</p>";
				htm += "<p>受診を希望されている日の3日前の19時から1日前の19時まで予約が可能です。</p>";
				htm += "<h2 id='reserve'><a href='https://airrsv.net/nishicli/calendar?schdlId=s00004880D', target='_blank'>予約ページに行く</a></h2>";
				htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
			} else {
				htm += "<p>このページは有効期限が切れています。</p>";;
				htm += "<br><h2 id='back'><a href='index.html'>戻る</a></h2>";
			}
			document.getElementById("main-content").innerHTML = htm;
		}
		req.send(null);
	} else {
		alert("パラメーターがありません。");
	}
});
