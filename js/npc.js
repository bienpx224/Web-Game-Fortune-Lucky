/**
 * Class quản lý hiển thị và tương tác với nhân vật NPC (Thầy bói)
 */
class NPCCharacter {
    constructor() {
        this.createNPCElement();
        this.showWelcomeMessage();
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
        `;

        this.container.insertBefore(message, this.container.firstChild);
    }
}

// Khởi tạo NPC khi trang web được load
document.addEventListener('DOMContentLoaded', () => {
    new NPCCharacter();
}); 