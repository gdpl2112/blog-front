// 定义歌词数据类型
export type Lyric = {
    timestamp: number
    content: string
}

//解析歌词数据
const parseLyrics = (dataStr: string): Lyric[] => {
    const lines = dataStr.split('\n')
    const lyrics: Lyric[] = []

    for (const line of lines) {
        const match = line.match(/\[(\d+):(\d+)\.(\d+)](.+)/)

        if (match) {
            const [, minutes, seconds, ms, content] = match
            // 将时间戳转换为秒
            const timestamp = parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(ms)

            lyrics.push({timestamp, content})
        }
    }

    return lyrics
}

//导出
export default parseLyrics

/**
 * 获取最近的歌词
 * @param time
 * @param nextn
 * @param lyrics
 */
export function getNearst(time: number, nextn: number = 3, lyrics: Lyric[]) {
    //最终返回歌词
    let outs = []
    //匹配到当前时间应的歌词
    let ns = false
    //上一次的歌词
    let ul = null;
    //上上一次的歌词
    let ull = null;

    for (let i = 0; i < lyrics.length; i++) {
        let ee = lyrics[i]
        if (ns) {
            if (outs.length >= (nextn + 2)) {
                break
            }
            outs.push(ee)
        } else {
            if (ee.timestamp > time) {
                ns = true
                if (ull != null) outs.push(ull)
                if (ul != null) outs.push(ul)
                outs.push(ee)
            }
            ull = ul;
            ul = ee;
        }
    }

    return outs
}
