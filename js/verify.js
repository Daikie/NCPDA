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

	let req = new XMLHttpRequest();
	req.open("GET", "https://daikie.github.io/NCPDA/js/id.csv", true);
	req.onload = function() {
		let csvArray = [];
		let lines = req.responseText.split(/\r\n|\n/);
		for (let i = 0; i < lines.length; i++) {
			let cells = lines[i].split(",");
			if (cells.length != 1) {
				csvArray.push(cells);
			}
		}
		console.log(csvArray[0][0]);
		console.log(csvArray[1][1]);
	}
	
	
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
		console.log(name + brth);
		if(selectY.value == today.getFullYear() && selectM.value == today.getMonth() + 1 && selectD.value == today.getDate()) {
			msg.innerHTML = '<span class="markR">生年月日を選択してください。</span>';
		}
		hash = $sha256(name + brth);
		console.log(hash);
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
			console.log(lastDay);
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
