import chai from 'chai';

import * as SummaryContainer from '../../containers/SummaryContainer';
import * as constants from '../../static/constants';


describe('Get message stats', () => {
  it('Get success', async () => {
    const stubUrl = 'TEST_URL';
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
            attachments: {
              0: {
                payload: {
                  url: stubUrl,
                },
              },
            },
          },
          C: {
            starred: false,
            category: constants.TIMELINE_CATEGORY_CODE_ACTIVITY,
          },
        },
      },
    };
    const messageStats = SummaryContainer._getMessageStats(stubState);
    const expectedMessageStats = {
      numMessages: 3,
      [constants.TIMELINE_CATEGORY_CODE_STAR]: 2,
      [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: 2,
      [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: 0,
      [constants.TIMELINE_CATEGORY_CODE_MOOD]: 0,
      [constants.TIMELINE_CATEGORY_CODE_MEMORY]: 0,
      [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: 1,
      [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: 0,
      [constants.TIMELINE_CATEGORY_CODE_OTHER]: 0,
      allImages: [stubUrl],
      [`${constants.TIMELINE_CATEGORY_CODE_STAR}Images`]: [stubUrl],
      [`${constants.TIMELINE_CATEGORY_CODE_ACTIVITY}Images`]: [],
      [`${constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR}Images`]: [],
      [`${constants.TIMELINE_CATEGORY_CODE_MOOD}Images`]: [],
      [`${constants.TIMELINE_CATEGORY_CODE_MEMORY}Images`]: [],
      [`${constants.TIMELINE_CATEGORY_CODE_MEDICAL}Images`]: [stubUrl],
      [`${constants.TIMELINE_CATEGORY_CODE_CAREGIVER}Images`]: [],
      [`${constants.TIMELINE_CATEGORY_CODE_OTHER}Images`]: [],
    };
    chai.assert.deepEqual(messageStats, expectedMessageStats);
  });
});
