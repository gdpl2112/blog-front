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
 * 获取歌词窗口
 * @param time 当前播放时间，单位毫秒
 * @param nextn 当前句之后最多展示的歌词数
 * @param lyrics 按时间排序的歌词
 * @returns lines 为上一句、当前句及后续句，activeIndex 为当前句下标
 */
export function getNearst(time: number, nextn: number = 3, lyrics: Lyric[]) {
    let currentIndex = -1

    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].timestamp > time) break
        currentIndex = i
    }

    const start = currentIndex > 0 ? currentIndex - 1 : 0
    const end = currentIndex < 0 ? nextn + 1 : currentIndex + nextn + 1

    return {
        lines: lyrics.slice(start, end),
        activeIndex: currentIndex < 0 ? 0 : currentIndex - start
    }
}
