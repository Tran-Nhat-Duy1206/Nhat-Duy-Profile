window.onload = function () {
    const bgImage = document.getElementById('bg-image');
    const bgVideo = document.getElementById('bg-video');
    const mainContent = document.querySelector('.profile-container');
    const loadingScreen = document.getElementById('loading-screen');
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const discordContainer = document.getElementById('discord-activity');
    const discordID = '745686280146387033';

    // Ẩn nội dung chính ban đầu
    mainContent.style.display = 'none';
    bgVideo.style.opacity = '0';

    // Phát nhạc nền ngẫu nhiên
    const backgroundAudio = new Audio();
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.4;
    backgroundAudio.src = 'Audio/' + ['Hanabi.mp3', 'Kafka.mp3', 'Furina.mp3', 'Hotaru.mp3', 'Raiden.mp3', 'Hutao.mp3'][Math.floor(Math.random() * 6)];
    document.body.appendChild(backgroundAudio);

    // Hiển thị màn hình tiếp tục
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        enterScreen.style.display = 'flex';
    }, 2000);

    // Khi nhấn tiếp tục
    enterBtn.addEventListener('click', () => {
        enterScreen.style.display = 'none';
        mainContent.style.display = 'block';
        bgVideo.style.opacity = '1';
        backgroundAudio.play().catch(err => console.log("Autoplay blocked:", err));
    });

    // Ngăn chuột phải
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Lấy trạng thái Discord
    const fetchDiscordStatus = () => {
        fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
            .then(data => {
                if (!data.success) throw new Error("Không thể lấy trạng thái Discord.");
                const { discord_user: user, discord_status: status, activities = [] } = data.data;
                const statusClass = { online: "status-online", idle: "status-idle", dnd: "status-dnd", offline: "status-offline" }[status] || "status-offline";
                const avatarURL = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png";
                discordContainer.innerHTML = `
                    <div class="discord-header">
                        <div class="discord-avatar-wrapper ${statusClass}">
                            <img class="discord-avatar" src="${avatarURL}" alt="Avatar">
                        </div>
                        <div class="discord-info">
                            <h3>${user.global_name}</h3>
                            <div class="status"><span class="discord-status-dot ${statusClass}"></span>${status}</div>
                        </div>
                    </div>
                    <div class="discord-activity-detail">
                        ${activities.length > 0 ? activities.map(act => act.name !== "Custom Status" ? `<p><strong>${act.name}</strong>: ${act.details || 'Đang hoạt động'}</p>` : `<p>${act.state || '...'}</p>`).join('') : '<p>Không có hoạt động nào.</p>'}
                    </div>`;
            })
            .catch(err => {
                console.error("Lỗi khi gọi API Discord:", err);
                discordContainer.innerHTML = "<p>Lỗi khi lấy trạng thái Discord.</p>";
            });
    };

    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 15000); // Cập nhật mỗi 15 giây
};