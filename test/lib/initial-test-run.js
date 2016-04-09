var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');
var underTest = rewire('../../lib/initial-test-run');

describe('initialTestRun lib', function() {

    describe('reportInitialRun method', function() {

        var restore;
        var reportInitialRun = underTest.__get__('reportInitialRun');

        describe('when one or more tests failed', function() {

            beforeEach(function() {
                restore = underTest.__set__({
                    didPass: sinon.stub().returns(false),
                    fail: sinon.spy(),
                    console: {
                        log: sinon.spy()
                    }
                });
                reportInitialRun({})(null, {});
            });

            it('should call fail', function() {
                expect(underTest.__get__('fail').calledWith('Initial test run failed - please check your tests are passing to begin.')).to.equal(true);
            });

            it('should not call console.log', function() {
                expect(underTest.__get__('console').log.called).to.equal(false);
            });

            afterEach(function() {
                restore();
            });

        });

        describe('when the tests pass', function() {

            var restore;
            var queue = {};

            beforeEach(function() {
                restore = underTest.__set__({
                    didPass: sinon.stub().returns(true),
                    os: {
                        cpus: sinon.stub().returns([1, 2])
                    }
                });
            });

            it('should set the queue concurrency to the number of cpus', function() {
                reportInitialRun(queue)(null, {});
                expect(queue.concurrency).to.equal(2);
            });

            afterEach(function() {
                restore();
            });

        });

    });

});
