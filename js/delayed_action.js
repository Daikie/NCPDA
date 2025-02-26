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

const dat = {
        'url' : 'https://airwait.jp/WCSP/api/20160600/external/stateless/store/getWaitInfo?key=Gh821KMxF8MMPmmQUIpycVeNRAXVEd99&storeId=KR00378855',
        'type' : 'GET',
    }
const req = new XMLHttpRequest();
req.open("GET", "https://airwait.jp/WCSP/api/20160600/external/stateless/store/getWaitInfo?key=Gh821KMxF8MMPmmQUIpycVeNRAXVEd99&storeId=KR00378855", true);
req.addEventListener("load", function() {
    const res = req.responseText;
    console.log(res);
});
req.send(null);
