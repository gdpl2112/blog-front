import {ElNotification} from "element-plus";

export function toast(msg: string, type = 'error', duration = 2000) {
    ElNotification({
        message: msg,
        type: type,
        duration: duration,
        offset: 80
    })
}

export function formatMsgTime(timespan: number) {
    let dateTime = new Date(timespan)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    let hour = dateTime.getHours()
    let minute = dateTime.getMinutes()
    let millisecond = dateTime.getTime()
    let now = new Date()
    let nowNew = now.getTime()
    let milliseconds = 0
    let timeSpanStr
    milliseconds = nowNew - millisecond
    if (milliseconds <= 1000 * 60) {
        timeSpanStr = '刚刚'
    } else if (1000 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60) {
        timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
    } else if (1000 * 60 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
    } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
    } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
        timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute
    } else {
        timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    }
    return timeSpanStr
}

export function getTimeMs(t: number) {
    let min = 0;
    while (true) {
        if (t >= 60) {
            t -= 60;
            min += 1;
        } else break
    }
    return "0" + min + ":" + (t < 10 ? "0" + t : t)
}