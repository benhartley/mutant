require('../../lib/register');
var rewire = require('rewire');
var sinon = require('sinon');
var expect = require('chai').expect;
var underTest = rewire('../../lib/binary-expression-operator-replace');

describe('binaryExpressionOperatorReplace lib', function() {

    var path, from;

    describe('when passed path contains passed "from" operator', function() {

        beforeEach(function() {
            path = {node: {operator: 'a'}};
            from = 'a';
        });

        it('should return passed n value + 1', function() {
            expect(underTest(from, 'b', '0', 0, path)).to.equal(1);
        });

        describe('when shouldMutate returns true', function() {

            var restore;

            before(function() {
                restore = underTest.__set__({
                    shouldMutate: sinon.stub().returns(true)
                });
            });

            it('should replace the operator with passed "to" value', function() {
                underTest(from, 'b', '0', 0, path);
                expect(path.node.operator).to.equal('b');
            });

            after(function() {
                restore();
            });

        });

    });

    describe('when passed path does not contain passed "from" operator', function() {

        beforeEach(function() {
            path = {node: {operator: 'a'}};
            from = 'c';
        });

        it('should not change the operator', function() {
            underTest(from, 'b', '0', 0, path);
            expect(path.node.operator).to.equal('a');
        });

        it('should return same value as passed n', function() {
            expect(underTest(from, 'b', '0', 0, path)).to.equal(0);
        });

    });

});
