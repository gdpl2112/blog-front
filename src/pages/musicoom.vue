<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import service, {login_state} from "@/axios";
import {getTimeMs} from "@/utils/utils";
import parseLyrics, {getNearst} from "@/api/lyric";
// 暂时移除所有图标导入，使用基础方式实现功能
import {ElMessage} from "element-plus";
import {
  ArrowLeft,
  ArrowRight,
  DocumentAdd,
  DocumentRemove,
  FolderAdd,
  Search,
  Switch,
  VideoPause,
  VideoPlay
} from "@element-plus/icons-vue";

// 音乐相关状态
const now_id = ref("");
const lyric = ref("");
const lyrics = ref([]);
const nowLyrics = ref([]);
const info = ref({});
const cover0 = ref("");
const ap = reactive(window.ap);
const currentPn = ref("");
const percentage = ref(0);
const isPlaying = ref(false);
const isRotating = ref(false);

// 对话框状态
const dialogVisible0 = ref(false);
const dialogVisibleRoom = ref(false);
const dialogVisibleList = ref(false);

// 搜索状态
const search = ref('');
const searchLoading = ref(false);
const rmop = ref(true);
const isPri = ref(false);
const tableData = ref([]);
const isSearchData = ref(false);

// 歌单状态
const toggleListLoading = ref(false);
let listType: String = "";

// 一起听状态
const lived = ref(false);
const livemd = ref(false);
const roomdata = ref({});
const rooms = ref([]);

// 播放模式
const playMode = ref('sequence'); // sequence, random, repeat

// 封面旋转相关
let rotationInterval: number | null = null;
let rotationDegrees = 0;
const iconImgRef = ref<HTMLElement | null>(null);

// 动画帧请求ID
let animationFrameId: number | null = null;

// 封面旋转动画
const animateCover = () => {
  if (!iconImgRef.value || !isRotating.value) return;

  rotationDegrees += 0.2; // 控制旋转速度
  iconImgRef.value.style.transform = `rotate(${rotationDegrees}deg)`;

  animationFrameId = requestAnimationFrame(animateCover);
};

// 开始封面旋转
const startRotation = () => {
  if (isRotating.value) return;

  isRotating.value = true;
  animateCover();
};

// 停止封面旋转
const stopRotation = () => {
  isRotating.value = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// 加载音乐资源
const loadRes = async (et: number = 2000) => {
  try {
    await new Promise(resolve => setTimeout(resolve, et));

    const ad0 = ap.list.audios[ap.list.index];
    if (!ad0) return;

    cover0.value = ad0.cover || '/icon.jpg'; // 添加默认封面
    now_id.value = ad0.songId || ad0.id;
    info.value = ad0;

    // 重置旋转状态
    rotationDegrees = 0;
    if (iconImgRef.value) {
      iconImgRef.value.style.transform = 'rotate(0deg)';
    }

    // 检查播放状态
    isPlaying.value = !ap.audio.paused;
    if (isPlaying.value) {
      startRotation();
    } else {
      stopRotation();
    }

    // 加载歌词
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
    console.error('歌词加载错误:', e);
  }
};

// 进度条变化处理
const onPercentChange = (p: number) => {
  const t = (p / 100 * ap.audio.duration) as number;
  ap.seek(t);
};

// 格式化时间提示
const getFormatToolTip = (v: number) => {
  v = (v / 100 * ap.audio.duration);
  return getTimeMs(Number(v.toFixed(0))) + '/' + getTimeMs(ap.audio.duration.toFixed(0));
};

// 切换播放/暂停
const togglePlay = () => {
  ap.toggle();
  isPlaying.value = !ap.audio.paused;

  if (isPlaying.value) {
    startRotation();
  } else {
    stopRotation();
  }
};

// 添加歌曲到临时歌单
const handleTempPlay = (index: number, row) => {
  isPri.value = false;
  if (listType != "temp") {
    listType = "temp";
    ap.list.clear();
  }
  ap.list.add({
    songId: row.id,
    name: row.name,
    artist: row.artist,
    cover: "/api/music/get-cover-by-id?id=" + row.id,
    url: "/api/music/get-url-by-id?id=" + row.id
  });
  ElMessage.success("临时歌曲添加成功!");
};

// 添加所有搜索结果到临时歌单
const addAllToTemp = () => {
  isPri.value = false;
  if (listType != "temp") {
    listType = "temp";
    ap.list.clear();
  }
  tableData.value.forEach(row => {
    ap.list.add({
      songId: row.id,
      name: row.name,
      artist: row.artist,
      cover: "/api/music/get-cover-by-id?id=" + row.id,
      url: "/api/music/get-url-by-id?id=" + row.id
    });
  });
  ElMessage.success("已添加全部歌曲到临时歌单");
};

// 添加歌曲到个人歌单
const handlePoi = (index: number, row) => {
  service.get(`/api/music/point?id=${row.id}&name=${row.name}&arts=${row.artist}`)
      .then((r) => {
        if (r.code == 200) {
          ElMessage.success("添加成功!");
          if (isPri.value) {
            ap.list.add(r.data);
          }
        } else {
          ElMessage.warning(r.msg);
        }
      })
      .catch(e => {
        console.error('添加歌曲失败:', e);
        ElMessage.error('添加失败');
      });
};

// 从个人歌单移除歌曲
const handleRmp = (index: number, row) => {
  service.get(`/api/music/rmp?id=${row.id}`)
      .then((r) => {
        if (r.code == 200) {
          ElMessage.success("移除成功!");
          tableData.value.splice(index, 1);
          ap.list.remove(index);
        } else {
          ElMessage.warning(r.msg);
        }
      })
      .catch(e => {
        console.error('移除歌曲失败:', e);
        ElMessage.error('移除失败');
      });
};

// 搜索歌曲
const onSearch = async () => {
  isSearchData.value = false;

  if (!search.value.trim()) {
    try {
      const r = await service.get("/api/music/list");
      if (r.code == 200) {
        tableData.value = r.data;
        rmop.value = true;
      }
    } catch (err) {
      ElMessage.error("获取音乐失败");
      console.error('获取音乐列表失败:', err);
    }
  } else {
    rmop.value = false;
    searchLoading.value = true;

    try {
      const r = await service.get(`/api/music/search?keyword=${encodeURIComponent(search.value)}`);
      tableData.value = r;
      isSearchData.value = true;
    } catch (e) {
      ElMessage.error("搜索失败");
      console.error('搜索音乐失败:', e);
    } finally {
      searchLoading.value = false;
    }
  }
};

// 切换播放模式
const togglePlayMode = () => {
  const modes = ['sequence', 'random', 'repeat'];
  const currentIndex = modes.indexOf(playMode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  playMode.value = modes[nextIndex];

  // 这里可以根据实际需要设置ap的播放模式
  ElMessage.info({
    'sequence': '顺序播放',
    'random': '随机播放',
    'repeat': '单曲循环'
  }[playMode.value]);
};

// 切换歌单
const toggleList = async (type: String = "pri", tips: Boolean = true) => {
  if (lived.value && !livemd.value) return;

  if (lived.value && livemd) {
    if (type !== "pri") {
      ElMessage.warning("当前处于一起听状态，无法切换到非个人歌单");
      return;
    }
  }

  if (listType == type) {
    toggleListLoading.value = false;
    dialogVisibleList.value = false;
    return;
  }

  toggleListLoading.value = true;

  try {
    let data;
    if (type === "pri") {
      const r = await service.get("/api/music/list");
      if (r.code !== 200) {
        throw new Error(r.msg || '获取个人歌单失败');
      }
      data = r.data;
    } else {
      data = await service.get(`/api/music/get-music-list?type=${type}`);
    }

    ap.list.clear();
    ap.list.add(data);
    listType = type;
    isPri.value = type === "pri";

    if (tips) {
      ElMessage.success("切换成功");
    }
  } catch (error) {
    ElMessage.error(`切换失败: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    toggleListLoading.value = false;
    dialogVisibleList.value = false;
  }
};

// 创建房间
const createRoom = () => {
  ElMessage.info("功能开发中，敬请期待");
};

// 退出房间
const exitRoom = () => {
  // 实现退出房间逻辑
  lived.value = false;
  livemd.value = false;
  roomdata.value = {};
  ElMessage.success("已退出房间");
};

// 加载房间列表
const loadRooms = async () => {
  try {
    const r = await service.get("/api/music/lives");
    if (r.code == 200) {
      rooms.value = r.data;
    } else {
      ElMessage.warning(r.msg);
    }
  } catch (e) {
    console.error('加载房间列表失败:', e);
    ElMessage.error('加载房间列表失败');
  }
};

// 加入房间
const joinRoom = (roomId?: string) => {
  ElMessage.info("功能开发中，敬请期待");
};

// 组件挂载
onMounted(async () => {
  // 调整界面到整个屏幕都是音乐组件
  const froom = document.getElementById("froom");
  if (froom) {
    froom.scrollIntoView({behavior: 'smooth'});
  }

  // 初始化加载音乐
  await loadRes();

  // 设置定时更新
  const updateInterval = setInterval(() => {
    if (!ap) return;

    // 更新时间
    currentPn.value = `${getTimeMs(ap.audio.currentTime.toFixed(0))}/${getTimeMs(ap.audio.duration.toFixed(0))}`;

    // 更新进度条
    if (!isNaN(ap.audio.duration)) {
      percentage.value = Number(((ap.audio.currentTime / ap.audio.duration) * 100).toFixed(2));
    }

    // 更新歌词
    nowLyrics.value = getNearst(ap.audio.currentTime * 1000, 6, lyrics.value);

    // 检查歌曲是否切换
    const currentAudio = ap.list.audios[ap.list.index];
    if (currentAudio && now_id.value !== (currentAudio.songId || currentAudio.id)) {
      loadRes(0);
    }

    // 检查播放状态变化
    const currentPlayingState = !ap.audio.paused;
    if (isPlaying.value !== currentPlayingState) {
      isPlaying.value = currentPlayingState;
      if (isPlaying.value) {
        startRotation();
      } else {
        stopRotation();
      }
    }
  }, 100);

  // 加载个人歌单
  if (login_state.value) {
    try {
      const r = await service.get("/api/music/list");
      if (r.code == 200) {
        tableData.value = r.data;
      }
    } catch (err) {
      console.error('加载个人歌单失败:', err);
    }
  }

  // 清理函数
  return () => {
    clearInterval(updateInterval);
    stopRotation();
  };
});
</script>

<template>
  <div class="music-room-container" id="froom">
    <!-- 背景效果 -->
    <div class="music-background">
      <div class="music-background-gradient"></div>
      <div class="music-background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 顶部控制栏 -->
    <div class="music-control-bar">
      <div class="control-buttons">
        <el-button
            v-if="!lived || livemd"
            type="primary"
            plain
            circle
            @click="dialogVisible0 = true"
            class="control-btn search-btn"
        >
          <el-icon>
            <Search/>
          </el-icon>
        </el-button>
        <el-button
            v-if="!lived || livemd"
            type="success"
            plain
            circle
            @click="dialogVisibleList = true"
            class="control-btn playlist-btn"
        >
          <el-icon>
            <Switch/>
          </el-icon>
        </el-button>
        <el-button
            v-if="!lived"
            type="warning"
            plain
            circle
            @click="createRoom()"
            class="control-btn create-room-btn"
        >
          <el-icon>
            <FolderAdd/>
          </el-icon>
        </el-button>
        <el-button
            v-if="!lived"
            type="info"
            plain
            circle
            @click="loadRooms(); dialogVisibleRoom = true"
            class="control-btn join-room-btn"
        >
          <el-icon>
            <Users/>
          </el-icon>
        </el-button>
        <el-button
            v-if="lived"
            type="danger"
            plain
            circle
            @click="exitRoom()"
            class="control-btn exit-room-btn"
        >
          <el-icon>
            <Minus/>
          </el-icon>
        </el-button>
      </div>

      <!-- 播放模式 -->
      <div class="play-mode-control">
        <el-tooltip :content="{
          'sequence': '顺序播放',
          'random': '随机播放',
          'repeat': '单曲循环'
        }[playMode]" effect="dark">
          <el-button
              type="text"
              circle
              @click="togglePlayMode"
              class="play-mode-btn"
          >
            <el-icon v-if="playMode === 'sequence'">
              <Repeat/>
            </el-icon>
            <el-icon v-else-if="playMode === 'random'">
              <Shuffle/>
            </el-icon>
            <el-icon v-else>
              <Repeat/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="music-main-content">
      <!-- 专辑封面 -->
      <div class="cover-section">
        <div class="cover-container">
          <div class="cover-disc">
            <div class="cover-spin" ref="iconImgRef" @click="togglePlay">
              <img :src="cover0 || '/icon.jpg'" alt="专辑封面" class="album-cover">
            </div>
            <div class="cover-center"></div>
          </div>
        </div>
      </div>

      <!-- 歌曲信息和歌词 -->
      <div class="info-lyrics-section">
        <div class="song-info">
          <h1 class="song-title">{{ info.name || '未播放歌曲' }}</h1>
          <h3 class="song-artist">{{ info.artist || '未知艺术家' }}</h3>
        </div>

        <div class="lyrics-container">
          <div class="lyrics-wrapper">
            <div
                v-for="(e, i) in nowLyrics"
                :key="i"
                :class="['lyric-line', { 'active-line': i === 0 }]"
                @click="ap.seek(e.timestamp/1000)"
            >
              <el-tooltip
                  effect="dark"
                  :content="getTimeMs((e.timestamp/1000).toFixed(0))"
                  placement="left"
              >
                <span>{{ e.content || '' }}</span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部播放控制 -->
    <div class="music-player-controls">
      <!-- 房间信息 -->
      <div v-if="lived" class="room-info">
        <div class="room-name">{{ roomdata.name || '音乐房间' }}</div>
        <div class="room-users">
          <el-avatar
              v-for="(e, index) in roomdata.icons || []"
              :key="index"
              :src="e"
              class="user-avatar"
          />
        </div>
      </div>

      <!-- 播放控制按钮 -->
      <div class="player-buttons">
        <el-button
            @click="ap.skipBack()"
            type="info"
            circle
            plain
            class="player-btn prev-btn"
        >
          <el-icon>
            <ArrowLeft/>
          </el-icon>
        </el-button>

        <el-button
            @click="togglePlay"
            type="primary"
            circle
            class="player-btn play-btn"
        >
          <el-icon v-if="isPlaying">
            <VideoPause/>
          </el-icon>
          <el-icon v-else>
            <VideoPlay/>
          </el-icon>
        </el-button>

        <el-button
            @click="ap.skipForward()"
            type="info"
            circle
            plain
            class="player-btn next-btn"
        >
          <el-icon>
            <ArrowRight/>
          </el-icon>
        </el-button>
      </div>

      <!-- 进度条 -->
      <div class="progress-container">
        <span class="time-display">{{ currentPn }}</span>
        <el-slider
            @change="onPercentChange"
            :format-tooltip="getFormatToolTip"
            v-model="percentage"
            class="progress-slider"
        />
      </div>
    </div>

    <!-- 搜索对话框 -->
    <el-dialog
        v-model="dialogVisible0"
        title="搜索音乐"
        width="700px"
        draggable
        align-center
        class="custom-dialog"
    >
      <el-form :inline="true" class="search-form">
        <el-form-item class="search-input-wrapper">
          <el-input
              v-model="search"
              placeholder="搜索歌曲、歌手或专辑"
              prefix-icon="el-icon-search"
              class="search-input"
              @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              :loading="searchLoading"
              type="primary"
              @click="onSearch"
              class="search-button"
          >
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              v-if="isSearchData"
              type="success"
              @click="addAllToTemp"
              class="add-all-button"
          >
            <el-icon>
              <FolderAdd/>
            </el-icon>
            全部添加
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
          :data="tableData"
          style="width: 100%;"
          height="500px"
          class="music-table"
      >
        <el-table-column label="曲名" prop="name" width="250" show-overflow-tooltip/>
        <el-table-column label="歌手" prop="artist" width="180" show-overflow-tooltip/>
        <el-table-column v-if="!rmop" align="center" width="100">
          <template #header>
            <div class="table-header-text">临时歌单</div>
          </template>
          <template #default="scope">
            <el-button
                size="small"
                type="success"
                @click="handleTempPlay(scope.$index, scope.row)"
                circle
                class="table-btn"
            >
              <el-icon>
                <FolderAdd/>
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120">
          <template #header>
            <div class="table-header-text">{{ rmop ? '移除' : '收藏' }}</div>
          </template>
          <template #default="scope">
            <el-button
                v-if="!rmop"
                size="small"
                type="primary"
                @click="handlePoi(scope.$index, scope.row)"
                circle
                class="table-btn"
            >
              <el-icon>
                <DocumentAdd/>
              </el-icon>
            </el-button>
            <el-button
                v-else
                size="small"
                type="danger"
                @click="handleRmp(scope.$index, scope.row)"
                circle
                class="table-btn"
            >
              <el-icon>
                <DocumentRemove/>
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 歌单切换对话框 -->
    <el-dialog
        :body-class="'text-center'"
        v-model="dialogVisibleList"
        title="选择音乐榜单"
        width="500px"
        draggable
        align-center
        class="custom-dialog"
    >
      <div class="playlist-options">
        <el-button
            :loading="toggleListLoading"
            type="danger"
            @click="toggleList('163')"
            class="playlist-btn-large"
        >
          <i class="icon-music icon-netease"></i> 网易云音乐热歌榜
        </el-button>

        <el-button
            :loading="toggleListLoading"
            type="success"
            @click="toggleList('qq')"
            class="playlist-btn-large"
        >
          <i class="icon-music icon-qq"></i> QQ音乐热歌榜
        </el-button>

        <el-button
            :loading="toggleListLoading"
            type="primary"
            @click="toggleList('kg')"
            class="playlist-btn-large"
        >
          <i class="icon-music icon-kugou"></i> 酷狗音乐热歌榜
        </el-button>

        <el-button
            :loading="toggleListLoading"
            type="info"
            @click="toggleList()"
            class="playlist-btn-large"
        >
          <i class="icon-music icon-personal"></i> 我的个人歌单
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 全局样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 音乐房间容器 */
.music-room-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0.95;
}

/* 背景效果 */
.music-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.music-background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.music-background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 15%;
  right: 10%;
  animation-delay: -5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  right: 20%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, 20px) rotate(5deg);
  }
  50% {
    transform: translate(0, 40px) rotate(0deg);
  }
  75% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

/* 顶部控制栏 */
.music-control-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  z-index: 100;
}

.control-buttons {
  display: flex;
  gap: 1rem;
}

.control-btn {
  transition: all 0.3s ease;
  border-width: 2px;
}

.control-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.play-mode-control {
  display: flex;
  align-items: center;
}

.play-mode-btn {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.play-mode-btn:hover {
  color: #409eff;
  transform: scale(1.1);
}

/* 主要内容区域 */
.music-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8rem 2rem 2rem;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .music-main-content {
    flex-direction: row;
    gap: 5rem;
  }
}

/* 专辑封面 */
.cover-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-container {
  position: relative;
  width: 280px;
  height: 280px;
}

@media (min-width: 768px) {
  .cover-container {
    width: 350px;
    height: 350px;
  }
}

.cover-disc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.cover-spin {
  width: 85%;
  height: 85%;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border: 8px solid rgba(255, 255, 255, 0.1);
}

.cover-spin:hover {
  transform: scale(1.05);
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-center {
  position: absolute;
  width: 15%;
  height: 15%;
  border-radius: 50%;
  background: #1a1a2e;
  border: 3px solid rgba(255, 255, 255, 0.2);
  z-index: 2;
}

/* 歌曲信息和歌词 */
.info-lyrics-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
}

.song-info {
  text-align: center;
  margin-bottom: 2rem;
}

.song-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.song-artist {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.lyrics-container {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.lyrics-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.lyric-line {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
}

.lyric-line:hover {
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.05);
}

.lyric-line.active-line {
  color: #409eff;
  font-size: 1.1rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* 底部播放控制 */
.music-player-controls {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 房间信息 */
.room-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.room-name {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.room-users {
  display: flex;
  gap: -10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  margin-left: -10px;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1) translateY(-3px);
  z-index: 1;
}

/* 播放控制按钮 */
.player-buttons {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.player-btn {
  transition: all 0.3s ease;
}

.player-btn:hover {
  transform: scale(1.1);
}

.play-btn {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

/* 进度条 */
.progress-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-display {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
}

.progress-slider {
  width: 100%;
}

:deep(.el-slider__runway) {
  background: rgba(255, 255, 255, 0.2);
  height: 6px;
  border-radius: 3px;
}

:deep(.el-slider__bar) {
  background: linear-gradient(90deg, #409eff, #67c23a);
  height: 6px;
  border-radius: 3px;
}

:deep(.el-slider__button) {
  width: 16px;
  height: 16px;
  border: 2px solid #409eff;
  background: white;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.5);
}

/* 自定义对话框样式 */
.custom-dialog {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(90deg, #409eff, #67c23a);
  color: white;
  padding: 1rem 1.5rem;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: rgba(255, 255, 255, 0.8);
}

/* 搜索表单样式 */
.search-form {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  flex: 1;
  min-width: 300px;
}

.search-input {
  border-radius: 8px;
}

.search-button,
.add-all-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-button:hover,
.add-all-button:hover {
  transform: translateY(-2px);
}

/* 表格样式 */
.music-table,
.rooms-table {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table) {
  background: rgba(255, 255, 255, 0.95);
}

:deep(.el-table th) {
  background: rgba(245, 247, 250, 0.8);
  font-weight: 600;
}

:deep(.el-table tr:hover > td) {
  background: rgba(240, 249, 255, 0.8);
}

.table-header-text {
  font-weight: 600;
}

.table-btn,
.join-room-table-btn {
  transition: all 0.3s ease;
}

.table-btn:hover,
.join-room-table-btn:hover {
  transform: scale(1.05);
}

/* 歌单选项样式 */
.playlist-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.playlist-btn-large {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.playlist-btn-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 图标样式 */
.icon-music {
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-control-bar {
    padding: 1rem;
  }

  .control-buttons {
    gap: 0.5rem;
  }

  .music-main-content {
    padding: 6rem 1rem 2rem;
    gap: 2rem;
  }

  .cover-container {
    width: 220px;
    height: 220px;
  }

  .song-title {
    font-size: 1.5rem;
  }

  .song-artist {
    font-size: 1rem;
  }

  .lyrics-container {
    max-height: 200px;
  }

  .lyric-line {
    font-size: 0.9rem;
  }

  .lyric-line.active-line {
    font-size: 1rem;
  }

  .music-player-controls {
    padding: 1rem;
    gap: 1rem;
  }

  .player-buttons {
    gap: 1.5rem;
  }

  .play-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .custom-dialog {
    width: 90% !important;
    margin: 0 auto;
  }

  .search-input-wrapper {
    min-width: auto;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .search-form {
    flex-direction: column;
  }

  .shape-1 {
    width: 200px;
    height: 200px;
  }

  .shape-2 {
    width: 150px;
    height: 150px;
  }

  .shape-3 {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .cover-container {
    width: 180px;
    height: 180px;
  }

  .song-title {
    font-size: 1.3rem;
  }

  .player-buttons {
    gap: 1rem;
  }

  .play-btn {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}
</style>