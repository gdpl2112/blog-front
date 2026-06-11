<style scoped>
.music-room {
  position: relative;
  min-height: 70vh;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8);
}

/* Floating shapes */
.music-room::before,
.music-room::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  animation: float 20s infinite ease-in-out;
  pointer-events: none;
}

.music-room::before {
  width: 300px; height: 300px;
  top: 5%; left: 5%;
}

.music-room::after {
  width: 200px; height: 200px;
  bottom: 10%; right: 8%;
  animation-delay: -7s;
}

@keyframes float {
  0%, 100% { transform: translate(0,0) rotate(0deg); }
  25% { transform: translate(20px,20px) rotate(3deg); }
  50% { transform: translate(0,40px) rotate(0deg); }
  75% { transform: translate(-20px,20px) rotate(-3deg); }
}

/* Top actions */
.music-actions {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  right: var(--space-4);
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.action-group {
  display: flex;
  gap: var(--space-2);
}

.action-icon {
  width: 40px; height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1.1rem;
  backdrop-filter: blur(8px);
}

.action-icon:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}

/* Content layout */
.music-content {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  flex: 1;
  width: 100%;
  max-width: 900px;
  padding-top: var(--space-8);
}

/* Album art */
.cover-wrap {
  flex-shrink: 0;
}

.cover-disc {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cover-disc::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.1);
}

.cover-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.05s linear;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.cover-center-dot {
  position: absolute;
  width: 20px; height: 20px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.15);
}

/* Info + Lyrics */
.info-section {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 var(--space-1);
  letter-spacing: -0.02em;
}

.song-artist {
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  font-weight: 400;
  margin: 0 0 var(--space-6);
}

.lyrics-box {
  max-height: 260px;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.lyric-line {
  padding: 6px 0;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lyric-line.active {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 1.05rem;
}

.lyric-line:hover {
  color: rgba(255,255,255,0.7);
}

/* Player controls */
.player-controls {
  width: 100%;
  max-width: 600px;
  padding-top: var(--space-6);
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.ctrl-btn {
  width: 44px; height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1.2rem;
}

.ctrl-btn:hover {
  background: rgba(255,255,255,0.12);
  color: white;
}

.ctrl-btn.primary {
  width: 56px; height: 56px;
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
  font-size: 1.4rem;
}

.ctrl-btn.primary:hover {
  background: var(--color-accent-hover);
  transform: scale(1.05);
}

.progress-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.progress-time {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  font-family: var(--font-mono);
  min-width: 80px;
}

.progress-bar-wrap {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.1);
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--color-accent);
  transition: width 0.1s linear;
  position: relative;
}

/* Dialog overrides */
:deep(.el-dialog) {
  background: var(--color-bg-elevated) !important;
  border-radius: var(--radius-lg) !important;
}

@media (max-width: 768px) {
  .music-content {
    flex-direction: column;
    gap: var(--space-6);
  }
  .cover-disc { width: 200px; height: 200px; }
  .song-title { font-size: 1.2rem; }
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
      <div v-if="lived" style="text-align:center;color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:var(--space-3);">
        {{ roomdata.name || '音乐房间' }}
      </div>
      <div class="progress-row">
        <span class="progress-time">{{ currentPn }}</span>
        <div class="progress-bar-wrap" @click="onProgressClick($event)">
          <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Search dialog -->
    <el-dialog v-model="dialogVisible0" title="搜索音乐" width="700px" draggable align-center>
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <el-input v-model="search" placeholder="搜索歌曲、歌手或专辑" @keyup.enter="onSearch" style="flex:1" />
        <el-button :loading="searchLoading" type="primary" @click="onSearch" style="background:var(--color-accent);border-color:var(--color-accent);">搜索</el-button>
        <el-button v-if="isSearchData" type="success" @click="addAllToTemp">全部添加</el-button>
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
    <el-dialog v-model="dialogVisibleList" title="选择音乐榜单" width="500px" draggable align-center>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <el-button :loading="toggleListLoading" type="danger" @click="toggleList('163')">
          网易云音乐热歌榜
        </el-button>
        <el-button :loading="toggleListLoading" type="success" @click="toggleList('qq')">
          QQ音乐热歌榜
        </el-button>
        <el-button :loading="toggleListLoading" type="primary" @click="toggleList('kg')">
          酷狗音乐热歌榜
        </el-button>
        <el-button :loading="toggleListLoading" @click="toggleList()">
          我的个人歌单
        </el-button>
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
const ap = reactive(window.ap);
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

const onPercentChange = (p: number) => { const t = (p / 100 * ap.audio.duration) as number; ap.seek(t); };

const onProgressClick = (e: MouseEvent) => {
  const bar = e.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const pct = ((e.clientX - rect.left) / rect.width) * 100;
  onPercentChange(Math.max(0, Math.min(100, pct)));
};

const togglePlay = () => {
  ap.toggle();
  isPlaying.value = !ap.audio.paused;
  isPlaying.value ? startRotation() : stopRotation();
};

const handleTempPlay = (index: number, row: any) => {
  isPri.value = false;
  if (listType != "temp") { listType = "temp"; ap.list.clear(); }
  ap.list.add({ songId: row.id, name: row.name, artist: row.artist, cover: "/api/music/get-cover-by-id?id=" + row.id, url: "/api/music/get-url-by-id?id=" + row.id });
  ElMessage.success("临时歌曲添加成功!");
};

const addAllToTemp = () => {
  isPri.value = false;
  if (listType != "temp") { listType = "temp"; ap.list.clear(); }
  tableData.value.forEach(row => { ap.list.add({ songId: row.id, name: row.name, artist: row.artist, cover: "/api/music/get-cover-by-id?id=" + row.id, url: "/api/music/get-url-by-id?id=" + row.id }); });
  ElMessage.success("已添加全部歌曲到临时歌单");
};

const handlePoi = (index: number, row: any) => {
  service.get(`/api/music/point?id=${row.id}&name=${row.name}&arts=${row.artist}`).then((r: any) => {
    if (r.code == 200) { ElMessage.success("添加成功!"); if (isPri.value) ap.list.add(r.data); }
    else ElMessage.warning(r.msg);
  }).catch(e => ElMessage.error('添加失败'));
};

const handleRmp = (index: number, row: any) => {
  service.get(`/api/music/rmp?id=${row.id}`).then((r: any) => {
    if (r.code == 200) { ElMessage.success("移除成功!"); tableData.value.splice(index, 1); ap.list.remove(index); }
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
    try { const r = await service.get(`/api/music/search?keyword=${encodeURIComponent(search.value)}`); tableData.value = r; isSearchData.value = true; }
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
    if (!ap) return;
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
