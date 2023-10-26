(function() {
	const buttonV = document.getElementById("verify");
	const selectY = document.getElementById("brth-y")
	const selectM = document.getElementById("brth-m")
	const selectD = document.getElementById("brth-d")
	const today = new Date();

	async function $sha256(text){
    	const uint8  = new TextEncoder().encode(text)
    	const digest = await crypto.subtle.digest('SHA-256', uint8)
    	return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
	}

	let csvArray = [];
	const req = new XMLHttpRequest();
	req.addEventListener("load", (event) => {
		const res = event.target.responseText;
		let lines = res.split(/\r\n|\n/);
		for (let i = 0; i < lines.length; i++) {
			let cells = lines[i].split(",");
			if (cells.length != 1) {
				csvArray.push(cells);
			}
		}
	});
	req.open("GET", "./js/id.csv", true);
	req.send();
	
	function $verify(){
		const msg = document.getElementById("msg");
		msg.innerHTML = "";
		const nameInput = document.getElementById("name");
		let name = nameInput.value;
		if(name == "") {
			msg.innerHTML = '<span class="markR">お名前をひらがな又はカタカナで入力してください。</span>';
		}
		name = name.normalize("NFKC");
		name = name.replace(/[ぁ-ん]/g, function(s) {
			return String.fromCharCode(s.charCodeAt(0) + 0x60);
		});
		name = name.replace(/\s+/g, "");

		brth = selectY.value + ("0" + selectM.value).slice(-2) + ("0" + selectD.value).slice(-2);
		if(selectY.value == today.getFullYear() && selectM.value == today.getMonth() + 1 && selectD.value == today.getDate()) {
			msg.innerHTML = '<p><span class="markR">生年月日を選択してください。</span></p>';
		}
		$sha256(name + brth).then(hash => {
			for(let j = 0; j < csvArray.length; j++) {
				if(hash == csvArray[j][0]) {
					var durt = Number.parseFloat(csvArray[j][3]) + Number.parseFloat(csvArray[j][4]);
					var skip = Number.parseInt(csvArray[j][5]);
					console.log(durt, skip);
					const icon = '<svg viewBox="0 0 16 16" class="bi bi-calendar-check" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path fill-rule="evenodd" d="M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"/></svg>'
					if(durt < 560) {
						msg.innerHTML = '<p>カルテ番号：' + csvArray[j][1] + '</p><h2 id="reserve"><a href="https://airrsv.net/nishicli/calendar?schdlId=s000093FF0" target="_blank">' + icon + '再診予約</a></h2>';
					} else {
						if(skip < 3 && durt < 720) {
							msg.innerHTML = '<p>カルテ番号：' + csvArray[j][1] + '</p><h2 id="reserve"><a href="https://airrsv.net/nishicli/calendar?schdlId=s00008E234" target="_blank">' + icon + '再診予約</a></h2>';
						} else {
							msg.innerHTML = '<p>カルテ番号：' + csvArray[j][1] + '</p><h2 id="reserve"><a href="https://airrsv.net/nishicli/calendar?schdlId=s000093FF2" target="_blank">' + icon + '再診予約</a></h2>';
						}
					}
					break;
				} else {
					msg.innerHTML = '<p><span class="markR">当院カルテから見つかりませんでした。</span>お名前・生年月日が正しく入力されていることを確認して再度ボタンを押してください。</p>';
				}
			}
		});
	}

	let i;
	function $setYear() {
		for(i = today.getFullYear(); i >= 1900; i--) {
			let op = document.createElement("option");
			op.value = i;
			op.text = i;
			selectY.appendChild(op);
		}
	}
	function $setMonth() {
		for(i = 1; i <= 12; i++) {
			let op = document.createElement("option");
			op.value = i;
			op.text = i;
			selectM.appendChild(op);
		}
	}
	function $setDay() {
		let children = selectD.children;
		while(children.length) {
			children[0].remove();
		}
		if(selectY.value !== "" && selectM.value !== "") {
			const lastDay = new Date(selectY.value, selectM.value, 0).getDate();
			for(i = 1; i <= lastDay; i++) {
				let op = document.createElement("option");
				op.value = i;
				op.text = i;
				selectD.appendChild(op);
			}
		}
	}
	
	window.onload = function() {
		buttonV.addEventListener("click", $verify);

		$setYear();
		$setMonth();
		$setDay();
		selectM.value = today.getMonth() + 1;
		selectD.value = today.getDate();
		selectY.addEventListener("change", $setDay);
		selectM.addEventListener("change", $setDay);
	}
})();
