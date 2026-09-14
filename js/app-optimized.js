// Taban App - 优化后的核心应用逻辑
// 使用模块化架构，确保代码质量和可维护性

console.log('🚀 Taban应用核心初始化开始...');

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global Error:', message, source, lineno, colno, error);
  showMessage('系统出现错误，已自动记录', 'error');
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  showMessage('网络请求失败，请检查网络连接', 'error');
  event.preventDefault();
});

// 检查并加载核心模块
let TabanStore, TabanUI, TabanAPI, TabanUtils;

try {
  // 动态加载核心模块
  if (typeof require !== 'undefined') {
    TabanStore = require('./js/app-core.js').TabanStore;
    TabanUI = require('./js/app-core.js').TabanUI;
    TabanAPI = require('./js/app-core.js').TabanAPI;
    TabanUtils = require('./js/app-core.js').TabanUtils;
  }
} catch (e) {
  console.log('核心模块加载失败，使用降级方案');
}

// 降级方案：基础功能实现
const TabanFallback = {
  // 数据存储
  store: {
    get: function(key, defaultValue) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (e) {
        console.error(`获取数据失败: ${key}`, e);
        return defaultValue;
      }
    },
    set: function(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`保存数据失败: ${key}`, e);
        return false;
      }
    }
  },
  
  // UI管理
  ui: {
    toast: function(message, type = 'info') {
      console.log(`[${type.toUpperCase()}] ${message}`);
      alert(message);
    },
    
    confirm: function(title, message, onConfirm) {
      if (confirm(`${title}\n\n${message}`)) {
        onConfirm && onConfirm();
      }
    }
  }
};

// 向后兼容的store对象
const store = {
  // 用户管理
  getProfile: () => TabanStore?.get('taban_profile', {}) || TabanFallback.store.get('taban_profile', {}),
  setProfile: (profile) => TabanStore?.set('taban_profile', profile) || TabanFallback.store.set('taban_profile', profile),
  updateProfile: (updates) => {
    const profile = this.getProfile();
    const newProfile = { ...profile, ...updates };
    return this.setProfile(newProfile);
  },
  
  // 宠物管理
  getPetList: () => TabanStore?.get('taban_pets', []) || TabanFallback.store.get('taban_pets', []),
  getPet: (petId) => {
    const pets = this.getPetList();
    return pets.find(p => p.id === petId);
  },
  addPet: (pet) => {
    const pets = this.getPetList();
    pets.push({ ...pet, id: pet.id || Date.now() });
    TabanStore?.set('taban_pets', pets) || TabanFallback.store.set('taban_pets', pets);
  },
  updatePet: (petId, updates) => {
    const pets = this.getPetList();
    const index = pets.findIndex(p => p.id === petId);
    if (index > -1) {
      pets[index] = { ...pets[index], ...updates };
      TabanStore?.set('taban_pets', pets) || TabanFallback.store.set('taban_pets', pets);
    }
  },
  deletePet: (petId) => {
    const pets = this.getPetList();
    const filtered = pets.filter(p => p.id !== petId);
    TabanStore?.set('taban_pets', filtered) || TabanFallback.store.set('taban_pets', filtered);
  },
  
  // 亲密度管理
  getPetBond: (petId) => TabanStore?.get(`taban_bond_${petId}`, {}) || TabanFallback.store.get(`taban_bond_${petId}`, {}),
  setPetBond: (petId, bond) => TabanStore?.set(`taban_bond_${petId}`, bond) || TabanFallback.store.set(`taban_bond_${petId}`, bond),
  updatePetBond: (petId, updates) => {
    const bond = this.getPetBond(petId);
    const newBond = { ...bond, ...updates };
    this.setPetBond(petId, newBond);
    return newBond;
  },
  
  // 健康管理
  getPetHealth: (petId) => TabanStore?.get(`taban_health_${petId}`, {
    vaccinations: [],
    checkups: [],
    dewormings: [],
    weightRecords: [],
    medications: [],
    notes: []
  }) || TabanFallback.store.get(`taban_health_${petId}`, {
    vaccinations: [],
    checkups: [],
    dewormings: [],
    weightRecords: [],
    medications: [],
    notes: []
  }),
  setPetHealth: (petId, health) => TabanStore?.set(`taban_health_${petId}`, health) || TabanFallback.store.set(`taban_health_${petId}`, health),
  
  // 性格管理
  getPetPersonality: (petId) => TabanStore?.get(`taban_personality_${petId}`, {}) || TabanFallback.store.get(`taban_personality_${petId}`, {}),
  setPetPersonality: (petId, personality) => TabanStore?.set(`taban_personality_${petId}`, personality) || TabanFallback.store.set(`taban_personality_${petId}`, personality),
  
  // 提醒管理
  getReminders: () => TabanStore?.get('taban_reminders', []) || TabanFallback.store.get('taban_reminders', []),
  addReminder: (reminder) => {
    const reminders = this.getReminders();
    reminders.push(reminder);
    if (reminders.length > 50) reminders.shift();
    TabanStore?.set('taban_reminders', reminders) || TabanFallback.store.set('taban_reminders', reminders);
  },
  
  // 记忆管理
  getMemories: () => TabanStore?.get('taban_memories', []) || TabanFallback.store.get('taban_memories', []),
  addMemory: (memory) => {
    const memories = this.getMemories();
    memories.push({...memory, id: Date.now(), createdAt: new Date().toISOString()});
    TabanStore?.set('taban_memories', memories) || TabanFallback.store.set('taban_memories', memories);
  },
  
  // 消息管理
  getMessages: () => TabanStore?.get('taban_messages', []) || TabanFallback.store.get('taban_messages', []),
  addMessage: (message) => {
    const messages = this.getMessages();
    messages.push({...message, id: Date.now(), createdAt: new Date().toISOString()});
    TabanStore?.set('taban_messages', messages) || TabanFallback.store.set('taban_messages', messages);
  },
  
  // 测验结果
  getQuizResults: () => TabanStore?.get('taban_quiz_results', []) || TabanFallback.store.get('taban_quiz_results', []),
  addQuizResult: (result) => {
    const results = this.getQuizResults();
    results.push({...result, id: Date.now(), createdAt: new Date().toISOString()});
    TabanStore?.set('taban_quiz_results', results) || TabanFallback.store.set('taban_quiz_results', results);
  },
  
  // 知识积分
  getKnowledgePoints: () => TabanStore?.get('taban_knowledge_points', 0) || TabanFallback.store.get('taban_knowledge_points', 0),
  addKnowledgePoints: (points) => {
    const current = this.getKnowledgePoints();
    const newPoints = current + points;
    TabanStore?.set('taban_knowledge_points', newPoints) || TabanFallback.store.set('taban_knowledge_points', newPoints);
  },
  
  // 徽章系统
  getBadges: () => TabanStore?.get('taban_badges', []) || TabanFallback.store.get('taban_badges', []),
  addBadge: (badge) => {
    const badges = this.getBadges();
    if (!badges.find(b => b.id === badge.id)) {
      badges.push(badge);
      TabanStore?.set('taban_badges', badges) || TabanFallback.store.set('taban_badges', badges);
    }
  },
  
  // 兼容性检查
  checkCompatibility: () => {
    const profile = this.getProfile();
    if (!profile.id) {
      this.setProfile({
        id: Date.now(),
        name: '新用户',
        avatar: '👤',
        createdAt: new Date().toISOString()
      });
    }
  }
};

// 全局渲染函数
function renderChrome(page) {
  const nav = document.getElementById('nav');
  const footer = document.getElementById('footer');
  
  if (nav) {
    nav.innerHTML = `
      <div class="nav-list">
        <a href="index.html" class="nav-item ${page === 'nav-home' ? 'active' : ''}">🏠 首页</a>
        <a href="square.html" class="nav-item ${page === 'nav-square' ? 'active' : ''}">🌟 社区</a>
        <a href="health.html" class="nav-item ${page === 'nav-health' ? 'active' : ''}">🏥 健康档案</a>
        <a href="pet-personality.html" class="nav-item ${page === 'nav-personality' ? 'active' : ''}">🎨 性格定制</a>
        <a href="pet-recommendations.html" class="nav-item ${page === 'nav-recommendations' ? 'active' : ''}">🤖 智能推荐</a>
        <a href="points-system.html" class="nav-item ${page === 'nav-points' ? 'active' : ''}">🌟 积分体系</a>
        <a href="knowledge.html" class="nav-item ${page === 'nav-knowledge' ? 'active' : ''}">📚 知识库</a>
        <a href="messages.html" class="nav-item ${page === 'nav-msg' ? 'active' : ''}">💬 私信</a>
      </div>
    `;
  }
  
  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>它伴 TaBan</h4>
            <p>AI驱动的宠物社交平台</p>
          </div>
          <div class="footer-section">
            <h4>功能特色</h4>
            <p>AI智能推荐 | 健康管理 | 社交互动</p>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>📧 hello@taban-pet.com</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 它伴 TaBan. 保留所有权利.</p>
        </div>
      </div>
    `;
  }
}

// 全局工具函数
function avatarHTML(user, size = 40, textSize = 20) {
  const avatarSize = size || 40;
  const avatarTextSize = textSize || 20;
  return `
    <div class="avatar" style="width: ${avatarSize}px; height: ${avatarSize}px; font-size: ${avatarTextSize}px;">
      ${user.avatar || '👤'}
    </div>
  `;
}

function bondLevelText(bondValue) {
  if (bondValue < 20) return '陌生';
  if (bondValue < 40) return '初识';
  if (bondValue < 60) return '熟悉';
  if (bondValue < 80) return '亲密';
  return '挚友';
}

function bondLevelColor(bondValue) {
  if (bondValue < 20) return '#999999';
  if (bondValue < 40) return '#FFC107';
  if (bondValue < 60) return '#4CAF50';
  if (bondValue < 80) return '#2196F3';
  return '#9C27B0';
}

// 消息提示函数
function showMessage(message, type = 'info') {
  if (TabanUI && TabanUI.toast) {
    TabanUI.toast(message, type);
  } else if (TabanFallback.ui.toast) {
    TabanFallback.ui.toast(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
  }
}

// 确认对话框函数
function showConfirm(title, message, onConfirm, onCancel) {
  if (TabanUI && TabanUI.confirm) {
    TabanUI.confirm(title, message, onConfirm, onCancel);
  } else if (TabanFallback.ui.confirm) {
    TabanFallback.ui.confirm(title, message, onConfirm);
  } else {
    if (confirm(`${title}\n\n${message}`)) {
      onConfirm && onConfirm();
    } else {
      onCancel && onCancel();
    }
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  try {
    // 检查数据兼容性
    if (store && store.checkCompatibility) {
      store.checkCompatibility();
    }
    
    // 初始化Toast系统
    if (TabanUI && TabanUI.initTheme) {
      TabanUI.initTheme();
    }
    
    console.log('✅ Taban应用初始化完成');
  } catch (error) {
    console.error('❌ Taban应用初始化失败:', error);
    showMessage('系统初始化失败，请刷新页面重试', 'error');
  }
});

// 导出全局对象
window.store = store;
window.renderChrome = renderChrome;
window.avatarHTML = avatarHTML;
window.bondLevelText = bondLevelText;
window.bondLevelColor = bondLevelColor;
window.showMessage = showMessage;
window.showConfirm = showConfirm;
window.TabanStore = TabanStore;
window.TabanUI = TabanUI;
window.TabanAPI = TabanAPI;
window.TabanUtils = TabanUtils;

console.log('🎉 Taban应用核心初始化完成！');