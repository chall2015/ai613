/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Data
const CITIES = [
  { id: 'hangzhou', name: '杭州', teamName: '杭城竞渡队', landmark: '西湖·三潭印月', color: '#0047AB', participation: 15420 },
  { id: 'ningbo', name: '宁波', teamName: '甬江先锋队', landmark: '宁波港·海螺', color: '#003399', participation: 12850 },
  { id: 'wenzhou', name: '温州', teamName: '瓯越破浪队', landmark: '雁荡山', color: '#0055A4', participation: 11200 },
  { id: 'shaoxing', name: '绍兴', teamName: '越州劲旅队', landmark: '鲁迅故里·乌篷船', color: '#002868', participation: 14900 },
  { id: 'huzhou', name: '湖州', teamName: '南太湖勇士', landmark: '月亮酒店', color: '#006241', participation: 9800 },
  { id: 'jiaxing', name: '嘉兴', teamName: '南湖竞发队', landmark: '红船', color: '#BF0A30', participation: 13500 },
  { id: 'jinhua', name: '金华', teamName: '婺州先锋队', landmark: '八咏楼', color: '#DAA520', participation: 8700 },
  { id: 'quzhou', name: '衢州', teamName: '三衢猛将队', landmark: '南孔圣地', color: '#2E8B57', participation: 7600 },
  { id: 'zhoushan', name: '舟山', teamName: '千岛巨浪队', landmark: '跨海大桥', color: '#1E90FF', participation: 10500 },
  { id: 'taizhou', name: '台州', teamName: '和合破浪队', landmark: '天台山', color: '#FF7F00', participation: 9200 },
  { id: 'lishui', name: '丽水', teamName: '处州腾龙队', landmark: '古堰画乡', color: '#228B22', participation: 6800 },
];

// App State
let state = {
  currentPage: 'home', // home, select, game, result, rankings
  rankingTab: 'speed', // speed, popularity
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
  lastResult: {
    time: 0,
    distance: 0,
    score: 0
  }
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
  // 确保 stage 始终有基准样式
  if (!stage.classList.contains('stage')) {
    stage.className = "stage";
  }
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
  stage.innerHTML = `
    <div class="h-full bg-gradient-to-b from-[#0047AB] to-[#002868] flex flex-col items-center justify-between p-12 pb-32 text-white overflow-hidden relative">
      <div class="absolute bottom-0 left-0 w-full h-1/3 opacity-20 pointer-events-none">
        <div class="water-wave h-full w-full bg-[url('https://www.transparenttextures.com/patterns/waves.png')] animate-pulse"></div>
      </div>
      <div class="flex flex-col items-center pt-32 z-10 w-full px-6">
        <h1 class="text-7xl font-black text-center tracking-tighter mb-4 drop-shadow-2xl italic leading-tight">中国蓝龙舟赛</h1>
        <p class="text-stone-300 text-center text-2xl font-light tracking-widest opacity-80">浙里龙舟竞风流 · 端午安康</p>
      </div>
      
      <div class="relative w-full h-96 flex items-center justify-center z-10">
         <div class="boat-visual w-24 h-80 bg-red-600 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center pt-6">
            <div class="w-4 h-4 rounded-full bg-yellow-400 mb-2 shadow-[0_0_10px_#facc15]"></div>
         </div>
      </div>

      <div class="flex flex-col items-center w-full gap-8 z-10 px-12">
        <button id="btn-start" class="w-full bg-[#E23D28] hover:bg-red-700 text-white font-black py-8 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(226,61,40,0.6)] text-4xl tracking-[0.5em] transition-all active:scale-95 border-b-8 border-red-900/50">
          立即参赛
        </button>
        <button id="btn-quiz" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-[32px] shadow-xl text-2xl tracking-[0.2em] transition-all active:scale-95 border-b-4 border-emerald-900/40 flex items-center justify-center gap-3">
          <span class="text-3xl">📝</span> 端午知识大比拼
        </button>
      </div>

      <!-- Side Bar -->
      <div class="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
        <button id="btn-rank" class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20 shadow-lg hover:bg-white/20 transition-all active:scale-90">
          <span class="text-2xl mb-1">📊</span>
          <span class="text-[10px] font-black tracking-tighter">排行榜</span>
        </button>
        <button id="btn-rules" class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20 shadow-lg hover:bg-white/20 transition-all active:scale-90">
          <span class="text-2xl mb-1">📜</span>
          <span class="text-[10px] font-black tracking-tighter">比赛规则</span>
        </button>
      </div>
    </div>
  `;
  document.getElementById('btn-start').onclick = () => navigateTo('select');
  document.getElementById('btn-rank').onclick = () => navigateTo('rankings');
  document.getElementById('btn-quiz').onclick = () => alert('端午答题功能即将上线！');
  document.getElementById('btn-rules').onclick = () => alert('划船机说明：通过左右击鼓控制龙舟，躲避障碍，冲向终点！');
}

function renderSelection() {
  stage.innerHTML = `
    <div class="h-full bg-stone-50 flex flex-col items-center p-12 overflow-y-auto pb-24">
      <div class="w-[600px]">
        <!-- Select Header -->
        <div class="w-full flex items-center gap-6 mb-8 pt-6">
          <button id="btn-back-select" class="text-stone-400 hover:text-stone-900 transition-colors p-3 bg-white rounded-2xl border border-stone-200 shadow-sm active:scale-90 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div class="flex-1">
            <h2 class="text-4xl font-black text-stone-900 tracking-tighter italic">选择参赛战队</h2>
            <p class="text-stone-500 mt-1 text-lg font-medium">浙里龙舟竞风流 · 为家乡荣誉而战！</p>
          </div>
        </div>

        <!-- 2-Column Bento Grid representing the cities -->
        <div class="grid grid-cols-2 gap-4">
          ${CITIES.map(city => `
            <button onclick="window.selectCity('${city.id}')" 
              class="group relative flex flex-col justify-between p-6 rounded-[32px] bg-white border-2 transition-all text-left overflow-hidden active:scale-95 h-56 shadow-sm hover:shadow-lg"
              style="border-color: #f5f5f4; background: linear-gradient(135deg, ${city.color}08 0%, #ffffff 100%)"
              onmouseover="this.style.borderColor='${city.color}40'; this.style.boxShadow='0 12px 20px -8px ${city.color}20';"
              onmouseout="this.style.borderColor='#f5f5f4'; this.style.boxShadow='none';">
              
              <!-- Color Indicator Line -->
              <div class="absolute left-0 top-0 bottom-0 w-2.5" style="background-color: ${city.color}"></div>
              
              <!-- Card Top -->
              <div class="w-full pl-2">
                <div class="flex justify-between items-start">
                  <div class="flex flex-col">
                    <span class="text-3xl font-black text-stone-900 tracking-tight">${city.name}</span>
                    <span class="mt-1 text-xs font-bold text-stone-400 tracking-widest uppercase">${city.teamName}</span>
                  </div>
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-inner" style="background-color: ${city.color}15; color: ${city.color}">
                    🛶
                  </div>
                </div>
              </div>

              <!-- Card Bottom -->
              <div class="w-full pl-2 mt-auto">
                <div class="text-stone-400 text-xs font-semibold flex items-center gap-1 mb-3">
                  <span class="opacity-75">📍</span> ${city.landmark}
                </div>
                <div class="flex justify-between items-center bg-stone-50/80 group-hover:bg-white px-3 py-1.5 rounded-xl border border-stone-100 transition-colors">
                  <span class="text-[10px] font-bold text-stone-400 tracking-wider">累计人气</span>
                  <span class="text-xs font-black text-stone-700" style="color: ${city.color}">${city.participation.toLocaleString()}</span>
                </div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.getElementById('btn-back-select').onclick = () => navigateTo('home');
  window.selectCity = (id) => {
    state.selectedTeam = CITIES.find(c => c.id === id);
    navigateTo('game');
  };
}

function renderGame() {
  const g = state.game;
  const progress = (g.distance / g.targetDistance) * 100;
  const team = state.selectedTeam || CITIES[0];

  stage.innerHTML = `
    <div class="absolute inset-0 bg-[#006241] overflow-hidden flex flex-col">
      <div class="p-12 pt-32 flex justify-between items-center z-20 text-white">
        <div class="flex flex-col">
          <span class="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">距离终点</span>
          <span class="text-5xl font-black italic">${Math.max(0, Math.round(g.targetDistance - g.distance))}m</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-sm font-bold opacity-70 uppercase tracking-widest font-mono mb-1">当前耗时</span>
          <span class="text-5xl font-black italic">${g.time.toFixed(1)}s</span>
        </div>
      </div>
      <div class="px-16 z-20 mt-4">
        <div class="h-4 w-full bg-black/20 rounded-full overflow-hidden shadow-inner border border-white/10">
          <div class="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-300 shadow-[0_0_20px_rgba(240,173,78,0.6)]" style="width: ${progress}%"></div>
        </div>
      </div>
      
      <div class="flex-1 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/water.png')] bg-repeat opacity-30 animate-pulse"></div>
        
        <div class="absolute top-12 left-0 w-full flex justify-center z-30">
          <div class="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full text-lg font-bold text-white border border-white/20 shadow-2xl flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            战队在线奖励: 速度 +5%
          </div>
        </div>
        
        <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 animate-bounce">
          <div class="boat-visual w-32 h-[600px] rounded-full relative" style="background-color: ${team.color}">
            <div class="boat-head absolute top-0 w-full h-32 bg-red-600 rounded-t-full flex items-center justify-center border-b-4 border-black/10">
               <div class="dragon-eye w-6 h-6 rounded-full bg-yellow-400 shadow-[0_0_15px_#facc15]"></div>
            </div>
          </div>
          
          ${g.target ? `
            <div class="absolute -top-[350px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
              <div class="flex gap-16">
                ${(g.target === 'left' || g.target === 'both') ? `
                  <div class="w-40 h-40 bg-[#E23D28] border-[10px] border-white rounded-[40px] flex items-center justify-center font-black text-white shadow-[0_20px_40px_rgba(226,61,40,0.5)] text-7xl">左</div>
                ` : ''}
                ${(g.target === 'right' || g.target === 'both') ? `
                  <div class="w-40 h-40 bg-[#E23D28] border-[10px] border-white rounded-[40px] flex items-center justify-center font-black text-white shadow-[0_20px_40px_rgba(226,61,40,0.5)] text-7xl">右</div>
                ` : ''}
              </div>
              <div class="bg-black/70 backdrop-blur-md px-12 py-5 rounded-2xl text-white text-3xl font-black tracking-[0.4em] uppercase border border-white/20 whitespace-nowrap shadow-2xl">
                ${g.target === 'both' ? '双桨齐划!' : '击鼓竞渡!'}
              </div>
            </div>
          ` : ''}
        </div>

        ${g.combo > 5 ? `
          <div class="absolute top-1/2 right-12 -translate-y-1/2 text-right">
            <div class="text-8xl font-black italic text-yellow-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] animate-pulse">${g.combo}</div>
            <div class="text-xl text-white font-black opacity-70 tracking-widest leading-none">COMBO</div>
          </div>
        ` : ''}

        ${g.countdown > 0 ? `
          <div class="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div class="text-[200px] font-black italic text-white animate-ping drop-shadow-2xl">${g.countdown}</div>
          </div>
        ` : ''}
      </div>
      <div class="h-2/5 bg-stone-900 grid grid-cols-2 gap-px border-t border-white/10 relative overflow-hidden">
        <button id="drum-l" class="active:bg-red-500/20 flex flex-col items-center justify-center text-white transition-all gap-5 select-none relative overflow-hidden">
          <div class="w-48 h-48 rounded-full border-8 border-red-500 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-transform active:scale-90 bg-red-950/20">
            <span class="text-7xl font-black">左</span>
          </div>
          <div class="text-stone-500 font-bold uppercase tracking-[0.4em] text-lg">LEFT DRUM</div>
        </button>
        <button id="drum-r" class="active:bg-blue-500/20 flex flex-col items-center justify-center text-white transition-all gap-5 select-none relative overflow-hidden">
          <div class="w-48 h-48 rounded-full border-8 border-blue-500 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-transform active:scale-90 bg-blue-950/20">
            <span class="text-7xl font-black">右</span>
          </div>
          <div class="text-stone-500 font-bold uppercase tracking-[0.4em] text-lg">RIGHT DRUM</div>
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
  const r = state.lastResult || { time: 0, distance: 0, combo: 0 };
  const t = state.selectedTeam || CITIES[0];
  
  stage.innerHTML = `
    <div class="h-full bg-[#0047AB] flex flex-col items-center p-12 overflow-y-auto pt-24 pb-32">
      <!-- Result Poster (9:16) -->
      <div class="w-[600px] shrink-0 aspect-[9/16] bg-white rounded-[56px] p-12 mb-12 shadow-2xl relative overflow-hidden flex flex-col justify-between border-[10px] border-white/40">
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-14">
            <div class="bg-stone-900 text-white px-6 py-2 rounded-xl text-base font-black uppercase tracking-widest shadow-xl">China Blue · 2026</div>
          </div>
          <div class="flex flex-col gap-4">
            <span class="text-lg font-black text-[#E23D28] tracking-[0.3em] uppercase opacity-80">Zhejiang Dragon Boat</span>
            <h3 class="text-6xl font-black text-stone-900 leading-tight tracking-tighter">竞渡争锋<br />凯旋临门</h3>
          </div>
        </div>

        <div class="relative z-10 flex flex-col gap-10">
          <div class="flex flex-col border-l-[8px] border-[#E23D28] pl-8">
            <span class="text-base font-bold text-stone-400 uppercase tracking-widest mb-2">竞速成绩 / Time</span>
            <span class="text-7xl font-black text-stone-900 font-mono tracking-tighter drop-shadow-sm">${r.time.toFixed(2)}s</span>
          </div>

          <div class="border-t-2 border-stone-100 pt-8 flex flex-col gap-5 relative z-10">
            <div class="flex justify-between items-center">
              <span class="text-stone-400 font-bold text-lg uppercase tracking-widest">战队 / Team</span>
              <span class="font-black text-stone-900 text-xl">${t.name} · ${t.teamName}</span>
            </div>
            <div class="flex justify-between items-center">
               <span class="text-stone-400 font-bold text-lg uppercase tracking-widest">日期 / Date</span>
               <span class="font-black text-stone-900 text-xl">2026.06.10</span>
            </div>
          </div>
        </div>
        

      </div>

      <div class="flex flex-col w-[620px] gap-8">
        <button class="w-full bg-[#E23D28] hover:bg-red-700 text-white font-black py-10 rounded-[40px] shadow-[0_30px_60px_rgba(226,61,40,0.4)] text-3xl transition-transform active:scale-95 border-b-8 border-red-900/50">分享我的战报</button>
        <div class="flex gap-8">
          <button id="btn-restart" class="flex-1 bg-white/10 text-white font-black py-8 rounded-[32px] flex items-center justify-center gap-4 text-2xl border-2 border-white/20 active:bg-white/20 transition-all">再赛一场</button>
          <button id="btn-rankings" class="flex-1 bg-white/10 text-white font-black py-8 rounded-[32px] flex items-center justify-center gap-4 text-2xl border-2 border-white/20 active:bg-white/20 transition-all">龙舟英雄榜</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('btn-restart').onclick = () => navigateTo('home');
  document.getElementById('btn-rankings').onclick = () => navigateTo('rankings');
}

function renderRankings() {
  const isSpeed = state.rankingTab === 'speed';
  
  stage.innerHTML = `
    <div class="h-full bg-stone-50 flex flex-col items-center overflow-hidden">
      <div class="w-full py-6 pt-12 bg-white border-b shrink-0 shadow-sm relative z-10 flex justify-center">
        <div class="w-[600px] flex items-center gap-4 px-6">
          <button id="btn-back" class="text-stone-400 hover:text-stone-900 transition-colors p-2 shrink-0">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div class="flex-1 flex p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
            <button id="tab-speed" class="flex-1 py-3 text-xl font-black rounded-xl transition-all duration-300 ${isSpeed ? 'bg-white text-[#E23D28] shadow-md' : 'text-stone-400 opacity-60'}">
              个人竞速
            </button>
            <button id="tab-popularity" class="flex-1 py-3 text-xl font-black rounded-xl transition-all duration-300 ${!isSpeed ? 'bg-white text-[#E23D28] shadow-md' : 'text-stone-400 opacity-60'}">
              战队人气
            </button>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto w-full flex flex-col items-center px-8 pt-8 pb-24 space-y-4">
        <div class="w-[600px] flex flex-col gap-4">
          ${isSpeed ? (
            [1,2,3,4,5,6,7,8,9,10].map(i => `
              <div class="flex items-center p-8 bg-white border-2 border-stone-100 rounded-[32px] shadow-sm hover:border-red-100 transition-all">
                <div class="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center font-black italic mr-6 text-3xl shadow-inner border border-stone-100">${i < 4 ? ['🥇','🥈','🥉'][i-1] : i}</div>
                <div class="flex-1">
                  <div class="font-black text-3xl text-stone-900 mb-1">用户*${Math.floor(Math.random()*9000+1000)}</div>
                  <div class="text-sm font-black text-stone-400 uppercase tracking-widest">${CITIES[i % CITIES.length].name}战队</div>
                </div>
                <div class="text-stone-900 font-mono font-black text-4xl italic">18.${i*2 + Math.floor(Math.random()*9)}s</div>
              </div>
            `).join('')
          ) : (
            [...CITIES].sort((a, b) => b.participation - a.participation).map((city, i) => `
              <div class="flex items-center p-8 bg-white border-2 border-stone-100 rounded-[32px] shadow-sm hover:border-red-100 transition-all">
                <div class="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center font-black italic mr-6 text-3xl shadow-inner border border-stone-100">${i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}</div>
                <div class="flex-1">
                  <div class="font-black text-3xl text-stone-900 mb-1">${city.teamName}</div>
                  <div class="text-sm font-black text-stone-400 uppercase tracking-widest">${city.name}盟会</div>
                </div>
                <div class="flex flex-col items-end">
                  <div class="text-[#059669] font-black text-3xl">${city.participation.toLocaleString()}</div>
                  <div class="text-xs text-stone-400 font-black uppercase tracking-[0.2em]">参与人次</div>
                </div>
              </div>
            `).join('')
          )}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('btn-back').onclick = () => navigateTo('home');
  document.getElementById('tab-speed').onclick = () => {
    state.rankingTab = 'speed';
    render();
  };
  document.getElementById('tab-popularity').onclick = () => {
    state.rankingTab = 'popularity';
    render();
  };
}

// Initial Render
render();
