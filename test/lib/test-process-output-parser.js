var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');
var underTest = rewire('../../lib/test-process-output-parser');

describe('testProcessOutputParser lib', function() {

    var restore;

    describe('updateStateMask method', function() {

        var updateStateMask = underTest.__get__('updateStateMask');

        describe('when passed a params object where .env.STATEMASK property is falsey', function() {
            it('should return undefined', function() {
                expect(updateStateMask({})).to.equal(undefined);
                expect(updateStateMask({env: {}})).to.equal(undefined);
                expect(updateStateMask({env: {STATEMASK: false}})).to.equal(undefined);
                expect(updateStateMask({env: {STATEMASK: undefined}})).to.equal(undefined);
            });
        });

        describe('when passed a params object with truthy .env.STATEMASK property', function() {

            describe('when passed a test pass result', function() {

                before(function() {
                    restore = underTest.__set__({
                        didPass: sinon.stub().returns(true)
                    });
                });

                it('should return the passed stateMask', function() {
                    var expected = {stateMaskWithResult: '0101'};
                    expect(updateStateMask({env: {STATEMASK: '0101'}})).to.deep.equal(expected);
                });

                after(function() {
                    restore();
                });

            });

            describe('when passed a test fail result', function() {

                before(function() {
                    restore = underTest.__set__({
                        didPass: sinon.stub().returns(false)
                    });
                });

                it('should return the passed stateMask with the last 1 zeroed out', function() {
                    var expected = {stateMaskWithResult: '0100'};
                    expect(updateStateMask({env: {STATEMASK: '0101'}})).to.deep.equal(expected);
                });

                after(function() {
                    restore();
                });

            });

        });

    });

    describe('exported Parser object', function() {

        var parser, params, callback, onSpy;

        beforeEach(function() {
            parser = Object.create(underTest);
        });

        describe('getTestParser method', function() {

            beforeEach(function() {
                onSpy = sinon.spy();
                restore = underTest.__set__({
                    tapParser: sinon.stub().returns({
                        on: onSpy
                    })
                });
                parser.processResult = sinon.spy();
                params = {a: true};
                callback = function() {};

                parser.getTestParser(params, callback);
            });

            it('should call this.processResult with params and callback', function() {
                expect(parser.processResult.calledWith(params, callback)).to.equal(true);
            });

            it('should bind to the "extra" event on the tapParser stream', function() {
                expect(onSpy.calledWith('extra')).to.equal(true);
            });

            afterEach(function() {
                restore();
            });

        });

        describe('parseNodeCount method', function() {

            describe('when passed extra TAP output that matches node count pattern', function() {
                it('should set the nodeCount property of the parser instance to the matched value', function() {
                    parser.parseNodeCount('Node count: 2');
                    expect(parser.nodeCount).to.equal(2);
                });
            });

            describe('when passed extra TAP output that does not match node count pattern', function() {

                it('should return undefined', function() {
                    expect(parser.parseNodeCount('ben')).to.equal(undefined);
                });

                it('should not set the nodeCount property of the parser instance', function() {
                    parser.parseNodeCount('ben');
                    expect(parser.nodeCount).to.equal(0);
                });

            });

        });

        describe('processResult method', function() {

            beforeEach(function() {
                restore = underTest.__set__({
                    updateStateMask: sinon.stub().returns({stateMask: true})
                });
                parser.nodeCount = 3;
            });

            it('should call passed callback with correct params', function() {
                var params = {
                    env: {
                        MUTATION: 'some-mutation'
                    }
                };
                var callbackSpy = sinon.spy();
                var expectedParams = {
                    mutation: 'some-mutation',
                    tap: {
                        result: true
                    },
                    stateMask: true,
                    nodeCount: 3

                };
                parser.processResult(params, callbackSpy)({result: true});
                expect(callbackSpy.calledWith(null, expectedParams)).to.equal(true);
            });

            afterEach(function() {
                restore();
            });

        });

    });

});
