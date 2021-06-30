import initPageController from './controllers/pages.mjs';

export default function bindRoutes(app) {
  const pageController = initPageController();

  app.get('/', pageController.home);
  app.get('/singleplayer', pageController.single);
  app.get('/multiplayer', pageController.multi);
}
