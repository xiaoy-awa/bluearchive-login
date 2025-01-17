const formTitle = document.getElementById('formTitle');
const submitButton = document.getElementById('submitButton');
const toggleForm = document.getElementById('toggleForm');
const transitionOverlay = document.querySelector('.transition-overlay');
const transitionVideo = document.getElementById('transitionVideo');
const formContainer = document.querySelector('.form-container');
const container = document.querySelector('.container');
const leftSide = document.querySelector('.left-side');
const emailGroup = document.getElementById('emailGroup');
const codeGroup = document.getElementById('codeGroup');
const getCodeLink = document.getElementById('getCodeLink');
const emailInput = document.getElementById('emailInput');
const codeInput = document.getElementById('codeInput');

let isLoginForm = true;

function handleResize() {
    if (window.innerWidth < 768) {
        document.body.style.backgroundImage = leftSide.style.backgroundImage;
        leftSide.style.display = 'none';
        container.style.background = 'rgba(255, 255, 255, 0.8)';
    } else {
        document.body.style.backgroundImage = 'none';
        leftSide.style.display = 'block';
        container.style.background = 'white';
    }
}

window.addEventListener('resize', handleResize);
handleResize();

toggleForm.addEventListener('click', (e) => {
    e.preventDefault();
    
    // 移除所有动画类
    formContainer.classList.remove('scale-in', 'slide-up');
    formContainer.style.animation = 'none';
    
    // 强制重排
    formContainer.offsetHeight;
    
    // 添加退出动画
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateY(10px)';
    formContainer.style.transition = 'all 0.3s ease-out';

    setTimeout(() => {
        toggleFormContent();
        
        // 重置过渡效果
        formContainer.style.transition = '';
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
        
        // 添加新的动画
        formContainer.style.animation = 'scaleIn 0.4s ease-out forwards';
    }, 300);
});

function toggleFormContent() {
    isLoginForm = !isLoginForm;
    formTitle.textContent = isLoginForm ? '登录' : '注册';
    submitButton.textContent = isLoginForm ? '登录' : '注册';
    toggleForm.textContent = isLoginForm ? '没有账号？注册' : '已有账号？登录';

    // 控制记住我选项的显示/隐藏
    const rememberMeDiv = document.querySelector('.remember-me');
    if (isLoginForm) {
        rememberMeDiv.style.display = 'flex';
    } else {
        rememberMeDiv.style.display = 'none';
    }

    emailGroup.style.display = isLoginForm ? 'none' : 'block';
    codeGroup.style.display = isLoginForm ? 'none' : 'block';
    document.querySelector('.checkbox-group').style.display = isLoginForm ? 'none' : 'flex';
    
    // 重新初始化表单处理
    initializeFormHandling();
}

getCodeLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // 检查是否处于禁用状态
    if (getCodeLink.classList.contains('disabled')) {
        return;
    }
    
    // 检查本地存储中的倒计时
    const savedTime = localStorage.getItem('codeCountdown');
    if (savedTime) {
        const remainingTime = Math.ceil((parseInt(savedTime) - Date.now()) / 1000);
        if (remainingTime > 0) {
            return; // 如果还在倒计时中，直接返回
        }
    }
    
    getCodeLink.classList.add('disabled');
    let countdown = 60;
    
    // 存储结束时间到本地存储
    const endTime = Date.now() + countdown * 1000;
    localStorage.setItem('codeCountdown', endTime.toString());
    
    // 显示验证码发送成功提示
    showAlert('验证码已发送', '请在5分钟内完成验证', 'success');
    
    const updateText = () => {
        const now = Date.now();
        const remaining = Math.ceil((endTime - now) / 1000);
        
        if (remaining <= 0) {
            clearInterval(interval);
            getCodeLink.classList.remove('disabled');
            getCodeLink.textContent = '获取验证码';
            localStorage.removeItem('codeCountdown');
        } else {
            getCodeLink.textContent = `${remaining}s`;
        }
    };
    
    updateText();
    const interval = setInterval(updateText, 1000);
});

// 页面加载时检查倒计时状态
window.addEventListener('load', () => {
    const savedTime = localStorage.getItem('codeCountdown');
    if (savedTime) {
        const remainingTime = Math.ceil((parseInt(savedTime) - Date.now()) / 1000);
        if (remainingTime > 0) {
            getCodeLink.classList.add('disabled');
            
            const interval = setInterval(() => {
                const remaining = Math.ceil((parseInt(savedTime) - Date.now()) / 1000);
                if (remaining <= 0) {
                    clearInterval(interval);
                    getCodeLink.classList.remove('disabled');
                    getCodeLink.textContent = '获取验证码';
                    localStorage.removeItem('codeCountdown');
                } else {
                    getCodeLink.textContent = `${remaining}s`;
                }
            }, 1000);
        }
    }
});

// 设置面板相关代码
const settingsBtn = document.querySelector('.settings-btn');
const settingsPanel = document.querySelector('.settings-panel');
const darkModeToggle = document.getElementById('darkModeToggle');

// 从localStorage加载深色模式设置
const isDarkMode = localStorage.getItem('darkMode') === 'true';

if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// 切换设置面板
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
});

// 点击面板外关闭面板
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPanel.classList.remove('active');
    }
});

// 颜色选择器相关代码
const colorPicker = document.getElementById('colorPicker');
const presetColors = document.querySelectorAll('.color-option');

// 从localStorage加载颜色
const savedColor = localStorage.getItem('themeColor') || '#3b82f6';
colorPicker.value = savedColor;
applyThemeColor(savedColor);

// 更新预设颜色的激活状态
function updatePresetActive(color) {
    presetColors.forEach(preset => {
        if (preset.dataset.color.toLowerCase() === color.toLowerCase()) {
            preset.classList.add('active');
        } else {
            preset.classList.remove('active');
        }
    });
}

// 初始化时设置激活状态
updatePresetActive(savedColor);

// 预设颜色点击事件
presetColors.forEach(preset => {
    preset.addEventListener('click', () => {
        const color = preset.dataset.color;
        colorPicker.value = color;
        updatePresetActive(color);
        applyThemeColor(color);
        localStorage.setItem('themeColor', color);
    });
});

colorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    updatePresetActive(color);
    applyThemeColor(color);
});

colorPicker.addEventListener('change', (e) => {
    const color = e.target.value;
    localStorage.setItem('themeColor', color);
});

// 深色模式切换
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeToggle.checked);
});

// 应用主题颜色
function applyThemeColor(color) {
    document.documentElement.style.setProperty('--theme-color', color);
    const style = document.createElement('style');
    style.textContent = `
        button { background: ${color} !important; }
        button:hover { background: ${adjustColor(color, -20)} !important; }
        .settings-btn { background: ${color}; }
        .settings-btn:hover { background: ${adjustColor(color, -20)}; }
        input:checked + .slider { background-color: ${color}; }
        #getCodeLink { color: ${color}; }
        #getCodeLink:hover { background: ${color}20; }
        .toggle-form { color: ${color}; }
        input:focus { border-color: ${color}; }
    `;
    document.head.appendChild(style);
}

// 调整颜色明度
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// 加载动画相关代码
const loadingOverlay = document.querySelector('.loading-overlay');

// 页面加载完成后移除加载动画
window.addEventListener('load', () => {
    // 确保至少显示250ms的加载动画
    setTimeout(() => {
        loadingOverlay.classList.add('fade-out');
        // 动画结束后移除元素
        setTimeout(() => {
            loadingOverlay.remove();
        }, 250);
    }, 250);
});

// 如果页面加载时间过长，显示提示信息
setTimeout(() => {
    if (document.readyState !== 'complete') {
        loadingOverlay.innerHTML += '<p style="margin-top: 20px; color: #666;">加载时间可能较长，请耐心等待...</p>';
    }
}, 3000);

// 获取表单元素
const usernameInput = document.querySelector('input[type="text"]');
const passwordInput = document.querySelector('input[type="password"]');
const rememberMeCheckbox = document.getElementById('rememberMe');

// 页面加载时检查本地存储
window.addEventListener('load', () => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMe && savedUsername && savedPassword) {
        usernameInput.value = savedUsername;
        passwordInput.value = savedPassword;
        rememberMeCheckbox.checked = true;
    }
});

// 定义全局变量来存储表单提交处理函数
let handleSubmit = null;

// 定义表单提交处理函数
function initializeFormHandling() {
    handleSubmit = async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('username', usernameInput.value);
        formData.append('password', passwordInput.value);
        formData.append('action', isLoginForm ? 'login' : 'register');
        
        if (!isLoginForm) {
            formData.append('email', emailInput.value);
        }
        
        // 如果选中"记住我"，保存登录信息
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedUsername', usernameInput.value);
            localStorage.setItem('rememberedPassword', passwordInput.value);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberMe');
        }
        
        try {
            // 发送请求到服务器
            const response = await fetch(window.location.href, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            // 确保在显示弹窗之前创建容器
            let alertContainer = document.getElementById('alertContainer');
            if (!alertContainer) {
                alertContainer = document.createElement('div');
                alertContainer.id = 'alertContainer';
                document.body.appendChild(alertContainer);
            }
            
            if (data.success) {
                showAlert(isLoginForm ? '登录成功' : '注册成功', data.message, 'success');
                // 延迟跳转，确保用户能看到成功提示
                setTimeout(() => {
                    window.location.href = '/user.php';
                //登陆后跳转地址
                }, 1500);
            } else {
                showAlert(isLoginForm ? '登录失败' : '注册失败', data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('操作失败', '请稍后重试', 'error');
        }
    };

    // 绑定表单提交事件
    const authForm = document.getElementById('authForm');
    if (authForm) {
        // 移除旧的事件监听器
        authForm.removeEventListener('submit', handleSubmit);
        // 添加新的事件监听器
        authForm.addEventListener('submit', handleSubmit);
    }
}

// 确保在页面加载时初始化表单处理
document.addEventListener('DOMContentLoaded', () => {
    initializeFormHandling();
});

// 修改显示弹窗的函数，保留多个弹窗的动画效果
function showAlert(title, message, type = 'success') {
    // 确保容器存在
    let alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        document.body.appendChild(alertContainer);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.innerHTML = `
        <h2>${title}</h2>
        <h3>${message}</h3>
    `;
    
    // 先添加到容器中
    alertContainer.appendChild(alertDiv);
    
    // 强制重排
    alertDiv.offsetHeight;
    
    // 添加显示类
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    let hideTimeout;
    let removeTimeout;
    
    const startHideTimer = () => {
        hideTimeout = setTimeout(() => {
            alertDiv.classList.remove('show');
            alertDiv.classList.add('fade-out');
            removeTimeout = setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertContainer.removeChild(alertDiv);
                }
            }, 300);
        }, 3000);
    };
    
    // 鼠标进入时清除定时器
    alertDiv.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        clearTimeout(removeTimeout);
        alertDiv.classList.remove('fade-out');
    });
    
    // 鼠标离开时重新开始计时
    alertDiv.addEventListener('mouseleave', startHideTimer);
    
    // 开始初始计时
    startHideTimer();
}