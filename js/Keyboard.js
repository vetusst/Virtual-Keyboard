/* eslint-disable import/extensions */
import * as storage from './utils/storage.js';
import create from './utils/create.js';
import language from './layouts/index.js';
import Key from './Key.js';

const main = create('main', '', [
  create('h1', 'header', 'Virtual Keyboard'),
  create('h3', 'description', 'Press Win + Space to change keyboard language')], null);

export default class Keyboard {
  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    this.keyPressed = {};
    this.isCaps = false;
  }

  init(langCode) {
    this.kbLang = language[langCode];
    this.output = create('textarea', 'output', null, main,
      ['placeholder', 'start typing...'], ['rows', 5], ['cols', 50], ['autocorrect', 'off'], ['spellcheck', false]);
    this.keyboard = create('div', 'keyboard', null, main, ['language', langCode]);
    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keys = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = create('div', 'keyboard_row', null, this.keyboard, ['row', i + 1]);
      row.forEach((code) => {
        const keyObj = this.kbLang.find((x) => x.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keys.push(keyButton);
          rowElement.appendChild(keyButton.div);
        }
      });
    });
    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
  }

  handleEvent = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    const { code, type } = e;
    const keyObj = this.keys.find((x) => x.code === code);
    if (!keyObj) return;
    this.output.focus();

    if (type.match(/keydown|mouseDown/)) {
      if (type.match(/key/)) e.preventDefault();
      keyObj.div.classList.add('active');

      if (code === 'ShiftLeft') this.isShift = true;
      if (code === 'AltLeft') this.isAlt = true;

      if (this.isShift && this.isAlt) this.switchLanguage();
    } else if (type.match(/keyup|mouseup/)) {
      if (type.match(/key/)) e.preventDefault();
      keyObj.div.classList.remove('active');

      if (code === 'ShiftLeft') this.isShift = false;
      if (code === 'AltLeft') this.isAlt = false;
    }
  }

  switchLanguage = () => {
    const langs = Object.keys(language); // ['en', 'ru']
    this.kbLang = langs.find((x) => x !== this.kbLang);
    this.keyboard.dataset.language = this.kbLang;
    storage.set('KeyboardLanguage', this.kbLang);
  }
}
