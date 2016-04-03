var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');
var underTest = rewire('../../lib/increase-node-count');

describe('increaseNodeCount lib', function() {

    var restore;

    beforeEach(function() {
        restore = underTest.__set__({
            console: {
                log: sinon.spy()
            }
        });
    });

    it('should log node count to stdout', function() {
        underTest(0);
        expect(underTest.__get__('console').log.calledWith('Node count: 1')).to.equal(true);
    });

    it('should return passed value n + 1', function() {
        expect(underTest(0)).to.equal(1);
    });

    afterEach(function() {
        restore();
    });

});
