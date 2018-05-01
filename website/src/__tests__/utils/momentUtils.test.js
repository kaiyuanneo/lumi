import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../../actions';
import * as momentUtils from '../../utils/momentUtils';
import * as constants from '../../static/constants';


describe('Save Timeline message', () => {
  it('Save success', async () => {
    const stubMessage = { senderPsid: 'TEST_SENDER_PSID' };
    const stubUid = 'TEST_UID';
    const stubUser = {
      firstName: 'TEST_FIRST_NAME',
      lastName: 'TEST_LAST_NAME',
      profilePic: 'TEST_PROFILE_PIC',
    };
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

    await momentUtils._saveTimelineMessage(stubDispatch, stubMessageSnapshot);

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
        senderProfilePic: stubUser.profilePic,
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

  momentUtils._saveMessageLocally(stubDispatch, stubGroupMessageSnapshot);

  chai.assert.isTrue(dbStub.calledOnce);
  chai.assert.isTrue(refStub.calledOnceWithExactly(messageRefParam));
  chai.assert.isTrue(onStub.calledOnce);

  dbStub.restore();
});


describe('Save group messages locally', () => {
  it('Save success', async () => {
    const stubActiveGroup = 'TEST_ACTIVE_GROUP';
    const stubNumChildren = 1;
    const stubAction = 'TEST_ACTION';

    const groupMessagesRefParam = `${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${stubActiveGroup}`;

    const saveNumMessagesStub = sinon.stub(actions, 'saveNumMessages').returns(stubAction);
    const onStub = sinon.stub();
    const onceStub = sinon.stub().resolves({ numChildren: () => stubNumChildren });
    const refStub = sinon.stub().returns({
      on: onStub,
      once: onceStub,
    });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const stubDispatch = sinon.stub();
    const offStub = sinon.stub();
    const valStub = sinon.stub().returns(stubActiveGroup);
    const stubActiveGroupRef = { off: offStub };
    const stubActiveGroupSnapshot = { val: valStub };

    await momentUtils
      ._saveGroupMessagesLocally(stubDispatch, stubActiveGroupRef, stubActiveGroupSnapshot);

    chai.assert.isTrue(valStub.calledOnce);
    chai.assert.isTrue(offStub.calledOnce);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(groupMessagesRefParam));
    chai.assert.isTrue(onStub.calledTwice);
    chai.assert.isTrue(stubDispatch.calledOnceWithExactly(stubAction));

    dbStub.restore();
    saveNumMessagesStub.restore();
  });

  it('No auth user active group', async () => {
    const stubActiveGroup = '';

    const onStub = sinon.stub();
    const refStub = sinon.stub().returns({ on: onStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const stubDispatch = sinon.stub();
    const offStub = sinon.stub();
    const valStub = sinon.stub().returns(stubActiveGroup);
    const stubActiveGroupRef = { off: offStub };
    const stubActiveGroupSnapshot = { val: valStub };

    await momentUtils
      ._saveGroupMessagesLocally(stubDispatch, stubActiveGroupRef, stubActiveGroupSnapshot);

    chai.assert.isTrue(valStub.calledOnce);
    chai.assert.isFalse(offStub.called);
    chai.assert.isFalse(dbStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(onStub.called);
    chai.assert.isFalse(stubDispatch.called);

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

    momentUtils.syncMessages(stubDispatch);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(activeGroupRefParam));
    chai.assert.isTrue(onStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});
