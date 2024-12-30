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