window.onload = function () {
    const bgVideo = document.getElementById('bg-video');
    const app = document.getElementById('app');
    const loadingScreen = document.getElementById('loading-screen');
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');

    const profileAvatar = document.getElementById('profile-avatar');
    const profileAvatarDeco = document.getElementById('profile-avatar-deco');
    const profileStatusDot = document.getElementById('profile-status-dot');
    const nameplateBubble = document.getElementById('nameplate-bubble');
    const profileName = document.getElementById('profile-name');
    const profilePronouns = document.getElementById('profile-pronouns');
    const badgeRow = document.getElementById('badge-row');
    const dynamicBio = document.getElementById('dynamic-bio');
    const discordContainer = document.getElementById('discord-activity');

    const musicTitle = document.getElementById('music-title');
    const musicArtist = document.getElementById('music-artist');
    const musicProgress = document.getElementById('music-progress');
    const musicCurrentTime = document.getElementById('music-current-time');
    const musicDuration = document.getElementById('music-duration');
    const playToggle = document.getElementById('play-toggle');
    const skipToggle = document.getElementById('skip-toggle');
    const muteToggle = document.getElementById('mute-toggle');

    const discordID = '745686280146387033';
    const blockedDomainRegex = /clipdeo\.com/gi;
    const hsrUid = '830392574';
    const profileUrl = 'https://tran-nhat-duy1206.github.io/Nhat-Duy-Profile/';

    app.hidden = true;

    const tracks = [
        { file: 'Hanabi.mp3', title: 'Hanabi', artist: 'Nhat Duy Playlist' },
        { file: 'Kafka.mp3', title: 'Kafka', artist: 'Nhat Duy Playlist' },
        { file: 'Furina.mp3', title: 'Furina', artist: 'Nhat Duy Playlist' },
        { file: 'Hotaru.mp3', title: 'Hotaru', artist: 'Nhat Duy Playlist' },
        { file: 'Raiden.mp3', title: 'Raiden', artist: 'Nhat Duy Playlist' },
        { file: 'Hutao.mp3', title: 'Hu Tao', artist: 'Nhat Duy Playlist' }
    ];

    let currentTrackIndex = Math.floor(Math.random() * tracks.length);

    const backgroundAudio = new Audio();
    backgroundAudio.loop = false;
    backgroundAudio.volume = 0.35;
    document.body.appendChild(backgroundAudio);

    const loadTrack = (index, shouldPlay = false) => {
        currentTrackIndex = (index + tracks.length) % tracks.length;
        const track = tracks[currentTrackIndex];

        backgroundAudio.src = `Audio/${track.file}`;
        backgroundAudio.load();

        musicTitle.textContent = track.title;
        musicArtist.textContent = track.artist;
        musicCurrentTime.textContent = '0:00';
        musicDuration.textContent = '0:00';
        musicProgress.style.width = '0%';

        if (shouldPlay) {
            backgroundAudio.play().then(() => {
                setPlayIcon(true);
            }).catch((err) => console.log('Autoplay blocked:', err));
        }
    };

    const skipTrack = () => {
        const wasPlaying = !backgroundAudio.paused;
        loadTrack(currentTrackIndex + 1, wasPlaying);
    };

    const escapeHtml = (raw = '') => String(raw)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const maskBlockedDomain = (raw = '') => String(raw).replace(blockedDomainRegex, '[hidden-domain]');

    const safeText = (raw = '') => escapeHtml(maskBlockedDomain(raw));

    const formatClock = (seconds) => {
        if (!Number.isFinite(seconds)) {
            return '0:00';
        }
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const formatElapsed = (startMs) => {
        const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        return `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')} elapsed`;
    };

    const setPlayIcon = (isPlaying) => {
        playToggle.innerHTML = isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-play"></i>';
    };

    const setMuteIcon = (isMuted) => {
        muteToggle.innerHTML = isMuted
            ? '<i class="fa-solid fa-volume-xmark"></i>'
            : '<i class="fa-solid fa-volume-high"></i>';
    };

    playToggle.addEventListener('click', () => {
        if (backgroundAudio.paused) {
            backgroundAudio.play().catch((err) => console.log('Autoplay blocked:', err));
            setPlayIcon(true);
            return;
        }
        backgroundAudio.pause();
        setPlayIcon(false);
    });

    muteToggle.addEventListener('click', () => {
        backgroundAudio.muted = !backgroundAudio.muted;
        setMuteIcon(backgroundAudio.muted);
    });

    skipToggle.addEventListener('click', () => {
        skipTrack();
    });

    backgroundAudio.addEventListener('loadedmetadata', () => {
        musicDuration.textContent = formatClock(backgroundAudio.duration);
    });

    backgroundAudio.addEventListener('timeupdate', () => {
        musicCurrentTime.textContent = formatClock(backgroundAudio.currentTime);
        const progress = backgroundAudio.duration > 0
            ? (backgroundAudio.currentTime / backgroundAudio.duration) * 100
            : 0;
        musicProgress.style.width = `${progress}%`;
    });

    backgroundAudio.addEventListener('ended', () => {
        skipTrack();
    });

    loadTrack(currentTrackIndex);

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        enterScreen.style.display = 'flex';
    }, 1200);

    enterBtn.addEventListener('click', () => {
        enterScreen.style.display = 'none';
        app.hidden = false;
        bgVideo.classList.add('active');
        backgroundAudio.play().catch((err) => console.log('Autoplay blocked:', err));
        setPlayIcon(true);
    });

    const statusClassFromValue = (status) => ({
        online: 'status-online',
        idle: 'status-idle',
        dnd: 'status-dnd',
        offline: 'status-offline'
    }[status] || 'status-offline');

    const statusLabel = (status) => ({
        online: 'Online',
        idle: 'Idle',
        dnd: 'Do Not Disturb',
        offline: 'Offline'
    }[status] || 'Offline');

    const buildDiscordAvatarUrl = (user) => {
        if (!user || !user.id || !user.avatar) {
            return 'https://cdn.discordapp.com/embed/avatars/0.png';
        }
        const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}`;
    };

    const buildAvatarDecorationUrl = (user) => {
        const decoData = user && user.avatar_decoration_data ? user.avatar_decoration_data : null;
        const asset = decoData && decoData.asset ? decoData.asset : '';
        if (!asset) {
            return '';
        }
        return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=240&passthrough=true`;
    };

    const setAvatarDecoration = (user) => {
        if (!profileAvatarDeco) {
            return;
        }

        const decoUrl = buildAvatarDecorationUrl(user);
        if (!decoUrl) {
            profileAvatarDeco.classList.add('hidden');
            profileAvatarDeco.removeAttribute('src');
            return;
        }

        profileAvatarDeco.src = decoUrl;
        profileAvatarDeco.classList.remove('hidden');
    };

    if (profileAvatarDeco) {
        profileAvatarDeco.addEventListener('error', () => {
            profileAvatarDeco.classList.add('hidden');
        });
    }

    const renderNameplate = (data, customStatus) => {
        if (!nameplateBubble) {
            return;
        }

        const nameplate = data
            && data.discord_user
            && data.discord_user.collectibles
            && data.discord_user.collectibles.nameplate
            ? data.discord_user.collectibles.nameplate
            : null;

        if (!nameplate) {
            nameplateBubble.className = 'nameplate-bubble hidden';
            nameplateBubble.textContent = '';
            return;
        }

        const palette = nameplate.palette ? `palette-${nameplate.palette}` : '';
        const statusText = customStatus && customStatus.state ? customStatus.state : 'Discord Nameplate Active';

        nameplateBubble.className = `nameplate-bubble ${palette}`.trim();
        nameplateBubble.textContent = maskBlockedDomain(statusText);
    };

    const publicFlagBadges = [
        { bit: 1, key: 'staff', label: 'Discord Staff', icon: 'fa-user-shield' },
        { bit: 2, key: 'partner', label: 'Partnered Server Owner', icon: 'fa-handshake' },
        { bit: 4, key: 'hypesquad-events', label: 'HypeSquad Events', icon: 'fa-bolt' },
        { bit: 8, key: 'bug-hunter-1', label: 'Bug Hunter Level 1', icon: 'fa-bug' },
        { bit: 64, key: 'hypesquad-bravery', label: 'HypeSquad Bravery', icon: 'fa-shield-heart' },
        { bit: 128, key: 'hypesquad-brilliance', label: 'HypeSquad Brilliance', icon: 'fa-gem' },
        { bit: 256, key: 'hypesquad-balance', label: 'HypeSquad Balance', icon: 'fa-scale-balanced' },
        { bit: 512, key: 'early-supporter', label: 'Early Supporter', icon: 'fa-star' },
        { bit: 16384, key: 'bug-hunter-2', label: 'Bug Hunter Level 2', icon: 'fa-bugs' },
        { bit: 131072, key: 'early-bot-dev', label: 'Early Verified Bot Developer', icon: 'fa-code' },
        { bit: 262144, key: 'moderator', label: 'Discord Certified Moderator', icon: 'fa-gavel' },
        { bit: 4194304, key: 'active-developer', label: 'Active Developer', icon: 'fa-laptop-code' }
    ];

    const makeBadgeKey = (label = '') => label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'custom';

    const guessIconFromText = (text = '') => {
        const key = text.toLowerCase();
        if (key.includes('shield') || key.includes('khi')) return 'fa-shield';
        if (key.includes('gem') || key.includes('diamond') || key.includes('kim cuong')) return 'fa-gem';
        if (key.includes('#') || key.includes('tag') || key.includes('hashtag')) return 'fa-hashtag';
        if (key.includes('gear') || key.includes('dev') || key.includes('do')) return 'fa-gears';
        if (key.includes('star') || key.includes('sao')) return 'fa-star';
        return 'fa-certificate';
    };

    const normalizeBadgeEntry = (entry) => {
        if (!entry) {
            return null;
        }

        if (typeof entry === 'object') {
            const label = String(entry.label || entry.name || entry.title || 'Badge');
            const image = entry.image || entry.img || entry.url || entry.icon_url || entry.iconUrl || '';
            const emoji = entry.emoji || '';
            const iconRaw = String(entry.icon || entry.iconClass || entry.fa || '').trim();

            let icon = '';
            const matchedIcon = iconRaw.match(/fa-[a-z0-9-]+/i);
            if (matchedIcon) {
                icon = matchedIcon[0];
            } else if (iconRaw) {
                icon = iconRaw.startsWith('fa-') ? iconRaw : `fa-${iconRaw}`;
            }

            return {
                label,
                image: image ? String(image) : '',
                emoji: emoji ? String(emoji) : '',
                icon: icon || guessIconFromText(label),
                key: entry.key ? makeBadgeKey(String(entry.key)) : makeBadgeKey(label)
            };
        }

        const raw = String(entry).trim();
        if (!raw) {
            return null;
        }

        const parts = raw.split(':');
        if (parts.length >= 2) {
            const label = parts[0].trim() || 'Badge';
            const hint = parts.slice(1).join(':').trim();
            if (/^https?:\/\//i.test(hint)) {
                return { label, image: hint, emoji: '', icon: guessIconFromText(label), key: makeBadgeKey(label) };
            }
            return { label, image: '', emoji: '', icon: hint.includes('fa-') ? hint : guessIconFromText(hint), key: makeBadgeKey(label) };
        }

        return { label: raw, image: '', emoji: '', icon: guessIconFromText(raw), key: makeBadgeKey(raw) };
    };

    const parseKvBadges = (kv) => {
        if (!kv || typeof kv !== 'object') {
            return [];
        }

        const rawBadges = kv.badges || kv.badge || kv.badge_icons || kv.badgeIcons;
        if (!rawBadges) {
            return [];
        }

        let list = [];

        if (Array.isArray(rawBadges)) {
            list = rawBadges;
        } else if (typeof rawBadges === 'string') {
            const trimmed = rawBadges.trim();
            if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        list = parsed;
                    } else if (parsed && Array.isArray(parsed.badges)) {
                        list = parsed.badges;
                    }
                } catch (err) {
                    list = trimmed.split(/[|,]/).map((item) => item.trim()).filter(Boolean);
                }
            } else {
                list = trimmed.split(/[|,]/).map((item) => item.trim()).filter(Boolean);
            }
        } else if (typeof rawBadges === 'object' && Array.isArray(rawBadges.badges)) {
            list = rawBadges.badges;
        }

        return list
            .map((entry) => normalizeBadgeEntry(entry))
            .filter(Boolean)
            .slice(0, 10);
    };

    const parsePublicFlagsBadges = (user, data) => {
        const flags = Number(user && user.public_flags ? user.public_flags : 0);
        const badges = flags
            ? publicFlagBadges
                .filter((item) => (flags & item.bit) === item.bit)
                .map((item) => ({ label: item.label, icon: item.icon, key: item.key }))
            : [];

        const premiumType = Number(user && user.premium_type ? user.premium_type : (data && data.premium_type ? data.premium_type : 0));
        const hasAvatarDecoration = Boolean(user && user.avatar_decoration_data);
        const hasAnimatedAvatar = Boolean(user && typeof user.avatar === 'string' && user.avatar.startsWith('a_'));
        const hasNitro = premiumType > 0 || hasAvatarDecoration || hasAnimatedAvatar;

        if (hasNitro) {
            badges.unshift({ label: 'Discord Nitro', icon: 'fa-crown', key: 'nitro' });
        }

        return badges.slice(0, 10);
    };

    const renderBadges = (user, kv, data) => {
        if (!badgeRow) {
            return;
        }

        const official = parsePublicFlagsBadges(user, data);
        const custom = parseKvBadges(kv);
        const merged = [...official, ...custom]
            .filter((badge, index, arr) => arr.findIndex((x) => x.label === badge.label) === index)
            .slice(0, 10);

        if (merged.length === 0) {
            badgeRow.innerHTML = '<span class="badge-item badge-profile" title="Profile"><i class="fa-solid fa-user"></i></span>';
            return;
        }

        badgeRow.innerHTML = merged
            .map((badge) => {
                const cls = `badge-item badge-${makeBadgeKey(badge.key || badge.label)}`;
                if (badge.image) {
                    return `<span class="${cls}" title="${escapeHtml(badge.label)}"><img class="badge-img" src="${escapeHtml(maskBlockedDomain(badge.image))}" alt="${escapeHtml(badge.label)}"></span>`;
                }
                if (badge.emoji) {
                    return `<span class="${cls}" title="${escapeHtml(badge.label)}"><span class="badge-emoji">${escapeHtml(badge.emoji)}</span></span>`;
                }
                return `<span class="${cls}" title="${escapeHtml(badge.label)}"><i class="fa-solid ${badge.icon}"></i></span>`;
            })
            .join('');
    };

    const getActiveDevices = (data) => {
        const devices = [];
        if (data.active_on_discord_desktop) devices.push('Desktop');
        if (data.active_on_discord_mobile) devices.push('Mobile');
        if (data.active_on_discord_web) devices.push('Web');
        return devices;
    };

    const renderBio = (user, customStatus, kv, data) => {
        const lines = [];
        lines.push('<p class="bio-label">• Profile</p>');
        lines.push(`<p><strong>UID HSR:</strong> ${safeText(hsrUid)}</p>`);
        lines.push(`<p><a href="${escapeHtml(profileUrl)}" target="_blank" rel="noopener noreferrer">${safeText(profileUrl)}</a></p>`);

        const fullTag = user && user.username
            ? `${user.username}${user.discriminator && user.discriminator !== '0' ? `#${user.discriminator}` : ''}`
            : '';

        if (fullTag) {
            lines.push(`<p><strong>@${safeText(fullTag)}</strong></p>`);
        }

        if (user && user.id) {
            lines.push(`<p class="subtle">ID: ${safeText(user.id)}</p>`);
        }

        const devices = getActiveDevices(data);
        if (devices.length > 0) {
            lines.push(`<p class="subtle">Devices: ${safeText(devices.join(', '))}</p>`);
        }

        if (user && user.bio) {
            lines.push(`<p>${safeText(user.bio)}</p>`);
        }

        if (customStatus && customStatus.state) {
            const emojiName = customStatus.emoji && customStatus.emoji.name ? `${customStatus.emoji.name} ` : '';
            lines.push(`<p>${safeText(`${emojiName}${customStatus.state}`)}</p>`);
        }

        if (kv && typeof kv === 'object') {
            const kvLines = Object.entries(kv)
                .filter((entry) => entry[0] !== 'pronouns' && entry[1])
                .slice(0, 2)
                .map((entry) => `<p>${safeText(entry[1])}</p>`);
            lines.push(...kvLines);
        }

        if (lines.length === 1) {
            lines.push('<p>Thong tin profile se duoc cap nhat theo Discord API.</p>');
        }

        dynamicBio.innerHTML = lines.join('');
    };

    const activityTypeLabel = (type) => ({
        0: 'Playing',
        1: 'Streaming',
        2: 'Listening',
        3: 'Watching',
        5: 'Competing'
    }[type] || 'Active');

    const renderPresence = (status, activities, spotify, data) => {
        const customStatus = activities.find((act) => act.name === 'Custom Status');
        const activeApps = activities.filter((act) => act.name !== 'Custom Status').slice(0, 3);
        const devices = getActiveDevices(data);

        const sections = [
            `<div class="presence-head"><span class="presence-dot ${statusClassFromValue(status)}"></span>${statusLabel(status)}${devices.length ? `<span class="head-meta">${safeText(devices.join(' • '))}</span>` : ''}</div>`
        ];

        if (spotify) {
            const spotifyStart = spotify.timestamps && spotify.timestamps.start ? Number(spotify.timestamps.start) : null;
            sections.push(`
                <div class="presence-body">
                    <div class="presence-icon">
                        <img src="${escapeHtml(maskBlockedDomain(spotify.album_art_url || ''))}" alt="Spotify album art">
                    </div>
                    <div class="presence-meta">
                        <strong>Spotify - ${safeText(spotify.song || 'Unknown song')}</strong>
                        <p>${safeText((spotify.artist || '').toString())}</p>
                        <p>${safeText(spotify.album || '')}</p>
                        ${spotifyStart ? `<p class="elapsed-tag" data-elapsed-start="${spotifyStart}">${formatElapsed(spotifyStart)}</p>` : ''}
                    </div>
                </div>
            `);
        }

        if (customStatus && customStatus.state) {
            sections.push(`
                <div class="presence-body">
                    <div class="presence-icon"><i class="fa-solid fa-comment-dots"></i></div>
                    <div class="presence-meta">
                        <strong>Custom Status</strong>
                        <p>${safeText(customStatus.state)}</p>
                    </div>
                </div>
            `);
        }

        activeApps.forEach((activity) => {
            const startMs = activity.timestamps && activity.timestamps.start ? Number(activity.timestamps.start) : null;
            sections.push(`
                <div class="presence-body">
                    <div class="presence-icon"><i class="fa-solid fa-gamepad"></i></div>
                    <div class="presence-meta">
                        <strong>${safeText(activity.name || 'Unknown App')}</strong>
                        <p class="subtle">${activityTypeLabel(activity.type)}</p>
                        ${activity.details ? `<p>${safeText(activity.details)}</p>` : ''}
                        ${activity.state ? `<p>${safeText(activity.state)}</p>` : ''}
                        ${startMs ? `<p class="elapsed-tag" data-elapsed-start="${startMs}">${formatElapsed(startMs)}</p>` : ''}
                    </div>
                </div>
            `);
        });

        if (!spotify && !customStatus && activeApps.length === 0) {
            sections.push(`
                <div class="presence-body">
                    <div class="presence-icon"><i class="fa-solid fa-moon"></i></div>
                    <div class="presence-meta">
                        <strong>Khong co activity</strong>
                        <p>Discord dang o trang thai nghi.</p>
                    </div>
                </div>
            `);
        }

        discordContainer.innerHTML = sections.join('');
    };

    const updateElapsedTimer = () => {
        const elapsedNodes = document.querySelectorAll('[data-elapsed-start]');
        elapsedNodes.forEach((node) => {
            const startMs = Number(node.getAttribute('data-elapsed-start'));
            if (Number.isFinite(startMs) && startMs > 0) {
                node.textContent = formatElapsed(startMs);
            }
        });
    };

    const fetchDiscordStatus = () => {
        fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(`HTTP error: ${res.status}`)))
            .then((payload) => {
                if (!payload.success) {
                    throw new Error('Cannot fetch discord status');
                }

                const data = payload.data;
                const user = data.discord_user || {};
                const status = data.discord_status || 'offline';
                const activities = Array.isArray(data.activities) ? data.activities : [];
                const customStatus = activities.find((act) => act.name === 'Custom Status');

                if (profileAvatar) {
                    profileAvatar.src = buildDiscordAvatarUrl(user);
                }

                setAvatarDecoration(user);

                if (profileName) {
                    profileName.textContent = user.global_name || user.username || 'Discord User';
                }

                if (profilePronouns) {
                    profilePronouns.textContent = (data.kv && data.kv.pronouns) ? data.kv.pronouns : 'he/him';
                }

                if (profileStatusDot) {
                    profileStatusDot.className = `status-dot ${statusClassFromValue(status)}`;
                }

                renderNameplate(data, customStatus);
                renderBadges(user, data.kv, data);

                renderBio(user, customStatus, data.kv, data);
                renderPresence(status, activities, data.spotify || null, data);
            })
            .catch((err) => {
                console.error('Loi khi goi API Discord:', err);
                if (profileAvatarDeco) {
                    profileAvatarDeco.classList.add('hidden');
                }
                if (nameplateBubble) {
                    nameplateBubble.className = 'nameplate-bubble hidden';
                    nameplateBubble.textContent = '';
                }
                discordContainer.innerHTML = `
                    <div class="presence-head"><span class="presence-dot status-offline"></span>Offline</div>
                    <div class="presence-body">
                        <div class="presence-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div class="presence-meta">
                            <strong>Khong the tai Discord presence</strong>
                            <p>Thu tai lai sau it phut.</p>
                        </div>
                    </div>
                `;
            });
    };

    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 15000);
    setInterval(updateElapsedTimer, 1000);
};
