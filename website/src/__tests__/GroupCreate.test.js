import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as GroupCreateContainer from '../containers/GroupCreateContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


describe('Create group', () => {
  it('Create success', () => {
    const stubGroupNameFieldValue = 'TEST_GROUP_NAME_FIELD_VALUE';
    const stubNewGroupId = 'TEST_NEW_GROUP_ID';
    const stubNewGroupRef = { key: stubNewGroupId };

    const pushStub = sinon.stub().returns(stubNewGroupRef);
    const refStub = sinon.stub().returns({ push: pushStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const utilsStub = sinon.stub(utils, 'addUserToGroup');

    const stubState = { group: { groupNameFieldValue: stubGroupNameFieldValue } };
    GroupCreateContainer._createGroup(stubState);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(constants.DB_PATH_LUMI_GROUPS));
    chai.assert.isTrue(pushStub.calledOnceWithExactly({ name: stubGroupNameFieldValue }));
    chai.assert.isTrue(utilsStub.calledOnceWithExactly(stubNewGroupId));

    dbStub.restore();
    utilsStub.restore();
  });
});
