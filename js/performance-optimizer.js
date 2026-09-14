// Taban Performance Monitor - 性能监控系统
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      domReady: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      interactiveTime: 0,
      memoryUsage: 0,
      networkRequests: 0,
      errorCount: 0
    };
    
    this.init();
  }
  
  init() {
    // 监控页面加载性能
    window.addEventListener('load', () => {
      this.calculateLoadTime();
      this.measurePerformance();
    });
    
    // 监控交互性能
    window.addEventListener('click', this.throttle(() => {
      this.metrics.interactiveTime = performance.now();
    }, 1000));
    
    // 监控内存使用
    setInterval(() => {
      this.checkMemoryUsage();
    }, 30000); // 30秒检查一次
    
    // 监控网络请求
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      this.metrics.networkRequests++;
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        console.log(`网络请求耗时: ${endTime - startTime}ms`, args[0]);
        return response;
      } catch (error) {
        this.metrics.errorCount++;
        console.error('网络请求失败:', error);
        throw error;
      }
    };
    
    // 监控错误
    window.addEventListener('error', (event) => {
      this.metrics.errorCount++;
      this.logError(event);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errorCount++;
      this.logError(event);
    });
    
    console.log('🔍 性能监控系统初始化完成');
  }
  
  calculateLoadTime() {
    this.metrics.loadTime = performance.now() - window.performance.timing.navigationStart;
    console.log(`页面加载时间: ${this.metrics.loadTime}ms`);
  }
  
  measurePerformance() {
    if (performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
      
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        this.metrics.domReady = navEntry.domContentLoadedEventEnd - navEntry.startTime;
      }
      
      console.log('性能指标:', this.metrics);
    }
  }
  
  checkMemoryUsage() {
    if (performance.memory) {
      this.metrics.memoryUsage = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
      
      const usageRatio = this.metrics.memoryUsage.used / this.metrics.memoryUsage.total;
      
      if (usageRatio > 0.8) {
        console.warn('⚠️ 内存使用率过高:', (usageRatio * 100).toFixed(2) + '%');
        TabanUI.toast('系统内存使用率过高，建议刷新页面', 'warning');
      }
    }
  }
  
  logError(error) {
    const errorData = {
      timestamp: new Date().toISOString(),
      type: error.error ? 'error' : 'unhandledrejection',
      message: error.message || error.reason,
      stack: error.error ? error.error.stack : error.reason?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    console.error('错误日志:', errorData);
    
    // 本地存储错误日志
    const errorLogs = JSON.parse(localStorage.getItem('taban_error_logs') || '[]');
    errorLogs.push(errorData);
    
    // 只保留最近100条错误日志
    if (errorLogs.length > 100) {
      errorLogs.shift();
    }
    
    localStorage.setItem('taban_error_logs', JSON.stringify(errorLogs));
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  getReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  }
}

// Taban Cache Manager - 缓存管理
class CacheManager {
  constructor() {
    this.prefix = 'taban_cache_';
    this.defaultTTL = 3600000; // 1小时
  }
  
  set(key, data, ttl = this.defaultTTL) {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('缓存设置失败:', error);
      return false;
    }
  }
  
  get(key) {
    try {
      const cachedData = localStorage.getItem(this.prefix + key);
      if (!cachedData) return null;
      
      const { data, timestamp, ttl } = JSON.parse(cachedData);
      
      // 检查是否过期
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('缓存获取失败:', error);
      return null;
    }
  }
  
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('缓存删除失败:', error);
      return false;
    }
  }
  
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('缓存清理失败:', error);
      return false;
    }
  }
  
  // 预加载关键数据
  preload() {
    // 预加载用户配置
    this.preloadUserConfig();
    
    // 预加载宠物数据
    this.preloadPetData();
    
    // 预加载缓存策略
    this.preloadCacheStrategy();
  }
  
  preloadUserConfig() {
    const userConfig = this.get('user_config');
    if (!userConfig) {
      // 模拟异步加载用户配置
      setTimeout(() => {
        const config = {
          theme: localStorage.getItem('taban_theme') || 'light',
          notifications: localStorage.getItem('taban_notifications') !== 'false',
          language: localStorage.getItem('taban_language') || 'zh-CN'
        };
        this.set('user_config', config, 86400000); // 24小时
      }, 100);
    }
  }
  
  preloadPetData() {
    const petData = this.get('pet_data');
    if (!petData) {
      // 模拟异步加载宠物数据
      setTimeout(() => {
        const pets = store.getPetList();
        this.set('pet_data', pets, 1800000); // 30分钟
      }, 200);
    }
  }
  
  preloadCacheStrategy() {
    const cacheStrategy = {
      user_config: 86400000, // 24小时
      pet_data: 1800000,     // 30分钟
      api_data: 300000,      // 5分钟
      images: 86400000,      // 24小时
      static: 604800000      // 7天
    };
    
    this.set('cache_strategy', cacheStrategy, 604800000); // 7天
  }
}

// Taban Network Monitor - 网络状态监控
class NetworkMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    this.init();
  }
  
  init() {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });
    
    // 监听网络质量变化
    if (this.connection) {
      this.connection.addEventListener('change', () => {
        this.handleConnectionChange();
      });
    }
    
    // 定期检查网络状态
    setInterval(() => {
      this.checkNetworkHealth();
    }, 60000); // 每分钟检查一次
  }
  
  handleOnline() {
    console.log('🌐 网络已连接');
    TabanUI.toast('网络已恢复', 'success');
    
    // 重新同步数据
    this.resyncData();
  }
  
  handleOffline() {
    console.log('📡 网络已断开');
    TabanUI.toast('网络连接已断开，将在恢复时同步数据', 'warning');
    
    // 保存离线操作
    this.saveOfflineOperations();
  }
  
  handleConnectionChange() {
    if (this.connection) {
      const connectionType = this.connection.effectiveType;
      const downlink = this.connection.downlink;
      const rtt = this.connection.rtt;
      
      console.log('网络连接变化:', {
        type: connectionType,
        downlink: downlink + 'Mbps',
        rtt: rtt + 'ms'
      });
    }
  }
  
  checkNetworkHealth() {
    if (this.isOnline) {
      fetch('https://www.google.com/favicon.ico', { cache: 'no-cache' })
        .then(() => {
          console.log('网络健康检查正常');
        })
        .catch(() => {
          console.warn('网络健康检查异常');
          this.handleOffline();
        });
    }
  }
  
  resyncData() {
    // 重新同步离线操作
    const offlineOps = JSON.parse(localStorage.getItem('taban_offline_ops') || '[]');
    if (offlineOps.length > 0) {
      console.log('同步离线操作:', offlineOps.length);
      // 这里可以添加具体的同步逻辑
      localStorage.removeItem('taban_offline_ops');
    }
  }
  
  saveOfflineOperations() {
    const offlineOps = JSON.parse(localStorage.getItem('taban_offline_ops') || '[]');
    offlineOps.push({
      type: 'offline',
      timestamp: Date.now(),
      data: window.location.href
    });
    
    // 只保留最近的50条离线操作
    if (offlineOps.length > 50) {
      offlineOps.shift();
    }
    
    localStorage.setItem('taban_offline_ops', JSON.stringify(offlineOps));
  }
  
  getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      connectionType: this.connection?.effectiveType || 'unknown',
      downlink: this.connection?.downlink || 0,
      rtt: this.connection?.rtt || 0,
      effectiveType: this.connection?.effectiveType || 'unknown'
    };
  }
}

// Taban Security Manager - 安全管理
class SecurityManager {
  constructor() {
    this.init();
  }
  
  init() {
    // XSS防护
    this.setupXSSProtection();
    
    // CSRF防护
    this.setupCSRFProtection();
    
    // 内容安全策略
    this.setupContentSecurityPolicy();
    
    // 输入验证
    this.setupInputValidation();
    
    console.log('🔒 安全管理系统初始化完成');
  }
  
  setupXSSProtection() {
    // 防御XSS攻击
    document.addEventListener('DOMContentLoaded', () => {
      // 过滤用户输入
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', (e) => {
          e.target.value = this.sanitizeInput(e.target.value);
        });
      });
      
      // 过滤富文本内容
      const richTexts = document.querySelectorAll('[contenteditable="true"]');
      richTexts.forEach(richText => {
        richText.addEventListener('input', (e) => {
          e.target.innerHTML = this.sanitizeHTML(e.target.innerHTML);
        });
      });
    });
  }
  
  setupCSRFProtection() {
    // 为异步请求添加CSRF令牌
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      if (args[1] && args[1].method && ['POST', 'PUT', 'DELETE'].includes(args[1].method)) {
        const csrfToken = localStorage.getItem('taban_csrf_token');
        if (csrfToken) {
          if (!args[1].headers) {
            args[1].headers = {};
          }
          args[1].headers['X-CSRF-Token'] = csrfToken;
        }
      }
      
      return originalFetch(...args);
    };
  }
  
  setupContentSecurityPolicy() {
    // 设置CSP头信息（通过服务器）
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error('CSP策略违规:', event);
      this.reportSecurityViolation(event);
    });
  }
  
  setupInputValidation() {
    // 输入验证规则
    this.validationRules = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^1[3-9]\d{9}$/,
      username: /^[a-zA-Z0-9_]{3,16}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      url: /^https?:\/\/.+\..+/,
      safeText: /^[\u4e00-\u9fa5a-zA-Z0-9\s\p{P}]+$/u
    };
  }
  
  sanitizeInput(input) {
    // 移除潜在的XSS攻击代码
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  sanitizeHTML(html) {
    // 移除危险的HTML标签
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // 移除脚本标签
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // 移除事件处理器
    const elements = temp.querySelectorAll('*');
    elements.forEach(element => {
      for (let attr of element.attributes) {
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      }
    });
    
    return temp.innerHTML;
  }
  
  validateInput(input, type) {
    const rule = this.validationRules[type];
    if (!rule) return true;
    
    return rule.test(input);
  }
  
  generateCSRFToken() {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    localStorage.setItem('taban_csrf_token', token);
    return token;
  }
  
  reportSecurityViolation(event) {
    const violation = {
      timestamp: new Date().toISOString(),
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      blockedURL: event.blockedURL,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      sourceFile: event.sourceFile
    };
    
    console.error('安全违规:', violation);
    
    // 本地存储安全日志
    const securityLogs = JSON.parse(localStorage.getItem('taban_security_logs') || '[]');
    securityLogs.push(violation);
    
    if (securityLogs.length > 100) {
      securityLogs.shift();
    }
    
    localStorage.setItem('taban_security_logs', JSON.stringify(securityLogs));
  }
}

// Taban Resource Optimizer - 资源优化器
class ResourceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.optimizeImages();
    this.optimizeCSS();
    this.optimizeJavaScript();
    this.lazyLoadResources();
    
    console.log('⚡ 资源优化器初始化完成');
  }
  
  optimizeImages() {
    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 图片格式优化提示
    if ('createImageBitmap' in window) {
      console.log('支持图片格式优化');
    }
  }
  
  optimizeCSS() {
    // CSS去重
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const seenStyles = new Set();
    
    stylesheets.forEach(stylesheet => {
      const href = stylesheet.href;
      if (seenStyles.has(href)) {
        stylesheet.remove();
      } else {
        seenStyles.add(href);
      }
    });
  }
  
  optimizeJavaScript() {
    // 代码分割和懒加载
    const scripts = document.querySelectorAll('script[data-src]');
    const scriptObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const script = entry.target;
          const newScript = document.createElement('script');
          newScript.src = script.dataset.src;
          newScript.async = true;
          document.head.appendChild(newScript);
          
          scriptObserver.unobserve(script);
        }
      });
    });
    
    scripts.forEach(script => scriptObserver.observe(script));
  }
  
  lazyLoadResources() {
    // 资源预加载
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach(link => {
      const href = link.href;
      const as = link.as;
      
      if (as === 'image') {
        const img = new Image();
        img.src = href;
      } else if (as === 'script') {
        const script = document.createElement('script');
        script.src = href;
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }
}

// 初始化所有监控系统
const performanceMonitor = new PerformanceMonitor();
const cacheManager = new CacheManager();
const networkMonitor = new NetworkMonitor();
const securityManager = new SecurityManager();
const resourceOptimizer = new ResourceOptimizer();

// 全局导出
window.TabanPerformance = performanceMonitor;
window.TabanCache = cacheManager;
window.TabanNetwork = networkMonitor;
window.TabanSecurity = securityManager;
window.TabanOptimizer = resourceOptimizer;

// 页面加载完成后执行优化操作
document.addEventListener('DOMContentLoaded', () => {
  // 预加载数据
  cacheManager.preload();
  
  // 生成CSRF令牌
  securityManager.generateCSRFToken();
  
  console.log('🎯 所有优化系统初始化完成');
});