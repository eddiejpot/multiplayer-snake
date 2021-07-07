/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import p5 from 'p5';
import axios from 'axios';
import Snake from '../../util/snake/snake.mjs';
import Food from '../../util/snake/food.mjs';

import { getCookie, deleteCookie, createCookie } from '../../util/cookieModule.mjs';

// DOM HELPERS
import createAskUserNameForm from '../../util/playerNameModule.mjs';

/*-------------------------------------------*/
/* --------------------------------- GLOBALS */
/*-------------------------------------------*/

// Globals used for the game
const canvasWidth = 400;
const canvasHeight = 400;
let snake;
let food;
const res = 10;
const setupWidth = Math.floor(canvasWidth / res);
const setupHeight = Math.floor(canvasHeight / res);
let globalScore = 0;
let newSketch;

// Globals used for the leaderoard
let leaderboardModal;

/*-------------------------------------------*/
/* ------------------------ HELPER FUNCTIONS */
/*-------------------------------------------*/

// DOM selectors
const gameParent = document.querySelector('#main-section');

/**
 * Helper function to create element
 * @param {String} type e.g. 'div'
 * @return {Document Object} e.g. gameParent as shown in line 46
 */
const createElement = (type, parent) => {
  const creation = document.createElement(type);
  parent.appendChild(creation);
  return creation;
};

/*
 * Returns an oject containing leaderboard data and state
 */
const prepareLeaderboardData = async () => {
  // ------------------------------------- 1. Add player to db / update current player on db
  let currentPlayerData;
  // If player is playing again update score on db
  if (getCookie('playAgain')) {
    console.log(getCookie('playAgain'));
    console.log('IN HERE');
    const dataToSend = {
      name: getCookie('name'),
      id: getCookie('id'),
      score: globalScore,
    };
    const { data } = await axios.put('/api/allplayers', dataToSend);
    currentPlayerData = data[1];

  // else add player to db
  } else {
    const playerName = getCookie('name');
    // prepare data to send
    const dataToSend = {
      name: playerName,
      score: globalScore,
    };
    const { data } = await axios.post('/api/allplayers', dataToSend);
    currentPlayerData = data;
  }

  // --------------------------------------- 2. get leader board
  const { data: leaderBoard } = await axios.get('/api/leaderboard');

  // ------------------------------------ 3. get data for custom leadebroard and leaderboard state
  // rank every one
  const numOfPlayers = leaderBoard.length;
  for (let i = 0; i < numOfPlayers; i += 1) {
    leaderBoard[i].rank = i + 1;
  }

  console.log(leaderBoard);
  const currentPlayerId = currentPlayerData.id;
  let leaderboardState = 'average';
  let customLeaderboard = [];

  for (let i = 0; i < numOfPlayers; i += 1) {
    // if player is top 5
    if (currentPlayerId === leaderBoard[i].id && i < 5) {
      // give current player highlight key
      leaderBoard[i].highlight = true;
      // make custom leaderboard
      for (let j = 0; j < 5; j += 1) {
        customLeaderboard.push(leaderBoard[j]);
      }
      leaderboardState = 'top';
    }

    // if player is bottem 5
    else if (currentPlayerData.id === leaderBoard[i].id && i >= numOfPlayers - 5) {
      // give current player highlight key
      leaderBoard[i].highlight = true;
      // make custom leaderboard
      for (let j = numOfPlayers - 5; j < numOfPlayers; j += 1) {
        customLeaderboard.push(leaderBoard[j]);
      }
      leaderboardState = 'bottem';
    }

    // if player is in middle
    else if (currentPlayerData.id === leaderBoard[i].id) {
      // give current player highlight key
      leaderBoard[i].highlight = true;
      // make custom leaderboard
      customLeaderboard = [
        leaderBoard[i - 2],
        leaderBoard[i - 1],
        leaderBoard[i],
        leaderBoard[i + 1],
        leaderBoard[i + 2],
      ];
    }
  }

  return {
    customLeaderboard,
    leaderboardState,
    currentPlayerData,
  };
};

/*
 * DOM manipulation to create instructions when game starts
 */
const createGameInstructions = () => {
  const playerName = getCookie('name');

  // instructions
  const instructionsParent = createElement('div', gameParent);
  instructionsParent.classList.add('single-player-instrutions');

  // row one
  const rowOne = createElement('div', instructionsParent);
  rowOne.classList.add('row', 'my-row');

  // greeting
  const greeting = createElement('h4', rowOne);
  greeting.innerHTML = `Hi ${playerName}`;

  // row two
  const rowTwo = createElement('div', instructionsParent);
  rowTwo.classList.add('row', 'my-row');

  // controls
  const controlsTitle = createElement('h6', rowTwo);
  controlsTitle.innerHTML = 'The game controls are';

  // controls
  const controls = createElement('h6', rowTwo);
  controls.classList.add('controls-text');
  controls.innerHTML = 'W: Up <br> S: Down <br> A: Left <br>D: Right';

  // row three
  const rowThree = createElement('div', instructionsParent);
  rowThree.classList.add('row', 'my-row');

  // submit button
  const submitBtn = createElement('button', rowThree);
  submitBtn.innerHTML = 'START';
  submitBtn.classList.add('single-player-submit-btn');
  submitBtn.addEventListener('click', () => {
    // delete instructions
    gameParent.innerHTML = '';
    initSnakeGame();
  });
};

/*
 * DOM manipulation to create form for user to enter name
 */
// const createAskUserNameForm = () => {
//   // form
//   const form = createElement('div', gameParent);
//   form.classList.add('single-player-name-form');

//   // row one
//   const rowOne = createElement('div', form);
//   rowOne.classList.add('row', 'my-row');

//   // header
//   const header = createElement('h4', rowOne);
//   header.innerHTML = 'ENTER YOUR NAME';

//   // row two
//   const rowTwo = createElement('div', form);
//   rowTwo.classList.add('row', 'my-row');

//   // input
//   const nameInput = createElement('input', rowTwo);
//   nameInput.setAttribute('type', 'text');
//   nameInput.setAttribute('placeholder', 'your name');
//   nameInput.setAttribute('id', 'name');

//   // submit button
//   const submitBtn = createElement('button', rowTwo);
//   submitBtn.innerHTML = 'Submit';
//   submitBtn.classList.add('single-player-submit-btn');
//   submitBtn.addEventListener('click', () => {
//     // check if input is empty
//     const userName = nameInput.value;
//     if (userName.trim() === '') {
//       header.innerHTML = 'ENTER YOUR NAME. PLEASE';
//     } else {
//       // set cookie
//       createCookie('name', nameInput.value);
//       // delete form
//       gameParent.innerHTML = '';
//       // go to game instructions
//       initGameInstructions();
//     }
//   });
// };

/*
 * DOM manipulation to create scoreboard above snake game
 */
const createScoreboard = () => {
  const scoreBoardMessage = createElement('h4', gameParent);
  scoreBoardMessage.innerHTML = 'Score:';
  // message
  const currentScore = createElement('span', scoreBoardMessage);
  currentScore.classList.add('single-player-score');
  currentScore.innerHTML = 0;
};

/*
 * DOM manipulation to create leaderboard row
 */
const createLeaderboardRow = (rankText, nameText, scoreInt, parent) => {
  const li = createElement('li', parent);
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

  const rankParent = createElement('div', li);
  rankParent.classList.add('ms-2', 'me-auto');

  const rank = createElement('div', rankParent);
  rank.classList.add('fw-bold');
  rank.innerHTML = rankText;

  const nameParent = createElement('div', li);
  nameParent.classList.add('ms-2', 'me-auto');

  const name = createElement('div', nameParent);
  name.classList.add('fw-bold');
  name.innerHTML = nameText;

  const score = createElement('span', li);
  score.classList.add('badge', 'bg-primary', 'rounded-pill');
  score.innerHTML = scoreInt;

  return li;
};

/*
 * DOM manipulation to create leaderboard
 */
const createLeaderoardModal = (playersArr, leaderboardState, currentPlayerData) => {
  const modalParent = createElement('div', document.body);
  modalParent.classList.add('modal', 'fade');
  modalParent.setAttribute('id', 'staticBackdrop');
  modalParent.setAttribute('data-bs-backdrop', 'static');
  modalParent.setAttribute('data-bs-keyboard', 'false');
  modalParent.setAttribute('tabindex', '-1');
  modalParent.setAttribute('aria-labelledby', 'staticBackdropLabel');
  modalParent.setAttribute('aria-hidden', 'true');

  const modalDialogue = createElement('div', modalParent);
  modalDialogue.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-dialog-scrollable');

  const modalContent = createElement('div', modalDialogue);
  modalContent.classList.add('modal-content', 'my-modal-content');

  const modalHeader = createElement('div', modalContent);
  modalHeader.classList.add('modal-header', 'd-inline', 'border-bottom-0');
  const modalTitle = createElement('h5', modalHeader);
  modalTitle.classList.add('modal-title', 'text-center');
  modalTitle.innerHTML = 'LEADERBOARD';

  // Leaderboard goes into modal body
  const modalBody = createElement('div', modalContent);
  modalBody.classList.add('modal-body');

  // Leaderboard
  const ul = createElement('ul', modalBody);
  ul.classList.add('list-group');

  // top row
  createLeaderboardRow('Rank', 'Name', 'Score', ul);
  // players
  for (let i = 0; i < playersArr.length; i += 1) {
    const player = playersArr[i];
    if (player.highlight) {
      const currentPLayer = createLeaderboardRow(player.rank, player.name, player.score, ul);
      currentPLayer.classList.add('highlight-player');
    } else {
      createLeaderboardRow(player.rank, player.name, player.score, ul);
    }
  }

  // Buttons go into modal footer
  const modalFooter = createElement('div', modalContent);
  modalFooter.classList.add('modal-footer', 'justify-content-center', 'border-top-0');

  const quitBtn = createElement('button', modalFooter);
  quitBtn.innerHTML = 'Quit';
  quitBtn.classList.add('btn', 'btn-secondary');
  quitBtn.addEventListener('click', () => {
    // DOM
    removeLeaderboardModal();
    document.querySelector('.single-player-score').innerHTML = 0;
    // delete id cookie
    deleteCookie('id');
    // delete playAgaing cookie
    deleteCookie('playAgain');
    // delete name cookie
    deleteCookie('name');
    // reset globalScore
    globalScore = 0;
    // go back to homepage
    window.location.href = '/';
  });

  const playAgainBtn = createElement('button', modalFooter);
  playAgainBtn.innerHTML = 'Play Again';
  playAgainBtn.classList.add('btn', 'btn-success');
  playAgainBtn.addEventListener('click', () => {
    // DOM
    removeLeaderboardModal();
    document.querySelector('.single-player-score').innerHTML = 0;
    // add cookie with user id so leaderboard can update
    createCookie('playAgain', true);
    createCookie('id', currentPlayerData.id);
    // reset globalScore
    globalScore = 0;
    // remove current sketch
    newSketch.remove();
    // make new sketch
    newSketch = new p5(sketch, gameParent);
  });
};

/*-------------------------------------------*/
/* ---------------------------------- SKETCH */
/*-------------------------------------------*/
// Snake game sketch
const sketch = (p) => {
  // check if snake eats food
  function checkIfFoodEaten() {
  // [x,y]
    const snakeHeadX = snake.location[0];
    const snakeHeadY = snake.location[1];
    const foodLocation = food.location;
    if (snakeHeadX === foodLocation[0] && snakeHeadY === foodLocation[1])
    {
      return true;
    }
    return false;
  }

  function checkIfEndGame() {
    const snakeHeadX = snake.location[0];
    const snakeHeadY = snake.location[1];
    const snakeBody = snake.body;
    // don't couut the last value in arr which is the head
    const snakeLength = snake.body.length - 2;

    // if snake hits wall
    if (snakeHeadX > setupWidth - 1 || snakeHeadX < 0 || snakeHeadY > setupHeight - 1 || snakeHeadY < 0) {
      return true;
    }

    // if snake hits itself
    for (let i = 0; i < snakeLength; i += 1) {
      const partOfBody = snakeBody[i];
      if (partOfBody.x === snakeHeadX && partOfBody.y === snakeHeadY) {
        return true;
      }
    }

    return false;
  }

  // Controls
  p.keyTyped = () => {
    const snakeDirection = snake.direction;
    if (p.key === 'w' && snakeDirection !== 'down') {
      snake.setDirection(0, -1);
    }

    if (p.key === 's' && snakeDirection !== 'up') {
      snake.setDirection(0, 1);
    }

    if (p.key === 'a' && snakeDirection !== 'right') {
      snake.setDirection(-1, 0);
    }

    if (p.key === 'd' && snakeDirection !== 'left') {
      snake.setDirection(1, 0);
    }

    if (p.key === ' ') {
      snake.grow();
      globalScore += 10;
      const scoreBoardElement = document.querySelector('.single-player-score');
      scoreBoardElement.innerHTML = globalScore;
    }
  };

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);

    // framerate / speed
    p.frameRate(30);

    // instances
    snake = new Snake(p, setupWidth, setupHeight);
    food = new Food(p);

    food.setLocation(setupWidth, setupHeight);
  };

  p.draw = () => {
    p.scale(res);
    p.background(0);

    // update snake location...
    snake.update();

    // if snake eats food do this...
    if (checkIfFoodEaten()) {
      // make new food
      food.setLocation(setupWidth, setupHeight);
      // grow snake
      snake.grow();
      // update score
      globalScore += 1;
      // DOM
      const scoreBoardElement = document.querySelector('.single-player-score');
      scoreBoardElement.innerHTML = globalScore;
    }

    // if snake hits self or wall do this..
    if (checkIfEndGame()) {
      console.log('game over');
      // stop game
      p.noLoop();
      initLeaderboard();
    }

    // display
    snake.show(p);
    food.show(p);
  };
};

/*-------------------------------------------*/
/* ------------------------- WHEN PAGE LOADS */
/*-------------------------------------------*/

// 2. Init instructions
const initGameInstructions = () => {
  console.log('INIT GAME RAN');
  createGameInstructions();
};

// 1. Ask user for name & save name as cookie
createAskUserNameForm(gameParent, initGameInstructions);

// 3. Init game
const initSnakeGame = () => {
  // create scoreboard
  createScoreboard();
  // init sketch
  newSketch = new p5(sketch, gameParent);
};

// 4. when game ends (automatic) STILL WORKING ON THIS PART
const initLeaderboard = async () => {
  // leaderboard state is top, bottem, average
  const { customLeaderboard, leaderboardState, currentPlayerData } = await prepareLeaderboardData();
  // make leaderboard display
  createLeaderoardModal(customLeaderboard, leaderboardState, currentPlayerData);
  leaderboardModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  leaderboardModal.show();
};

const removeLeaderboardModal = () => {
  leaderboardModal.dispose();
  document.getElementById('staticBackdrop').remove();
};
