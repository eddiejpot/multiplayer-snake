/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/

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

/*
 * Create leaderboard row
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

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

/**
 * Creates Leaderboard modal (DOM manipulation)
 * @param {Array} customLeaderBoardArr takes in the customLeaderBoardArr
 * @param {Function} callBackQuit callback for when quit button is clicked
 * @param {Function} callBackPlayAgain callback for when playAgain button is clicked
 */
const createModalLeaderBoard = (customLeaderBoardArr, callBackQuit, callBackPlayAgain) => {
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
  for (let i = 0; i < customLeaderBoardArr.length; i += 1) {
    const player = customLeaderBoardArr[i];
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
    callBackQuit();
  });

  const playAgainBtn = createElement('button', modalFooter);
  playAgainBtn.innerHTML = 'Play Again';
  playAgainBtn.classList.add('btn', 'btn-success');
  playAgainBtn.addEventListener('click', () => {
    callBackPlayAgain();
  });
};

/*-------------------------------------------*/
/* --------------------------- EXPORT MODULE */
/*-------------------------------------------*/
export default createModalLeaderBoard;
