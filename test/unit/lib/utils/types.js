const { assert } = require('chai');
const getType = require('../../../../lib/utils/types');


describe('For types util', () => {
  it('should work as as expected', () => {
    assert.equal(getType({}), 'Object');
    assert.equal(getType([]), 'Array');
    assert.equal(getType(''), 'String');
    assert.equal(getType(() => {}), 'Function');
    assert.equal(getType(true), 'Boolean');
    assert.equal(getType(/test/i), 'RegExp');
    assert.equal(getType(), 'Undefined');
  });
});
