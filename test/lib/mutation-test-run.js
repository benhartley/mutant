var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');
var underTest = rewire('../../lib/mutation-test-run');

describe('MutationTestRun lib', function() {

    var instance;

    describe('constructor', function() {
        it('should set the initial state', function() {
            var queue = {a: true};
            instance = new underTest(queue, 'path', '1');
            expect(instance.queue).to.deep.equal(queue);
            expect(instance.testPath).to.equal('path');
            expect(instance.stateMask).to.equal('1');
            expect(instance.nodeCount).to.equal(1);
        });
    });

    describe('hasUnmutatedNodes predicate', function() {

        beforeEach(function() {
            instance = new underTest({}, 'path', '1');
        });

        describe('when stateMask length is greater than nodeCount', function() {
            it('should return false', function() {
                instance.stateMask = '01';
                instance.nodeCount = 1;
                expect(instance.hasUnmutatedNodes()).to.equal(false);
            });
        });

        describe('when stateMask length is equal to nodeCount', function() {
            it('should return true', function() {
                instance.stateMask = '1';
                instance.nodeCount = 1;
                expect(instance.hasUnmutatedNodes()).to.equal(true);
            });
        });

        describe('when stateMask length is less thannodeCount', function() {
            it('should return true', function() {
                instance.stateMask = '1';
                instance.nodeCount = 2;
                expect(instance.hasUnmutatedNodes()).to.equal(true);
            });
        });

    });

    describe('getMutationParams', function() {
        it('should return a representation of the test params', function() {
            var expected = {
                testPath: 'path',
                env: {
                    MUTATION: 'm',
                    STATEMASK: '1'
                }
            };
            instance = new underTest({}, 'path', '1');
            expect(instance.getMutationParams('m')).to.deep.equal(expected);
        });
    });

    describe('handleNodeMutatonResult method', function() {

        var callback, result;

        beforeEach(function() {
            callback = sinon.spy();
            result = {nodeCount: 3, stateMaskWithResult: '01'};
            instance = new underTest({}, 'path', '1');
        });

        it('should update the nodeCount property of the instance', function() {
            instance.handleNodeMutationResult(callback)(null, result);
            expect(instance.nodeCount).to.equal(3);
        });

        it('should update the stateMask property of the instance', function() {
            instance.handleNodeMutationResult(callback)(null, result);
            expect(instance.stateMask).to.equal('011');
        });

        it('should call the callback with the error and result', function() {
            instance.handleNodeMutationResult(callback)(null, result);
            expect(callback.calledWith(null, result)).to.equal(true);
        });

    });

});
