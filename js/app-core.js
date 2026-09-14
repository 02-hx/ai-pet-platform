// Taban Store - 统一数据管理
const TabanStore = {
  // 数据版本控制
  version: '1.0.0',
  
  // 初始化
  init() {
    this.checkDataVersion();
    this.loadDataIntegrity();
  },
  
  // 数据版本检查
  checkDataVersion() {
    const savedVersion = localStorage.getItem('taban_version');
    if (savedVersion !== this.version) {
      console.log('数据版本更新，执行迁移:', savedVersion, '->', this.version);
      this.migrateData(savedVersion, this.version);
      localStorage.setItem('taban_version', this.version);
    }
  },
  
  // 数据迁移
  migrateData(fromVersion, toVersion) {
    // 从低版本迁移到高版本的逻辑
    if (fromVersion && fromVersion < '1.0.0') {
      console.log('执行旧数据迁移');
      // 这里可以添加具体的迁移逻辑
    }
  },
  
  // 数据完整性检查
  loadDataIntegrity() {
    const essentialKeys = ['taban_profile', 'taban_pets', 'taban_memories'];
    essentialKeys.forEach(key => {
      if (!localStorage.getItem(key)) {
        console.warn(`缺少必要数据: ${key}`);
        this.createDefaultData(key);
      }
    });
  },
  
  // 创建默认数据
  createDefaultData(key) {
    switch(key) {
      case 'taban_profile':
        localStorage.setItem(key, JSON.stringify({
          id: Date.now(),
          name: '新用户',
          avatar: '👤',
          createdAt: new Date().toISOString()
        }));
        break;
      case 'taban_pets':
        localStorage.setItem(key, JSON.stringify([]));
        break;
      case 'taban_memories':
        localStorage.setItem(key, JSON.stringify([]));
        break;
    }
  },
  
  // 统一数据获取方法
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`获取数据失败: ${key}`, error);
      return defaultValue;
    }
  },
  
  // 统一数据设置方法
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`保存数据失败: ${key}`, error);
      return false;
    }
  },
  
  // 统一数据删除方法
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除数据失败: ${key}`, error);
      return false;
    }
  },
  
  // 数据备份
  backup() {
    const backupData = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('taban_')) {
        backupData[key] = this.get(key);
      }
    });
    return backupData;
  },
  
  // 数据恢复
  restore(backupData) {
    Object.keys(backupData).forEach(key => {
      this.set(key, backupData[key]);
    });
  }
};

// Taban UI - 统一UI管理
const TabanUI = {
  // 主题管理
  themes: {
    light: {
      '--primary-soft': '#FFEAD9',
      '--primary-deep': '#FF8A00',
      '--bg-gradient': 'linear-gradient(135deg, #FFF9F2, #FFF3E6)',
      '--bg-soft': '#FFF8F0',
      '--ink-deep': '#2C2C2C',
      '--ink-soft': '#666666',
      '--ink-faint': '#999999',
      '--line': '#E5E5E5',
      '--green-deep': '#4CAF50',
      '--red-deep': '#f44336',
      '--blue-deep': '#2196F3'
    },
    dark: {
      '--primary-soft': '#FFB74D',
      '--primary-deep': '#FF6B00',
      '--bg-gradient': 'linear-gradient(135deg, #2C2C2C, #1A1A1A)',
      '--bg-soft': '#333333',
      '--ink-deep': '#FFFFFF',
      '--ink-soft': '#CCCCCC',
      '--ink-faint': '#999999',
      '--line': '#444444',
      '--green-deep': '#66BB6A',
      '--red-deep': '#EF5350',
      '--blue-deep': '#42A5F5'
    }
  },
  
  // 初始化主题
  initTheme() {
    const savedTheme = localStorage.getItem('taban_theme') || 'light';
    this.applyTheme(savedTheme);
  },
  
  // 应用主题
  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (theme) {
      Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
      });
      localStorage.setItem('taban_theme', themeName);
    }
  },
  
  // 切换主题
  toggleTheme() {
    const currentTheme = localStorage.getItem('taban_theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  },
  
  // Toast通知系统
  toast(message, type = 'info', duration = 3000) {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${this.getToastIcon(type)}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  // 获取Toast图标
  getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  },
  
  // 确认对话框
  confirm(title, message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="modal-actions">
          <button class="modal-btn cancel" onclick="TabanUI.closeModal()">取消</button>
          <button class="modal-btn confirm" onclick="TabanUI.handleConfirm()">确定</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    window.currentConfirmCallback = onConfirm;
    window.currentCancelCallback = onCancel;
    
    setTimeout(() => modal.classList.add('show'), 10);
  },
  
  // 关闭模态框
  closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
    if (window.currentCancelCallback) {
      window.currentCancelCallback();
    }
  },
  
  // 处理确认
  handleConfirm() {
    if (window.currentConfirmCallback) {
      window.currentConfirmCallback();
    }
    this.closeModal();
  },
  
  // 加载动画
  showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = `
      <div class="loader">
        <div class="loader-spinner"></div>
        <div class="loader-text">加载中...</div>
      </div>
    `;
    document.body.appendChild(loader);
    return loader;
  },
  
  hideLoading(loader) {
    if (loader) {
      loader.remove();
    } else {
      const existingLoader = document.querySelector('.loader-overlay');
      if (existingLoader) {
        existingLoader.remove();
      }
    }
  }
};

// Taban API - 统一API管理
const TabanAPI = {
  // 基础配置
  baseUrl: '',
  
  // 统一请求方法
  async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(this.baseUrl + url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API请求失败:', error);
      TabanUI.toast('网络请求失败，请检查网络连接', 'error');
      throw error;
    }
  },
  
  // GET请求
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? url + '?' + queryString : url;
    return this.request(fullUrl, { method: 'GET' });
  },
  
  // POST请求
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // PUT请求
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // DELETE请求
  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
};

// Taban Utils - 工具函数集合
const TabanUtils = {
  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // 深拷贝
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = this.deepClone(obj[key]);
    });
    return cloned;
  },
  
  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  
  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes);
  },
  
  // 格式化文件大小
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // 文件类型检查
  isValidFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
  },
  
  // 文件大小检查
  isValidFileSize(file, maxSize) {
    return file.size <= maxSize;
  },
  
  // 安全HTML过滤
  sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },
  
  // 验证邮箱
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // 验证手机号
  isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },
  
  // 数字范围检查
  isInRange(num, min, max) {
    return num >= min && num <= max;
  },
  
  // 随机数组项
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  
  // 数组去重
  uniqueArray(array) {
    return [...new Set(array)];
  }
};

// 向后兼容的别名
const store = TabanStore;
const toast = TabanUI.toast;
const confirm = TabanUI.confirm;

// 全局初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化存储
  TabanStore.init();
  
  // 初始化主题
  TabanUI.initTheme();
  
  // 初始化错误处理
  if (typeof errorHandler !== 'undefined') {
    errorHandler.init();
  }
  
  // 检查数据完整性
  TabanStore.checkDataIntegrity();
  
  console.log('Taban系统初始化完成');
});