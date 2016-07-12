'use strict';

var Observer = require('./observer');
var Bus = require('./bus');

var jsdom = require('jsdom');

describe('observer', function() {
  var constructorErrors = [
    [ undefined, 'bus is required; got undefined' ],
    [ {}, 'bus.emit must be a function; got undefined' ],
  ];

  constructorErrors.forEach(function(error) {
    var arg = error[0];
    var message = error[1];

    it('should throw when constructed with argument '+ arg, function() {
      expect(function() { return new Observer(arg); }).toThrow(new Error(message));
    });
  });

  it('should create observer when constructed with proper arguments', function() {
    var observer = new Observer(new Bus());
    expect(observer).not.toBeNull();
    expect(observer.constructor).toBe(Observer);
  });

  describe('.observeBrowserEvents', function() {
    var bus = null;
    var testedObserver = null;

    beforeEach(function() {
      bus = new Bus();
      testedObserver = new Observer(bus);
    });

    var document = jsdom.jsdom();

    afterAll(function() {
      document.defaultView.close();
    });

    function node() {
      return document.createElement('p');
    }

    var errors = [
      [ 'undefined nodes', undefined, undefined, 'nodes is required; got undefined' ],
      [ 'empty nodes array', [], undefined, 'nodes.length must be > 0; got 0' ],
      [ 'undefined events', [ node() ], undefined, 'events is required; got undefined' ],
      [ 'empty events array', [ node() ], [], 'events.length must be > 0; got 0' ],
      [
        'node without addEventListener function',
        [ {} ],
        [ 'load' ],
        'node[0].addEventListener must be a function; got undefined',
      ],
      [ 'event that is not a string', [ node() ], [ 0 ], 'events[0] must be a string; got 0' ],
    ];

    errors.forEach(function(error) {
      var testName = error[0];
      var arg0 = error[1];
      var arg1 = error[2];
      var message = error[3];

      it('should throw when called with '+ testName, function() {
        expect(function() { testedObserver.observeBrowserEvents(arg0, arg1); })
          .toThrow(new Error(message));
      });
    });
  });
});

/*
  eslint-env node, jasmine
 */

/*
  eslint
    max-nested-callbacks: 0
    no-undefined: 0
 */
