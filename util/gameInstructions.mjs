/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import { getCookie } from './cookies.mjs';

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

/*-------------------------------------------*/
/* ----------------------------- MAIN MODULE */
/*-------------------------------------------*/

/**
 * Creates Instructions (DOM manipulation)
 * @param {Object} mainParent the parent element of this instruction div
 * @param {Function} callback takes in the function to initialize game
 */
const createGameInstructions = (callback) => {
  const parent = document.querySelector('#form-instruction-section');
  const playerName = getCookie('name');

  // instructions
  const instructionsParent = createElement('div', parent);
  instructionsParent.classList.add('single-player-instrutions');

  // row one
  const rowOne = createElement('div', instructionsParent);
  rowOne.classList.add('row', 'my-row');

  // greeting
  const greeting = createElement('h4', rowOne);
  greeting.innerHTML = `Welcome ${playerName}!`;

  // row two
  const rowTwo = createElement('div', instructionsParent);
  rowTwo.classList.add('row', 'my-row');

  // Col One
  const colOne = createElement('div', rowTwo);
  colOne.classList.add('col-sm-4', 'my-col');

  // Col Two
  const colTwo = createElement('div', rowTwo);
  colTwo.classList.add('col-sm-8', 'my-col');

  // controls
  const controlsTitle = createElement('h6', colOne);
  controlsTitle.innerHTML = 'Controls:';

  // controls
  const controls = createElement('h6', colTwo);
  controls.classList.add('controls-text');
  controls.innerHTML = 'W: Up <br> S: Down <br> A: Left <br>D: Right';

  // row three
  const rowThree = createElement('div', instructionsParent);
  rowThree.classList.add('row', 'my-row');

  // submit button
  const submitBtn = createElement('button', rowThree);
  submitBtn.innerHTML = 'START';
  submitBtn.classList.add('single-player-submit-btn');
  submitBtn.addEventListener('click', () => {
    // delete instructions
    parent.remove();
    callback();
  });
};

/*-------------------------------------------*/
/* --------------------------- EXPORT MODULE */
/*-------------------------------------------*/
export default createGameInstructions;
