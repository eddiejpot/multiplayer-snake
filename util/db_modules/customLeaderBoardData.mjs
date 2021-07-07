/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import axios from 'axios';

/*-------------------------------------------*/
/* ------------------------ HELPER FUNCTIONS */
/*-------------------------------------------*/

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

/**
 * gets leaderboard data and returns a custom one
 * @param {Object} currentPlayerData
 * @returns {Array} currentplayer + X other players
 */
const getCustomLeaderboardData = async (currentPlayerData) => {
  // 1. get full leader board
  const { data: leaderBoard } = await axios.get('/api/leaderboard');

  // 2. get data for custom leadebroard and leaderboard state
  // rank every one
  const numOfPlayers = leaderBoard.length;
  for (let i = 0; i < numOfPlayers; i += 1) {
    leaderBoard[i].rank = i + 1;
  }

  const currentPlayerId = currentPlayerData.id;
  let customLeaderboard = [];

  // THIS CONTROLS HOW MANY TO SHOW
  const playersToReturn = 10;

  for (let i = 0; i < numOfPlayers; i += 1) {
    // if player is top 5
    if (currentPlayerId === leaderBoard[i].id && i < playersToReturn) {
      // give current player highlight key
      leaderBoard[i].highlight = true;
      // make custom leaderboard
      for (let j = 0; j < playersToReturn; j += 1) {
        customLeaderboard.push(leaderBoard[j]);
      }
    }

    // if player is bottem 5
    else if (currentPlayerData.id === leaderBoard[i].id && i >= numOfPlayers - playersToReturn) {
      // give current player highlight key
      leaderBoard[i].highlight = true;
      // make custom leaderboard
      for (let j = numOfPlayers - playersToReturn; j < numOfPlayers; j += 1) {
        customLeaderboard.push(leaderBoard[j]);
      }
    }

    // if player is in middle
    else if (currentPlayerData.id === leaderBoard[i].id) {
      if (playersToReturn === 10) {
        // give current player highlight key
        leaderBoard[i].highlight = true;
        // make custom leaderboard
        customLeaderboard = [
          leaderBoard[i - 5],
          leaderBoard[i - 4],
          leaderBoard[i - 3],
          leaderBoard[i - 2],
          leaderBoard[i - 1],
          leaderBoard[i],
          leaderBoard[i + 1],
          leaderBoard[i + 2],
          leaderBoard[i + 3],
          leaderBoard[i + 4],
        ];
      } else {
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
  }

  return customLeaderboard;
};

/*-------------------------------------------*/
/* --------------------------- EXPORT MODULE */
/*-------------------------------------------*/
export default getCustomLeaderboardData;
