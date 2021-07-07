/*-------------------------------------------*/
/* ------------------------ HELPER FUNCTIONS */
/*-------------------------------------------*/
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

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

/**
 * Creates Score board above snake game (DOM manipulation)
 * @param {HTML Element} mainParent the parent element of this scoreboard div
 */
export const createScoreboard = (mainParent) => {
  const scoreBoardMessage = createElement('h4', mainParent);
  scoreBoardMessage.innerHTML = 'Score:';
  // message
  const currentScore = createElement('span', scoreBoardMessage);
  currentScore.classList.add('single-player-score');
  currentScore.innerHTML = 0;
};

/**
 * Updates Score board above snake game (DOM manipulation)
 * @param {Number} score
 */
export const updateScoreboard = (score) => {
  const currentScore = document.querySelector('.single-player-score');
  currentScore.innerHTML = score;
};
