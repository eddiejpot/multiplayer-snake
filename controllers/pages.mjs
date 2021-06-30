import { resolve } from 'path';

export default function initPageController() {
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

  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    home,
    single,
    multi,
  };
}
