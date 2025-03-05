/**
 * Class quản lý hiển thị và tương tác với nhân vật NPC (Thầy bói)
 */
class NPCCharacter {
    constructor() {
        this.createNPCElement();
        this.showWelcomeMessage();
        
        // Thêm style cho animation
        if (!document.getElementById('npc-animations')) {
            const style = document.createElement('style');
            style.id = 'npc-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Tạo phần tử HTML cho NPC và thêm vào DOM
     */
    createNPCElement() {
        // Tạo container chính
        const container = document.createElement('div');
        container.className = 'npc-container';

        // Tạo phần tử hình ảnh NPC
        const npcImage = document.createElement('img');
        npcImage.src = './img/npc.png';
        npcImage.alt = 'Thầy bói';
        npcImage.className = 'npc-image';
        
        // Thêm sự kiện click vào hình ảnh thầy bói
        npcImage.addEventListener('click', () => this.showClickMessage());

        // Thêm vào container
        container.appendChild(npcImage);
        document.body.appendChild(container);
        
        this.container = container;
    }

    /**
     * Hiển thị lời chào mừng từ NPC
     */
    showWelcomeMessage() {
        const message = document.createElement('div');
        message.className = 'welcome-message';
        message.innerHTML = `
            <p>Chào mừng quý khách! 🎎</p>
            <p>Thầy bói xin phép giúp bạn khám phá vận mệnh ngày 8/3 nhé!</p>
            <p>Số may mắn thầy lấy đánh đề nhé 🤣</p>
        `;

        // Tạo nút đóng welcome message
        const closeButton = document.createElement('button');
        closeButton.className = 'close-welcome-btn';
        closeButton.innerHTML = '✖';
        closeButton.setAttribute('aria-label', 'Đóng');
        closeButton.addEventListener('click', () => this.closeWelcomeMessage(message));
        
        // Thêm nút đóng vào message
        message.appendChild(closeButton);

        this.container.insertBefore(message, this.container.firstChild);
        this.welcomeMessage = message;
    }
    
    /**
     * Đóng welcome message khi click vào nút đóng
     * @param {HTMLElement} messageElement - Phần tử welcome message cần đóng
     */
    closeWelcomeMessage(messageElement) {
        // Thêm animation fade out
        messageElement.style.animation = 'fadeOut 0.5s ease-out forwards';
        
        // Xóa phần tử sau khi animation kết thúc
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.remove();
            }
        }, 500);
    }
    
    /**
     * Hiển thị thông báo khi click vào thầy bói
     */
    showClickMessage() {
        // Xóa message cũ nếu có
        const oldMessage = this.container.querySelector('.click-message');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        // Tạo message mới
        const message = document.createElement('div');
        message.className = 'click-message';
        message.innerHTML = `<p>Ái, thầy đẹp trai chứ hông dễ dãi, đừng đụng chạm vào người thầy nhé 😎</p>`;
        
        // Thêm style cho message
        message.style.cssText = `
            background-color: #ff9800;
            color: #fff;
            padding: 10px 15px;
            border-radius: 8px;
            margin-top: 10px;
            position: absolute;
            max-width: 250px;
            animation: fadeIn 0.3s ease-out;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        
        // Thêm message vào container
        this.container.appendChild(message);
        
        // Tự động ẩn message sau 3 giây
        setTimeout(() => {
            if (message && message.parentNode) {
                message.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    if (message && message.parentNode) {
                        message.remove();
                    }
                }, 500);
            }
        }, 3000);
    }
}

// Khởi tạo NPC khi trang web được load
document.addEventListener('DOMContentLoaded', () => {
    new NPCCharacter();
}); 