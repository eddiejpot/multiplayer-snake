/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import p5 from 'p5';
import axios from 'axios';
import Snake from '../snake/snake.mjs';
import Food from '../snake/food.mjs';

/*-------------------------------------------*/
/* --------------------------------- GLOBALS */
/*-------------------------------------------*/
const canvasWidth = 400;
const canvasHeight = 400;
let snake;
let food;
const res = 10;
const setupWidth = Math.floor(canvasWidth / res);
const setupHeight = Math.floor(canvasHeight / res);
let globalScore = 0;
let newSketch;

/*-------------------------------------------*/
/* ------------------------ HELPER FUNCTIONS */
/*-------------------------------------------*/

/**
 * Returns value of cookie
 * @param {String} key Key of cookie
 * @return {String} value of cookie
 */
const getCookie = (key) => {
  let cookieValue;
  const cookies = document.cookie;
  // if many cookies
  if (cookies.includes(';')) {
    cookieValue = cookies.split('; ')
      .find((row) => row.startsWith(`${key}=`))
      .split('=')[1];
  } else {
    cookieValue = cookies.split('=')[1];
  }
  return cookieValue;
};

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

// !!---------- STIL WORKING ON THIS FUNCTION
const prepareLeaderboardData = async () => {
  // --------------------------- 1. Add player to db
  // const playerName = getCookie('name');

  const playerName = 'TEST';
  globalScore = 60;
  // prepare data to send
  const dataToSend = {
    name: playerName,
    score: globalScore,
  };
  const { data: currentPlayerData } = await axios.post('/api/allplayers', dataToSend);
  console.log(currentPlayerData);

  // ----------------------------- 2. get leader board and return +-2 other players
  const { data: leaderBoard } = await axios.get('/api/leaderboard');

  let customLeaderboard = [];

  // 3 scenerios for leaderboard
  // player is in the middle
  // player is top 2
  // player is bottom

  for (let i = 0; i < leaderBoard.length; i += 1) {
    const player = leaderBoard[i];
    if (player.id === currentPlayerData.id) {
      // rank current player
      leaderBoard[i].rank = i;
      // rank players before and after player +- 2
      leaderBoard[i - 2].rank = i - 2;
      leaderBoard[i - 1].rank = i - 1;
      leaderBoard[i + 1].rank = i + 1;
      leaderBoard[i + 2].rank = i + 2;
      // return players
      customLeaderboard = [
        leaderBoard[i - 2],
        leaderBoard[i - 1],
        leaderBoard[i],
        leaderBoard[i + 1],
        leaderBoard[i + 2],
      ];
    }
  }
  console.log(customLeaderboard);
  return customLeaderboard;

  // ----------------------------- 3. display data customLeaderboard
};

/*
 * DOM manipulation to create message when game ends
 */
const createEndGameMessage = () => {
  // create message parent
  const endGameParent = createElement('div', gameParent);

  // message header
  const messageHeader = createElement('h2', endGameParent);
  messageHeader.innerHTML = 'GAME ENDED';

  // message box
  const messageBox = createElement('div', endGameParent);
  // message
  const playerScore = createElement('h4', messageBox);
  playerScore.innerHTML = globalScore;
  const highestScore = createElement('h4', messageBox);
  highestScore.innerHTML = 'working on it';

  // create btn group
  const btnGrp = createElement('div', endGameParent);
  // create btns
  const playAgain = createElement('button', btnGrp);
  playAgain.innerHTML = 'PLAY AGAIN';
  const quitBtn = createElement('button', btnGrp);
  quitBtn.innerHTML = 'QUIT';

  // listeners
  playAgain.addEventListener('click', () => {
    // DOM
    endGameParent.remove();
    // remove current sketch
    newSketch.remove();
    // make new sketch
    newSketch = new p5(sketch, gameParent);
  });
  quitBtn.addEventListener('click', () => {
    // go back to homepage
    window.location.href = '/';
  });
};

/*
 * DOM manipulation to create instructions when game starts
 */
const createGameInstructions = () => {
  const playerName = getCookie('name');

  // instructions
  const instructions = createElement('div', gameParent);
  instructions.classList.add('single-player-instrutions');

  // header
  const header = createElement('h2', instructions);
  header.innerHTML = `Hello ${playerName} These are the instructions...`;

  // submit button
  const submitBtn = createElement('button', instructions);
  submitBtn.innerHTML = 'PLAY GAME!';
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
const createAskUserNameForm = () => {
  // form
  const form = createElement('div', gameParent);
  form.classList.add('single-player-name-form');

  // header
  const header = createElement('h2', form);
  header.innerHTML = 'Who goes there?';

  // input
  const nameInput = createElement('input', form);
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('placeholder', 'your name');
  nameInput.setAttribute('id', 'name');

  // submit button
  const submitBtn = createElement('button', form);
  submitBtn.innerHTML = 'Submit';
  submitBtn.classList.add('single-player-submit-btn');
  submitBtn.addEventListener('click', () => {
    // set cookie
    // document.cookie = `name=${nameInput.value}`;
    document.cookie = `name=${encodeURIComponent(nameInput.value)}`;

    // delete form
    gameParent.innerHTML = '';
    // go to game instructions
    initGameInstructions();
  });
};

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

    if (p.key === ' ' && snakeDirection !== 'left') {
      snake.grow();
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
    p.background(220);

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
      createEndGameMessage();
    }

    // display
    snake.show(p);
    food.show(p);
  };
};

/*-------------------------------------------*/
/* ------------------------- WHEN PAGE LOADS */
/*-------------------------------------------*/

// 1. Ask user for name & save name as cookie
createAskUserNameForm();

// 2. Init instructions
const initGameInstructions = () => {
  createGameInstructions();
};

// 3. Init game
const initSnakeGame = () => {
  // create scoreboard
  createScoreboard();
  // init sketch
  newSketch = new p5(sketch, gameParent);
};

// 4. when game ends (automatic) STILL WORKING ON THIS PART
