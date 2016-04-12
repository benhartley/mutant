var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');
var underTest = rewire('../../lib/mutation-plugin');

describe('mutationPlugin lib', function() {

    describe('shouldMutate method', function() {

        describe('when n is 0', function() {

            beforeEach(function() {
                underTest.n = 0;
            });

            describe('when nth character in stateMask is 1', function() {
                it('should return true', function() {
                    expect(underTest.shouldMutate('1')).to.equal(true);
                });
            });

            describe('when nth character in stateMask is not 1', function() {
                it('should return false', function() {
                    expect(underTest.shouldMutate('0')).to.equal(false);
                });
            });

        });

        describe('when n is 1', function() {

            beforeEach(function() {
                underTest.n = 1;
            });

            describe('when nth character in stateMask is 1', function() {
                it('should return true', function() {
                    expect(underTest.shouldMutate('01')).to.equal(true);
                });
            });

            describe('when nth character in stateMask is not 1', function() {
                it('should return false', function() {
                    expect(underTest.shouldMutate('10')).to.equal(false);
                });
            });

        });

    });

    describe('increaseNodeCount method', function() {

        var restore;

        beforeEach(function() {
            underTest.n = 3;
            restore = underTest.__set__({
                console: {
                    log: sinon.spy()
                }
            });
        });

        it('should log node count to stdout', function() {
            underTest.increaseNodeCount();
            expect(underTest.__get__('console').log.calledWith('Node count: 3')).to.equal(true);
        });

        afterEach(function() {
            restore();
        });

    });

});

