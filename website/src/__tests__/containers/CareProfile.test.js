import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../../actions';
import * as CareProfileContainer from '../../containers/CareProfileContainer';
import * as constants from '../../static/constants';


describe('Handle care recipient', () => {
  it('Care recipient exists', () => {
    const stubCareRecipientUid = 'CR_UID';
    const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;

    const stubActionToggleFetchedCareRecipient = 'A';
    const stubActionSaveCareRecipientUid = 'B';
    const saveFetchedCareRecipientStub = sinon.stub(actions, 'saveFetchedCareRecipient')
      .returns(stubActionToggleFetchedCareRecipient);
    const saveCareRecipientUidStub = sinon.stub(actions, 'saveCareRecipientUid')
      .returns(stubActionSaveCareRecipientUid);

    const careRecipientUidValStub = sinon.stub().returns(stubCareRecipientUid);
    const careRecipientUidSnapshot = { val: careRecipientUidValStub };
    const careRecipientUidOffStub = sinon.stub();
    const careRecipientOnStub = sinon.stub();

    const careRecipientUidRef = { off: careRecipientUidOffStub };
    const refStub = sinon.stub();
    refStub.withArgs(careRecipientRefParam).returns({ on: careRecipientOnStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const dispatch = sinon.stub();

    CareProfileContainer
      ._handleCareRecipient(dispatch, careRecipientUidRef, careRecipientUidSnapshot);
    chai.assert.isTrue(dispatch.calledTwice);
    chai.assert.isTrue(dispatch.calledWithExactly(stubActionToggleFetchedCareRecipient));
    chai.assert.isTrue(dispatch.calledWithExactly(stubActionSaveCareRecipientUid));
    chai.assert.isTrue(saveFetchedCareRecipientStub.calledOnce);
    chai.assert.isTrue(saveCareRecipientUidStub.calledOnceWithExactly(stubCareRecipientUid));
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnce);
    chai.assert.isTrue(refStub.calledWithExactly(careRecipientRefParam));
    chai.assert.isTrue(careRecipientUidValStub.calledOnce);
    chai.assert.isTrue(careRecipientUidOffStub.calledOnce);
    chai.assert.isTrue(careRecipientOnStub.calledOnce);

    dbStub.restore();
    saveFetchedCareRecipientStub.restore();
    saveCareRecipientUidStub.restore();
  });

  it('Care recipient does not exist', () => {
    const stubCareRecipientUid = '';
    const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;

    const stubActionToggleFetchedCareRecipient = 'A';
    const stubActionSaveCareRecipientUid = 'B';
    const saveFetchedCareRecipientStub = sinon.stub(actions, 'saveFetchedCareRecipient')
      .returns(stubActionToggleFetchedCareRecipient);
    const saveCareRecipientUidStub = sinon.stub(actions, 'saveCareRecipientUid')
      .returns(stubActionSaveCareRecipientUid);

    const careRecipientUidValStub = sinon.stub().returns(stubCareRecipientUid);
    const careRecipientUidSnapshot = { val: careRecipientUidValStub };
    const careRecipientUidOffStub = sinon.stub();
    const careRecipientOnStub = sinon.stub();

    const careRecipientUidRef = { off: careRecipientUidOffStub };
    const refStub = sinon.stub();
    refStub.withArgs(careRecipientRefParam).returns({ on: careRecipientOnStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const dispatch = sinon.stub();

    CareProfileContainer
      ._handleCareRecipient(dispatch, careRecipientUidRef, careRecipientUidSnapshot);
    chai.assert.isTrue(dispatch.calledOnce);
    chai.assert.isTrue(dispatch.calledWithExactly(stubActionToggleFetchedCareRecipient));
    chai.assert.isTrue(saveFetchedCareRecipientStub.calledOnce);
    chai.assert.isFalse(saveCareRecipientUidStub.called);
    chai.assert.isFalse(dbStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isTrue(careRecipientUidValStub.calledOnce);
    chai.assert.isFalse(careRecipientUidOffStub.called);
    chai.assert.isFalse(careRecipientOnStub.called);

    dbStub.restore();
    saveFetchedCareRecipientStub.restore();
    saveCareRecipientUidStub.restore();
  });
});


describe('Get care recipient', () => {
  it('Get success', async () => {
    const stubAuthUid = 'AUTH_UID';

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;

    const activeGroupOnStub = sinon.stub();
    const refStub = sinon.stub();
    refStub.withArgs(activeGroupRefParam).returns({ on: activeGroupOnStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const dispatch = sinon.stub();

    await CareProfileContainer._getCareRecipient(dispatch);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(activeGroupRefParam));
    chai.assert.isTrue(activeGroupOnStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});
