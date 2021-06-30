/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import p5 from 'p5';
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
// dom selectors
const gameParent = document.querySelector('#main-section');

const createElement = (type, parent) => {
  const creation = document.createElement(type);
  parent.appendChild(creation);
  return creation;
};

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

// // export module that creates an instance of the snake game
// export default function initSnakeGame(parentElement) {
//   return new p5(sketch, parentElement);
// }

/*-------------------------------------------*/
/* ----------------------------- INIT SKETCH */
/*-------------------------------------------*/
newSketch = new p5(sketch, gameParent);
