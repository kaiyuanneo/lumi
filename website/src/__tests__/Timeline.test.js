import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../actions';
import * as TimelineContainer from '../containers/TimelineContainer';
import * as constants from '../static/constants';


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
        messageFilterCategory: '',
      },
    };
    const stubMessage = {
      showInTimeline: false,
      category: '',
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, false);
  });

  it('Category all', () => {
    const stubState = {
      timeline: {
        messageFilterCategory: constants.TIMELINE_CATEGORY_CODE_ALL,
      },
    };
    const stubMessage = {
      showInTimeline: true,
      category: '',
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, true);
  });

  it('Category match', () => {
    const stubCategory = 'TEST_CATEGORY';
    const stubState = {
      timeline: {
        messageFilterCategory: stubCategory,
      },
    };
    const stubMessage = {
      showInTimeline: true,
      category: stubCategory,
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, true);
  });

  it('None of the above', () => {
    const stubState = {
      timeline: {
        messageFilterCategory: 'TEST_CATEGORY_1',
      },
    };
    const stubMessage = {
      showInTimeline: true,
      category: 'TEST_CATEGORY_2',
    };
    const shouldRenderMessage = TimelineContainer._shouldRenderMessage(stubState, stubMessage);
    chai.assert.strictEqual(shouldRenderMessage, false);
  });
});


describe('Save Timeline message', () => {
  it('Save success', async () => {
    const stubMessage = { senderPsid: 'TEST_SENDER_PSID' };
    const stubUid = 'TEST_UID';
    const stubUser = { firstName: 'TEST_FIRST_NAME', lastName: 'TEST_LAST_NAME' };
    const stubAction = 'TEST_ACTION';

    const uidRefParam = `${constants.DB_PATH_USER_PSID_TO_UID}/${stubMessage.senderPsid}`;
    const userRefParam = `${constants.DB_PATH_USERS}/${stubUid}`;

    const stubDispatch = sinon.stub();
    const messageValStub = sinon.stub().returns(stubMessage);
    const stubMessageSnapshot = { val: messageValStub };
    const userValStub = sinon.stub().returns(stubUser);
    const userOnceStub = sinon.stub().resolves({ val: userValStub });
    const uidValStub = sinon.stub().returns(stubUid);
    const uidOnceStub = sinon.stub().resolves({ val: uidValStub });
    const refStub = sinon.stub();
    refStub.withArgs(uidRefParam).returns({ once: uidOnceStub });
    refStub.withArgs(userRefParam).returns({ once: userOnceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const saveTimelineMessageStub = sinon.stub(actions, 'saveTimelineMessage').returns(stubAction);

    await TimelineContainer._saveTimelineMessage(stubDispatch, stubMessageSnapshot);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWith(uidRefParam));
    chai.assert.isTrue(refStub.calledWith(userRefParam));
    chai.assert.isTrue(uidOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(uidValStub.calledOnce);
    chai.assert.isTrue(userOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(userValStub.calledOnce);
    chai.assert.isTrue(messageValStub.calledOnce);
    chai.assert.isTrue(stubDispatch.calledOnceWithExactly(stubAction));
    chai.assert.isTrue(saveTimelineMessageStub.calledOnceWithExactly({
      [stubMessageSnapshot.key]: {
        ...stubMessage,
        senderFirstName: stubUser.firstName,
        senderLastName: stubUser.lastName,
      },
    }));

    dbStub.restore();
    saveTimelineMessageStub.restore();
  });
});


describe('Save message locally', () => {
  const stubKey = 'TEST_KEY';
  const stubGroupMessageSnapshot = { key: stubKey };

  const messageRefParam = `${constants.DB_PATH_LUMI_MESSAGES}/${stubKey}`;

  const stubDispatch = sinon.stub();
  const onStub = sinon.stub();
  const refStub = sinon.stub().returns({ on: onStub });
  const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

  TimelineContainer._saveMessageLocally(stubDispatch, stubGroupMessageSnapshot);

  chai.assert.isTrue(dbStub.calledOnce);
  chai.assert.isTrue(refStub.calledOnceWithExactly(messageRefParam));
  chai.assert.isTrue(onStub.calledOnce);

  dbStub.restore();
});


describe('Save group messages locally', () => {
  it('Save success', () => {
    const stubActiveGroup = 'TEST_ACTIVE_GROUP';

    const groupMessagesRefParam = `${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${stubActiveGroup}`;

    const onStub = sinon.stub();
    const refStub = sinon.stub().returns({ on: onStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const stubDispatch = sinon.stub();
    const offStub = sinon.stub();
    const valStub = sinon.stub().returns(stubActiveGroup);
    const stubActiveGroupRef = { off: offStub };
    const stubActiveGroupSnapshot = { val: valStub };

    TimelineContainer
      ._saveGroupMessagesLocally(stubDispatch, stubActiveGroupRef, stubActiveGroupSnapshot);

    chai.assert.isTrue(valStub.calledOnce);
    chai.assert.isTrue(offStub.calledOnce);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(groupMessagesRefParam));
    chai.assert.isTrue(onStub.calledTwice);

    dbStub.restore();
  });

  it('No auth user active group', () => {
    const stubActiveGroup = '';

    const onStub = sinon.stub();
    const refStub = sinon.stub().returns({ on: onStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const stubDispatch = sinon.stub();
    const offStub = sinon.stub();
    const valStub = sinon.stub().returns(stubActiveGroup);
    const stubActiveGroupRef = { off: offStub };
    const stubActiveGroupSnapshot = { val: valStub };

    TimelineContainer
      ._saveGroupMessagesLocally(stubDispatch, stubActiveGroupRef, stubActiveGroupSnapshot);

    chai.assert.isTrue(valStub.calledOnce);
    chai.assert.isFalse(offStub.called);
    chai.assert.isFalse(dbStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(onStub.called);

    dbStub.restore();
  });
});


describe('Sync messages', () => {
  it('Sync success', () => {
    const stubAuthUid = 'TEST_AUTH_UID';

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;

    const onStub = sinon.stub();
    const refStub = sinon.stub().returns({ on: onStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const stubDispatch = sinon.stub();

    TimelineContainer._syncMessages(stubDispatch);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(activeGroupRefParam));
    chai.assert.isTrue(onStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});
