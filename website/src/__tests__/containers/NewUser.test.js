import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as actions from '../../actions';
import * as NewUserContainer from '../../containers/NewUserContainer';
import * as constants from '../../static/constants';


describe('Get user first name', () => {
  it('Get success', async () => {
    const stubAuthUid = 'TEST_AUTH_UID';
    const stubFirstName = 'TEST_FIRST_NAME';
    const stubAction = 'TEST_ACTION';

    const firstNameRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/firstName`;

    const valStub = sinon.stub().returns(stubFirstName);
    const onceStub = sinon.stub().resolves({ val: valStub });
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const saveAuthUserFirstNameStub =
      sinon.stub(actions, 'saveAuthUserFirstName').returns(stubAction);
    const stubDispatch = sinon.stub();

    await NewUserContainer._getUserFirstName(stubDispatch);

    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(firstNameRefParam));
    chai.assert.isTrue(onceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(valStub.calledOnce);
    chai.assert.isTrue(saveAuthUserFirstNameStub.calledOnceWithExactly(stubFirstName));
    chai.assert.isTrue(stubDispatch.calledOnceWithExactly(stubAction));

    dbStub.restore();
    authStub.restore();
    saveAuthUserFirstNameStub.restore();
  });
});
