/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
// import css for webpack
import './styles/styles.css';

// libraries
import p5 from 'p5';
import axios from 'axios';
// import { text } from 'express';
import Snake from '../../util/snake/snake.mjs';
import Food from '../../util/snake/food.mjs';

import { getCookie, deleteCookie, createCookie } from '../../util/cookies.mjs';

// DOM HELPER MODULES
import createAskUserNameForm from '../../util/playerName.mjs';
import createGameInstructions from '../../util/gameInstructions.mjs';
import { createMiniLeaderBoard, updateMiniLeaderBoard } from '../../util/miniLeaderBoard.mjs';
import createModalLeaderBoard from '../../util/modalLeaderBoard.mjs';
import addPlayerToDb from '../../util/db_modules/addPlayerToDb.mjs';
import updatePlayerScoreDb from '../../util/db_modules/updatePlayerScoreDb.mjs';
import getCustomLeaderboardData from '../../util/db_modules/customLeaderBoardData.mjs';
import { createScoreboard, updateScoreboard } from '../../util/scoreBoard.mjs';

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
let showText = false;

// Globals used for the leaderoard and score
let leaderboardModal;
let currentPlayerData;

/*-------------------------------------------*/
/* ------------------------ HELPER FUNCTIONS */
/*-------------------------------------------*/

// ---------------- DOM selectors
const mainSectionElement = document.querySelector('#main-section');
const gameSectionElement = document.querySelector('#game-section');
const miniLeaderboardSectionElement = document.querySelector('#mini-leaderboard-section');

// ---------------- Leaderboard modal
const removeLeaderboardModal = () => {
  leaderboardModal.dispose();
  document.getElementById('staticBackdrop').remove();
};
// initializes leaderboard modal
const initLeaderboardModal = async () => {
  // get leaderboard data
  let customLeaderBoardArr = await getCustomLeaderboardData(currentPlayerData);
  // make leaderboard modal
  createModalLeaderBoard(customLeaderBoardArr,
    // when user clicks quit game
    () => {
      // go back to homepage
      window.location.href = '/';
      // reset globalScore
      updateScoreboard(0);
      globalScore = 0;
      // DOM
      removeLeaderboardModal();
      // delete id cookie
      deleteCookie('id');
      // delete playAgaing cookie
      deleteCookie('playAgain');
      // delete name cookie
      deleteCookie('name');
    },
    // when user clicks playAgain
    async () => {
      // reset globalScore
      updateScoreboard(0);
      globalScore = 0;
      // reset current player score to zero
      // update player score in DB
      [, currentPlayerData] = await updatePlayerScoreDb(currentPlayerData, globalScore);
      // get leaderboard data
      customLeaderBoardArr = await getCustomLeaderboardData(currentPlayerData);
      // update mini leader board
      updateMiniLeaderBoard(customLeaderBoardArr);
      // DOM
      removeLeaderboardModal();
      // remove current sketch
      newSketch.remove();
      // make new sketch
      newSketch = new p5(sketch, gameSectionElement);
      // add cookie with user id so leaderboard can update
      createCookie('playAgain', true);
      createCookie('id', currentPlayerData.id);
    });
  // display leadebroard modal
  leaderboardModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  leaderboardModal.show();
};

/*-------------------------------------------*/
/* --------------------------- GAME / SKETCH */
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

  // animation
  function nomTextAnimation() {
    p.textSize(2);
    p.text('yum', setupWidth / 2, p.random(setupHeight / 2 - 0.2, setupHeight / 2 + 0.2));
    p.fill(252, 252, 252);
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
      // CHEAT MODE
      snake.grow();
      globalScore += 10;
      // DOM
      updateScoreboard(globalScore);
      (async () => {
        // update player score in DB
        [, currentPlayerData] = await updatePlayerScoreDb(currentPlayerData, globalScore);
        // get leaderboard data
        const customLeaderBoardArr = await getCustomLeaderboardData(currentPlayerData);
        // update mini leader board
        updateMiniLeaderBoard(customLeaderBoardArr);
      })();
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

  p.draw = async () => {
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
      // update global score
      globalScore += 1;
      // DOM
      updateScoreboard(globalScore);
      // update player score in DB
      [, currentPlayerData] = await updatePlayerScoreDb(currentPlayerData, globalScore);
      // get leaderboard data
      const customLeaderBoardArr = await getCustomLeaderboardData(currentPlayerData);
      // update mini leader board
      updateMiniLeaderBoard(customLeaderBoardArr);

      // animation
      showText = true;
      setTimeout(() => {
        showText = false;
      }, 500);
    }

    // if snake hits self or wall do this..
    if (checkIfEndGame()) {
      console.log('game over');
      // stop game
      p.noLoop();
      initLeaderboardModal();
    }

    // display
    snake.show(p);
    food.show(p);

    // animation
    if (showText) {
      nomTextAnimation();
    }
  };
};

/*-------------------------------------------*/
/* ------------------------------- PAGE FLOW */
/*-------------------------------------------*/

// Step 1: Ask user for name & save name as cookie
createAskUserNameForm(

  // Step 2: create game instructions once form is filled up
  () => createGameInstructions(

    // Step 3: initialize game once instructions are read
    async () => {
      // add player to db
      currentPlayerData = await addPlayerToDb();
      // create scoreboard
      createScoreboard(gameSectionElement);

      // get leaderboard data
      const customLeaderBoardArr = await getCustomLeaderboardData(currentPlayerData);

      // create mini leaderboard
      createMiniLeaderBoard(miniLeaderboardSectionElement, customLeaderBoardArr);

      // init sketch
      newSketch = new p5(sketch, gameSectionElement);
    },
  ),
);
