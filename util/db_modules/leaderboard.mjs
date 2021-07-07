/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import axios from 'axios';
import { getCookie } from './cookies.mjs';

/*-------------------------------------------*/
/* ------------------------ HELPER FUNCTIONS */
/*-------------------------------------------*/

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

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

/*-------------------------------------------*/
/* --------------------------- EXPORT MODULE */
/*-------------------------------------------*/
export default createGameInstructions;
