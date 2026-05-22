'use strict';

// ─── TIMER ────────────────────────────────────────────────────────────────────
// Updates every timer text element across ALL screens including wait screens

function startCountdown(timerEnd, onExpire) {
    stopCountdown();

    function tick() {
        const remaining = Math.max(0, Math.floor((timerEnd - Date.now()) / 1000));
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;
        const display = `${min}:${sec.toString().padStart(2, '0')}`;

        // Update every timer text on every screen
        [
            'r1-timer-text', 'r1-wait-timer-text',
            'r2-timer-text', 'r2-wait-timer-text'
        ].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.textContent = display;
            el.classList.toggle('timer-urgent', remaining <= 30);
        });

        // Drain fill bars
        if (state.timerTotal > 0) {
            const pct = Math.round((remaining / state.timerTotal) * 100);
            [
                'r1-timer-fill', 'r1-wait-timer-fill',
                'r2-timer-fill', 'r2-wait-timer-fill'
            ].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.width = `${pct}%`;
            });
        }

        if (remaining <= 0) {
            stopCountdown();
            if (onExpire) onExpire();
        }
    }

    tick();
    state.timerInterval = setInterval(tick, 1000);
}

function stopCountdown() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}