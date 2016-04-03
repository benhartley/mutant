require('../../lib/register');
var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');
var underTest = rewire('../../lib/fail');

describe('fail lib', function() {

    var restore;

    beforeEach(function() {
        restore = underTest.__set__({
            chalk: {
                red: sinon.spy()
            },
            console: {
                error: sinon.spy(),
                log: sinon.stub()
            },
            figures: {
                cross: sinon.stub().returns('cross')
            },
            process: {
                exit: sinon.spy()
            }
        });
        underTest('example failure');
    });

    it('should call console.error', function() {
        expect(underTest.__get__('console').error.called);
    });

    it('should call chalk.red with constructed message', function() {
        expect(underTest.__get__('chalk').red.calledWith('cross Error: example failure\n'));
    });

    it('should call figures.cross', function() {
        expect(underTest.__get__('figures').cross.called);
    });

    afterEach(function() {
        restore();
    });

});
