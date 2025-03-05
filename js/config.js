/**
 * Config.js
 * Cấu hình cho Game Gieo Quẻ May Mắn
 */

// Danh sách các quẻ may mắn
const FORTUNE_TYPES = [
    {
        id: 'suc-khoe',
        name: 'Sức Khỏe',
        icon: '❤️',
        color: '#e74c3c'
    },
    {
        id: 'sac-dep',
        name: 'Sắc Đẹp',
        icon: '✨',
        color: '#9b59b6'
    },
    {
        id: 'tinh-yeu',
        name: 'Tình Yêu',
        icon: '💘',
        color: '#ff6b81'
    },
    {
        id: 'su-nghiep',
        name: 'Sự Nghiệp',
        icon: '📈',
        color: '#3498db'
    },
    {
        id: 'gia-dinh',
        name: 'Gia Đình',
        icon: '👨‍👩‍👧‍👦',
        color: '#27ae60'
    },
    {
        id: 'tai-chinh',
        name: 'Tài Chính',
        icon: '💰',
        color: '#f1c40f'
    },
    {
        id: 'tri-tue',
        name: 'Trí Tuệ',
        icon: '🧠',
        color: '#1abc9c'
    },
    {
        id: 'niem-vui',
        name: 'Niềm Vui',
        icon: '😄',
        color: '#f39c12'
    },
    {
        id: 'hanh-phuc',
        name: 'Hạnh Phúc',
        icon: '🌈',
        color: '#2ecc71'
    },
    {
        id: 'y-chi',
        name: 'Ý Chí',
        icon: '🔥',
        color: '#e67e22'
    }
];

/**
 * Cấu hình chung cho frontend
 */

// URL của backend API - xử lý tất cả các tình huống
const API_URL = (() => {
    // Kiểm tra nếu đang mở file trực tiếp (file://)
    if (window.location.protocol === 'file:') {
        // Khi mở file trực tiếp, luôn sử dụng localhost:5001
        return 'http://localhost:5001/api';
    }
    
    // Kiểm tra môi trường: nếu chạy trên localhost, sử dụng URL đầy đủ với port 5001
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5001/api';
    }
    
    // Trên môi trường production (Vercel), sử dụng URL tương đối
    return '/api';
})(); 