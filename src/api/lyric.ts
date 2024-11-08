// 定义歌词数据类型
type Lyric = {
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