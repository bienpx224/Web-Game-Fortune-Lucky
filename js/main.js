/**
 * Game Gieo Quẻ May Mắn - main.js
 * Code by AI Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const nameScreen = document.getElementById('nameScreen');
    const gameScreen = document.getElementById('gameScreen');
    const loadingScreen = document.getElementById('loadingScreen');
    const resultScreen = document.getElementById('resultScreen');
    
    const playerNameInput = document.getElementById('playerName');
    const startGameButton = document.getElementById('startGame');
    const playerNameDisplay = document.getElementById('playerNameDisplay');
    const resultNameDisplay = document.getElementById('resultNameDisplay');
    
    const fortuneBox = document.getElementById('fortuneBox');
    const drawFortuneButton = document.getElementById('drawFortune');
    const fortuneTypeDisplay = document.getElementById('fortuneType');
    const fortuneResultDisplay = document.getElementById('fortuneResult');
    
    const drawAgainButton = document.getElementById('drawAgain');
    const shareResultButton = document.getElementById('shareResult');
    
    // Game state
    let playerName = '';
    let selectedFortune = null;
    
    // Event listeners
    startGameButton.addEventListener('click', startGame);
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startGame();
    });
    
    drawFortuneButton.addEventListener('click', drawFortune);
    fortuneBox.addEventListener('click', drawFortune);
    
    drawAgainButton.addEventListener('click', resetGame);
    shareResultButton.addEventListener('click', shareResult);
    
    /**
     * Khởi động game khi người dùng nhập tên
     */
    function startGame() {
        playerName = playerNameInput.value.trim();
        
        if (!playerName) {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }
        
        // Hiển thị tên người chơi
        playerNameDisplay.textContent = playerName;
        
        // Chuyển sang màn hình gieo quẻ
        nameScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }
    
    /**
     * Thực hiện rút quẻ khi người dùng nhấn nút
     */
    function drawFortune() {
        // Hiệu ứng rung lắc
        fortuneBox.classList.add('shaking');
        
        // Vô hiệu hóa nút trong quá trình lắc
        drawFortuneButton.disabled = true;
        
        // Sau 0.8 giây (thời gian của animation), chọn quẻ ngẫu nhiên
        setTimeout(() => {
            // Chọn ngẫu nhiên 1 trong 10 quẻ
            const randomIndex = Math.floor(Math.random() * FORTUNE_TYPES.length);
            selectedFortune = FORTUNE_TYPES[randomIndex];
            
            // Thay đổi icon trong fortune box
            fortuneBox.innerHTML = `<span style="font-size: 3rem;">${selectedFortune.icon}</span>`;
            
            // Dừng hiệu ứng rung lắc
            fortuneBox.classList.remove('shaking');
            
            // Hiển thị màn hình loading
            gameScreen.classList.add('hidden');
            loadingScreen.classList.remove('hidden');
            
            // Gọi API Backend để lấy kết quả
            getFortuneResult(selectedFortune, playerName);
        }, 800);
    }
    
    /**
     * Hiển thị thông báo lỗi cho người dùng
     */
    function showErrorMessage(error) {
        let errorMessage = '';
        
        // Xác định loại lỗi
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMessage = `
                <div class="error-box">
                    <h3>Không thể kết nối đến server!</h3>
                    <p>Có vẻ như server backend không hoạt động. Hãy thử các cách sau:</p>
                    <ul>
                        <li>Đảm bảo server backend đang chạy ở port 5001</li>
                        <li>Mở web bằng Live Server thay vì mở file trực tiếp</li>
                        <li>Kiểm tra console để biết thêm thông tin</li>
                    </ul>
                    <p>Đang hiển thị kết quả mẫu...</p>
                </div>
            `;
            
            // Hiển thị thông báo trong 5 giây
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-notification';
            errorContainer.innerHTML = errorMessage;
            document.body.appendChild(errorContainer);
            
            setTimeout(() => {
                document.body.removeChild(errorContainer);
            }, 5000);
        }
    }
    
    /**
     * Gọi API Backend để lấy kết quả
     */
    async function getFortuneResult(fortune, name) {
        try {
            // Gọi API backend
            const response = await fetch(`${API_URL}/fortune`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fortuneType: fortune.name,
                    playerName: name
                })
            });
            
            // Kiểm tra kết quả
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi gọi API');
            }
            
            // Xử lý kết quả
            const data = await response.json();
            
            // Hiển thị kết quả
            showResult(fortune, name, data.data.result, data.data.luckyNumber);
        } catch (error) {
            console.error('Lỗi khi lấy kết quả:', error);
            
            // Hiển thị thông báo lỗi
            showErrorMessage(error);
            
            // Sử dụng kết quả mẫu nếu có lỗi
            showMockResult(fortune, name);
        }
    }
    
    /**
     * Hiển thị kết quả
     */
    function showResult(fortune, name, result, luckyNumber) {
        // Cập nhật màn hình kết quả
        fortuneTypeDisplay.textContent = `${fortune.icon} ${fortune.name}`;
        fortuneTypeDisplay.style.color = fortune.color;
        resultNameDisplay.textContent = name;
        
        // Xử lý định dạng kết quả để hiển thị đẹp hơn
        const formattedResult = formatFortuneMessage(result, name);
        
        // Thêm số may mắn vào cuối kết quả (nếu có)
        let finalResult = formattedResult;
        if (luckyNumber !== undefined && luckyNumber !== null) {
            // Format số may mắn luôn hiển thị 2 chữ số (00-99)
            const formattedNumber = luckyNumber.toString().padStart(2, '0');
            finalResult += `<p class="lucky-number">Số may mắn của bạn: ${formattedNumber}</p>`;
        }
        
        fortuneResultDisplay.innerHTML = finalResult;
        
        // Chuyển sang màn hình kết quả
        loadingScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        // Lưu kết quả vào localStorage
        saveResult(fortune, name, result, luckyNumber);
    }
    
    /**
     * Định dạng nội dung lời chúc để hiển thị đẹp hơn với màu sắc
     */
    function formatFortuneMessage(message, name) {
        if (!message) return '';
        
        // Tách các dòng của tin nhắn
        let lines = message.split('\n');
        
        // Định dạng mỗi dòng - áp dụng màu sắc tự động qua CSS
        let formattedLines = lines.map(line => {
            // Bôi đậm tên người nhận
            line = line.replace(
                new RegExp(name, 'gi'), 
                `<strong>${name}</strong>`
            );
            
            return `<p>${line}</p>`;
        });
        
        return formattedLines.join('');
    }
    
    /**
     * Hiển thị kết quả mẫu (sử dụng khi không có API key hoặc có lỗi)
     */
    function showMockResult(fortune, name) {
        const mockResults = {
            'suc-khoe': `${name} ơi, sức khỏe là vàng,\nNgày 8/3 chúc bạn trăm năm dài lâu.\nDịu dàng mà vẫn mạnh mẽ,\nSức khỏe dồi dào, tươi vui mỗi ngày.`,
            'sac-dep': `Vẻ đẹp tỏa sáng từ trong tâm hồn,\nChúc ${name} luôn rạng rỡ và tự tin.\nNgày 8/3 thêm xinh tươi lộng lẫy,\nĐẹp như hoa, duyên như ngọc.`,
            'tinh-yeu': `Tình yêu đến nhẹ nhàng như gió,\nChúc ${name} tìm thấy nửa kia hoàn hảo.\nHạnh phúc ngọt ngào đong đầy trái tim,\nYêu và được yêu, trọn vẹn mỗi ngày.`,
            'su-nghiep': `Sự nghiệp thăng hoa, tài năng tỏa sáng,\nChúc ${name} thành công trên mọi bước đường.\nNỗ lực hôm nay, thành quả ngày mai,\nChắp cánh ước mơ, vươn tới tầm cao.`,
            'gia-dinh': `Gia đình là bến đỗ yêu thương,\n${name} ơi, chúc bạn trọn vẹn niềm vui.\nGia đình hạnh phúc, đầm ấm yêu thương,\nMái ấm bình yên, mãi bên nhau.`,
            'tai-chinh': `Tài lộc dồi dào, may mắn kéo đến,\nChúc ${name} luôn dư dả, sung túc, an nhàn.\nTiền vào như nước, may mắn tràn đầy,\nTài chính vững vàng, đầu tư sinh lời.`,
            'tri-tue': `Trí tuệ sáng ngời, tâm hồn rộng mở,\nChúc ${name} ngày càng thông thái, tinh tường.\nSách vở là bạn, học hỏi là vui,\nTri thức là chìa khóa mở mọi cánh cửa.`,
            'niem-vui': `Niềm vui đơn giản từ những điều nhỏ nhất,\nChúc ${name} luôn mỉm cười và hạnh phúc.\nVui như hoa nở, sáng ngời ánh mắt,\nNiềm vui tràn đầy mỗi phút giây.`,
            'hanh-phuc': `Hạnh phúc là khi biết trân trọng hiện tại,\n${name} ơi, chúc bạn tìm thấy bình yên trong tâm hồn.\nSống trọn từng phút giây, yêu thương trọn vẹn,\nHạnh phúc đong đầy lấp lánh cuộc đời.`,
            'y-chi': `Ý chí sắt đá, kiên cường bất khuất,\nChúc ${name} vượt qua mọi thử thách trên đường đời.\nQuyết tâm là chìa khóa của thành công,\nBền bỉ theo đuổi, thành quả sẽ đến.`
        };
        
        const result = mockResults[fortune.id] || `Chúc ${name} một ngày 8/3 tràn ngập niềm vui và hạnh phúc!`;
        
        // Tạo số may mắn ngẫu nhiên từ 0-99
        const randomLuckyNumber = Math.floor(Math.random() * 100);
        
        // Hiển thị kết quả mẫu với số may mắn ngẫu nhiên
        showResult(fortune, name, result, randomLuckyNumber);
    }
    
    /**
     * Lưu kết quả vào localStorage
     */
    function saveResult(fortune, name, result, luckyNumber) {
        const historyData = {
            timestamp: new Date().toISOString(),
            name: name,
            fortune: fortune,
            result: result,
            luckyNumber: luckyNumber
        };
        
        // Lấy lịch sử cũ (nếu có)
        let history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
        
        // Thêm kết quả mới vào
        history.unshift(historyData);
        
        // Giới hạn lịch sử lưu trữ (tối đa 10 kết quả)
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Lưu lại vào localStorage
        localStorage.setItem('fortuneHistory', JSON.stringify(history));
    }
    
    /**
     * Reset game để chơi lại
     */
    function resetGame() {
        // Quay lại màn hình gieo quẻ
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Reset trạng thái
        fortuneBox.innerHTML = `<i class="fa-solid fa-gift fa-bounce"></i>`;
        drawFortuneButton.disabled = false;
        selectedFortune = null;
    }
    
    /**
     * Chia sẻ kết quả
     */
    function shareResult() {
        // Tạo nội dung chia sẻ
        const shareText = `
🎊 Quẻ may mắn ngày 8/3 cho ${playerName} 🎊
✨ ${selectedFortune.name} ✨

"${fortuneResultDisplay.textContent}"

👉 Hãy thử vận may của bạn tại: [link website]
        `.trim();
        
        // Kiểm tra hỗ trợ Web Share API
        if (navigator.share) {
            navigator.share({
                title: 'Quẻ may mắn ngày 8/3',
                text: shareText
            })
            .catch(error => {
                console.warn('Không thể chia sẻ:', error);
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
    }
    
    /**
     * Phương thức chia sẻ thay thế (khi Web Share API không được hỗ trợ)
     */
    function fallbackShare(text) {
        // Tạo textarea tạm thời
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        
        // Chọn và sao chép nội dung
        textarea.select();
        document.execCommand('copy');
        
        // Xóa textarea
        document.body.removeChild(textarea);
        
        // Thông báo
        alert('Đã sao chép kết quả! Bạn có thể dán vào ứng dụng để chia sẻ.');
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }

        try {
            // Gọi API để lấy lời chúc
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();
            
            if (data.success) {
                // Lưu lời chúc vào backend
                await fetch('/api/wishes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        message: data.fortune
                    })
                });

                // Hiển thị kết quả
                showResult(data.fortune, name, data.fortune.result, data.data.luckyNumber);
            } else {
                alert('Có lỗi xảy ra: ' + data.message);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi gửi yêu cầu!');
        }
    }
}); 