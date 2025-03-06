class FloatingWish {
  constructor(wish, container) {
    this.wish = wish;
    this.container = container;
    this.element = document.createElement('div');
    this.element.className = 'floating-wish';
    this.isHovered = false;
    this.moveInterval = null;
    this.currentPosition = { x: 0, y: 0 };
    this.init();
  }

  // Thêm hàm sanitize để ngăn chặn XSS
  sanitizeHTML(text) {
    if (!text) return '';
    // Tạo một phần tử div tạm thời
    const tempElement = document.createElement('div');
    // Đặt nội dung vào textContent (không phải innerHTML) để chuyển đổi tất cả HTML thành text
    tempElement.textContent = text;
    // Lấy ra text đã được sanitize
    return tempElement.textContent;
  }

  init() {
    // Tạo vị trí ngẫu nhiên trên trục X (chỉ ở 2 bên)
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const margin = 100;
    const sideWidth = (window.innerWidth - 800) / 2 - margin;
    
    let randomX;
    if (side === 'left') {
      randomX = margin + Math.random() * sideWidth;
    } else {
      randomX = window.innerWidth - margin - Math.random() * sideWidth;
    }
    
    this.currentPosition.x = randomX;
    this.currentPosition.y = -100;
    this.updatePosition();
    
    // Sanitize dữ liệu người dùng trước khi hiển thị
    const sanitizedName = this.sanitizeHTML(this.wish.name);
    const sanitizedMessage = this.sanitizeHTML(this.wish.message);
    
    this.element.innerHTML = `
      <div class="wish-bubble">
        <div class="flower">
          <div class="petal petal-1"></div>
          <div class="petal petal-2"></div>
          <div class="petal petal-3"></div>
          <div class="petal petal-4"></div>
          <div class="petal petal-5"></div>
          <div class="petal petal-6"></div>
          <div class="petal petal-7"></div>
          <div class="petal petal-8"></div>
          <div class="flower-center">
            <div class="wish-name">${sanitizedName}</div>
          </div>
        </div>
        <div class="wish-message hidden">
          <div class="recipient-name">Gửi đến: ${sanitizedName || 'Bạn'}</div>
          <div class="message-content">${sanitizedMessage}</div>
        </div>
      </div>
    `;

    // Thêm sự kiện hover và click
    const wishBubbleEl = this.element.querySelector('.wish-bubble');
    const flowerEl = this.element.querySelector('.flower');
    const messageEl = this.element.querySelector('.wish-message');

    const showMessage = () => {
      if (!this.isHovered) {
        // console.log('Show message triggered');
        this.isHovered = true;
        this.pauseAnimation();
        messageEl.classList.remove('hidden');
        flowerEl.classList.add('paused');
      }
    };

    const hideMessage = (event) => {
      // Kiểm tra xem mouse có đang ở trên wish-bubble hoặc các phần tử con không
      // event có thể là null trong trường hợp gọi qua event handler khác
      const isStillHovering = event && wishBubbleEl.contains(event.relatedTarget);
      if (this.isHovered && !isStillHovering) {
        // console.log('Hide message triggered');
        this.isHovered = false;
        this.resumeAnimation();
        messageEl.classList.add('hidden');
        flowerEl.classList.remove('paused');
      }
    };

    // Áp dụng sự kiện cho toàn bộ wish-bubble
    wishBubbleEl.addEventListener('mouseenter', showMessage);
    wishBubbleEl.addEventListener('mouseleave', hideMessage);
    wishBubbleEl.addEventListener('click', (event) => {
      if (this.isHovered) {
        // Chỉ ẩn khi click vào flower, không ẩn khi click vào message
        if (!messageEl.contains(event.target)) {
          hideMessage(null);  // Truyền null vì không có event.relatedTarget
        }
      } else {
        showMessage();
      }
    });

    this.container.appendChild(this.element);
    requestAnimationFrame(() => this.animate());
  }

  updatePosition() {
    this.element.style.left = `${this.currentPosition.x}px`;
    this.element.style.bottom = `${this.currentPosition.y}px`;
  }

  pauseAnimation() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
    
    // Lưu vị trí hiện tại theo đúng cách
    const computedStyle = getComputedStyle(this.element);
    this.currentPosition.x = parseFloat(computedStyle.left) || this.currentPosition.x;
    this.currentPosition.y = parseFloat(computedStyle.bottom) || this.currentPosition.y;
    
    // Cố định vị trí tại chỗ, không thay đổi transition
    this.element.style.transform = 'translate3d(0,0,0)';
    this.element.style.transition = 'none';
    this.element.style.left = `${this.currentPosition.x}px`;
    this.element.style.bottom = `${this.currentPosition.y}px`;
  }

  resumeAnimation() {
    // Tính toán thời gian còn lại dựa trên vị trí hiện tại
    const remainingHeight = window.innerHeight + 200 - this.currentPosition.y;
    const remainingDuration = (remainingHeight / (window.innerHeight + 400)) * this.duration;
    
    if (remainingDuration <= 0) {
      this.element.remove();
      return;
    }
    
    // Khôi phục animation từ vị trí hiện tại
    this.element.style.transition = `all ${remainingDuration/1000}s linear`;
    this.element.style.transform = 'translate3d(0,0,0)';
    
    setTimeout(() => {
      // Dùng setTimeout để đảm bảo transition được áp dụng sau khi CSS được cập nhật
      this.currentPosition.y = window.innerHeight + 200;
      this.updatePosition();
      this.startSideMovement(remainingDuration);
    }, 50);
  }

  animate() {
    this.duration = 15000 + Math.random() * 5000;
    const finalHeight = window.innerHeight + 200;
    
    this.element.style.transition = `all ${this.duration/1000}s linear`;
    
    setTimeout(() => {
      this.currentPosition.y = finalHeight;
      this.updatePosition();
      this.startSideMovement(this.duration);
    }, Math.random() * 1000);
  }

  startSideMovement(duration) {
    const startLeft = this.currentPosition.x;
    const amplitude = 30;
    const frequency = 2 * Math.PI / duration * 1000;
    const startTime = Date.now();

    this.moveInterval = setInterval(() => {
      if (this.isHovered) return;

      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(this.moveInterval);
        this.element.remove();
        return;
      }
      
      this.currentPosition.x = startLeft + Math.sin(elapsed * frequency) * amplitude;
      this.updatePosition();
    }, 50);
  }
}

class FloatingWishes {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'floating-wishes-container';
    document.body.appendChild(this.container);
    this.wishes = [];
    this.init();
  }

  init() {
    const style = document.createElement('style');
    style.textContent = `
      #floating-wishes-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      }

      .floating-wish {
        position: absolute;
        pointer-events: auto;
        cursor: pointer;
        z-index: 10000;
        transform: translate3d(0,0,0);
      }

      .wish-bubble {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }

      .flower {
        position: relative;
        width: 80px;
        height: 80px;
        transform-origin: center center;
        transition: transform 0.3s ease;
        animation: flowerRotate 20s linear infinite;
        will-change: transform;
      }

      .flower.paused {
        animation-play-state: paused;
        transform: scale(1.1);
      }

      .petal {
        position: absolute;
        width: 30px;
        height: 30px;
        background: #ffd1dc;
        border-radius: 50% 50% 0 50%;
        transform-origin: 100% 100%;
        transition: all 0.3s ease;
      }

      .flower.paused .petal {
        background: #ffb6c1;
      }

      .petal-1 { transform: rotate(0deg); }
      .petal-2 { transform: rotate(45deg); }
      .petal-3 { transform: rotate(90deg); }
      .petal-4 { transform: rotate(135deg); }
      .petal-5 { transform: rotate(180deg); }
      .petal-6 { transform: rotate(225deg); }
      .petal-7 { transform: rotate(270deg); }
      .petal-8 { transform: rotate(315deg); }

      .flower-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: #ff69b4;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      }

      .flower.paused .flower-center {
        background: #ff1493;
      }

      .wish-name {
        font-weight: bold;
        text-align: center;
        color: white;
        font-size: 10px;
        padding: 3px;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        letter-spacing: -0.2px;
        transform: scale(0.9);
        transform-origin: center center;
        line-height: 1.1;
      }

      .wish-message {
        position: absolute;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        width: max-content;
        max-width: 250px;
        top: 110%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 10px;
        z-index: 2;
        border: 1px solid #ffd1dc;
        color: #333;
        font-size: 13px;
        line-height: 1.5;
        pointer-events: auto;
        cursor: default;
      }

      .recipient-name {
        font-weight: bold;
        color: #ff69b4;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px dashed #ffd1dc;
        text-align: center;
      }

      .message-content {
        color: #555;
      }

      .hidden {
        display: none;
      }

      @keyframes flowerRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    this.startPolling();
  }

  async fetchRecentWishes() {
    try {
      const response = await fetch(`${API_URL}/wishes/recent`);
      const data = await response.json();
      if (data.success) {
        // console.log('Nhận được lời chúc:', data.data); // Thêm log để debug
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lời chúc:', error);
      return [];
    }
  }

  addWish(wish) {
    // console.log('Thêm lời chúc mới:', wish); // Thêm log để debug
    new FloatingWish(wish, this.container);
  }

  async startPolling() {
    // Lấy dữ liệu ban đầu và hiển thị ngay
    const initialWishes = await this.fetchRecentWishes();
    initialWishes.forEach(wish => this.addWish(wish));
    
    // Polling mỗi 10 giây
    setInterval(async () => {
      const newWishes = await this.fetchRecentWishes();
      
      // Hiển thị ngẫu nhiên các lời chúc nhận được từ API, không phân biệt trùng lặp
      if (newWishes.length > 0) {
        // Lấy ngẫu nhiên từ 1 đến 3 lời chúc để hiển thị
        const numToShow = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numToShow; i++) {
          // Chọn một lời chúc ngẫu nhiên từ danh sách
          const randomIndex = Math.floor(Math.random() * newWishes.length);
          const randomWish = newWishes[randomIndex];
          
          // Hiển thị lời chúc ngẫu nhiên
          this.addWish(randomWish);
        }
      }
      
      // Cập nhật danh sách lời chúc trong bộ nhớ, chỉ để lưu trữ
      this.wishes = [...newWishes];
      
      // Giới hạn số lượng lời chúc lưu trong bộ nhớ
      if (this.wishes.length > 30) {
        this.wishes = this.wishes.slice(-30);
      }
    }, 10000);
  }
}

// Khởi tạo component
window.addEventListener('DOMContentLoaded', () => {
  new FloatingWishes();
}); 