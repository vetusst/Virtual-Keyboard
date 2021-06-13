/* eslint-disable import/extensions */
import create from './utils/create.js';

export default class Key {
  constructor({ lower, upper, code }) {
    this.lower = lower;
    this.upper = upper;
    this.code = code;
    this.isFnKey = Boolean(code.match(/Backspace|Tab|CapsLock|Enter|ShiftLeft|ShiftRight|ControlLeft|MetaLeft|AltLeft|AltRight|ContextMenu|ControlRight/));

    if (upper && upper.match(/[^a-zA-Zа-яёЁА-Я0-9]/)) {
      this.sub = create('div', 'sub', this.upper);
    } else {
      this.sub = create('div', 'sub', '');
    }

    switch (lower) {
      case 'CapsLock':
        this.letter = create('div', 'letter', 'Caps Lock');
        break;
      case 'Control':
        this.letter = create('div', 'letter', 'Ctrl');
        break;
      case 'ContextMenu':
        this.letter = create('div', 'letter', 'Fn');
        break;
      case 'Meta':
        this.letter = create('div', 'letter', 'Win');
        break;
      default:
        this.letter = create('div', 'letter', lower);
    }

    // this.div = create('div', 'keyboard__key', [this.sub, this.letter], null, ['code', this.code],
    //   this.isFnKey ? ['fn', 'true'] : ['fn', 'false']);
    this.div = create('div', 'keyboard__key', [this.sub, this.letter], null, ['code', this.code], ['fn', this.isFnKey]);
  }
}
