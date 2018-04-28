import chai from 'chai';

import * as SummaryContainer from '../../containers/SummaryContainer';
import * as constants from '../../static/constants';


describe('Get filter stats', () => {
  it('Get success', async () => {
    const stubState = {
      timeline: {
        messages: {
          A: {
            starred: true,
            category: constants.TIMELINE_CATEGORY_CODE_ACTIVITY,
          },
          B: {
            starred: true,
            category: constants.TIMELINE_CATEGORY_CODE_MEDICAL,
          },
          C: {
            starred: false,
            category: constants.TIMELINE_CATEGORY_CODE_ACTIVITY,
          },
        },
      },
    };
    const filterStats = SummaryContainer._getFilterStats(stubState);
    const expectedFilterStats = {
      [constants.TIMELINE_CATEGORY_CODE_STAR]: 2,
      [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: 2,
      [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: 0,
      [constants.TIMELINE_CATEGORY_CODE_MOOD]: 0,
      [constants.TIMELINE_CATEGORY_CODE_MEMORY]: 0,
      [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: 1,
      [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: 0,
      [constants.TIMELINE_CATEGORY_CODE_OTHER]: 0,
    };
    chai.assert.deepEqual(filterStats, expectedFilterStats);
  });
});
