// Tool tip for multiplayer

const exampleEl = document.getElementById('multiplayer');
exampleEl.setAttribute('title', 'The developer is still working on this feature 🐢');
exampleEl.setAttribute('data-bs-placement', 'bottom');
console.log(exampleEl);
const tooltip = new bootstrap.Tooltip(exampleEl);
