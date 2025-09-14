const weeks = ['日', '月', '火', '水', '木', '金', '土'];
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const todayStr = String(year + "-" + ("00" + month).slice(-2) + "-" + ("00" + date.getDate()).slice(-2));
const config = {
    show: 2,
}

function showCalendar(year, month, amList, pmList, offList, todayStr) {
    for ( i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month, amList, pmList, offList, todayStr);
        const sec = document.createElement('section');
        sec.innerHTML = calendarHtml;
        document.querySelector('#calendar').appendChild(sec);

        month++;
        if (month > 12) {
            year++;
            month = 1;
        }
    }
}

function createCalendar(year, month, amList, pmList, offList, todayStr) {
    const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
    const endDate = new Date(year, month,  0); // 月の最後の日を取得
    const endDayCount = endDate.getDate(); // 月の末日
    const lastMonthEndDate = new Date(year, month - 1, 0); // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
    const startDay = startDate.getDay(); // 月の最初の日の曜日を取得

    let dayCount = 1; // 日にちのカウント
    let calendarHtml = ''; // HTMLを組み立てる変数
    let dateStr; // YYYY-MM-DDの形式の日付
    let dayTag; // 日にち表示タグ
    calendarHtml += '<h1>' + year  + '年' + month + '月</h1>';
    calendarHtml += '<table>';

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td>' + weeks[i] + '</td>';
    }
    
    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>';
        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1;
                calendarHtml += '<td class="is-disabled">' + num + '</td>';
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount;
                calendarHtml += '<td class="is-disabled">' + num + '</td>';
                dayCount++;
            } else {
                dateStr = String(year + "-" + ("00" + month).slice(-2) + "-" + ("00" + dayCount).slice(-2));
                if (d == 0 || d == 3 || offList.includes(dateStr)) {
                    dayTag = '<span class="off">' + dayCount + '</span>';
                } else if(d == 4 || d == 5 || d == 6 || amList.includes(dateStr)) {
                    dayTag = '<span class="am">' + dayCount + '</span>';
                } else if(pmList.includes(dateStr)) {  
                    dayTag = '<span class="pm">' + dayCount + '</span>';
                } else {
                    dayTag = '<span>' + dayCount + '</span>';
                }
                
                if(todayStr == dateStr) {
                    calendarHtml += '<td class="today">' + dayTag + '</td>';
                } else {
                    calendarHtml += '<td>' + dayTag + '</td>';
                }
                dayCount++;
            }
        }
        calendarHtml += '</tr>';
    }
    calendarHtml += '</table>';

    return calendarHtml;
}

let offArr = [];
let amArr = [];
let pmArr = [];
// 祝日
const reqH = new XMLHttpRequest();
reqH.open("GET", "./js/hd.csv", true);
reqH.addEventListener("load", function() {
    const resH = reqH.responseText;
    let linesH = resH.split(/\r\n|\n/);
    for (let ih = 0; ih < linesH.length; ih++) {
        let cellsH = linesH[ih].split(",");
        if (cellsH[0].length > 0){
            offArr.push(cellsH[0]);
        }
    }
    // 臨時休業日
    const reqC = new XMLHttpRequest();
    reqC.open("GET", "./js/cd.csv", true);
    reqC.addEventListener("load", function() {
        const resC = reqC.responseText;
        let linesC = resC.split(/\r\n|\n/);
        for (let ic = 0; ic < linesC.length; ic++) {
            let cellsC = linesC[ic].split(",");
            if (cellsC.length > 1) {
                if (cellsC[0] != "*") {     // コメント行スキップ
                    if (cellsC[1] == "s" || cellsC[1] == "n") { // 夏季休業、年末年始休業
                        cdate = new Date(cellsC[0]);
                        udate = new Date(cellsC[2]);
                        do {
                            let vy = cdate.getFullYear();
                            let vm = cdate.getMonth() + 1;
                            let vd = cdate.getDate();
                            offArr.push(String(vy + "-" + ("00" + vm).slice(-2) + "-" + ("00" + vd).slice(-2)));
                            cdate.setDate(cdate.getDate() + 1);
                        } while (cdate <= udate);

                    } else if (cellsC[1] == "w" && cellsC[2] == "-") {
                        offArr.push(cellsC[0]);
                    } else if (cellsC[1] == "p" && cellsC[2] == "-") {
                        amArr.push(cellsC[0]);
                    } else if (cellsC[1] == "a" && cellsC[2] == "-") {
                        pmArr.push(cellsC[0]);
                    }
                }
            }
            
        }
        showCalendar(year, month, amArr, pmArr, offArr, todayStr);
    });
    reqC.send(null);
});
reqH.send(null);

