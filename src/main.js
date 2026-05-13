/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Data
const CITIES = [
  { id: 'hangzhou', name: '杭州', teamName: '杭城竞渡队', landmark: '西湖·三潭印月', color: '#0047AB' },
  { id: 'ningbo', name: '宁波', teamName: '甬江先锋队', landmark: '宁波港·海螺', color: '#003399' },
  { id: 'wenzhou', name: '温州', teamName: '瓯越破浪队', landmark: '雁荡山', color: '#0055A4' },
  { id: 'shaoxing', name: '绍兴', teamName: '越州劲旅队', landmark: '鲁迅故里·乌篷船', color: '#002868' },
  { id: 'huzhou', name: '湖州', teamName: '南太湖勇士', landmark: '月亮酒店', color: '#006241' },
  { id: 'jiaxing', name: '嘉兴', teamName: '南湖竞发队', landmark: '红船', color: '#BF0A30' },
  { id: 'jinhua', name: '金华', teamName: '婺州先锋队', landmark: '八咏楼', color: '#DAA520' },
  { id: 'quzhou', name: '衢州', teamName: '三衢猛将队', landmark: '南孔圣地', color: '#2E8B57' },
  { id: 'zhoushan', name: '舟山', teamName: '千岛巨浪队', landmark: '跨海大桥', color: '#1E90FF' },
  { id: 'taizhou', name: '台州', teamName: '和合破浪队', landmark: '天台山', color: '#FF7F00' },
  { id: 'lishui', name: '丽水', teamName: '处州腾龙队', landmark: '古堰画乡', color: '#228B22' },
];

// App State
let state = {
  currentPage: 'home', // home, select, game, result, rankings
  selectedTeam: null,
  game: {
    distance: 0,
    targetDistance: 1000,
    time: 0,
    combo: 0,
    mistakes: 0,
    maxMistakes: 3,
    target: null, // 'left', 'right', 'both'
    isReady: false,
    countdown: 3,
    interval: null
  },
  lastResult: null
};

const stage = document.getElementById('stage');

// Navigation
function navigateTo(page) {
  state.currentPage = page;
  if (page === 'game') startCountdown();
  render();
}

// Game Logic
function startCountdown() {
  state.game = {
    distance: 0,
    targetDistance: 1000,
    time: 0,
    combo: 0,
    mistakes: 0,
    maxMistakes: 3,
    target: null,
    isReady: false,
    countdown: 3
  };
  
  const timer = setInterval(() => {
    state.game.countdown--;
    if (state.game.countdown <= 0) {
      clearInterval(timer);
      state.game.isReady = true;
      generateTarget();
      startGameLoop();
    }
    render();
  }, 1000);
}

function generateTarget() {
  const types = ['left', 'right', 'both'];
  state.game.target = types[Math.floor(Math.random() * types.length)];
  render();
}

function startGameLoop() {
  if (state.game.interval) clearInterval(state.game.interval);
  state.game.interval = setInterval(() => {
    if (state.game.isReady && state.game.distance < state.game.targetDistance) {
      state.game.time += 0.1;
      render();
    }
  }, 100);
}

function handleDrum(action) {
  if (!state.game.isReady || state.currentPage !== 'game') return;

  if (action === state.game.target) {
    const boost = 1 + (state.game.combo * 0.02);
    state.game.distance += 15 * boost;
    state.game.combo++;
    if (state.game.distance >= state.game.targetDistance) {
      endGame();
    } else {
      generateTarget();
    }
  } else {
    state.game.mistakes++;
    state.game.combo = 0;
    if (state.game.mistakes >= state.game.maxMistakes) {
      endGame();
    } else {
      generateTarget();
    }
  }
}

function endGame() {
  clearInterval(state.game.interval);
  state.lastResult = {
    time: state.game.time,
    distance: state.game.distance,
    score: state.game.combo * 100
  };
  navigateTo('result');
}

// Rendering Engine
function render() {
  stage.innerHTML = '';
  
  switch(state.currentPage) {
    case 'home':
      renderHome();
      break;
    case 'select':
      renderSelection();
      break;
    case 'game':
      renderGame();
      break;
    case 'result':
      renderResult();
      break;
    case 'rankings':
      renderRankings();
      break;
  }
}

function renderHome() {
  stage.className = "w-full max-w-[430px] aspect-[750/1624] bg-stone-50 overflow-hidden relative shadow-2xl flex flex-col";
  stage.innerHTML = `
    <div class="h-full bg-gradient-to-b from-[#0047AB] to-[#002868] flex flex-col items-center justify-between p-8 pb-16 text-white overflow-hidden relative">
      <div class="absolute bottom-0 left-0 w-full h-1/3 opacity-20 pointer-events-none">
        <div class="water-wave h-full w-full bg-[url('https://www.transparenttextures.com/patterns/waves.png')] animate-pulse"></div>
      </div>
      <div class="flex flex-col items-center pt-20 z-10">
        <div class="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium mb-4 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
          浙江广电 · 中国蓝
        </div>
        <h1 class="text-5xl font-bold text-center tracking-tighter mb-2">中国蓝龙舟赛</h1>
        <p class="text-stone-300 text-center text-lg font-light">浙里龙舟竞风流 · 端午安康</p>
      </div>
      <div class="flex flex-col items-center w-full gap-4 z-10 px-4">
        <button id="btn-start" class="w-full bg-[#E23D28] hover:bg-red-700 text-white font-bold py-6 rounded-2xl shadow-xl shadow-red-900/40 text-xl tracking-widest transition-transform active:scale-95">
          立即参赛
        </button>
        <div class="flex gap-4 w-full">
          <button id="btn-rank" class="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
            排行榜
          </button>
          <button class="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
            规则
          </button>
        </div>
      </div>
      <div class="text-white/40 text-xs flex flex-col items-center gap-1 z-10">
        <p>© 2024 浙江广播电视集团 中国蓝</p>
      </div>
    </div>
  `;
  document.getElementById('btn-start').onclick = () => navigateTo('select');
  document.getElementById('btn-rank').onclick = () => navigateTo('rankings');
}

function renderSelection() {
  stage.innerHTML = `
    <div class="h-full bg-stone-50 flex flex-col p-6 overflow-y-auto pb-10">
      <div class="mb-8 pt-6">
        <h2 class="text-3xl font-extrabold text-stone-900 tracking-tight">选择你的家乡战队</h2>
        <p class="text-stone-500 mt-1">集结全省之力，为家乡荣誉而战！</p>
      </div>
      <div class="grid grid-cols-1 gap-4">
        ${CITIES.map(city => `
          <button onclick="window.selectCity('${city.id}')" class="group relative flex items-center p-4 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-blue-200 transition-all text-left overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1.5" style="background-color: ${city.color}"></div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-xl font-bold text-stone-900">${city.name}</span>
                <span class="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold text-stone-500 uppercase">${city.teamName}</span>
              </div>
              <p class="text-xs text-stone-400">${city.landmark}</p>
            </div>
            <div class="flex flex-col items-end gap-1">
              <div class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                ${Math.floor(Math.random() * 5000 + 1000)}人已加入
              </div>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  window.selectCity = (id) => {
    state.selectedTeam = CITIES.find(c => c.id === id);
    navigateTo('game');
  };
}

function renderGame() {
  const g = state.game;
  const progress = (g.distance / g.targetDistance) * 100;

  stage.innerHTML = `
    <div class="absolute inset-0 bg-[#006241] overflow-hidden flex flex-col">
      <div class="p-6 pt-12 flex justify-between items-center z-20 text-white">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold opacity-70 uppercase tracking-widest">距离终点</span>
          <span class="text-2xl font-black italic">${Math.max(0, Math.round(g.targetDistance - g.distance))}m</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-[10px] font-bold opacity-70 uppercase tracking-widest font-mono">用时</span>
          <span class="text-2xl font-black italic">${g.time.toFixed(1)}s</span>
        </div>
      </div>
      <div class="px-6 z-20">
        <div class="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
          <div class="h-full bg-[#E23D28] transition-all duration-300" style="width: ${progress}%"></div>
        </div>
      </div>
      <div class="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/water.png')] bg-repeat">
        <div class="absolute top-4 left-0 w-full flex justify-center z-30">
          <div class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20">
            战队在线奖励: 速度 +5%
          </div>
        </div>
        
        <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 transition-transform duration-300">
          <div class="w-12 h-64 rounded-full shadow-2xl relative" style="background-color: ${state.selectedTeam.color}">
            <div class="absolute top-0 w-full h-12 bg-red-600 rounded-t-full"></div>
          </div>
          
          ${g.target ? `
            <div class="absolute -top-40 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
              <div class="flex gap-6">
                ${(g.target === 'left' || g.target === 'both') ? '<div class="w-16 h-16 bg-[#E23D28] border-4 border-white rounded-2xl flex items-center justify-center font-black text-white shadow-xl text-2xl">左</div>' : ''}
                ${(g.target === 'right' || g.target === 'both') ? '<div class="w-16 h-16 bg-[#E23D28] border-4 border-white rounded-2xl flex items-center justify-center font-black text-white shadow-xl text-2xl">右</div>' : ''}
              </div>
            </div>
          ` : ''}
        </div>

        ${g.combo > 5 ? `
          <div class="absolute top-1/2 right-6 -translate-y-1/2 text-right">
            <div class="text-4xl font-black italic text-yellow-400 drop-shadow-lg">${g.combo}</div>
            <div class="text-[10px] text-white font-bold opacity-50">COMBO</div>
          </div>
        ` : ''}

        ${g.countdown > 0 ? `
          <div class="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div class="text-8xl font-black italic text-white animate-ping">${g.countdown}</div>
          </div>
        ` : ''}
      </div>
      <div class="h-1/3 bg-stone-900 grid grid-cols-2 gap-px border-t border-white/10 relative">
        <button id="drum-l" class="active:bg-red-900/50 flex flex-col items-center justify-center text-white transition-colors gap-2">
          <div class="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center"><span class="text-2xl font-black">左</span></div>
        </button>
        <button id="drum-r" class="active:bg-blue-900/50 flex flex-col items-center justify-center text-white transition-colors gap-2">
          <div class="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center"><span class="text-2xl font-black">右</span></div>
        </button>
      </div>
    </div>
  `;
  
  if (document.getElementById('drum-l')) {
    document.getElementById('drum-l').onpointerdown = () => handleDrum('left');
    document.getElementById('drum-r').onpointerdown = () => handleDrum('right');
  }
}

function renderResult() {
  const r = state.lastResult;
  const t = state.selectedTeam;
  
  stage.innerHTML = `
    <div class="h-full bg-[#0047AB] flex flex-col items-center p-8 overflow-y-auto pt-12">
      <!-- Result Poster (9:16) -->
      <div class="w-full shrink-0 aspect-[9/16] bg-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden flex flex-col justify-between border-4 border-white/50">
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-6">
            <div class="bg-stone-900 text-white px-3 py-1 rounded text-[10px] font-black uppercase">China Blue · 2024</div>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-[#E23D28] tracking-widest uppercase">Zhejiang Dragon Boat</span>
            <h3 class="text-4xl font-black text-stone-900 leading-tight">竞渡争锋<br />凯旋临门</h3>
          </div>
        </div>

        <div class="relative z-10 flex flex-col gap-8">
          <div class="grid grid-cols-1 gap-6">
            <div class="flex flex-col border-l-4 border-[#E23D28] pl-4">
              <span class="text-[10px] font-bold text-stone-400 uppercase">竞速成绩 / Time</span>
              <span class="text-5xl font-black text-stone-900 font-mono tracking-tighter">${r.time.toFixed(2)}s</span>
            </div>
          </div>

          <div class="border-t border-stone-100 pt-6 flex flex-col gap-2 relative z-10">
            <div class="flex justify-between items-center text-sm">
              <span class="text-stone-500 font-medium">战队 / Team</span>
              <span class="font-bold text-stone-900">${t.name} · ${t.teamName}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
               <span class="text-stone-500 font-medium">日期 / Date</span>
               <span class="font-bold text-stone-900">2024.06.10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full gap-4 pb-12">
        <button class="w-full bg-[#E23D28] hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-lg">分享我的战报</button>
        <div class="flex gap-4">
          <button id="btn-restart" class="flex-1 bg-white/10 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-2">再赛一场</button>
          <button id="btn-rankings" class="flex-1 bg-white/10 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-2">榜单</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('btn-restart').onclick = () => navigateTo('home');
  document.getElementById('btn-rankings').onclick = () => navigateTo('rankings');
}

function renderRankings() {
  stage.innerHTML = `
    <div class="h-full bg-stone-50 flex flex-col overflow-hidden">
      <div class="p-6 pt-12 flex items-center gap-4 bg-white border-b">
        <button id="btn-back" class="text-stone-400">返回</button>
        <h2 class="text-2xl font-black text-stone-900 italic">实时排行榜</h2>
      </div>
      <div class="flex-1 overflow-y-auto px-6 pt-4 pb-12 space-y-3">
        ${[1,2,3,4,5].map(i => `
          <div class="flex items-center p-5 bg-white border rounded-2xl shadow-sm">
            <div class="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-black italic mr-4">${i < 4 ? ['🥇','🥈','🥉'][i-1] : i}</div>
            <div class="flex-1">
              <div class="font-bold">用户*竞渡</div>
              <div class="text-[10px] text-stone-400 uppercase">杭州战队</div>
            </div>
            <div class="text-stone-900 font-mono font-bold">18.${i*2}s</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.getElementById('btn-back').onclick = () => navigateTo('home');
}

// Initial Render
render();
