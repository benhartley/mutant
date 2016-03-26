var rewire = require('rewire');
var expect = require('chai').expect;
var underTest = rewire('../../lib/register');

describe('Register lib', function() {

    describe('shouldRegister predicate', function() {

        var shouldRegister = underTest.__get__('shouldRegister');

        describe('when process.env.MUTANT is falsey', function() {

            var restore;

            before(function() {
                restore = underTest.__set__({process: {env: {}}});
            });

            it('should return false', function() {
                expect(shouldRegister('somefile')).to.equal(false);
            });

            after(function() {
                restore();
            });

        });

        describe('when passed `filename` contains "node_modules"', function() {
            it('should return false', function() {
                expect(shouldRegister('node_modules/somefile')).to.equal(false);
            });
        });

        describe('when process.env.MUTANT is truthy and passed `filename` does not contain "node_modules"', function() {

            var restore;

            before(function() {
                restore = underTest.__set__({process: {env: {MUTANT: true}}});
            });

            it('should return true', function() {
                expect(shouldRegister('node_modules/somefile')).to.equal(false);
            });

            after(function() {
                restore();
            });

        });

    });

});
