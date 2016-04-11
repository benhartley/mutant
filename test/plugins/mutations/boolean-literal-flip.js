var rewire = require('rewire');
var expect = require('chai').expect;
var runMutationPlugin = require('../../helpers/run-mutation-plugin');
var underTest = rewire('../../../plugins/mutations/boolean-literal-flip');

describe('booleanLiteralFlip mutation plugin', function() {

    var restore;

    beforeEach(function() {
        restore = underTest.__set__({
            n: 0
        });
    });

    describe('when AST does not contain a BooleanLiteral', function() {
        it('should return the input unchanged', function() {
            var input = 'var notBool = "x";';
            expect(runMutationPlugin(input, underTest, '1')).to.equal(input);
        });
    });

    describe('when AST does contain BooleanLiterals', function() {

        var input = 'var firstBool = true;\nvar secondBool = true;';

        describe('when passed stateMask of "00"', function() {
            it('should return the input unchanged', function() {
                expect(runMutationPlugin(input, underTest, '00')).to.equal(input);
            });
        });

        describe('when passed stateMask of "01"', function() {
            it('should flip the relevant boolean', function() {
                var expected = 'var firstBool = true;\nvar secondBool = false;';
                expect(runMutationPlugin(input, underTest, '01')).to.equal(expected);
            });
        });

        describe('when passed stateMask of "10"', function() {
            it('should flip the relevant boolean', function() {
                var expected = 'var firstBool = false;\nvar secondBool = true;';
                expect(runMutationPlugin(input, underTest, '10')).to.equal(expected);
            });
        });

        describe('when passed stateMask of "11"', function() {
            it('should flip the relevant boolean', function() {
                var expected = 'var firstBool = false;\nvar secondBool = false;';
                expect(runMutationPlugin(input, underTest, '11')).to.equal(expected);
            });
        });

    });

    afterEach(function() {
        restore();
    });

});
