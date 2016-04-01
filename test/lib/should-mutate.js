require('../../lib/register');
var expect = require('chai').expect;

var underTest = require('../../lib/should-mutate');

describe('shouldMutate lib', function() {

    describe('when nth character in stateMask is 1', function() {
        it('should return true', function() {
            expect(underTest('1', 0)).to.equal(true);
            expect(underTest('01', 1)).to.equal(true);
            expect(underTest('101', 2)).to.equal(true);
            expect(underTest('0001', 3)).to.equal(true);
        });
    });

    describe('when nth character in stateMask is not 1', function() {
        it('should return false', function() {
            expect(underTest('0', 0)).to.equal(false);
            expect(underTest('10', 1)).to.equal(false);
            expect(underTest('010', 2)).to.equal(false);
            expect(underTest('0010', 3)).to.equal(false);
        });
    });

});
