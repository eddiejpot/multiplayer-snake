// import css for webpack
import './styles/styles.css';

// Tool tip for multiplayer

const exampleEl = document.getElementById('multiplayer');
exampleEl.setAttribute('title', 'The developer is still working on this feature 🐢');
exampleEl.setAttribute('data-bs-placement', 'bottom');
const tooltip = new bootstrap.Tooltip(exampleEl);
