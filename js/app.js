/* ============================================================
   它伴 TaBan · 存储与共享工具
   ============================================================ */

const store = {
  /* --- 宠物分身 --- */
  getPets() {
    const mine = JSON.parse(localStorage.getItem('taban_pets') || '[]');
    return [...PRESET_PETS, ...mine];
  },
  getPet(id) {
    return this.getPets().find(p => p.id === id) || null;
  },
  saveUserPet(pet) {
    const mine = JSON.parse(localStorage.getItem('taban_pets') || '[]');
    mine.push(pet);
    localStorage.setItem('taban_pets', JSON.stringify(mine));
  },

  /* --- 用户档案 --- */
  getProfile() {
    return JSON.parse(localStorage.getItem('taban_profile') || '{}');
  },
  saveProfile(p) {
    localStorage.setItem('taban_profile', JSON.stringify(p));
  },

  /* --- 陪伴关系（按宠物存） --- */
  getBond(petId) {
    const all = JSON.parse(localStorage.getItem('taban_bonds') || '{}');
    return all[petId] || null;
  },
  getPetBond(petId) {
    return this.getBond(petId) || {};
  },
  saveBond(petId, bond) {
    const all = JSON.parse(localStorage.getItem('taban_bonds') || '{}');
    all[petId] = bond;
    localStorage.setItem('taban_bonds', JSON.stringify(all));
  },
  getBonds() {
    return JSON.parse(localStorage.getItem('taban_bonds') || '{}');
  },

  /* --- 主人私信（亲密度达标解锁） --- */
  getProofs() {
    return JSON.parse(localStorage.getItem('taban_proofs') || '{}');
  },

  getProof(petId) {
    return this.getProofs()[petId] || null;
  },

  getChats() {
    return JSON.parse(localStorage.getItem('taban_chats') || '{}');
  },

  getChat(petId) {
    return this.getChats()[petId] || null;
  },
  unlockChat(petId) {
    const all = this.getChats();
    if (all[petId]) return all[petId];
    const pet = this.getPet(petId);
    const ownerName = (pet.owner || '主人').split(' · ')[0];
    const hello = pet.memorial ? [
      { who: 'owner', t: Date.now(), text: `你好…我是${pet.name}的主人${ownerName}。谢谢你愿意来陪它、记得它 🌈` },
      { who: 'owner', t: Date.now() + 1, text: `看它和你聊天的时候，就像他还在一样。他生前的事，你想知道什么都可以问我。` },
    ] : [
      { who: 'owner', t: Date.now(), text: `你好呀！我是${pet.name}的主人${ownerName}😊 刚收到平台通知——你和${pet.name}的亲密度达标啦，它最近总提起你。` },
      { who: 'owner', t: Date.now() + 1, text: `最近我节奏比较忙，谢谢你愿意陪它。关于它的任何事都可以问我，随便聊～` },
    ];
    const chat = { msgs: hello, unread: hello.length };
    all[petId] = chat;
    localStorage.setItem('taban_chats', JSON.stringify(all));
    return chat;
  },
  setEmergencyMode(petId, isOn) {
    const modes = this.getEmergencyModes();
    modes[petId] = isOn;
    localStorage.setItem('taban_emergency_modes', JSON.stringify(modes));
  },

  getEmergencyModes() {
    return JSON.parse(localStorage.getItem('taban_emergency_modes') || '{}');
  },

  getPetHealth(petId) {
    return JSON.parse(localStorage.getItem(`taban_health_${petId}`) || JSON.stringify({
      vaccinations: [],
      checkups: [],
      dewormings: [],
      weightRecords: [],
      medications: [],
      notes: []
    }));
  },

  addReminder(reminder) {
    const reminders = this.getReminders();
    reminders.push(reminder);
    if (reminders.length > 50) reminders.shift();
    localStorage.setItem('taban_reminders', JSON.stringify(reminders));
  },

  getReminders() {
    return JSON.parse(localStorage.getItem('taban_reminders') || '[]');
  },

  saveRecommendations(recommendations) {
    const allRecs = this.getAllRecommendations();
    const index = allRecs.findIndex(r => r.petId === recommendations.petId);
    if (index > -1) {
      allRecs[index] = recommendations;
    } else {
      allRecs.push(recommendations);
    }
    localStorage.setItem('taban_recommendations', JSON.stringify(allRecs));
  },

  getRecommendations(petId) {
    const allRecs = this.getAllRecommendations();
    return allRecs.find(r => r.petId === petId);
  },

  getAllRecommendations() {
    return JSON.parse(localStorage.getItem('taban_recommendations') || '[]');
  },

  setPetPersonality(petId, personality) {
    localStorage.setItem(`taban_personality_${petId}`, personality);
  },

  getPetPersonality(petId) {
    return localStorage.getItem(`taban_personality_${petId}`) || 'energetic';
  },

  addEmojiHistory(petId, emojiData) {
    const history = this.getEmojiHistory(petId);
    history.unshift(emojiData); // 添加到开头
    if (history.length > 50) history.pop(); // 最多保存50条
    localStorage.setItem(`taban_emoji_${petId}`, JSON.stringify(history));
  },

  getEmojiHistory(petId) {
    return JSON.parse(localStorage.getItem(`taban_emoji_${petId}`) || '[]');
  },

  getEmergencyMode(petId) {
    return this.getEmergencyModes()[petId] || false;
  },

  setProof(proof) {
    const all = this.getProofs();
    all[proof.petId] = proof;
    localStorage.setItem('taban_proofs', JSON.stringify(all));
  },

  saveChat(petId, chat) {
    const all = this.getChats();
    all[petId] = chat;
    localStorage.setItem('taban_chats', JSON.stringify(all));
  },
};

/* 亲密度达到该值（「眼熟了」）即可解锁与主人私信 */
const CHAT_UNLOCK = 80;

/* 初始化一段新的陪伴关系 */
function newBond() {
  return {
    affinity: 0,            // 亲密度 0~1000
    totalChat: 0,           // 累计消息
    memories: [],           // 记忆碎片
    lastSeen: Date.now(),   // 上次互动
    status: { mood: 70, hunger: 70, energy: 70 },
    metToday: false,
  };
}

/* 亲密度 → 等级 */
function levelOf(affinity) {
  let cur = LEVELS[0], next = null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (affinity >= LEVELS[i].min) cur = LEVELS[i];
  }
  const idx = LEVELS.indexOf(cur);
  next = LEVELS[idx + 1] || null;
  const progress = next ? (affinity - cur.min) / (next.min - cur.min) : 1;
  return { ...cur, idx, next, progress: Math.min(1, Math.max(0, progress)) };
}

/* 离线状态漂移：饥饿下降、精力回复、心情受影响 */
function applyStatusDrift(bond) {
  const hours = Math.min(72, (Date.now() - bond.lastSeen) / 3600e3);
  const s = bond.status;
  s.hunger = clamp(s.hunger - hours * 5, 8, 100);
  s.energy = clamp(s.energy + hours * 7, 10, 100);
  s.mood = clamp(s.mood - hours * 3 - (s.hunger < 30 ? 10 : 0), 10, 100);
  bond.lastSeen = Date.now();
  return bond;
}

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

/* 宠物头像 DOM：优先展示照片，无照片则回退到 emoji */
function avatarHTML(pet, size = 64, fontSize = 34) {
  const inner = pet.photo
    ? `<img src="${pet.photo}" alt="${pet.name}">`
    : `<span>${pet.emoji || SPECIES[pet.species].emoji}</span>`;
  return `<div class="pet-avatar hue-${pet.hue ?? 0}" style="width:${size}px;height:${size}px;font-size:${fontSize}px">
    ${inner}
    ${pet.memorial ? '<span class="deco">🌈</span>' : ''}
  </div>`;
}

/* 本地图片压缩：读文件 → 等比缩放 → JPEG dataURL（避免 localStorage 超额） */
function compressImage(file, maxSide = 360, quality = 0.85) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* 根据性格滑块生成标签 */
function traitTags(pet) {
  const tags = [];
  tags.push({ t: STYLES[pet.style]?.label || '独特性格', c: STYLES[pet.style]?.tag || 'orange' });
  if (pet.energy >= 75) tags.push({ t: '元气满满', c: 'orange' });
  else if (pet.energy <= 40) tags.push({ t: '安静优雅', c: 'green' });
  if (pet.clingy >= 75) tags.push({ t: '黏人体质', c: 'pink' });
  if (pet.mischief >= 75) tags.push({ t: '拆家预备役', c: 'purple' });
  else if (pet.mischief <= 30) tags.push({ t: '乖巧懂事的让人心疼', c: 'green' });
  return tags.slice(0, 3);
}

/* Toast */
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2400);
}

/* 导航高亮 */
function markNav(id) {
  const a = document.querySelector(`.nav-links a#${id}`);
  if (a) a.classList.add('active');
}

/* 公共导航 / 页脚注入（减少重复） */
function renderChrome(active) {
  const profile = store.getProfile();
  const hiName = profile.name ? `，${profile.name}` : '';
  document.getElementById('nav').innerHTML = `
    <div class="nav-inner">
      <a class="logo" href="index.html"><span class="paw">🐾</span>它伴</a>
      <div class="nav-links">
        <a href="index.html" id="nav-home">首页</a>
        <a href="square.html" id="nav-square">宠物广场</a>
        <a href="match.html" id="nav-match">契合度测试</a>
        <a href="create.html" id="nav-create">创建分身</a>
        <a href="market.html" id="nav-market">🏠 投喂市场</a>
        <a href="health.html" id="nav-health">🏥 健康档案</a>
        <a href="pet-personality.html" id="nav-personality">🎨 性格定制</a>
        <a href="pet-recommendations.html" id="nav-recommendations">🤖 智能推荐</a>
        <a href="points-system.html" id="nav-points">🌟 积分体系</a>
        <a href="knowledge.html" id="nav-knowledge">📚 知识库</a>
        <a href="messages.html" id="nav-msg">私信</a>
        <a href="companion.html" class="btn small" id="nav-go">开始陪伴${hiName}</a>
      </div>
    </div>`;
  updateNavBadge();
  if (active && document.getElementById(active)) document.getElementById(active).classList.add('active');

  document.getElementById('footer').innerHTML = `
    <div class="wrap">
      <div class="cols">
        <div>
          <div class="brand"><span class="paw">🐾</span>它伴 TaBan</div>
          <div class="slogan">把心爱的它，变成永远在线的陪伴。AI 数字分身 × 真人互动 × 感情契合度。</div>
        </div>
        <div>
          <h5>体验产品</h5>
          <a href="square.html">宠物广场</a>
          <a href="match.html">契合度测试</a>
          <a href="create.html">创建宠物分身</a>
          <a href="companion.html">互动房间</a>
          <a href="messages.html">主人私信</a>
        </div>
        <div>
          <h5>了解更多</h5>
          <a href="index.html#how">双边模式</a>
          <a href="index.html#features">核心功能</a>
          <a href="index.html#stories">温暖故事</a>
          <a href="index.html#faq">常见问题</a>
        </div>
      </div>
      <div class="base">它伴 TaBan · 概念原型演示 · 所有宠物均为演示数据 · © 2026 TaBan Lab</div>
    </div>`;
}

/* 刷新导航「私信」上的未读红点 */
function updateNavBadge() {
  const a = document.getElementById('nav-msg');
  if (!a) return;
  const n = Object.values(store.getChats()).reduce((s, c) => s + (c.unread || 0), 0);
  a.innerHTML = '私信' + (n > 0 ? `<em class="nav-dot">${n > 99 ? '99+' : n}</em>` : '');
}

/* 便捷跳转：设定当前互动宠物 */
function goCompanion(petId) {
  localStorage.setItem('taban_active_pet', petId);
  location.href = 'companion.html?pet=' + encodeURIComponent(petId);
}

function getActivePet() {
  const qs = new URLSearchParams(location.search).get('pet');
  const id = qs || localStorage.getItem('taban_active_pet');
  const pet = id ? store.getPet(id) : null;
  return pet || store.getPets()[0];
}
