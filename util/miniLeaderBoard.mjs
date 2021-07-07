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
  score.classList.add('badge', 'rounded-pill', 'my-badge');
  score.innerHTML = scoreInt;

  return li;
};

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

/**
 * Creates Instructions (DOM manipulation)
 * @param {Array} leaderBoardArr takes in the customLeaderBoardArr
 */

/**
 * Creates mini leaderboard (DOM manipulation)
 * @param {HTML Element} mainParent HTML element
 * @param {Array} customLeaderBoardArr takes in the customLeaderBoardArr
 */
export const createMiniLeaderBoard = (mainParent, customLeaderBoardArr) => {
  // parent
  const miniLeaderBoardParent = createElement('div', mainParent);
  miniLeaderBoardParent.classList.add('mini-leaderboard');

  // Leaderboard title
  const title = createElement('h4', miniLeaderBoardParent);
  title.innerHTML = 'Leaderboard';
  title.classList.add('leaderboard-title');

  // Leaderboard
  const ul = createElement('ul', miniLeaderBoardParent);
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
};

export const updateMiniLeaderBoard = (customLeaderBoardArr) => {
  // empty list group
  const listGroup = document.querySelector('.list-group');
  listGroup.innerHTML = '';

  // top row
  createLeaderboardRow('Rank', 'Name', 'Score', listGroup);

  // players
  for (let i = 0; i < customLeaderBoardArr.length; i += 1) {
    const player = customLeaderBoardArr[i];
    if (player.highlight) {
      const currentPLayer = createLeaderboardRow(player.rank, player.name, player.score, listGroup);
      currentPLayer.classList.add('highlight-player');
    } else {
      createLeaderboardRow(player.rank, player.name, player.score, listGroup);
    }
  }
};
