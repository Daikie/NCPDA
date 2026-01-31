import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyDPWuquS7WZzdRqW4ZAKnsMc4TLXhnv__M",
    authDomain: "checkedin-37ad3.firebaseapp.com",
    databaseURL: "https://checkedin-37ad3-default-rtdb.firebaseio.com",
    projectId: "checkedin-37ad3",
    storageBucket: "checkedin-37ad3.firebasestorage.app",
    messagingSenderId: "187394650062",
    appId: "1:187394650062:web:0b73c121a043c95513859f",
    measurementId: "G-65F9H4TV4K"
  };

// 初期化
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const visitorRef = ref(database, 'visitor_count');

var countPerson = document.getElementById("count-person");
var mo = new MutationObserver(function() {
    if (document.getElementById("count-person").textContent == "待ち人数：--") {
        document.getElementById('visitor-count').innerText = "--";
    }
});
var config = {
  childList: true
};
mo.observe(countPerson, config);

// データが更新されたら自動的に実行される
onValue(visitorRef, (snapshot) => {
    const data = snapshot.val();
    console.log("院内患者数：" + data + "人");
    if (document.getElementById("count-person").textContent == "待ち人数：計算中...") {
        document.getElementById('visitor-count').innerText = "計算中...";
    } else if (document.getElementById("count-person").textContent == "待ち人数：--") {
        document.getElementById('visitor-count').innerText = "--";
    } else {
        document.getElementById('visitor-count').innerText = data || 0;
        document.getElementById('visitor-count').innerText += "人";
    }
    
    // 少しアニメーションさせると「更新された感」が出ます
    const el = document.getElementById('visitor-count');
    el.style.opacity = 0;
    setTimeout(() => el.style.opacity = 1, 100);
});
