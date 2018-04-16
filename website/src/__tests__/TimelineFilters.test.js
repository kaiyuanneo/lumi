import chai from 'chai';

import * as TimelineFiltersContainer from '../containers/TimelineFiltersContainer';


describe('Get filter default value', () => {
  it('Get success', async () => {
    const stubState = {
      timeline: {
        messageFilterCategories: {
          A: true,
          B: false,
        },
      },
    };
    const filterDefaultValueA = TimelineFiltersContainer._getFilterDefaultValue(stubState, 'A');
    const filterDefaultValueB = TimelineFiltersContainer._getFilterDefaultValue(stubState, 'B');
    chai.assert.strictEqual(filterDefaultValueA, 'A');
    chai.assert.strictEqual(filterDefaultValueB, '');
  });
});
