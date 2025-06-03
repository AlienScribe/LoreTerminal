// main.js
import { Library } from './library.js';

document.addEventListener('DOMContentLoaded', async () => {
    const bootSequence = document.getElementById('bootSequence');
    const terminal = document.getElementById('terminal');
    const starfield = document.getElementById('starfield');

    // Generate CSS-based starfield
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starfield.appendChild(star);
    }

    terminal.style.display = 'none';

    const bootText = bootSequence.querySelector('.boot-text');
    const messages = [
        'INITIALIZING A-01 CANON TERMINAL... [OK]',
        'LOADING LORE DATABASE... [OK]',
        'ESTABLISHING CONNECTION... [OK]',
        'SYSTEM READY.'
    ];

    for (const message of messages) {
        bootText.textContent = message;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    bootSequence.style.opacity = '0';
    setTimeout(() => {
        bootSequence.style.display = 'none';
        terminal.style.display = 'flex';
        terminal.style.opacity = '1';
    }, 500);

    const library = new Library();
    await library.init();
});