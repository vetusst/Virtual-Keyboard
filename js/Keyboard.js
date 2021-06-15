/* eslint-disable import/extensions */
import * as storage from './utils/storage.js';
import create from './utils/create.js';
import language from './layouts/index.js';
import Key from './Key.js';

const main = create('main', '', [
  create('h1', 'header', '<u>Virtual Keyboard'),
  create('h2', 'description', '<i>Press <code>Shift + Alt</code> to change keyboard language</i>')], null);

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
    document.addEventListener('keydown', this.catchKeyEvent);
    document.addEventListener('keyup', this.catchKeyEvent);
    document.addEventListener('mousedown', this.catchClickEvent);
    document.addEventListener('mouseup', this.catchClickEvent);
  }

  catchKeyEvent = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    const keyObj = this.keys.find((x) => x.code === e.code);
    if (!keyObj) return;
    this.output.focus();

    const { type } = e;
    if (type.match(/key/)) e.preventDefault();

    this.handleEvents(keyObj, type);
  }

  catchClickEvent = (e) => {
    const code = e.target.closest('.keyboard__key');
    if (!code) return;
    const keyObj = this.keys.find((x) => x.code === e.target.closest('.keyboard__key').dataset.code);

    const { type } = e;
    this.handleEvents(keyObj, type);
  }

  handleEvents = (keyObj, type) => {
    const { code } = keyObj;
    if (type.match(/keydown|mousedown/)) {
      if (code.match(/Shift/)) this.isShift = true;
      if (code.match(/Alt/)) this.isAlt = true;
      keyObj.div.classList.add('active');
      if (code === 'CapsLock') {
        this.capsMode();
        this.isCaps = !this.isCaps;
        // eslint-disable-next-line no-unused-expressions
        this.isCaps ? keyObj.div.classList.add('caps-lock-on') : keyObj.div.classList.remove('caps-lock-on');
      }

      if (this.isShift && this.isAlt) this.switchLanguage();
      else if (this.isShift && !this.isAlt) this.shiftMode();

      if (!this.isShift) {
        this.printToOutput(keyObj, this.isCaps ? keyObj.upper : keyObj.lower);
      } else if (this.isShift) {
        this.printToOutput(keyObj, this.isCaps ? keyObj.lower : keyObj.upper);
      }
    } else if (type.match(/keyup|mouseup/)) {
      keyObj.div.classList.remove('active');

      if (code.match(/Shift/)) {
        this.isShift = false;
        this.shiftMode();
      }
      if (code.match(/Alt/)) this.isAlt = false;
    }
  }

  switchLanguage = () => {
    const langs = Object.keys(language); // ['en', 'ru']
    const toLang = langs.find((x) => x !== this.keyboard.dataset.language);
    this.kbLang = language[toLang];
    this.keyboard.dataset.language = toLang;
    storage.set('KeyboardLanguage', toLang);

    this.keys.map((button) => {
      const keyObj = this.kbLang.find((x) => button.code === x.code);
      const newButton = button;
      newButton.lower = keyObj.lower;
      newButton.upper = keyObj.upper;

      if (keyObj.upper && keyObj.upper.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
        newButton.sub.innerHTML = keyObj.upper;
      } else {
        newButton.sub.innerHTML = '';
      }
      newButton.letter.innerHTML = keyObj.lower;
      return newButton;
    });
  }

  shiftMode() {
    this.keys.map((button) => {
      const keyObj = this.kbLang.find((x) => button.code === x.code);
      if (button.isFnKey) return button;

      const newButton = button;

      if (keyObj.upper && keyObj.upper.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
        if (!this.isCaps) newButton.sub.innerHTML = this.isShift ? keyObj.lower : keyObj.upper;
        else newButton.sub.innerHTML = this.isShift ? keyObj.upper : keyObj.lower;
      } else {
        newButton.sub.innerHTML = '';
      }

      if (!this.isCaps) newButton.letter.innerHTML = this.isShift ? keyObj.upper : keyObj.lower;
      else newButton.letter.innerHTML = this.isShift ? keyObj.lower : keyObj.upper;

      return newButton;
    });
  }

  capsMode() {
    this.keys.map((button) => {
      const keyObj = this.kbLang.find((x) => button.code === x.code);
      if (button.isFnKey) return button;

      const newButton = button;

      if (keyObj.upper && keyObj.upper.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
        newButton.sub.innerHTML = !this.isCaps ? keyObj.upper : keyObj.lower;
      } else {
        newButton.sub.innerHTML = '';
      }
      newButton.letter.innerHTML = this.isCaps ? keyObj.lower : keyObj.upper;
      return newButton;
    });
  }

  printToOutput(keyObj, symbol) {
    let cursor = this.output.selectionStart;
    const left = this.output.value.slice(0, cursor);
    const right = this.output.value.slice(cursor);

    const fnButtons = {
      Tab: () => {
        this.output.value = `${left}\t${right}`;
        cursor += 1;
      },
      Enter: () => {
        this.output.value = `${left}\n${right}`;
        cursor += 1;
      },
      Space: () => {
        this.output.value = `${left} ${right}`;
        cursor += 1;
      },
      Backspace: () => {
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursor += 1;
      },
    };

    if (fnButtons[keyObj.code]) fnButtons[keyObj.code]();
    else if (!keyObj.isFnKey) {
      this.output.value = `${left}${symbol}${right}`;
      cursor += 1;
    }

    this.output.setSelectionRange(cursor, cursor);
  }
}
