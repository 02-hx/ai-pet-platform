// 统一错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global Error:', message, source, lineno, colno, error);
  showToast('系统出现错误，已自动记录', 'error');
  return false;
};

// 异步错误处理
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  showToast('网络请求失败，请检查网络连接', 'error');
  event.preventDefault();
});

// 性能监控
const PerformanceMonitor = {
  start(name) {
    performance.mark(`${name}-start`);
  },
  
  end(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    const measures = performance.getEntriesByName(name);
    console.log(`${name}耗时: ${measures[0].duration}ms`);
  }
};

// 网络状态监控
const NetworkMonitor = {
  isOnline: navigator.onLine,
  
  init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      showToast('网络已恢复', 'success');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      showToast('网络连接已断开', 'warning');
    });
  }
};

// 内存监控
const MemoryMonitor = {
  checkMemory() {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize;
      const total = performance.memory.totalJSHeapSize;
      const ratio = used / total;
      
      if (ratio > 0.8) {
        console.warn('内存使用率过高:', ratio);
        showToast('系统内存使用率过高，建议刷新页面', 'warning');
      }
    }
  }
};

// 初始化监控
NetworkMonitor.init();
setInterval(MemoryMonitor.checkMemory, 30000); // 30秒检查一次