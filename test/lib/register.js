var expect = require('chai').expect;
var rewire = require('rewire');
var underTest = rewire('../../lib/register');

describe('register lib', function() {

    describe('shouldRegister predicate', function() {

        var restore;
        var shouldRegister = underTest.__get__('shouldRegister');

        describe('when filename contains "node_modules"', function() {
            it('should return false', function() {
                expect(shouldRegister('node_modules/thing.js')).to.equal(false);
                expect(shouldRegister('path/node_modules/thing.js')).to.equal(false);
            });
        });

        describe('when filename does not contain "node_modules"', function() {

            describe('when env satisfies conditions', function() {

                before(function() {
                    restore = underTest.__set__({
                        process: {
                            env: {
                                MUTATION: 'yup',
                                STATEMASK: '01'
                            }
                        }
                    });
                });

                it('should return true', function() {
                    expect(shouldRegister('thing.js')).to.equal(true);
                });

                after(function() {
                    restore();
                });

            });

            describe('when env does not satisfy mutation condition', function() {

                before(function() {
                    restore = underTest.__set__({
                        process: {
                            env: {
                                STATEMASK: '01'
                            }
                        }
                    });
                });

                it('should return false', function() {
                    expect(shouldRegister('thing.js')).to.equal(false);
                });

                after(function() {
                    restore();
                });

            });

            describe('when env does not satisfy stateMask condition', function() {

                before(function() {
                    restore = underTest.__set__({
                        process: {
                            env: {
                                MUTATION: 'yup'
                            }
                        }
                    });
                });

                it('should return false', function() {
                    expect(shouldRegister('thing.js')).to.equal(false);
                });

                after(function() {
                    restore();
                });

            });

        });

    });

});
