window.onload = function () {
    const bgImage = document.getElementById('bg-image');
    const bgVideo = document.getElementById('bg-video');
    const mainContent = document.querySelector('.profile-container');
    const loadingScreen = document.getElementById('loading-screen');
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');

    // Ẩn nội dung chính ban đầu
    mainContent.style.display = 'none';
    bgVideo.style.opacity = '0';

    // Sau 2s: Ẩn loading, hiện màn hình "Click để tiếp tục"
    setTimeout(() => {
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (enterScreen) enterScreen.style.display = 'flex';
    }, 2000);

    // Khi click "Nhấn để tiếp tục"
    enterBtn.addEventListener('click', () => {
        if (enterScreen) enterScreen.style.display = 'none';
        mainContent.style.display = 'block';
        bgVideo.style.opacity = '1';

        // Phát nhạc (nếu chưa tự phát được)
        backgroundAudio.play().catch(err => console.log("Play error:", err));
    });

    // Nhạc nền
    const backgroundAudio = document.createElement('audio');
    backgroundAudio.id = 'background-audio';
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.4;

    const musicTracks = ['Hanabi.mp3', 'Kafka.mp3', 'Furina.mp3', 'Hotaru.mp3', 'Raiden.mp3', 'Hutao.mp3'];
    const randomTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    backgroundAudio.src = 'Audio/' + randomTrack;
    document.body.appendChild(backgroundAudio);

    // Cố gắng phát tự động
    backgroundAudio.play().catch(error => {
        console.warn("Trình duyệt chặn phát nhạc tự động. Sẽ phát khi người dùng click.");
        document.body.addEventListener('click', () => backgroundAudio.play(), { once: true });
    });

    // Ngăn chuột phải
    document.addEventListener('contextmenu', (e) => e.preventDefault());
};
