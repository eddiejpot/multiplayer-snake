/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import axios from 'axios';
import { getCookie } from '../cookies.mjs';

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

/**
 * adds player to DB
 * @returns {Object} Player data
 */
const addPlayerToDb = async () => {
  const playerName = getCookie('name');
  // prepare data to send
  const dataToSend = {
    name: playerName,
    score: 0,
  };
  const { data } = await axios.post('/api/allplayers', dataToSend);
  return data;
};

/*-------------------------------------------*/
/* --------------------------- EXPORT MODULE */
/*-------------------------------------------*/
export default addPlayerToDb;
