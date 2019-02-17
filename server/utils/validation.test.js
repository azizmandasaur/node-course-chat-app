const expect = require('expect');

const {isRealString} = require('./validation');

describe('Check is Params are valid', () => {
    it('should reject non-string values', () => {
        var res = isRealString(1234);
        expect(res).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var res = isRealString('     ');
        expect(res).toBe(false);
    });

    it('should allow string with non-space char', () => {
        var res = isRealString('User1');
        expect(res).toBe(true);
    });
});