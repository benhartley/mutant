require('../../lib/register');
var rewire = require('rewire');
var sinon = require('sinon');
var expect = require('chai').expect;
var underTest = rewire('../../lib/binary-expression-operator-replace');

describe('binaryExpressionOperatorReplace lib', function() {

    var path, from, mockMutation;

    describe('when passed path contains passed "from" operator', function() {

        beforeEach(function() {
            path = {node: {operator: 'a'}};
            from = 'a';
        });

        describe('when mutation.shouldMutate returns true', function() {

            beforeEach(function() {
                mockMutation = {
                    shouldMutate: sinon.stub().returns(true),
                    increaseNodeCount: sinon.spy()
                };
                underTest(mockMutation, from, 'b')('0').BinaryExpression(path);
            });

            it('should replace the operator with passed "to" value', function() {
                expect(path.node.operator).to.equal('b');
            });

            it('should call mutation.increaseNodeCount', function() {
                expect(mockMutation.increaseNodeCount.called).to.equal(true);
            });

        });

        describe('when mutation.shouldMutate returns false', function() {

            beforeEach(function() {
                mockMutation = {
                    shouldMutate: sinon.stub().returns(false),
                    increaseNodeCount: sinon.spy()
                };
                underTest(mockMutation, from, 'b')('0').BinaryExpression(path);
            });

            it('should not replace the operator', function() {
                expect(path.node.operator).to.equal(from);
            });

            it('should call mutation.increaseNodeCount', function() {
                expect(mockMutation.increaseNodeCount.called).to.equal(true);
            });

        });

    });

    describe('when passed path does not contain passed "from" operator', function() {

        beforeEach(function() {
            path = {node: {operator: 'a'}};
            from = 'c';
            mockMutation = {
                shouldMutate: sinon.spy(),
                increaseNodeCount: sinon.spy()
            };
            underTest(mockMutation, from, 'b')('0').BinaryExpression(path);
        });

        it('should not change the operator', function() {
            expect(path.node.operator).to.equal('a');
        });

        it('should not call mutation.shouldMutate', function() {
            expect(mockMutation.shouldMutate.called).to.equal(false);
        });

        it('should not call mutation.increaseNodeCount', function() {
            expect(mockMutation.increaseNodeCount.called).to.equal(false);
        });

    });

});
