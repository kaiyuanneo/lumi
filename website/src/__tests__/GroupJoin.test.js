import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../actions';
import * as GroupJoinContainer from '../containers/GroupJoinContainer';
import * as constants from '../static/constants';


describe('Handle change', () => {
  it('Group ID exists', async () => {
    const stubGroupId = 'TEST_GROUP_ID';
    const stubActionSaveGroupIdFieldValue = 'A';
    const stubActionSaveGroupJoinValidationState = 'B';

    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubGroupId}`;

    const valStub = sinon.stub().returns('TEST_VAL');
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const saveGroupIdFieldValueStub =
      sinon.stub(actions, 'saveGroupIdFieldValue').returns(stubActionSaveGroupIdFieldValue);
    const saveGroupJoinValidationStateStub =
      sinon.stub(actions, 'saveGroupJoinValidationState')
        .returns(stubActionSaveGroupJoinValidationState);
    const stubDispatch = sinon.stub();
    const stubE = {
      target: {
        value: stubGroupId,
      },
    };

    await GroupJoinContainer._handleChange(stubDispatch, stubE);

    chai.assert.isTrue(stubDispatch.calledTwice);
    chai.assert.isTrue(stubDispatch.calledWithExactly(stubActionSaveGroupIdFieldValue));
    chai.assert.isTrue(stubDispatch.calledWithExactly(stubActionSaveGroupJoinValidationState));
    chai.assert.isTrue(saveGroupIdFieldValueStub.calledOnceWithExactly(stubE.target.value));
    chai.assert.isTrue(saveGroupJoinValidationStateStub.calledOnceWithExactly('success'));
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(groupRefParam));
    chai.assert.isTrue(onceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(valStub.calledOnce);

    dbStub.restore();
    saveGroupIdFieldValueStub.restore();
    saveGroupJoinValidationStateStub.restore();
  });

  it('Input is empty', async () => {
    const stubActionSaveGroupIdFieldValue = 'A';
    const stubActionSaveGroupJoinValidationState = 'B';

    const valStub = sinon.stub().returns('TEST_VAL');
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const saveGroupIdFieldValueStub =
      sinon.stub(actions, 'saveGroupIdFieldValue').returns(stubActionSaveGroupIdFieldValue);
    const saveGroupJoinValidationStateStub =
      sinon.stub(actions, 'saveGroupJoinValidationState')
        .returns(stubActionSaveGroupJoinValidationState);
    const stubDispatch = sinon.stub();
    const stubE = {
      target: {
        value: '',
      },
    };

    await GroupJoinContainer._handleChange(stubDispatch, stubE);

    chai.assert.isTrue(stubDispatch.calledTwice);
    chai.assert.isTrue(stubDispatch.calledWithExactly(stubActionSaveGroupIdFieldValue));
    chai.assert.isTrue(stubDispatch.calledWithExactly(stubActionSaveGroupJoinValidationState));
    chai.assert.isTrue(saveGroupIdFieldValueStub.calledOnceWithExactly(stubE.target.value));
    chai.assert.isTrue(saveGroupJoinValidationStateStub.calledOnceWithExactly(null));
    chai.assert.isFalse(dbStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(onceStub.called);
    chai.assert.isFalse(valStub.called);

    dbStub.restore();
    saveGroupIdFieldValueStub.restore();
    saveGroupJoinValidationStateStub.restore();
  });

  it('Group ID does not exist', async () => {
    const stubGroupId = 'TEST_GROUP_ID';
    const stubActionSaveGroupIdFieldValue = 'A';
    const stubActionSaveGroupJoinValidationState = 'B';

    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubGroupId}`;

    const valStub = sinon.stub().returns('');
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const saveGroupIdFieldValueStub =
      sinon.stub(actions, 'saveGroupIdFieldValue').returns(stubActionSaveGroupIdFieldValue);
    const saveGroupJoinValidationStateStub =
      sinon.stub(actions, 'saveGroupJoinValidationState')
        .returns(stubActionSaveGroupJoinValidationState);
    const stubDispatch = sinon.stub();
    const stubE = {
      target: {
        value: stubGroupId,
      },
    };

    await GroupJoinContainer._handleChange(stubDispatch, stubE);

    chai.assert.isTrue(stubDispatch.calledTwice);
    chai.assert.isTrue(stubDispatch.calledWithExactly(stubActionSaveGroupIdFieldValue));
    chai.assert.isTrue(stubDispatch.calledWithExactly(stubActionSaveGroupJoinValidationState));
    chai.assert.isTrue(saveGroupIdFieldValueStub.calledOnceWithExactly(stubE.target.value));
    chai.assert.isTrue(saveGroupJoinValidationStateStub.calledOnceWithExactly('error'));
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(groupRefParam));
    chai.assert.isTrue(onceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(valStub.calledOnce);

    dbStub.restore();
    saveGroupIdFieldValueStub.restore();
    saveGroupJoinValidationStateStub.restore();
  });
});
