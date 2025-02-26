var today = new Date();
let elmA = document.getElementById("sideA");
let elmSD = document.getElementById("switchDate");
let elmB = document.getElementById("sideB");
switchDate = new Date(elmSD.textContent);
console.log(switchDate);
console.log(today);
if (today < switchDate) {
	elmB.remove();
	console.log("Showing sideA");
} else {
	elmA.remove();
	console.log("Showing sideB");
}
elmSD.remove();

const req = new XMLHttpRequest();
req.open("POST", "https://cl.airwait.jp/WCLP/api/external/stateless/reservations?key=Gh821KMxF8MMPmmQUIpycVeNRAXVEd99&storeId=KR00378855&waitTypeId=0001", true);
req.addEventListener("load", function() {
    const res = req.responseText;
    console.log(res);
});
req.send(null);
