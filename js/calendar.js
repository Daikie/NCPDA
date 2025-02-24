const weeks = ['日', '月', '火', '水', '木', '金', '土'];
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const todayStr = String(year + "-" + ("00" + month).slice(-2) + "-" + ("00" + date.getDate()).slice(-2));
const config = {
    show: 2,
}

function showCalendar(year, month, halfList, offList, todayStr) {
    for ( i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month, halfList, offList, todayStr);
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

function createCalendar(year, month, halfList, offList, todayStr) {
    const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
    const endDate = new Date(year, month,  0); // 月の最後の日を取得
    const endDayCount = endDate.getDate(); // 月の末日
    const lastMonthEndDate = new Date(year, month - 1, 0); // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
    const startDay = startDate.getDay(); // 月の最初の日の曜日を取得

    let dayCount = 1; // 日にちのカウント
    let calendarHtml = ''; // HTMLを組み立てる変数
    let dateStr; // YYYY-MM-DDの形式の日付

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
                if(d == 0 || d == 3 || offList.includes(dateStr)) {
                    calendarHtml += '<td class="off">' + dayCount + '</td>';
                } else if(d == 5 || d == 6 || halfList.includes(dateStr)) {
                    calendarHtml += '<td class="half">' + dayCount + '</td>';
                } else if(todayStr == dateStr) {
                    calendarHtml += '<td class="today">' + dayCount + '</td>';
                } else {
                    calendarHtml += '<td>' + dayCount + '</td>';
                }
                dayCount++;
            }
        }
        calendarHtml += '</tr>';
    }
    calendarHtml += '</table>';

    return calendarHtml;
}

// 祝日
let offArr = [];
let halfArr = [];
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
            if (cellsC[1] == "w" && cellsC[2] == "-") {
                if (cellsC[0].length > 0){
                    offArr.push(cellsC[0]);
                }
            } else {
                if (cellsC[0].length > 0){
                    halfArr.push(cellsC[0]);
                }
            }
        }
        showCalendar(year, month, halfArr, offArr, todayStr);
    });
    reqC.send(null);
});
reqH.send(null);

