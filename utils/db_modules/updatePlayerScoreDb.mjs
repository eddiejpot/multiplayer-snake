/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import axios from 'axios';

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

/**
 * updates player score on DB
 * @param {Object} currentPlayerData
 * @param {Number} newScore
 * @returns {Object} Updated Player data
 */
const updatePlayerScoreDb = async (currentPlayerData, newScore) => {
  // console.log('In updatePlayerScoreDb--------->');
  // console.log(currentPlayerData);

  // prepare data to send
  const dataToSend = {
    name: currentPlayerData.name,
    id: currentPlayerData.id,
    score: newScore,
  };
  const { data } = await axios.put('/api/allplayers', dataToSend);
  return data;
};

/*-------------------------------------------*/
/* --------------------------- EXPORT MODULE */
/*-------------------------------------------*/
export default updatePlayerScoreDb;
