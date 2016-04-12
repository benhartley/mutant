var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');
var underTest = rewire('../../lib/config');

describe('config lib', function() {

    var restore;

    describe('validate method', function() {

        var validate = underTest.__get__('validate');

        describe('when loaded config does not contain a tests.run property', function() {

            beforeEach(function() {
                restore = underTest.__set__({
                    fail: sinon.spy(),
                    config: {}
                });
                validate();
            });

            it('should call fail', function() {
                expect(underTest.__get__('fail').calledWith('Config missing tests.run command')).to.equal(true);
            });

            afterEach(function() {
                restore();
            });

        });

        describe('when loaded config tests.run property does not contain $FILE placeholder', function() {

            beforeEach(function() {
                restore = underTest.__set__({
                    fail: sinon.spy(),
                    config: {
                        tests: {
                            run: 'some test command'
                        }
                    }
                });
                validate();
            });

            it('should call fail', function() {
                expect(underTest.__get__('fail').calledWith('Config tests.run command missing $FILE placeholder')).to.equal(true);
            });

            afterEach(function() {
                restore();
            });

        });

    });

});
