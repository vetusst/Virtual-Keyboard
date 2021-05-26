class BaseStringInt {
    get() {
        return this.val
    }
}

function StringBuilder(val) {
    this.val = val
  
    this.plus = function(...args) {
      this.val += args.join('')
      return this
    }
    this.minus = function(n) {
      this.val = this.val.slice(0, -n)
      return this
    }
    this.multiply = function(int) {
      this.val = this.val.repeat(int)
      return this
    }
    this.divide = function(n) {
      let k = Math.floor(this.val.length / n)
      this.val = this.val.slice(0,k)
      return this
    }
    this.remove = function(val) {
      let ind = this.val.indexOf(val)
      this.val = this.val.substr(0, ind) + this.val.substr(ind + val.length)
      return this
    }
    this.sub = function(from, n) {
      this.val = this.val.substr(from, n)
      return this
    }
    // this.get = function() {
    //   return this.val
    // }
}
StringBuilder.prototype = Object.create(BaseStringInt.prototype);

class IntBuilder extends BaseStringInt {
    constructor(val=0) {
        super()
        this.val = val
    }

    plus(...args) {
        this.val = args.reduce((a,b) => a + b) + this.val
        return this
    }
    minus(...args) {
        this.val = args.reduce((a,b) => - a - b) + this.val
        return this
    }
    multiply(n){
        this.val = this.val * n
        return this
    }
    divide(n) {
        this.val = Math.floor(this.val/n)
        return this
    }
    mod(n) {
        this.val = this.val % n
        return this
    }
    
    static random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

let testString = new StringBuilder('Hello')
let testInt = new IntBuilder(10)

testString
    .plus(' all', '!')                    // 'Hello all!'
    .minus(4)                                  // 'Hello '
    .multiply(3)                               // 'Hello Hello Hello '
    .divide(4)                                 // 'Hell';
    .remove('l')                               // 'He';
    .sub(1,1)                                  // 'e';
    console.log(testString.get())

testInt
    .plus(2, 3, 2)                     // 17;
    .minus(1, 2)                       // 14;
    .multiply(2)                       // 28;
    .divide(4)                         // 7;
    .mod(3)                            // 1;
    console.log(testInt.get())

