var expect = require('chai').expect;
var underTest = require('../../lib/did-mutate');

describe('didMutate helper predicate', function() {

    describe('when passed a result with nodeCount > 0 and stateMaskWithResult containing 1', function() {
        it('should return true', function() {
            expect(underTest({nodeCount: 1, stateMaskWithResult: '1'})).to.equal(true);
            expect(underTest({nodeCount: 2, stateMaskWithResult: '01'})).to.equal(true);
            expect(underTest({nodeCount: 2, stateMaskWithResult: '10'})).to.equal(true);
        });
    });

    describe('when passed a result with nodeCount = 0', function() {
        it('should return false', function() {
            expect(underTest({nodeCount: 0, stateMaskWithResult: '1'})).to.equal(false);
            expect(underTest({nodeCount: 0, stateMaskWithResult: '0'})).to.equal(false);
        });
    });

    describe('when passed a result where stateMaskWithResult does not contain a 1', function() {
        it('should return false', function() {
            expect(underTest({nodeCount: 1, stateMaskWithResult: '0'})).to.equal(false);
            expect(underTest({nodeCount: 2, stateMaskWithResult: '00'})).to.equal(false);
        });
    });

});
