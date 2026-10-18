<style scoped>
/* =============================================
   音乐厅：一间只点了一盏灯的屋子
   ============================================= */

.music-room {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap-5);
  min-height: calc(100vh - var(--nav-h) - 250px);
  padding: var(--gap-7) var(--gap-6) var(--gap-6);
  background:
    radial-gradient(90% 70% at 50% 0%, rgba(48, 55, 68, 0.72) 0%, rgba(16, 19, 24, 0.92) 62%, rgba(9, 11, 14, 0.96) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--r-lg);
  box-shadow: 0 44px 90px -50px rgba(6, 9, 14, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px) saturate(140%);
  -webkit-backdrop-filter: blur(30px) saturate(140%);
  overflow: hidden;
}

/* 顶部动作 */
.music-actions {
  position: absolute;
  top: var(--gap-4);
  left: var(--gap-4);
  right: var(--gap-4);
  display: flex;
  justify-content: space-between;
  z-index: 5;
}

.action-group {
  display: flex;
  gap: 6px;
}

.action-icon {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--dur) var(--ease);
}

.action-icon:hover {
  border-color: rgba(255, 255, 255, 0.42);
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
}

/* 主体 */
.music-content {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: var(--gap-7);
  align-items: center;
  width: 100%;
  max-width: 880px;
  padding-top: var(--gap-6);
}

/* 唱片 */
.cover-wrap {
  display: flex;
  justify-content: center;
}

.cover-disc {
  position: relative;
  width: 264px;
  height: 264px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cover-disc::before {
  content: '';
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.cover-disc::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  pointer-events: none;
}

.cover-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.02);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
  transition: transform 0.06s linear;
}

.cover-center-dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--seal);
  box-shadow: 0 0 0 4px rgba(20, 21, 24, 0.9);
}

/* 信息与歌词 */
.info-section {
  min-width: 0;
}

.song-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 2.6vw, 32px);
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.4;
  color: #f4f2eb;
  margin: 0 0 6px;
}

.song-artist {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.42);
  margin: 0 0 var(--gap-5);
}

.lyrics-box {
  max-height: 264px;
  overflow-y: auto;
  padding-right: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: var(--gap-5);
}

.lyrics-box::-webkit-scrollbar {
  width: 3px;
}

.lyrics-box::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.16);
  border: 0;
}

.lyric-line {
  padding: 5px 0;
  font-family: var(--font-display);
  font-size: 15px;
  line-height: 1.75;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: color var(--dur) var(--ease);
}

.lyric-line:hover {
  color: rgba(255, 255, 255, 0.66);
}

.lyric-line.active {
  color: #f4f2eb;
  font-size: 16.5px;
  font-weight: 600;
}

/* 控制条 */
.player-controls {
  width: 100%;
  max-width: 700px;
  padding-top: var(--gap-6);
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-3);
  margin-bottom: var(--gap-5);
}

.ctrl-btn {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.66);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--dur) var(--ease);
}

.ctrl-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}

.ctrl-btn.primary {
  width: 56px;
  height: 56px;
  background: var(--seal);
  border-color: var(--seal);
  color: #fff;
  font-size: 19px;
}

.ctrl-btn.primary:hover {
  background: #d4513c;
  border-color: #d4513c;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: var(--gap-4);
}

.progress-time {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  min-width: 52px;
}

.progress-bar-wrap {
  position: relative;
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.16);
  cursor: pointer;
}

.progress-bar-wrap::before {
  content: '';
  position: absolute;
  inset: -9px 0;
}

.progress-fill {
  height: 100%;
  background: var(--seal);
  transition: width 0.1s linear;
}

/* 房间名 */
.room-name {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.38);
  margin-bottom: var(--gap-3);
}

/* 弹窗内的检索条 */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.search-bar .grow {
  flex: 1;
}

.playlist-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.playlist-menu .btn {
  justify-content: flex-start;
  height: 44px;
  padding: 0 16px;
  font-size: var(--text-sm);
}

:deep(.el-dialog) {
  border-top: 2px solid var(--ink) !important;
}

@media (max-width: 860px) {
  .music-content {
    grid-template-columns: 1fr;
    gap: var(--gap-5);
    padding-top: var(--gap-7);
  }

  .cover-disc {
    width: 200px;
    height: 200px;
  }

  .lyrics-box {
    max-height: 200px;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-left: 0;
    padding-top: var(--gap-3);
  }

  .music-room {
    padding: var(--gap-6) var(--gap-4);
  }
}
</style>

<template>
  <div class="music-room" id="froom">
    <!-- Actions bar -->
    <div class="music-actions">
      <div class="action-group">
        <button class="action-icon" @click="dialogVisible0 = true" title="搜索音乐">
          <i class="bi bi-search"></i>
        </button>
        <button class="action-icon" @click="dialogVisibleList = true" title="切换歌单">
          <i class="bi bi-music-note-list"></i>
        </button>
        <button class="action-icon" @click="createRoom()" title="创建房间">
          <i class="bi bi-plus-circle"></i>
        </button>
        <button class="action-icon" @click="loadRooms(); dialogVisibleRoom = true" title="加入房间">
          <i class="bi bi-people"></i>
        </button>
      </div>
      <div class="action-group">
        <button class="action-icon" @click="togglePlayMode" :title="{'sequence':'顺序播放','random':'随机播放','repeat':'单曲循环'}[playMode]">
          <i :class="{'bi bi-arrow-repeat': playMode==='sequence', 'bi bi-shuffle': playMode==='random', 'bi bi-repeat-1': playMode==='repeat'}"></i>
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="music-content">
      <div class="cover-wrap">
        <div class="cover-disc" @click="togglePlay">
          <img ref="iconImgRef" :src="cover0 || '/icon.jpg'" class="cover-img" alt="cover" />
          <div class="cover-center-dot"></div>
        </div>
      </div>
      <div class="info-section">
        <h1 class="song-title">{{ info.name || '未播放歌曲' }}</h1>
        <h2 class="song-artist">{{ info.artist || '未知艺术家' }}</h2>
        <div class="lyrics-box">
          <div v-for="(e, i) in nowLyrics" :key="i"
               :class="['lyric-line', { active: i === 0 }]"
               @click="ap.seek(e.timestamp/1000)">
            {{ e.content || '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Player controls -->
    <div class="player-controls">
      <div class="control-buttons">
        <button class="ctrl-btn" @click="ap.skipBack()"><i class="bi bi-skip-start"></i></button>
        <button class="ctrl-btn primary" @click="togglePlay">
          <i :class="isPlaying ? 'bi bi-pause' : 'bi bi-play'"></i>
        </button>
        <button class="ctrl-btn" @click="ap.skipForward()"><i class="bi bi-skip-end"></i></button>
      </div>
      <div v-if="lived" class="room-name">{{ roomdata.name || '音乐房间' }}</div>
      <div class="progress-row">
        <span class="progress-time">{{ currentPn }}</span>
        <div class="progress-bar-wrap" @click="onProgressClick($event)">
          <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Search dialog -->
    <el-dialog
      append-to-body v-model="dialogVisible0" title="搜索音乐" width="700px" draggable align-center>
      <div class="search-bar">
        <el-input v-model="search" class="grow" placeholder="搜索歌曲、歌手或专辑" @keyup.enter="onSearch" />
        <el-button :loading="searchLoading" type="primary" @click="onSearch">搜索</el-button>
        <el-button v-if="isSearchData" @click="addAllToTemp">全部添加</el-button>
      </div>
      <el-table :data="tableData" style="width:100%;" height="420px" class="music-table">
        <el-table-column label="曲名" prop="name" width="240" show-overflow-tooltip />
        <el-table-column label="歌手" prop="artist" width="160" show-overflow-tooltip />
        <el-table-column v-if="!rmop" align="center" width="80">
          <template #header><span style="font-size:0.8rem;">临时</span></template>
          <template #default="scope">
            <el-button size="small" type="success" @click="handleTempPlay(scope.$index, scope.row)" circle>
              <el-icon><Plus /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80">
          <template #header><span style="font-size:0.8rem;">{{ rmop ? '移除' : '收藏' }}</span></template>
          <template #default="scope">
            <el-button v-if="!rmop" size="small" type="primary" @click="handlePoi(scope.$index, scope.row)" circle>
              <el-icon><Plus /></el-icon>
            </el-button>
            <el-button v-else size="small" type="danger" @click="handleRmp(scope.$index, scope.row)" circle>
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- Playlist dialog -->
    <el-dialog
      append-to-body v-model="dialogVisibleList" title="选择音乐榜单" width="500px" draggable align-center>
      <div class="playlist-menu">
        <button class="btn btn--block" :disabled="toggleListLoading" @click="toggleList('163')">
          网易云音乐 · 热歌榜
        </button>
        <button class="btn btn--block" :disabled="toggleListLoading" @click="toggleList('qq')">
          QQ 音乐 · 热歌榜
        </button>
        <button class="btn btn--block" :disabled="toggleListLoading" @click="toggleList('kg')">
          酷狗音乐 · 热歌榜
        </button>
        <button class="btn btn--block" :disabled="toggleListLoading" @click="toggleList()">
          我的个人歌单
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import service, {login_state} from "@/axios";
import {getTimeMs} from "@/utils/utils";
import parseLyrics, {getNearst} from "@/api/lyric";
import {ElMessage} from "element-plus";
import {Plus, Delete} from "@element-plus/icons-vue";

const now_id = ref("");
const lyric = ref("");
const lyrics = ref([] as any[]);
const nowLyrics = ref([] as any[]);
const info = ref({} as any);
const cover0 = ref("");
const ap = {
  get list() { return window.ap?.list },
  get audio() { return window.ap?.audio },
  seek: (time: number) => window.ap?.seek(time),
  skipBack: () => window.ap?.skipBack(),
  skipForward: () => window.ap?.skipForward(),
  toggle: () => window.ap?.toggle()
};
const currentPn = ref("");
const percentage = ref(0);
const isPlaying = ref(false);
const isRotating = ref(false);

const dialogVisible0 = ref(false);
const dialogVisibleRoom = ref(false);
const dialogVisibleList = ref(false);

const search = ref('');
const searchLoading = ref(false);
const rmop = ref(true);
const isPri = ref(false);
const tableData = ref([] as any[]);
const isSearchData = ref(false);

const toggleListLoading = ref(false);
let listType: String = "";

const lived = ref(false);
const livemd = ref(false);
const roomdata = ref({} as any);
const rooms = ref([] as any[]);

const playMode = ref('sequence');

let rotationInterval: number | null = null;
let rotationDegrees = 0;
const iconImgRef = ref<HTMLElement | null>(null);
let animationFrameId: number | null = null;

const animateCover = () => {
  if (!iconImgRef.value || !isRotating.value) return;
  rotationDegrees += 0.2;
  iconImgRef.value.style.transform = `rotate(${rotationDegrees}deg)`;
  animationFrameId = requestAnimationFrame(animateCover);
};

const startRotation = () => {
  if (isRotating.value) return;
  isRotating.value = true;
  animateCover();
};

const stopRotation = () => {
  isRotating.value = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const loadRes = async (et: number = 2000) => {
  try {
    await new Promise(resolve => setTimeout(resolve, et));
    if (!ap.list || !ap.audio) return;
    const ad0 = ap.list.audios[ap.list.index];
    if (!ad0) return;
    cover0.value = ad0.cover || '/icon.jpg';
    now_id.value = ad0.songId || ad0.id;
    info.value = ad0;
    rotationDegrees = 0;
    if (iconImgRef.value) iconImgRef.value.style.transform = 'rotate(0deg)';
    isPlaying.value = !ap.audio.paused;
    isPlaying.value ? startRotation() : stopRotation();
    if (!ad0.lyric) {
      const r = await service.get(`/api/music/get-lrc-by-id?id=${now_id.value}&type=${listType}`);
      lyric.value = r;
      lyrics.value = parseLyrics(r);
      ad0.lyric = r;
    } else {
      lyric.value = ad0.lyric;
      lyrics.value = parseLyrics(ad0.lyric);
    }
  } catch (e) {
    ElMessage.error('获取歌词失败');
  }
};

const onPercentChange = (p: number) => { if (ap.audio) ap.seek(p / 100 * ap.audio.duration); };

const onProgressClick = (e: MouseEvent) => {
  const bar = e.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const pct = ((e.clientX - rect.left) / rect.width) * 100;
  onPercentChange(Math.max(0, Math.min(100, pct)));
};

const togglePlay = () => {
  if (!ap.audio) return;
  ap.toggle();
  isPlaying.value = !ap.audio.paused;
  isPlaying.value ? startRotation() : stopRotation();
};

const handleTempPlay = (index: number, row: any) => {
  if (!ap.list) { ElMessage.warning("播放器尚未准备好，请稍后再试"); return; }
  isPri.value = false;
  if (listType != "temp") { listType = "temp"; ap.list.clear(); }
  ap.list.add({ songId: row.id, name: row.name, artist: row.artist, cover: "/api/music/get-cover-by-id?id=" + row.id, url: "/api/music/get-url-by-id?id=" + row.id });
  ElMessage.success("临时歌曲添加成功!");
};

const addAllToTemp = () => {
  if (!ap.list) { ElMessage.warning("播放器尚未准备好，请稍后再试"); return; }
  isPri.value = false;
  if (listType != "temp") { listType = "temp"; ap.list.clear(); }
  tableData.value.forEach(row => { ap.list.add({ songId: row.id, name: row.name, artist: row.artist, cover: "/api/music/get-cover-by-id?id=" + row.id, url: "/api/music/get-url-by-id?id=" + row.id }); });
  ElMessage.success("已添加全部歌曲到临时歌单");
};

const handlePoi = (index: number, row: any) => {
  service.get(`/api/music/point?id=${row.id}&name=${row.name}&arts=${row.artist}`).then((r: any) => {
    if (r.code == 200) { ElMessage.success("添加成功!"); if (isPri.value && ap.list) ap.list.add(r.data); }
    else ElMessage.warning(r.msg);
  }).catch(e => ElMessage.error('添加失败'));
};

const handleRmp = (index: number, row: any) => {
  service.get(`/api/music/rmp?id=${row.id}`).then((r: any) => {
    if (r.code == 200) { ElMessage.success("移除成功!"); tableData.value.splice(index, 1); ap.list?.remove(index); }
    else ElMessage.warning(r.msg);
  }).catch(e => ElMessage.error('移除失败'));
};

const onSearch = async () => {
  isSearchData.value = false;
  if (!search.value.trim()) {
    try { const r: any = await service.get("/api/music/list"); if (r.code == 200) { tableData.value = r.data; rmop.value = true; } }
    catch (err) { ElMessage.error("获取音乐失败"); }
  } else {
    searchLoading.value = true;
    try { const r = await service.get(`/api/music/search?keyword=${encodeURIComponent(search.value)}`); tableData.value = r; rmop.value = false; isSearchData.value = true; }
    catch (e) { ElMessage.error("搜索失败"); }
    finally { searchLoading.value = false; }
  }
};

const togglePlayMode = () => {
  const modes = ['sequence', 'random', 'repeat'];
  const currentIndex = modes.indexOf(playMode.value);
  playMode.value = modes[(currentIndex + 1) % modes.length];
  ElMessage.info({'sequence':'顺序播放','random':'随机播放','repeat':'单曲循环'}[playMode.value]);
};

const toggleList = async (type: String = "pri", tips: Boolean = true) => {
  if (lived.value && !livemd.value) return;
  if (lived.value && livemd && type !== "pri") { ElMessage.warning("当前处于一起听状态，无法切换"); return; }
  if (listType == type) { toggleListLoading.value = false; dialogVisibleList.value = false; return; }
  toggleListLoading.value = true;
  try {
    if (!ap.list) throw new Error("播放器尚未准备好");
    let data;
    if (type === "pri") { const r: any = await service.get("/api/music/list"); if (r.code !== 200) throw new Error(r.msg || ''); data = r.data; }
    else { data = await service.get(`/api/music/get-music-list?type=${type}`); }
    ap.list.clear(); ap.list.add(data); listType = type; isPri.value = type === "pri";
    if (tips) ElMessage.success("切换成功");
  } catch (error) { ElMessage.error(`切换失败: ${error instanceof Error ? error.message : String(error)}`); }
  finally { toggleListLoading.value = false; dialogVisibleList.value = false; }
};

const createRoom = () => { ElMessage.info("功能开发中，敬请期待"); };
const exitRoom = () => { lived.value = false; livemd.value = false; roomdata.value = {}; ElMessage.success("已退出房间"); };
const loadRooms = async () => { try { const r: any = await service.get("/api/music/lives"); if (r.code == 200) rooms.value = r.data; else ElMessage.warning(r.msg); } catch (e) { ElMessage.error('加载房间列表失败'); } };
const joinRoom = (roomId?: string) => { ElMessage.info("功能开发中，敬请期待"); };

onMounted(async () => {
  // const froom = document.getElementById("froom"); if (froom) froom.scrollIntoView({behavior: 'smooth'});
  await loadRes();
  const updateInterval = setInterval(() => {
    if (!ap.audio || !ap.list) return;
    currentPn.value = `${getTimeMs(ap.audio.currentTime.toFixed(0))}/${getTimeMs(ap.audio.duration.toFixed(0))}`;
    if (!isNaN(ap.audio.duration)) { percentage.value = Number(((ap.audio.currentTime / ap.audio.duration) * 100).toFixed(2)); }
    nowLyrics.value = getNearst(ap.audio.currentTime * 1000, 6, lyrics.value);
    const currentAudio = ap.list.audios[ap.list.index];
    if (currentAudio && now_id.value !== (currentAudio.songId || currentAudio.id)) loadRes(0);
    const currentPlayingState = !ap.audio.paused;
    if (isPlaying.value !== currentPlayingState) { isPlaying.value = currentPlayingState; isPlaying.value ? startRotation() : stopRotation(); }
  }, 100);
  if (login_state.value) { try { const r: any = await service.get("/api/music/list"); if (r.code == 200) tableData.value = r.data; } catch (err) {} }
  return () => { clearInterval(updateInterval); stopRotation(); };
});
</script>
