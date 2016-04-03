var expect = require('chai').expect;
var underTest = require('../../lib/did-pass');

describe('didPass module', function() {

    describe('when passed parsed TAP output for passing tests', function() {
        it('should return true', function() {
            expect(underTest({ok: true})).to.equal(true);
        });
    });

    describe('when passed parsed TAP output for failed tests', function() {
        it('should return false', function() {
            expect(underTest({ok: false})).to.equal(false);
            // expect(underTest({failures: [1, 2, 3]})).to.equal(false);
        });
    });

});
