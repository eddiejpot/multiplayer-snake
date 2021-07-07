/*-------------------------------------------*/
/* ------------------IMPORT MODULES/ CLASSES */
/*-------------------------------------------*/
import { createCookie } from './cookieModule.mjs';

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
 * DOM manipulation to create form for user to enter name
 */
const createAskUserNameForm = (mainParent, callback) => {
  // form
  const form = createElement('div', mainParent);
  form.classList.add('single-player-name-form');

  // row one
  const rowOne = createElement('div', form);
  rowOne.classList.add('row', 'my-row');

  // header
  const header = createElement('h4', rowOne);
  header.innerHTML = 'ENTER YOUR NAME';

  // row two
  const rowTwo = createElement('div', form);
  rowTwo.classList.add('row', 'my-row');

  // input
  const nameInput = createElement('input', rowTwo);
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('placeholder', 'your name');
  nameInput.setAttribute('id', 'name');

  // submit button
  const submitBtn = createElement('button', rowTwo);
  submitBtn.innerHTML = 'Submit';
  submitBtn.classList.add('single-player-submit-btn');
  submitBtn.addEventListener('click', () => {
    // check if input is empty
    const userName = nameInput.value;
    if (userName.trim() === '') {
      header.innerHTML = 'ENTER YOUR NAME. PLEASE';
    } else {
      // set cookie
      createCookie('name', nameInput.value);
      // delete form
      mainParent.innerHTML = '';
      // go to game instructions
      callback();
    }
  });
};

export default createAskUserNameForm;
