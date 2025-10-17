let dataBox = document.querySelector('.data');
let title = document.querySelector('.data h2');
let position = document.querySelector('.data .position');

let tab;
let oppositeTab;
let timeLoop = 0;
let lastOppositePos = null; // cached parsed position from storage

// Theme state
let currentTheme = localStorage.getItem('theme') || 'enhanced';

// Smoothed target state
let renderTargetX = null;
let renderTargetY = null;
let beamPhase = 0;

// Particles for ambiance (enhanced theme)
const particles = [];
const MAX_PARTICLES = 80;

function getWindowCenterOnScreen() {
    // Use outerWidth/outerHeight to approximate the window frame size
    const centerX = (window.screenX || 0) + (window.outerWidth || window.innerWidth) / 2;
    const centerY = (window.screenY || 0) + (window.outerHeight || window.innerHeight) / 2;
    return [Math.round(centerX), Math.round(centerY)];
}

function serializePosition(posArray) {
    return posArray.join(',');
}

function parsePosition(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const parts = raw.split(',');
    if (parts.length !== 2) return null;
    const x = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    if (Number.isNaN(x) || Number.isNaN(y)) return null;
    return [x, y];
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

// Expose toggle for button
window.toggleTheme = function () {
    const next = currentTheme === 'enhanced' ? 'classic' : 'enhanced';
    setTheme(next);
};

// Determine this tab's role without forcing reloads
const hasTab1 = localStorage.getItem('tab1') !== null;
const hasTab2 = localStorage.getItem('tab2') !== null;

if (hasTab1 && hasTab2) {
    // Already two tabs are active
    tab = null;
    oppositeTab = null;
    title.innerHTML = 'Two tabs already active. Click restart to reset';
} else if (hasTab1) {
    tab = 'tab2';
    oppositeTab = 'tab1';
    localStorage.setItem(tab, serializePosition(getWindowCenterOnScreen()));
    title.innerHTML = 'second tab';
} else {
    tab = 'tab1';
    oppositeTab = 'tab2';
    localStorage.setItem(tab, serializePosition(getWindowCenterOnScreen()));
    title.innerHTML = 'first tab';
}

// Canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function resizeCanvasForDPR() {
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== Math.floor(displayWidth * dpr) || canvas.height !== Math.floor(displayHeight * dpr)) {
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
}

resizeCanvasForDPR();
window.addEventListener('resize', resizeCanvasForDPR);

ctx.fillStyle = '#5a5aff';

// Keep our own position updated periodically (only if we own a tab slot)
if (tab) {
    setInterval(function () {
        localStorage.setItem(tab, serializePosition(getWindowCenterOnScreen()));
    }, 100);
}

// Listen to storage updates from the opposite tab
window.addEventListener('storage', function (e) {
    if (!oppositeTab) return;
    if (e.key === oppositeTab) {
        lastOppositePos = parsePosition(e.newValue);
    }
});

function getOppositePosition() {
    // Prefer the cached value from storage events, fall back to direct read
    if (lastOppositePos && Array.isArray(lastOppositePos)) return lastOppositePos;
    if (!oppositeTab) return null;
    const raw = localStorage.getItem(oppositeTab);
    const parsed = parsePosition(raw);
    if (parsed) lastOppositePos = parsed;
    return parsed;
}

// ------- Enhanced Theme Draw Helpers -------
function drawGradientBackground(centerX, centerY) {
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(centerX, centerY));
    grad.addColorStop(0, '#0b0b1a');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Vignette
    const vignette = ctx.createRadialGradient(centerX, centerY, Math.min(centerX, centerY), centerX, centerY, Math.max(centerX, centerY));
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function ensureParticles(centerX, centerY) {
    // Initialize up to MAX_PARTICLES softly orbiting around center
    while (particles.length < MAX_PARTICLES) {
        particles.push({
            angle: Math.random() * Math.PI * 2,
            radius: 80 + Math.random() * Math.min(centerX, centerY),
            speed: 0.001 + Math.random() * 0.002,
            size: 1 + Math.random() * 2,
            alpha: 0.2 + Math.random() * 0.4
        });
    }
}

function drawParticles(centerX, centerY) {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#9bb1ff';
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function drawRippleRings(x, y, t) {
    for (let i = 0; i < 6; i++) {
        const radius = 40 + i * 90;
        ctx.beginPath();
        const opacity = 0.25 * (1 - ((t + i * 0.1) % 1));
        ctx.strokeStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.arc(x, y, radius, (timeLoop + i) * Math.PI, (2 + timeLoop + i) * Math.PI);
        ctx.stroke();
    }
}

function drawGlowingNode(x, y) {
    // Outer glow
    const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, 120);
    glowGrad.addColorStop(0, 'rgba(80,120,255,0.35)');
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y, 120, 0, 2 * Math.PI);
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(x, y, 36, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBeam(centerX, centerY, targetX, targetY) {
    // Curved quadratic beam
    const cx = (centerX + targetX) / 2;
    const cy = (centerY + targetY) / 2 - 0.15 * Math.hypot(targetX - centerX, targetY - centerY);

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#7fa2ff';
    ctx.shadowBlur = 18;
    ctx.setLineDash([12, 10]);
    ctx.lineDashOffset = -beamPhase;
    ctx.strokeStyle = tab === 'tab1' ? '#ffffff' : '#7fa2ff';

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.quadraticCurveTo(cx, cy, targetX, targetY);
    ctx.stroke();

    // Beam core
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#b9c8ff';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.quadraticCurveTo(cx, cy, targetX, targetY);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// ------- Classic Theme Draw Helpers -------
function drawClassicBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawClassicRings(x, y) {
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.arc(x, y, 40 + i * 80, (timeLoop + i) * Math.PI, (1.9 + timeLoop + i) * Math.PI);
        ctx.stroke();
    }
}

function drawClassicNode(x, y) {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawClassicLine(centerX, centerY, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = tab === 'tab1' ? '#ffffff' : '#0055ff';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#0055ff';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function drawLabel(x, y) {
    if (!tab) return;
    ctx.font = 'bolder 52px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    const sopX = x - 14;
    const sopY = y + 16;
    ctx.fillText(tab === 'tab1' ? '+' : '-', sopX, sopY);
}

function computeTarget(centerX, centerY) {
    const myCenterOnScreen = getWindowCenterOnScreen();
    const oppCenterOnScreen = getOppositePosition();

    let rawTargetX = centerX;
    let rawTargetY = centerY;
    if (oppCenterOnScreen) {
        const dx = oppCenterOnScreen[0] - myCenterOnScreen[0];
        const dy = oppCenterOnScreen[1] - myCenterOnScreen[1];
        rawTargetX = centerX + dx;
        rawTargetY = centerY + dy;
    }

    rawTargetX = clamp(rawTargetX, 20, window.innerWidth - 20);
    rawTargetY = clamp(rawTargetY, 20, window.innerHeight - 20);

    if (renderTargetX === null || renderTargetY === null) {
        renderTargetX = rawTargetX;
        renderTargetY = rawTargetY;
    } else {
        const ease = currentTheme === 'enhanced' ? 0.12 : 0.25; // classic a bit snappier
        renderTargetX = lerp(renderTargetX, rawTargetX, ease);
        renderTargetY = lerp(renderTargetY, rawTargetY, ease);
    }

    position.innerHTML = oppCenterOnScreen ? `${Math.round(renderTargetX)},${Math.round(renderTargetY)}` : 'waiting for other tab…';
}

function drawScene() {
    timeLoop += 0.01;
    beamPhase += 1.5; // speed for dashed beam
    if (timeLoop > 10 * 6) timeLoop = 0;

    const centerX = Math.floor(window.innerWidth / 2);
    const centerY = Math.floor(window.innerHeight / 2);

    computeTarget(centerX, centerY);

    if (currentTheme === 'enhanced') {
        drawGradientBackground(centerX, centerY);
        ensureParticles(centerX, centerY);
        drawParticles(centerX, centerY);
        drawBeam(centerX, centerY, renderTargetX, renderTargetY);
        drawRippleRings(renderTargetX, renderTargetY, (timeLoop % 1));
        drawGlowingNode(renderTargetX, renderTargetY);
        drawLabel(renderTargetX, renderTargetY);
    } else {
        drawClassicBackground();
        drawClassicRings(renderTargetX, renderTargetY);
        drawClassicNode(renderTargetX, renderTargetY);
        drawClassicLine(centerX, centerY, renderTargetX, renderTargetY);
        drawLabel(renderTargetX, renderTargetY);
    }
}

function tick() {
    drawScene();
    requestAnimationFrame(tick);
}

// Start animating regardless; it gracefully handles missing opposite tab
requestAnimationFrame(tick);