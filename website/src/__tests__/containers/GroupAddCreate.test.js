import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as GroupAddCreateContainer from '../../containers/GroupAddCreateContainer';
import * as constants from '../../static/constants';
import * as baseUtils from '../../utils/baseUtils';


describe('Create group', () => {
  it('Create success', async () => {
    const stubFirstNameFieldValue = 'TEST_FIRST_NAME';
    const stubLastNameFieldValue = 'TEST_LAST_NAME';
    const stubCareRecipientId = 'TEST_CARE_RECIPIENT_ID';
    const stubCareRecipientRef = { key: stubCareRecipientId };
    const stubNewGroupId = 'TEST_NEW_GROUP_ID';
    const stubNewGroupRef = { key: stubNewGroupId };

    const usersPushStub = sinon.stub().returns(stubCareRecipientRef);
    const groupsPushStub = sinon.stub().returns(stubNewGroupRef);
    const refStub = sinon.stub();
    refStub.withArgs(constants.DB_PATH_USERS).returns({ push: usersPushStub });
    refStub.withArgs(constants.DB_PATH_LUMI_GROUPS).returns({ push: groupsPushStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const baseUtilsStub = sinon.stub(baseUtils, 'addUserToGroup');

    const stubStateProps = {
      firstNameFieldValue: stubFirstNameFieldValue,
      lastNameFieldValue: stubLastNameFieldValue,
    };
    await GroupAddCreateContainer._createGroup(stubStateProps);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWithExactly(constants.DB_PATH_USERS));
    chai.assert.isTrue(refStub.calledWithExactly(constants.DB_PATH_LUMI_GROUPS));
    chai.assert.isTrue(usersPushStub.calledOnceWithExactly({
      firstName: stubFirstNameFieldValue,
      lastName: stubLastNameFieldValue,
    }));
    chai.assert.isTrue(groupsPushStub.calledOnceWithExactly({
      name: `${stubFirstNameFieldValue} ${stubLastNameFieldValue}`,
      activeCareRecipient: stubCareRecipientId,
    }));
    chai.assert.isTrue(baseUtilsStub.calledTwice);
    chai.assert.isTrue(baseUtilsStub.calledWithExactly(stubNewGroupId));
    chai.assert.isTrue(baseUtilsStub.calledWithExactly(stubNewGroupId, stubCareRecipientId));

    dbStub.restore();
    baseUtilsStub.restore();
  });
});
