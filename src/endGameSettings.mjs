let globalScore = 0;
/*-------------------------------------------*/
/* -------------------- DOM HELPER FUNCTIONS */
/*-------------------------------------------*/
// dom selectors
const gameParent = document.querySelector('#main-section');

const createElement = (type, parent) => {
  const creation = document.createElement(type);
  parent.appendChild(creation);
  return creation;
};

const createEndGameMessage = (p) => {
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
    window.location.href = '/';
  });
  quitBtn.addEventListener('click', () => {
    // go back to homepage
    window.location.href = '/';
  });
};
/*-------------------------------------------*/
/* ------------------------------- POST GAME */
/*-------------------------------------------*/

export default function initEndGameSettings() {
  const score = () => {
    globalScore += 1;
    const scoreBoardElement = document.querySelector('.score');
    scoreBoardElement.innerHTML = globalScore;
    console.log(globalScore);
    console.log('UPDATE SCORE');
  };
  const gameOver = (p) => {
    // stop game
    p.noLoop();
    console.log('game over');
    createEndGameMessage(p);
  };

  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    score,
    gameOver,
  };
}
