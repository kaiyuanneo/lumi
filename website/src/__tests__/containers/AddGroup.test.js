import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';

import * as NewUserContainer from '../../containers/AddGroupContainer';
import * as constants from '../../static/constants';


describe('Get user first name', () => {
  it('Get success', async () => {
    const stubAuthUid = 'TEST_AUTH_UID';

    const firstNameRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/firstName`;

    const onStub = sinon.stub();
    const refStub = sinon.stub().returns({ on: onStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const stubDispatch = sinon.stub();

    await NewUserContainer._getUserFirstName(stubDispatch);

    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(firstNameRefParam));
    chai.assert.isTrue(onStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});
