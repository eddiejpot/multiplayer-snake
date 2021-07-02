/* ----------------------------------------- */
/* -------------------------- IMPORT MODULES */
/* ----------------------------------------- */
import pkg from 'sequelize';
import { resolve } from 'path';

const { Op } = pkg;

/* ----------------------------------------- */
/* --------------------- CONTROLLER FUNTIONS */
/* ----------------------------------------- */

export default function initPageController(db) {
  const home = (req, res) => {
    // special JS page. Include the webpack main.html file
    res.sendFile(resolve('dist', 'home.html'));
  };
  const single = (req, res) => {
    // special JS page. Include the webpack main.html file
    res.sendFile(resolve('dist', 'singleplayer.html'));
  };
  const multi = (req, res) => {
    // special JS page. Include the webpack main.html file
    res.sendFile(resolve('dist', 'multiplayer.html'));
  };

  const playersIndex = async (req, res) => {
    const allUsers = await db.Player.findAll({ raw: true });
    res.send(allUsers);
  };

  const leaderBoardIndex = async (req, res) => {
    const leaderBoard = await db.Player.findAll({ order: [['score', 'DESC']] });
    res.send(leaderBoard);
  };

  const createPlayer = async (req, res) => {
    // get data
    const {
      name,
      score,
    } = req.body;
    // create user
    const playerCreatedData = await db.Player.create({
      name,
      score,
    });
    res.send(playerCreatedData);
  };
  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    home,
    single,
    multi,
    playersIndex,
    leaderBoardIndex,
    createPlayer,
  };
}
