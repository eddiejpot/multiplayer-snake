/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import p5 from 'p5';
import Snake from './snake.mjs';
import Food from './food.mjs';

/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/

// Import functions that control what happens when player scores or when game ends
import initEndGameSettings from '../endGameSettings.mjs';

// Initialize those functions
const gameSettings = initEndGameSettings();
const updateScore = () => {
  gameSettings.score();
};
const endGame = (p) => {
  gameSettings.gameOver(p);
};

// Snake game sketch
const sketch = (p) => {
  let snake;
  let food;
  const res = 10;
  let setupWidth;
  let setupHeight;

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

  p.setup = () => {
    // the map
    p.createCanvas(400, 400);

    // framerate / speed
    p.frameRate(30);

    setupWidth = Math.floor(p.width / res);
    setupHeight = Math.floor(p.height / res);

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
      // callback to update score
      updateScore();
    }

    // if snake hits self or wall do this..
    if (checkIfEndGame()) {
      // callback to end game
      endGame(p);
    }

    // display
    snake.show(p);
    food.show(p);
  };
};

/*-------------------------------------------*/
/* ---------------------------------- EXPORT */
/*-------------------------------------------*/
// export module that creates an instance of the snake game
export default function initSnakeGame(parentElement) {
  return new p5(sketch, parentElement);
}

// const makeSketch = () => {
//   playerOne = new p5(sketch);
// };
