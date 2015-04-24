'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
  });

  it('should not actually test anything yet', function() {
    expect(1).toBe(1);
  });
});
