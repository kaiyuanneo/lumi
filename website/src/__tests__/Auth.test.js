import chai from 'chai';
import * as firebase from 'firebase';
import nock from 'nock';
import sinon from 'sinon';
import hash from 'string-hash';

import * as AuthContainer from '../containers/AuthContainer';
import * as constants from '../static/constants';


// NB: _setUserInfo is currently not tested because we haven't found a way to cleanly stub
// private functions yet.
describe('Get user info from Facebook', () => {
  it('Verify return value', async () => {
    const stubInfo = { info: 'TEST_INFO' };
    // Stub HTTP request to avoid call to Facebook
    nock(constants.URL_FACEBOOK_GRAPH_API)
      .get('/me')
      .query(true)
      .reply(200, stubInfo);
    const stubCredential = { accessToken: 'TEST_ACCESS_TOKEN' };
    const facebookUserInfo = await AuthContainer._getUserInfoFromFacebook(stubCredential);
    chai.assert.deepEqual(facebookUserInfo, stubInfo);
  });
});

describe('Merge existing user record', () => {
  it('Existing user exists', async () => {
    const stubEmail = 'TEST_EMAIL';
    const stubExistingUid = 'EXISTING_UID';
    const stubCurrentUid = 'CURRENT_UID';
    const stubGid = 'TEST_GID';
    const stubExistingUser = { groups: { [stubGid]: true } };

    const existingUidRefParam = `${constants.DB_PATH_USER_EMAIL_TO_UID}/${hash(stubEmail)}`;
    const existingUserRefParam = `${constants.DB_PATH_USERS}/${stubExistingUid}`;
    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubGid}`;

    const existingUidValStub = sinon.stub().returns(stubExistingUid);
    const existingUidOnceStub = sinon.stub().resolves({ val: existingUidValStub });

    const existingUserValStub = sinon.stub().returns(stubExistingUser);
    const existingUserOnceStub = sinon.stub().resolves({ val: existingUserValStub });
    const existingUserRemoveStub = sinon.stub();

    const groupValStub = sinon.stub().returns({ activeCareRecipient: stubExistingUid });
    const groupOnceStub = sinon.stub().resolves({ val: groupValStub });
    const groupChildUpdateStub = sinon.stub();
    const groupChildStub = sinon.stub().returns({ update: groupChildUpdateStub });
    const groupUpdateStub = sinon.stub();

    const refStub = sinon.stub();
    refStub.withArgs(existingUidRefParam).returns({ once: existingUidOnceStub });
    refStub.withArgs(existingUserRefParam).returns({
      once: existingUserOnceStub,
      remove: existingUserRemoveStub,
    });
    refStub.withArgs(groupRefParam).returns({
      once: groupOnceStub,
      child: groupChildStub,
      update: groupUpdateStub,
    });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const stubUser = { uid: stubCurrentUid };
    const stubUserInfo = { email: stubEmail };
    const existingUser = await AuthContainer._mergeExistingUserRecord(stubUser, stubUserInfo);

    chai.assert.deepEqual(existingUser, stubExistingUser);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledThrice);
    chai.assert.isTrue(refStub.calledWithExactly(existingUidRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(existingUserRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(groupRefParam));

    chai.assert.isTrue(existingUidOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(existingUidValStub.calledOnce);

    chai.assert.isTrue(existingUserOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(existingUserValStub.calledOnce);
    chai.assert.isTrue(existingUserRemoveStub.calledOnce);

    chai.assert.isTrue(groupOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(groupChildStub.calledOnceWithExactly('members'));
    chai.assert.isTrue(groupValStub.calledOnce);
    chai.assert.isTrue(groupChildUpdateStub.calledOnceWithExactly({
      [stubExistingUid]: null,
      [stubCurrentUid]: true,
    }));
    chai.assert.isTrue(groupValStub.calledOnce);
    chai.assert.isTrue(groupUpdateStub.calledOnceWithExactly({
      activeCareRecipient: stubCurrentUid,
    }));

    dbStub.restore();
  });

  it('No existing user', async () => {
    const stubEmail = 'TEST_EMAIL';
    const stubExistingUid = '';
    const stubCurrentUid = 'CURRENT_UID';
    const stubGid = 'TEST_GID';
    const stubExistingUser = {};

    const existingUidRefParam = `${constants.DB_PATH_USER_EMAIL_TO_UID}/${hash(stubEmail)}`;
    const existingUserRefParam = `${constants.DB_PATH_USERS}/${stubExistingUid}`;
    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubGid}`;

    const existingUidValStub = sinon.stub().returns(stubExistingUid);
    const existingUidOnceStub = sinon.stub().resolves({ val: existingUidValStub });

    const existingUserValStub = sinon.stub().returns(stubExistingUser);
    const existingUserOnceStub = sinon.stub().resolves({ val: existingUserValStub });
    const existingUserRemoveStub = sinon.stub();

    const groupValStub = sinon.stub().returns({ activeCareRecipient: stubExistingUid });
    const groupOnceStub = sinon.stub().resolves({ val: groupValStub });
    const groupChildUpdateStub = sinon.stub();
    const groupChildStub = sinon.stub().returns({ update: groupChildUpdateStub });
    const groupUpdateStub = sinon.stub();

    const refStub = sinon.stub();
    refStub.withArgs(existingUidRefParam).returns({ once: existingUidOnceStub });
    refStub.withArgs(existingUserRefParam).returns({
      once: existingUserOnceStub,
      remove: existingUserRemoveStub,
    });
    refStub.withArgs(groupRefParam).returns({
      once: groupOnceStub,
      child: groupChildStub,
      update: groupUpdateStub,
    });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    const stubUser = { uid: stubCurrentUid };
    const stubUserInfo = { email: stubEmail };
    const existingUser = await AuthContainer._mergeExistingUserRecord(stubUser, stubUserInfo);

    chai.assert.deepEqual(existingUser, stubExistingUser);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnce);
    chai.assert.isTrue(refStub.calledWithExactly(existingUidRefParam));
    chai.assert.isFalse(refStub.calledWithExactly(existingUserRefParam));
    chai.assert.isFalse(refStub.calledWithExactly(groupRefParam));

    chai.assert.isTrue(existingUidOnceStub.called);
    chai.assert.isTrue(existingUidValStub.calledOnce);

    chai.assert.isFalse(existingUserOnceStub.called);
    chai.assert.isFalse(existingUserValStub.called);
    chai.assert.isFalse(existingUserRemoveStub.called);

    chai.assert.isFalse(groupOnceStub.called);
    chai.assert.isFalse(groupChildStub.called);
    chai.assert.isFalse(groupValStub.called);
    chai.assert.isFalse(groupChildUpdateStub.called);
    chai.assert.isFalse(groupValStub.called);
    chai.assert.isFalse(groupUpdateStub.called);

    dbStub.restore();
  });
});

describe('Get user PSID', () => {
  it('Verify return value', async () => {
    const stubPsid = 'TEST_PSID';
    const stubResponseVal = { psid: stubPsid };
    // Stub HTTP request to avoid call to Facebook
    nock(constants.URL_LUMI_WEBHOOK)
      .get('/psid')
      .query(true)
      .reply(200, stubResponseVal);
    const stubUserInfo = { id: 'TEST_ID' };
    const psid = await AuthContainer._getUserPsid(stubUserInfo);
    chai.assert.deepEqual(psid, stubPsid);
  });
});

describe('Save user info', async () => {
  it('Successful save', async () => {
    const stubCurrentUid = 'CURRENT_UID';
    const stubCurrentUser = {
      uid: stubCurrentUid,
      photoURL: 'TEST_PHOTO_URL',
    };
    const stubFacebookUserInfo = {
      id: 'TEST_ID',
      email: 'TEST_EMAIL',
      first_name: 'TEST_FIRST_NAME',
      last_name: 'TEST_LAST_NAME',
    };
    const stubPsid = 'TEST_PSID';

    const userEmailToUidUpdateStub = sinon.stub();
    const userPsidToUidUpdateStub = sinon.stub();
    const userUpdateStub = sinon.stub();

    const refStub = sinon.stub();
    refStub.withArgs(constants.DB_PATH_USER_EMAIL_TO_UID).returns({
      update: userEmailToUidUpdateStub,
    });
    refStub.withArgs(constants.DB_PATH_USER_PSID_TO_UID).returns({
      update: userPsidToUidUpdateStub,
    });
    const userRefParam = `${constants.DB_PATH_USERS}/${stubCurrentUid}`;
    refStub.withArgs(userRefParam).returns({ update: userUpdateStub });

    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });

    await AuthContainer._saveUserInfo(stubCurrentUser, {}, stubFacebookUserInfo, stubPsid);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(refStub.calledThrice);
    chai.assert.isTrue(refStub.calledWithExactly(constants.DB_PATH_USER_EMAIL_TO_UID));
    chai.assert.isTrue(refStub.calledWithExactly(constants.DB_PATH_USER_PSID_TO_UID));
    chai.assert.isTrue(refStub.calledWithExactly(userRefParam));
    chai.assert.isTrue(userEmailToUidUpdateStub.calledOnceWithExactly({
      [hash(stubFacebookUserInfo.email)]: stubCurrentUid,
    }));
    chai.assert.isTrue(userPsidToUidUpdateStub.calledOnceWithExactly({
      [stubPsid]: stubCurrentUid,
    }));
    chai.assert.isTrue(userUpdateStub.calledOnceWithExactly({
      ...stubFacebookUserInfo,
      id: null,
      asid: stubFacebookUserInfo.id,
      uid: stubCurrentUid,
      first_name: null,
      firstName: stubFacebookUserInfo.first_name,
      last_name: null,
      lastName: stubFacebookUserInfo.last_name,
      profilePic: stubCurrentUser.photoURL,
      psid: stubPsid,
    }));

    dbStub.restore();
  });
});
