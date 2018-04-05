import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../actions';
import * as CareCardContainer from '../containers/CareCardContainer';
import * as constants from '../static/constants';


describe('Test Care Card connected component functions', () => {
  describe('Get care recipient', () => {
    it('Care recipient exists', async () => {
      const stubAuthUid = 'AUTH_UID';
      const stubCareRecipientUid = 'CR_UID';
      const stubActiveGroup = 'TEST_GROUP';
      const stubCareRecipient = 'TEST_CARE_RECIPIENT';

      const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
      const careRecipientUidRefParam =
        `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}/activeCareRecipient`;
      const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;

      const activeGroupValStub = sinon.stub().returns(stubActiveGroup);
      const activeGroupOnceStub = sinon.stub().resolves({ val: activeGroupValStub });

      const careRecipientUidValStub = sinon.stub().returns(stubCareRecipientUid);
      const careRecipientUidOnStub = sinon.stub().resolves({ val: careRecipientUidValStub });
      const careRecipientUidOffStub = sinon.stub();

      const careRecipientValStub = sinon.stub().returns(stubCareRecipient);
      const careRecipientOnStub = sinon.stub().resolves({ val: careRecipientValStub });

      const refStub = sinon.stub();
      refStub.withArgs(activeGroupRefParam).returns({ once: activeGroupOnceStub });
      refStub.withArgs(careRecipientUidRefParam).returns({
        on: careRecipientUidOnStub,
        off: careRecipientUidOffStub,
      });
      refStub.withArgs(careRecipientRefParam).returns({ on: careRecipientOnStub });
      const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
      const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });

      const stubActionToggleFetchedCareRecipient = 'A';
      const stubActionSaveCareRecipientUid = 'B';
      const stubActionUpdateCareRecipient = 'C';
      const toggleFetchedCareRecipientStub = sinon.stub(actions, 'toggleFetchedCareRecipient')
        .returns(stubActionToggleFetchedCareRecipient);
      const saveCareRecipientUidStub = sinon.stub(actions, 'saveCareRecipientUid')
        .returns(stubActionSaveCareRecipientUid);
      const updateCareRecipientStub = sinon.stub(actions, 'updateCareRecipient')
        .returns(stubActionUpdateCareRecipient);

      const dispatch = sinon.stub();
      await CareCardContainer._getCareRecipient(dispatch);
      chai.assert.isTrue(dispatch.calledThrice);
      chai.assert.isTrue(dispatch.calledWithExactly(stubActionToggleFetchedCareRecipient));
      chai.assert.isTrue(dispatch.calledWithExactly(stubActionSaveCareRecipientUid));
      chai.assert.isTrue(dispatch.calledWithExactly(stubActionUpdateCareRecipient));
      chai.assert.isTrue(toggleFetchedCareRecipientStub.calledOnce);
      chai.assert.isTrue(saveCareRecipientUidStub.calledOnceWithExactly(stubCareRecipientUid));
      chai.assert.isTrue(updateCareRecipientStub.calledOnceWithExactly(stubCareRecipient));

      chai.assert.isTrue(refStub.calledThrice);
      chai.assert.isTrue(refStub.calledWithExactly(activeGroupRefParam));
      chai.assert.isTrue(refStub.calledWithExactly(careRecipientUidRefParam));
      chai.assert.isTrue(refStub.calledWithExactly(careRecipientRefParam));

      chai.assert.isTrue(activeGroupOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
      chai.assert.isTrue(activeGroupValStub.calledOnce);

      chai.assert
        .isTrue(careRecipientUidOnStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
      chai.assert.isTrue(careRecipientUidValStub.calledOnce);
      chai.assert.isTrue(careRecipientUidOffStub.calledOnce);

      chai.assert.isTrue(careRecipientOnStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
      chai.assert.isTrue(careRecipientValStub.calledOnce);

      dbStub.restore();
      authStub.restore();
      toggleFetchedCareRecipientStub.restore();
      saveCareRecipientUidStub.restore();
      updateCareRecipientStub.restore();
    });

    it('Care recipient does not exist', async () => {
      const stubAuthUid = 'AUTH_UID';
      const stubCareRecipientUid = '';
      const stubActiveGroup = 'TEST_GROUP';
      const stubCareRecipient = 'TEST_CARE_RECIPIENT';

      const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
      const careRecipientUidRefParam =
        `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}/activeCareRecipient`;
      const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;

      const activeGroupValStub = sinon.stub().returns(stubActiveGroup);
      const activeGroupOnceStub = sinon.stub().resolves({ val: activeGroupValStub });

      const careRecipientUidValStub = sinon.stub().returns(stubCareRecipientUid);
      const careRecipientUidOnStub = sinon.stub().resolves({ val: careRecipientUidValStub });
      const careRecipientUidOffStub = sinon.stub();

      const careRecipientValStub = sinon.stub().returns(stubCareRecipient);
      const careRecipientOnStub = sinon.stub().resolves({ val: careRecipientValStub });

      const refStub = sinon.stub();
      refStub.withArgs(activeGroupRefParam).returns({ once: activeGroupOnceStub });
      refStub.withArgs(careRecipientUidRefParam).returns({
        on: careRecipientUidOnStub,
        off: careRecipientUidOffStub,
      });
      refStub.withArgs(careRecipientRefParam).returns({ on: careRecipientOnStub });
      const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
      const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });

      const stubActionToggleFetchedCareRecipient = 'A';
      const stubActionSaveCareRecipientUid = 'B';
      const stubActionUpdateCareRecipient = 'C';
      const toggleFetchedCareRecipientStub = sinon.stub(actions, 'toggleFetchedCareRecipient')
        .returns(stubActionToggleFetchedCareRecipient);
      const saveCareRecipientUidStub = sinon.stub(actions, 'saveCareRecipientUid')
        .returns(stubActionSaveCareRecipientUid);
      const updateCareRecipientStub = sinon.stub(actions, 'updateCareRecipient')
        .returns(stubActionUpdateCareRecipient);

      const dispatch = sinon.stub();
      await CareCardContainer._getCareRecipient(dispatch);
      chai.assert.isTrue(dispatch.calledOnce);
      chai.assert.isTrue(dispatch.calledWithExactly(stubActionToggleFetchedCareRecipient));
      chai.assert.isFalse(dispatch.calledWithExactly(stubActionSaveCareRecipientUid));
      chai.assert.isFalse(dispatch.calledWithExactly(stubActionUpdateCareRecipient));
      chai.assert.isTrue(toggleFetchedCareRecipientStub.calledOnce);
      chai.assert.isFalse(saveCareRecipientUidStub.called);
      chai.assert.isFalse(updateCareRecipientStub.called);

      chai.assert.isTrue(refStub.calledTwice);
      chai.assert.isTrue(refStub.calledWithExactly(activeGroupRefParam));
      chai.assert.isTrue(refStub.calledWithExactly(careRecipientUidRefParam));
      chai.assert.isFalse(refStub.calledWithExactly(careRecipientRefParam));

      chai.assert.isTrue(activeGroupOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
      chai.assert.isTrue(activeGroupValStub.calledOnce);

      chai.assert
        .isTrue(careRecipientUidOnStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
      chai.assert.isTrue(careRecipientUidValStub.calledOnce);
      chai.assert.isFalse(careRecipientUidOffStub.called);

      chai.assert.isFalse(careRecipientOnStub.called);
      chai.assert.isFalse(careRecipientValStub.called);

      dbStub.restore();
      authStub.restore();
      toggleFetchedCareRecipientStub.restore();
      saveCareRecipientUidStub.restore();
      updateCareRecipientStub.restore();
    });
  });
});
