/* eslint-disable import/extensions */
import create from './utils/create.js';

export default class Key {
  constructor({ lower, upper, code }) {
    this.lower = lower;
    this.upper = upper;
    this.code = code;
    this.isFnKey = Boolean(code.match(/Backspace|Tab|CapsLock|Enter|ShiftLeft|ShiftRight|ControlLeft|MetaLeft|AltLeft|AltRight|ContextMenu|ControlRight|Space/));

    if (upper && upper.match(/[^a-zA-Zа-яёЁА-Я0-9]/)) {
      this.sub = create('div', 'sub', this.upper);
    } else {
      this.sub = create('div', 'sub', '');
    }

    this.letter = create('div', 'letter', lower);

    // this.div = create('div', 'keyboard__key', [this.sub, this.letter], null, ['code', this.code],
    //   this.isFnKey ? ['fn', 'true'] : ['fn', 'false']);
    this.div = create('div', 'keyboard__key', [this.sub, this.letter], null, ['code', this.code], ['fn', this.isFnKey]);
  }
}
