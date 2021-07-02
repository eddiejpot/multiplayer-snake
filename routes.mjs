/* ----------------------------------------- */
/* -------------------------- IMPORT MODULES */
/* ----------------------------------------- */
import db from './db/models/index.mjs';
import initPageController from './controllers/pages.mjs';

/* ----------------------------------------- */
/* ---------------------------------- ROUTES */
/* ----------------------------------------- */
export default function bindRoutes(app) {
  const pageController = initPageController(db);

  // api routes
  app.get('/api/allplayers', pageController.playersIndex);
  app.post('/api/allplayers', pageController.createPlayer);
  app.get('/api/leaderboard', pageController.leaderBoardIndex);

  // other routes
  app.get('/', pageController.home);
  app.get('/singleplayer', pageController.single);
  app.get('/multiplayer', pageController.multi);
}
