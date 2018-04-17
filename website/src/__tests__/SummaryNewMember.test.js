import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';
import hash from 'string-hash';

import * as SummaryNewMemberContainer from '../containers/SummaryNewMemberContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


describe('Save new member', () => {
  it('Save success', async () => {
    const stubAuthUid = 'AUTH_UID';
    const stubActiveGroupId = 'TEST_GROUP_ID';
    const stubNewMemberKey = 'TEST_NEW_MEMBER_KEY';

    const usersRefParam = constants.DB_PATH_USERS;
    const userEmailToUidRefParam = constants.DB_PATH_USER_EMAIL_TO_UID;
    const activeGroupIdRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroupId}`;

    const usersPushStub = sinon.stub().resolves({ key: stubNewMemberKey });
    const userEmailToUidUpdateStub = sinon.stub();
    const activeGroupIdValStub = sinon.stub().returns(stubActiveGroupId);
    const activeGroupIdOnceStub = sinon.stub().resolves({ val: activeGroupIdValStub });
    const groupUpdateStub = sinon.stub();

    const refStub = sinon.stub();
    refStub.withArgs(usersRefParam).returns({ push: usersPushStub });
    refStub.withArgs(userEmailToUidRefParam).returns({ update: userEmailToUidUpdateStub });
    refStub.withArgs(activeGroupIdRefParam).returns({ once: activeGroupIdOnceStub });
    refStub.withArgs(groupRefParam).returns({ update: groupUpdateStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const utilsStub = sinon.stub(utils, 'addUserToGroup');

    const stubStateProps = { email: 'TEST_EMAIL' };
    await SummaryNewMemberContainer._saveNewMember(stubStateProps);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.strictEqual(refStub.callCount, 4);
    chai.assert.isTrue(refStub.calledWithExactly(usersRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(userEmailToUidRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(activeGroupIdRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(groupRefParam));
    chai.assert.isTrue(usersPushStub.calledOnceWithExactly({ ...stubStateProps }));
    chai.assert.isTrue(userEmailToUidUpdateStub.calledOnceWithExactly({
      [hash(stubStateProps.email)]: stubNewMemberKey,
    }));
    chai.assert
      .isTrue(activeGroupIdOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(activeGroupIdValStub.calledOnce);
    chai.assert.isTrue(utilsStub.calledOnceWithExactly(stubActiveGroupId, stubNewMemberKey));
    chai.assert.isTrue(groupUpdateStub.calledOnceWithExactly({
      activeCareRecipient: stubNewMemberKey,
    }));

    dbStub.restore();
    authStub.restore();
    utilsStub.restore();
  });
});
