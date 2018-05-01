import chai from 'chai';

import * as TimelineContainer from '../../containers/TimelineContainer';
import * as constants from '../../static/constants';


describe('Get sorted message map', () => {
  it('Get success', async () => {
    const stubState = {
      timeline: {
        messages: {
          B: 'B',
          C: 'C',
          A: 'A',
        },
      },
    };

    const sortedMessageMap = TimelineContainer._getSortedMessageMap(stubState);

    const expectedSortedMessageMap = new Map();
    expectedSortedMessageMap.set('C', 'C');
    expectedSortedMessageMap.set('B', 'B');
    expectedSortedMessageMap.set('A', 'A');
    const expectedSortedMessageMapIterator = expectedSortedMessageMap.entries();

    sortedMessageMap.forEach((val, key) => {
      const [expectedKey, expectedVal] = expectedSortedMessageMapIterator.next().value;
      chai.assert.strictEqual(key, expectedKey);
      chai.assert.strictEqual(val, expectedVal);
    });
  });
});


describe('Should render message', () => {
  it('showInTimeline is false', () => {
    const stubState = {
      timeline: {
        filterCategories: {},
      },
    };
    const stubMessage = {
      showInTimeline: false,
      category: '',
      starred: false,
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, false);
  });

  it('Category all', () => {
    const stubState = {
      timeline: {
        filterCategories: {
          [constants.TIMELINE_CATEGORY_CODE_ALL]: true,
        },
      },
    };
    const stubMessage = {
      showInTimeline: true,
      category: '',
      starred: false,
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, true);
  });

  it('Category match', () => {
    const stubCategory = 'TEST_CATEGORY';
    const stubState = {
      timeline: {
        filterCategories: {
          [stubCategory]: true,
        },
      },
    };
    const stubMessage = {
      showInTimeline: true,
      category: stubCategory,
      starred: false,
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, true);
  });

  it('Star category', () => {
    const stubState = {
      timeline: {
        filterCategories: {
          [constants.TIMELINE_CATEGORY_CODE_STAR]: true,
        },
      },
    };
    const stubMessage = {
      showInTimeline: true,
      category: '',
      starred: true,
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, true);
  });

  it('None of the above', () => {
    const stubState = {
      timeline: {
        filterCategories: {},
      },
    };
    const stubMessage = {
      showInTimeline: true,
      category: 'TEST_CATEGORY_2',
      starred: false,
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, false);
  });
});
