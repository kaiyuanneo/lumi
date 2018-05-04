import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../../actions';
import * as HomeContainer from '../../containers/HomeContainer';
import * as constants from '../../static/constants';


describe('Save is auth user in group', () => {
  it('Active group', () => {
    const stubActionSaveIsAuthUserInGroup = true;
    const saveIsAuthUserInGroupStub =
      sinon.stub(actions, 'saveIsAuthUserInGroup').returns(stubActionSaveIsAuthUserInGroup);
    const stubDispatch = sinon.stub();
    const stubActiveGroupSnapshot = { val: sinon.stub().returns('TEST_VAL') };

    HomeContainer._saveIsAuthUserInGroup(stubDispatch, stubActiveGroupSnapshot);

    chai.assert.isTrue(saveIsAuthUserInGroupStub.calledOnceWithExactly(true));
    chai.assert.isTrue(stubDispatch.calledOnceWithExactly(stubActionSaveIsAuthUserInGroup));
    chai.assert.isTrue(stubActiveGroupSnapshot.val.calledOnce);

    saveIsAuthUserInGroupStub.restore();
  });

  it('No active group', () => {
    const stubActionSaveIsAuthUserInGroup = true;
    const saveIsAuthUserInGroupStub =
      sinon.stub(actions, 'saveIsAuthUserInGroup').returns(stubActionSaveIsAuthUserInGroup);
    const stubDispatch = sinon.stub();
    const stubActiveGroupSnapshot = { val: sinon.stub() };

    HomeContainer._saveIsAuthUserInGroup(stubDispatch, stubActiveGroupSnapshot);

    chai.assert.isTrue(saveIsAuthUserInGroupStub.calledOnceWithExactly(false));
    chai.assert.isTrue(stubDispatch.calledOnceWithExactly(stubActionSaveIsAuthUserInGroup));
    chai.assert.isTrue(stubActiveGroupSnapshot.val.calledOnce);

    saveIsAuthUserInGroupStub.restore();
  });
});


describe('Get is auth user in group', () => {
  it('Get success', () => {
    const stubAuthUid = 'TEST_AUTH_UID';

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;

    const onStub = sinon.stub();
    const refStub = sinon.stub().returns({ on: onStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const stubDispatch = sinon.stub();

    HomeContainer._getIsAuthUserInGroup(stubDispatch);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(activeGroupRefParam));
    chai.assert.isTrue(onStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});
