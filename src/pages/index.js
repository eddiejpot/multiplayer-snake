/*-------------------------------------------*/
/* ---------------------------IMPORT MODULES */
/*-------------------------------------------*/

// this initializes an instance of a snake game
import initSnakeGame from './snake/sketch.mjs';

// dom selectors
const gameParent = document.querySelector('#main-section');

/*-------------------------------------------*/
/* -------------------- DOM HELPER FUNCTIONS */
/*-------------------------------------------*/

const createElement = (type, parent) => {
  const creation = document.createElement(type);
  parent.appendChild(creation);
  return creation;
};

const initSinglePlayer = () => {
  // refresh screen
  gameParent.innerHTML = '';
  // make scoreboard
  const scoreboard = createElement('h1', gameParent);
  scoreboard.classList.add('score');
  scoreboard.innerHTML = 0;
  // initialize game
  initSnakeGame(gameParent);
};

const createWelcomePage = () => {
  // create h1
  const header = createElement('h1', gameParent);
  header.innerHTML = 'WELCOME!';
  // create btn group
  const btnGrp = createElement('div', gameParent);
  // create btns
  const singlePlayerBtn = createElement('button', btnGrp);
  singlePlayerBtn.innerHTML = 'SINGLE PLAYER';
  const multiPlayerBtn = createElement('button', btnGrp);
  multiPlayerBtn.innerHTML = 'MULTIPLAYER';

  // listeners
  singlePlayerBtn.addEventListener('click', initSinglePlayer);
};

createWelcomePage();
