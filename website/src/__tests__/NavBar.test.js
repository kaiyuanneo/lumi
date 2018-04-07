import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../actions';
import * as NavBarContainer from '../containers/NavBarContainer';
import * as constants from '../static/constants';


describe('Save auth user group info', () => {
  it('Active group exists', async () => {
    const stubActiveGroup = 'TEST_ACTIVE_GROUP';
    const stubGroupName = 'TEST_GROUP_NAME';

    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}`;

    const valStub = sinon.stub().returns({ name: stubGroupName });
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const stubActionSaveAuthUserGroupInfo = 'TEST_ACTION';
    const saveAuthUserGroupInfoStub =
      sinon.stub(actions, 'saveAuthUserGroupInfo').returns(stubActionSaveAuthUserGroupInfo);
    const stubDispatch = sinon.stub();
    const stubActiveGroupRef = { off: sinon.stub() };
    const stubActiveGroupSnapshot = { val: sinon.stub().returns(stubActiveGroup) };

    await NavBarContainer
      ._saveAuthUserGroupInfo(stubDispatch, stubActiveGroupRef, stubActiveGroupSnapshot);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(groupRefParam));
    chai.assert.isTrue(onceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(valStub.calledOnce);
    chai.assert
      .isTrue(saveAuthUserGroupInfoStub.calledOnceWithExactly(stubActiveGroup, stubGroupName));
    chai.assert.isTrue(stubDispatch.calledOnceWithExactly(stubActionSaveAuthUserGroupInfo));
    chai.assert.isTrue(stubActiveGroupSnapshot.val.calledOnce);
    chai.assert.isTrue(stubActiveGroupRef.off.calledOnce);

    dbStub.restore();
    saveAuthUserGroupInfoStub.restore();
  });

  it('No active group', async () => {
    const stubActiveGroup = '';
    const stubGroupName = 'TEST_GROUP_NAME';

    const valStub = sinon.stub().returns({ name: stubGroupName });
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const stubActionSaveAuthUserGroupInfo = 'TEST_ACTION';
    const saveAuthUserGroupInfoStub =
      sinon.stub(actions, 'saveAuthUserGroupInfo').returns(stubActionSaveAuthUserGroupInfo);
    const stubDispatch = sinon.stub();
    const stubActiveGroupRef = { off: sinon.stub() };
    const stubActiveGroupSnapshot = { val: sinon.stub().returns(stubActiveGroup) };

    await NavBarContainer
      ._saveAuthUserGroupInfo(stubDispatch, stubActiveGroupRef, stubActiveGroupSnapshot);

    chai.assert.isFalse(dbStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(onceStub.called);
    chai.assert.isFalse(valStub.called);
    chai.assert.isFalse(saveAuthUserGroupInfoStub.called);
    chai.assert.isFalse(stubDispatch.called);
    chai.assert.isTrue(stubActiveGroupSnapshot.val.calledOnce);
    chai.assert.isFalse(stubActiveGroupRef.off.called);

    dbStub.restore();
    saveAuthUserGroupInfoStub.restore();
  });
});


describe('Get group info', () => {
  it('Get success', () => {
    const stubAuthUid = 'TEST_AUTH_UID';

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;

    const onStub = sinon.stub();
    const refStub = sinon.stub().returns({ on: onStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const stubDispatch = sinon.stub();

    NavBarContainer._getGroupInfo(stubDispatch);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(activeGroupRefParam));
    chai.assert.isTrue(onStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});
