var rewire = require('rewire');
var sinon = require('sinon');
var expect = require('chai').expect;
var underTest = rewire('../../lib/mutator');

describe('mutator lib', function() {

    describe('getMutation method', function() {

        var restore;
        var getMutation = underTest.__get__('getMutation');

        beforeEach(function() {
            restore = underTest.__set__({
                plugins: {
                    exampleMutation: sinon.spy()
                },
                fail: sinon.spy()
            });
        });

        describe('when passed a mutation for which we have a valid plugin', function() {
            it('should call the plugin with the passed stateMask', function() {
                getMutation('exampleMutation', '0101');
                expect(underTest.__get__('plugins').exampleMutation.calledWith('0101')).to.equal(true);
            });
        });

        describe('when passed a mutation for which we do not have a valid plugin', function() {
            it('should call fail with an error message', function() {
                getMutation('ben', '0101');
                expect(underTest.__get__('fail').calledWith('Plugin "ben" does not return a function')).to.equal(true);
            });
        });

        afterEach(function() {
            restore();
        });

    });

    describe('runMutations method', function() {

        var restore;
        var runMutations = underTest.__get__('runMutations');

        describe('when env variables are invalid', function() {

            before(function() {
                restore = underTest.__set__({
                    process: {
                        env: {
                            MUTATION: 'a,b,c',
                            STATEMASK: '1,0'
                        }
                    },
                    fail: sinon.spy()
                });
            });

            it('should call fail with an error message', function() {
                runMutations({});
                expect(underTest.__get__('fail').calledWith('Mutation / State Mask mismatch')).to.equal(true);
            });

            after(function() {
                restore();
            });

        });

    });

});
