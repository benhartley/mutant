var rewire = require('rewire');
var sinon = require('sinon');
var expect = require('chai').expect;
var underTest = rewire('../../../plugins/mutations/boolean-literal-flip');

describe('booleanLiteralFlip mutation plugin', function() {

    var restore, path;

    describe('when mutation.shouldMutate returns true', function() {

        beforeEach(function() {
            restore = underTest.__set__({
                mutation: {
                    shouldMutate: sinon.stub().returns(true),
                    increaseNodeCount: sinon.spy()
                }
            });
            path = {node: {value: true}};
            underTest('0').BooleanLiteral(path);
        });

        it('should invert the node boolean value', function() {
            expect(path.node.value).to.equal(false);
        });

        it('should call mutation.increaseNodeCount', function() {
            expect(underTest.__get__('mutation').increaseNodeCount.called).to.equal(true);
        });

        afterEach(function() {
            restore();
        });

    });

    describe('when mutation.shouldMutate returns false', function() {

        beforeEach(function() {
            restore = underTest.__set__({
                mutation: {
                    shouldMutate: sinon.stub().returns(false),
                    increaseNodeCount: sinon.spy()
                }
            });
            path = {node: {value: true}};
            underTest('0').BooleanLiteral(path);
        });

        it('should should not change the node boolean value', function() {
            expect(path.node.value).to.equal(true);
        });

        it('should call mutation.increaseNodeCount', function() {
            expect(underTest.__get__('mutation').increaseNodeCount.called).to.equal(true);
        });

        afterEach(function() {
            restore();
        });

    });

});
