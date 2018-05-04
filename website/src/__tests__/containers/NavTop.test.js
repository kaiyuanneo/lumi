import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../../actions';
import * as NavTopContainer from '../../containers/NavTopContainer';
import * as constants from '../../static/constants';


describe('Get group name', () => {
  it('Get success', async () => {
    const stubGroupId = 'TEST_GROUP_ID';
    const stubGroupName = 'TEST_GROUP_NAME';
    const stubGroup = {
      name: stubGroupName,
    };

    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubGroupId}`;

    const valStub = sinon.stub().returns(stubGroup);
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const groupName = await NavTopContainer._getGroupName(stubGroupId);

    chai.assert.strictEqual(groupName, stubGroupName);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(groupRefParam));
    chai.assert.isTrue(onceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(valStub.calledOnce);

    dbStub.restore();
  });
});


describe('Save auth user active group info', () => {
  // No choice but to stub functions within getGroupName because cannot stub private method
  it('Active group exists', async () => {
    const stubActiveGroupId = 'TEST_ACTIVE_GROUP';
    const stubGroupName = 'TEST_GROUP_NAME';
    const stubActionSaveAuthUserGroupInfo = 'TEST_ACTION';

    // Stubs for contents of _getGroupName. No need to test whether they are called
    const valStub = sinon.stub().returns({ name: stubGroupName });
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const saveAuthUserGroupInfoStub =
      sinon.stub(actions, 'saveAuthUserActiveGroupInfo').returns(stubActionSaveAuthUserGroupInfo);
    const stubDispatch = sinon.stub();
    const stubGroupIdSnapshot = { val: sinon.stub().returns(stubActiveGroupId) };

    await NavTopContainer
      ._saveAuthUserActiveGroupInfo(stubDispatch, stubGroupIdSnapshot);

    chai.assert
      .isTrue(saveAuthUserGroupInfoStub.calledOnceWithExactly(stubActiveGroupId, stubGroupName));
    chai.assert.isTrue(stubDispatch.calledOnceWithExactly(stubActionSaveAuthUserGroupInfo));
    chai.assert.isTrue(stubGroupIdSnapshot.val.calledOnce);

    dbStub.restore();
    saveAuthUserGroupInfoStub.restore();
  });

  it('No active group', async () => {
    const stubActiveGroupId = '';
    const stubActionSaveAuthUserGroupInfo = 'TEST_ACTION';

    const saveAuthUserGroupInfoStub =
      sinon.stub(actions, 'saveAuthUserActiveGroupInfo').returns(stubActionSaveAuthUserGroupInfo);
    const stubDispatch = sinon.stub();
    const stubGroupIdSnapshot = { val: sinon.stub().returns(stubActiveGroupId) };

    await NavTopContainer
      ._saveAuthUserActiveGroupInfo(stubDispatch, stubGroupIdSnapshot);

    chai.assert.isFalse(saveAuthUserGroupInfoStub.called);
    chai.assert.isFalse(stubDispatch.called);
    chai.assert.isTrue(stubGroupIdSnapshot.val.calledOnce);

    saveAuthUserGroupInfoStub.restore();
  });
});


describe('Get group info', () => {
  it('Get success', () => {
    const stubAuthUid = 'TEST_AUTH_UID';

    const groupsRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/groups`;
    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;

    const groupsRefOnStub = sinon.stub();
    const activeGroupRefOnStub = sinon.stub();
    const refStub = sinon.stub();
    refStub.withArgs(groupsRefParam).returns({ on: groupsRefOnStub });
    refStub.withArgs(activeGroupRefParam).returns({ on: activeGroupRefOnStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const stubDispatch = sinon.stub();

    NavTopContainer._getGroupInfo(stubDispatch);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWithExactly(groupsRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(activeGroupRefParam));
    chai.assert.isTrue(groupsRefOnStub.calledOnce);
    chai.assert.isTrue(activeGroupRefOnStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});


describe('Handle nav select', () => {
  it('Product code select group', () => {
    const stubCareRecipientUid = 'TEST_CARE_RECIPIENT_UID';
    const stubAuthUid = 'TEST_AUTH_UID';
    const stubGroupId = 'TEST_GROUP_ID';

    const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;
    const authUserRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}`;

    const careRecipientOffStub = sinon.stub();
    const authUserUpdateStub = sinon.stub();
    const refStub = sinon.stub();
    refStub.withArgs(careRecipientRefParam).returns({ off: careRecipientOffStub });
    refStub.withArgs(authUserRefParam).returns({ update: authUserUpdateStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const signOutStub = sinon.stub();
    const authStub = sinon.stub(firebase, 'auth').returns({
      currentUser: { uid: stubAuthUid },
      signOut: signOutStub,
    });

    const stubEventKey = `${constants.PRODUCT_CODE_SELECT_GROUP}${stubGroupId}`;
    const stubStateProps = { careRecipientUid: stubCareRecipientUid };
    const stubDispatchProps = { switchGroup: sinon.stub() };
    NavTopContainer._handleNavSelect(stubEventKey, stubStateProps, stubDispatchProps);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWithExactly(careRecipientRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(authUserRefParam));
    chai.assert.isTrue(stubDispatchProps.switchGroup.calledOnceWithExactly(stubGroupId));
    chai.assert.isTrue(careRecipientOffStub.calledOnce);
    chai.assert.isTrue(authUserUpdateStub.calledOnceWithExactly({ activeGroup: stubGroupId }));
    chai.assert.isFalse(signOutStub.called);

    dbStub.restore();
    authStub.restore();
  });

  it('Product code sign out', () => {
    const stubCareRecipientUid = 'TEST_CARE_RECIPIENT_UID';
    const stubAuthUid = 'TEST_AUTH_UID';

    const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;
    const authUserRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}`;

    const careRecipientOffStub = sinon.stub();
    const authUserUpdateStub = sinon.stub();
    const refStub = sinon.stub();
    refStub.withArgs(careRecipientRefParam).returns({ off: careRecipientOffStub });
    refStub.withArgs(authUserRefParam).returns({ update: authUserUpdateStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const signOutStub = sinon.stub();
    const authStub = sinon.stub(firebase, 'auth').returns({
      currentUser: { uid: stubAuthUid },
      signOut: signOutStub,
    });

    const stubEventKey = constants.PRODUCT_CODE_SIGN_OUT;
    const stubStateProps = { careRecipientUid: stubCareRecipientUid };
    const stubDispatchProps = { switchGroup: sinon.stub() };
    NavTopContainer._handleNavSelect(stubEventKey, stubStateProps, stubDispatchProps);

    chai.assert.isFalse(dbStub.called);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(stubDispatchProps.switchGroup.called);
    chai.assert.isFalse(careRecipientOffStub.called);
    chai.assert.isFalse(authUserUpdateStub.called);
    chai.assert.isTrue(signOutStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});
