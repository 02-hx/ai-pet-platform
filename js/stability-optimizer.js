// 稳定性优化脚本
// 解决网站不稳定问题

class StabilityOptimizer {
    constructor() {
        this.memoryMonitorInterval = null;
        this.errorMonitorInterval = null;
        this.performanceMonitorInterval = null;
        this.init();
    }

    init() {
        console.log('🚀 启动稳定性优化器...');
        
        // 启动内存监控
        this.startMemoryMonitor();
        
        // 启动错误监控
        this.startErrorMonitor();
        
        // 启动性能监控
        this.startPerformanceMonitor();
        
        // 页面卸载时清理
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    // 内存监控
    startMemoryMonitor() {
        this.memoryMonitorInterval = setInterval(() => {
            if (performance.memory) {
                const usedJSHeapSize = performance.memory.usedJSHeapSize / 1024 / 1024;
                const totalJSHeapSize = performance.memory.totalJSHeapSize / 1024 / 1024;
                const jsHeapSizeLimit = performance.memory.jsHeapSizeLimit / 1024 / 1024;
                
                const memoryUsagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;
                
                // 记录内存使用情况
                console.log(`📊 内存使用: ${memoryUsagePercent.toFixed(2)}% (${usedJSHeapSize.toFixed(2)}MB)`);
                
                // 如果内存使用超过85%，清理内存
                if (memoryUsagePercent > 85) {
                    this.cleanupMemory();
                    console.warn('⚠️ 内存使用过高，已执行清理');
                }
            }
        }, 30000); // 每30秒检查一次
    }

    // 错误监控
    startErrorMonitor() {
        this.errorMonitorInterval = setInterval(() => {
            // 检查全局错误
            if (window.lastError) {
                console.error('❌ 检测到全局错误:', window.lastError);
                this.handleGlobalError(window.lastError);
                window.lastError = null;
            }
            
            // 检查未处理的Promise错误
            if (window.unhandledPromiseRejection) {
                console.error('❌ 未处理的Promise拒绝:', window.unhandledPromiseRejection);
                this.handleUnhandledRejection(window.unhandledPromiseRejection);
                window.unhandledPromiseRejection = null;
            }
        }, 15000); // 每15秒检查一次
    }

    // 性能监控
    startPerformanceMonitor() {
        this.performanceMonitorInterval = setInterval(() => {
            // 检查页面响应性
            const now = Date.now();
            const lastInteraction = window.lastInteractionTime || now;
            const idleTime = now - lastInteraction;
            
            // 如果页面超过2分钟没有交互，可能存在卡死
            if (idleTime > 120000) {
                console.warn('⚠️ 页面长时间无交互，可能卡死');
                this.checkPageResponsiveness();
            }
            
            // 检查网络连接状态
            if (navigator.onLine === false) {
                console.error('❌ 网络连接已断开');
                this.handleNetworkError();
            }
        }, 20000); // 每20秒检查一次
    }

    // 清理内存
    cleanupMemory() {
        // 清理定时器
        const timers = Object.keys(window);
        timers.forEach(key => {
            if (key.startsWith('timer_') || key.startsWith('interval_')) {
                const timer = window[key];
                if (timer && (timer.hasOwnProperty('cancel') || timer.hasOwnProperty('clear'))) {
                    if (timer.cancel) timer.cancel();
                    if (timer.clear) timer.clear();
                }
            }
        });

        // 清理事件监听器
        const events = ['click', 'scroll', 'resize', 'input', 'change'];
        events.forEach(eventType => {
            const elements = document.querySelectorAll(`*[data-${eventType}]`);
            elements.forEach(element => {
                element.removeEventListener(eventType, element[`__${eventType}Handler__`]);
            });
        });

        // 清理闭包引用
        if (window.closureReferences) {
            window.closureReferences = {};
        }

        console.log('✅ 内存清理完成');
    }

    // 处理全局错误
    handleGlobalError(error) {
        // 记录错误信息
        console.error('全局错误详情:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });

        // 如果是关键错误，建议用户刷新
        if (error.message.includes('Memory') || error.message.includes('Stack')) {
            console.warn('💡 检测到内存或堆栈错误，建议刷新页面');
        }
    }

    // 处理Promise拒绝
    handleUnhandledRejection(rejection) {
        console.error('未处理的Promise拒绝:', rejection);
        
        // 如果是网络相关的错误，重试
        if (rejection.reason && rejection.reason.message.includes('Network')) {
            console.log('🔄 尝试重新建立网络连接...');
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }
    }

    // 检查页面响应性
    checkPageResponsiveness() {
        const start = Date.now();
        let responseDetected = false;
        
        // 创建一个临时事件监听器来检测响应
        const tempHandler = () => {
            responseDetected = true;
            document.removeEventListener('click', tempHandler);
            document.removeEventListener('keydown', tempHandler);
        };
        
        document.addEventListener('click', tempHandler);
        document.addEventListener('keydown', tempHandler);
        
        // 等待1秒看是否有响应
        setTimeout(() => {
            if (!responseDetected) {
                console.error('❌ 页面无响应，建议刷新');
                window.location.reload();
            }
        }, 1000);
        
        // 记录最后交互时间
        window.lastInteractionTime = Date.now();
    }

    // 处理网络错误
    handleNetworkError() {
        console.warn('🌐 网络连接断开，尝试重新连接...');
        
        // 等待网络恢复
        const checkNetwork = () => {
            if (navigator.onLine) {
                console.log('✅ 网络已恢复');
                window.location.reload();
            } else {
                setTimeout(checkNetwork, 5000);
            }
        };
        
        setTimeout(checkNetwork, 5000);
    }

    // 清理资源
    cleanup() {
        if (this.memoryMonitorInterval) {
            clearInterval(this.memoryMonitorInterval);
        }
        if (this.errorMonitorInterval) {
            clearInterval(this.errorMonitorInterval);
        }
        if (this.performanceMonitorInterval) {
            clearInterval(this.performanceMonitorInterval);
        }
        
        this.cleanupMemory();
        console.log('🧹 稳定性优化器已清理');
    }
}

// 记录用户交互
document.addEventListener('click', () => {
    window.lastInteractionTime = Date.now();
});

document.addEventListener('keydown', () => {
    window.lastInteractionTime = Date.now();
});

// 启动稳定性优化器
window.stabilityOptimizer = new StabilityOptimizer();

console.log('🛡️ 稳定性优化器已启动');