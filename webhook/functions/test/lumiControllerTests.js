import chai from 'chai';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import mocha from 'mocha';
import nock from 'nock';
import rewire from 'rewire';
import sinon from 'sinon';
import { Md5 } from 'ts-md5/dist/md5';

import * as lumiController from '../lib/controllers/lumiController';
import * as constants from '../lib/static/constants';
import * as utils from '../lib/utils';


// Rewire uses Lumi controller file path to test and stub private methods of Lumi controller
const lumiControllerFilePath = '../lib/controllers/lumiController.js';


/**
 * Test Lumi's function to verify webhook authenticity with Messenger
 */
mocha.describe('Webhook verification unit tests', () => {
  // Stub Cloud Functions config because it is not available in local context
  let configStub;
  const testToken = 'TEST_TOKEN';
  mocha.before(() => {
    configStub = sinon.stub(functions, 'config').returns({
      lumi: {
        token_verify: testToken,
      },
    });
  });

  // Restore Cloud Functions config
  mocha.after(() => {
    configStub.restore();
  });

  mocha.it('Verification success', () => {
    const challenge = 'TEST_CHALLENGE';
    const req = {
      query: {
        'hub.mode': 'subscribe',
        'hub.verify_token': testToken,
        'hub.challenge': challenge,
      },
    };
    const res = {
      // Return this so that res.status is chainable
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      sendStatus: sinon.stub(),
    };
    lumiController.verify(req, res);
    chai.assert.isTrue(res.status.calledOnceWithExactly(200));
    chai.assert.isTrue(res.send.calledOnceWithExactly(challenge));
    chai.assert.isTrue(res.sendStatus.notCalled);
  });

  mocha.it('Verification failure bad mode', () => {
    const challenge = 'TEST_CHALLENGE';
    const req = {
      query: {
        'hub.mode': 'BAD_MODE',
        'hub.verify_token': testToken,
        'hub.challenge': challenge,
      },
    };
    const res = {
      // Return this so that res.status is chainable
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      sendStatus: sinon.stub(),
    };
    lumiController.verify(req, res);
    chai.assert.isTrue(res.status.notCalled);
    chai.assert.isTrue(res.send.notCalled);
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(403));
  });

  mocha.it('Verification failure bad token', () => {
    const challenge = 'TEST_CHALLENGE';
    const req = {
      query: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'BAD_TOKEN',
        'hub.challenge': challenge,
      },
    };
    const res = {
      // Return this so that res.status is chainable
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      sendStatus: sinon.stub(),
    };
    lumiController.verify(req, res);
    chai.assert.isTrue(res.status.notCalled);
    chai.assert.isTrue(res.send.notCalled);
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(403));
  });

  mocha.it('Verification failure bad mode and token', () => {
    const challenge = 'TEST_CHALLENGE';
    const req = {
      query: {
        'hub.mode': '',
        'hub.verify_token': '',
        'hub.challenge': challenge,
      },
    };
    const res = {
      // Return this so that res.status is chainable
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      sendStatus: sinon.stub(),
    };
    lumiController.verify(req, res);
    chai.assert.isTrue(res.status.notCalled);
    chai.assert.isTrue(res.send.notCalled);
    chai.assert.isTrue(res.sendStatus.notCalled);
  });
});


/**
 * Test getting user PSID from ASID so that Lumi can match application users with Messenger users
 */
mocha.describe('Get user PSID from ASID unit tests', () => {
  // Stub Cloud Functions config because it is not available in local context
  let configStub;
  mocha.before(() => {
    configStub = sinon.stub(functions, 'config').returns({
      lumi: {
        env: constants.ENV_TEST,
        token_app_access: 'APP_ACCESS_TOKEN',
        token_app_access_staging: 'APP_ACCESS_TOKEN_STAGING',
      },
    });
  });

  // Restore Cloud Functions config
  mocha.after(() => {
    configStub.restore();
  });

  mocha.it('Get PSID from ASID success', async () => {
    const req = {
      query: {
        asid: 'TEST_ASID',
      },
    };
    const res = {
      // Return this so that res.status and res.set are chainable
      status: sinon.stub().returnsThis(),
      set: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // Stub HTTP request to avoid call to Facebook
    nock(constants.URL_FB_GRAPH_API)
      .get('/TEST_ASID')
      .query(true)
      .reply(200, {
        ids_for_pages: {
          data: [
            {
              id: 'TEST_ID_1',
              page: {
                id: 0,
              },
            },
            {
              id: 'TEST_ID_2',
              page: {
                id: constants.PAGE_ID_LUMI,
              },
            },
          ],
        },
      });
    await lumiController.getPsidFromAsid(req, res);
    chai.assert.isTrue(res.status.calledOnceWithExactly(200));
    chai.assert.isTrue(res.set.calledOnceWithExactly('Access-Control-Allow-Origin', '*'));
    chai.assert.isTrue(res.json.calledOnceWithExactly({ psid: 'TEST_ID_2' }));
    nock.cleanAll();
  });

  mocha.it('Get PSID from ASID failure', async () => {
    const req = {
      query: {
        asid: 'TEST_ASID',
      },
    };
    const res = {
      // Return this so that res.status and res.set are chainable
      status: sinon.stub().returnsThis(),
      set: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    // Stub HTTP request to avoid call to Facebook
    nock(constants.URL_FB_GRAPH_API)
      .get('/TEST_ASID')
      .query(true)
      .reply(200, {
        ids_for_pages: {
          data: [
            {
              id: 'TEST_ID_1',
              page: {
                id: 0,
              },
            },
            {
              id: 'TEST_ID_2',
              page: {
                id: 1,
              },
            },
          ],
        },
      });
    await lumiController.getPsidFromAsid(req, res);
    chai.assert.isTrue(res.status.calledOnceWithExactly(200));
    chai.assert.isTrue(res.set.calledOnceWithExactly('Access-Control-Allow-Origin', '*'));
    chai.assert.isTrue(res.json.calledOnceWithExactly({ psid: '' }));
    nock.cleanAll();
  });
});


/**
 * Test that Lumi saves images to DB and returns an updated received message
 */
mocha.describe('Save image to DB unit tests', () => {
  mocha.it('Save image success', async () => {
    const rewiredLumiController = rewire(lumiControllerFilePath);
    const stubDomain = 'TEST_DOMAIN';
    const stubPath = '/TEST_PATH';
    const stubTempUrl = `${stubDomain}${stubPath}`;
    const stubDestination = `${Md5.hashStr(stubTempUrl)}.jpg`;
    const stubDownloadUrl = 'TEST_DOWNLOAD_URL';
    const stubBlob = 'TEST_BLOB';

    nock(stubDomain)
      .get(stubPath)
      .query(true)
      .reply(200, stubBlob);

    const getSignedUrlStub = sinon.stub().resolves([stubDownloadUrl]);
    const uploadStub = sinon.stub().resolves([{ getSignedUrl: getSignedUrlStub }]);
    const bucketStub = sinon.stub().returns({ upload: uploadStub });
    const storageStub = sinon.stub(admin, 'storage').get(() => (() => ({ bucket: bucketStub })));

    const permUrl = await rewiredLumiController.__get__('saveImageToDb')(stubTempUrl);

    chai.assert.isTrue(bucketStub.calledOnce);
    chai.assert
      .isTrue(uploadStub.calledOnceWithExactly(stubTempUrl, { destination: stubDestination }));
    chai.assert.isTrue(getSignedUrlStub.calledOnceWithExactly({
      action: 'read',
      expires: constants.DATE_IMAGE_EXPIRY,
    }));
    chai.assert.strictEqual(permUrl, stubDownloadUrl);

    storageStub.restore();
    nock.cleanAll();
  });
});


mocha.describe('Get permanent image URL unit tests', () => {
  mocha.it('Get URL success', async () => {
    const rewiredLumiController = rewire(lumiControllerFilePath);
    const stubPermUrl = 'TEST_PERM_URL';
    const saveImageToDbStub = sinon.stub().resolves(stubPermUrl);
    const revertLumiController = rewiredLumiController.__set__('saveImageToDb', saveImageToDbStub);

    const res = {
      status: sinon.stub().returnsThis(),
      set: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const req = { body: { tempUrl: 'TEST_TEMP_URL' } };
    await rewiredLumiController.getPermanentImageUrl(req, res);
    chai.assert.isTrue(saveImageToDbStub.calledOnceWithExactly(req.body.tempUrl));
    chai.assert.isTrue(res.status.calledOnceWithExactly(200));
    chai.assert.isTrue(res.set.calledOnceWithExactly('Access-Control-Allow-Origin', '*'));
    chai.assert.isTrue(res.json.calledOnceWithExactly({ permUrl: stubPermUrl }));

    // Revert changes to affected modules
    revertLumiController();
  });
});

/**
 * Test that Lumi calls Facebook's Send API with the relevant parameters
 */
mocha.describe('Call Send API unit tests', () => {
  // Stub Cloud Functions config because it is not available in local context
  let configStub;
  mocha.before(() => {
    configStub = sinon.stub(functions, 'config').returns({
      lumi: {
        env: constants.ENV_TEST,
        token_page_access: 'PAGE_ACCESS_TOKEN',
        token_page_access_staging: 'PAGE_ACCESS_TOKEN_STAGING',
      },
    });
  });

  // Restore Cloud Functions config
  mocha.after(() => {
    configStub.restore();
  });

  mocha.it('Call Send API with correct parameters', async () => {
    const requestMock = nock(constants.URL_FB_SEND_API)
      .post('', {
        recipient: {
          id: 'SENDER_PSID',
        },
        message: 'RESPONSE',
      })
      .query({ access_token: 'PAGE_ACCESS_TOKEN_STAGING' })
      .reply(200);
    await rewire(lumiControllerFilePath).__get__('callSendApi')('SENDER_PSID', 'RESPONSE');
    chai.assert.isTrue(requestMock.isDone());
    nock.cleanAll();
  });
});


/**
 * Test that Lumi gets group name from group ID properly
 */
mocha.describe('Get group name from group ID unit tests', () => {
  mocha.it('Get group name success', async () => {
    const stubGroupId = 'TEST_GROUP_ID';
    const stubGroupName = 'TEST_GROUP_NAME';
    const refParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubGroupId}/name`;
    const onceStub = sinon.stub().resolves(stubGroupName);
    const refStub = sinon.stub().returns({ once: onceStub });
    const dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: refStub })));
    const groupName =
      await rewire(lumiControllerFilePath).__get__('getGroupNameFromGroupId')(stubGroupId);
    chai.assert.deepEqual(groupName, stubGroupName);
    chai.assert.isTrue(refStub.calledOnceWithExactly(refParam));
    chai.assert.isTrue(onceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    dbStub.restore();
  });
});


/**
 * Test that Lumi generates the correct quick replies
 */
mocha.describe('Get quick reply unit tests', () => {
  mocha.it('Get quick reply for category Other', async () => {
    const messageRef = { key: 'MESSAGE_KEY' };
    const responseCode = constants.RESPONSE_CODE_CATEGORY_OTHER;
    const expectedQuickReply = {
      title: constants.QUICK_REPLY_TITLE_CATEGORY_OTHER,
      content_type: constants.QUICK_REPLY_CONTENT_TYPE_TEXT,
      payload: JSON.stringify({
        groupId: null,
        isOriginalMessageText: null,
        code: responseCode,
        messageKey: messageRef.key,
      }),
    };
    const quickReply =
      await rewire(lumiControllerFilePath).__get__('getQuickReply')(messageRef, responseCode);
    chai.assert.deepEqual(quickReply, expectedQuickReply);
  });
});


/**
 * Test that Lumi generates the correct responses for a given message
 */
mocha.describe('Get response unit tests', () => {
  let rewiredLumiController;
  let revertLumiController;
  let getQuickReplyStub;
  let utilsStub;
  const stubQuickReply = 'QUICK_REPLY';
  const stubText = 'TEXT';
  mocha.before(() => {
    rewiredLumiController = rewire(lumiControllerFilePath);
  });
  mocha.beforeEach(() => {
    getQuickReplyStub = sinon.stub().returns(stubQuickReply);
    revertLumiController = rewiredLumiController.__set__('getQuickReply', getQuickReplyStub);
    utilsStub = sinon.stub(utils, 'responseCodeToResponseMessage').returns(stubText);
  });
  mocha.afterEach(() => {
    // Revert changes to affected modules
    revertLumiController();
    // Restore utilsStub after each test to verify that it is called exactly once in each test
    utilsStub.restore();
  });

  mocha.it('Get response for new message when user in multiple groups', async () => {
    const webhookEvent = { message: { text: true } };
    const receivedResponseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
    const messageRef = { text: 'TEXT' };
    const userGroups = ['GROUP'];
    const expectedResponse = {
      text: stubText,
      quick_replies: [
        stubQuickReply,
      ],
    };
    const response = await rewiredLumiController
      .__get__('getResponse')(webhookEvent, receivedResponseCode, messageRef, userGroups);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.isTrue(getQuickReplyStub.calledOnce);
    chai.assert.isTrue(getQuickReplyStub
      .calledWith(messageRef, constants.RESPONSE_CODE_CHOSE_GROUP, userGroups[0], true));
    chai.assert.isTrue((
      utilsStub.calledOnceWithExactly(receivedResponseCode, webhookEvent, userGroups, null)));
  });

  mocha.it('Get response for new message text', async () => {
    const webhookEvent = { message: { text: true } };
    const receivedResponseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
    const messageRef = {};
    const expectedResponse = {
      text: stubText,
      quick_replies: [
        stubQuickReply,
        stubQuickReply,
      ],
    };
    const response = await rewiredLumiController
      .__get__('getResponse')(webhookEvent, receivedResponseCode, messageRef);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.isTrue(getQuickReplyStub.calledTwice);
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_YES)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_NO)));
    chai.assert.isTrue((
      utilsStub.calledOnceWithExactly(receivedResponseCode, webhookEvent, null, null)));
  });

  mocha.it('Get response for new message image', async () => {
    const webhookEvent = { message: {} };
    const receivedResponseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
    const messageRef = {};
    const expectedResponse = {
      text: stubText,
      quick_replies: [
        'QUICK_REPLY',
        'QUICK_REPLY',
      ],
    };
    const response = await rewiredLumiController
      .__get__('getResponse')(webhookEvent, receivedResponseCode, messageRef);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.isTrue(getQuickReplyStub.calledTwice);
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_YES)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_NO)));
    chai.assert.isTrue((
      utilsStub.calledOnceWithExactly(receivedResponseCode, webhookEvent, null, null)));
  });

  mocha.it('Get response for chose group, original message text', async () => {
    const webhookEvent = { message: { text: true } };
    const receivedResponseCode = constants.RESPONSE_CODE_CHOSE_GROUP;
    const messageRef = {};
    const userGroups = null;
    const isOriginalMessageText = true;
    const expectedResponse = {
      text: stubText,
      quick_replies: [
        stubQuickReply,
        stubQuickReply,
      ],
    };
    const response = await rewiredLumiController.__get__('getResponse')(
      webhookEvent, receivedResponseCode, messageRef, userGroups, isOriginalMessageText);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.isTrue(getQuickReplyStub.calledTwice);
    chai.assert.isTrue(
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_YES));
    chai.assert.isTrue(
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_IMAGE_NO));
    chai.assert.isTrue(utilsStub.calledOnceWithExactly(
      receivedResponseCode, webhookEvent, userGroups, isOriginalMessageText));
  });

  mocha.it('Get response for chose group, original message image', async () => {
    const webhookEvent = { message: {} };
    const receivedResponseCode = constants.RESPONSE_CODE_CHOSE_GROUP;
    const messageRef = {};
    const userGroups = null;
    const isOriginalMessageText = false;
    const expectedResponse = {
      text: stubText,
      quick_replies: [
        'QUICK_REPLY',
        'QUICK_REPLY',
      ],
    };
    const response = await rewiredLumiController.__get__('getResponse')(
      webhookEvent, receivedResponseCode, messageRef, userGroups, isOriginalMessageText);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.isTrue(getQuickReplyStub.calledTwice);
    chai.assert.isTrue(
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_YES));
    chai.assert.isTrue(
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_ATTACH_TEXT_NO));
    chai.assert.isTrue(utilsStub.calledOnceWithExactly(
      receivedResponseCode, webhookEvent, userGroups, isOriginalMessageText));
  });

  mocha.it('Get response for message attachment', async () => {
    const webhookEvent = { message: { text: true } };
    const receivedResponseCode = constants.RESPONSE_CODE_ATTACH_IMAGE_NO;
    const messageRef = {};
    const expectedResponse = {
      text: stubText,
      quick_replies: [
        'QUICK_REPLY',
        'QUICK_REPLY',
      ],
    };
    const response = await rewiredLumiController
      .__get__('getResponse')(webhookEvent, receivedResponseCode, messageRef);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.strictEqual(getQuickReplyStub.callCount, 2);
    chai.assert.isTrue(getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_STAR_YES));
    chai.assert.isTrue(getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_STAR_NO));
  });

  mocha.it('Get response for star response', async () => {
    const webhookEvent = { message: { text: true } };
    const receivedResponseCode = constants.RESPONSE_CODE_STAR_NO;
    const messageRef = {};
    const expectedResponse = {
      text: stubText,
      quick_replies: [
        'QUICK_REPLY',
        'QUICK_REPLY',
        'QUICK_REPLY',
        'QUICK_REPLY',
        'QUICK_REPLY',
        'QUICK_REPLY',
        'QUICK_REPLY',
      ],
    };
    const response = await rewiredLumiController
      .__get__('getResponse')(webhookEvent, receivedResponseCode, messageRef);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.strictEqual(getQuickReplyStub.callCount, 7);
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_CATEGORY_ACTIVITY)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_CATEGORY_MOOD)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_CATEGORY_MEMORY)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_CATEGORY_MEDICAL)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_CATEGORY_CAREGIVER)));
    chai.assert.isTrue((
      getQuickReplyStub.calledWith(messageRef, constants.RESPONSE_CODE_CATEGORY_OTHER)));
    chai.assert.isTrue((
      utilsStub.calledOnceWithExactly(receivedResponseCode, webhookEvent, null, null)));
  });

  mocha.it('Get response for other message', async () => {
    const webhookEvent = { message: {} };
    const receivedResponseCode = '';
    const messageRef = {};
    const expectedResponse = {
      text: stubText,
      quick_replies: null,
    };
    const response = await rewiredLumiController
      .__get__('getResponse')(webhookEvent, receivedResponseCode, messageRef);
    chai.assert.deepEqual(response, expectedResponse);
    chai.assert.isFalse(getQuickReplyStub.called);
    chai.assert.isTrue((
      utilsStub.calledOnceWithExactly(receivedResponseCode, webhookEvent, null, null)));
  });
});


/**
 * Test that Lumi saves messages to groups properly
 */
mocha.describe('Handle message to group unit tests', () => {
  mocha.it('Handle message to group success', async () => {
    // Params for DB references
    const psid = 'PSID';
    const uid = 'UID';
    const gid = 'GID';
    const psidToUidRefParam = `${constants.DB_PATH_USER_PSID_TO_UID}/${psid}`;
    const userRefParam = `${constants.DB_PATH_USERS}/${uid}`;

    // Method stubs
    const psidToUidValStub = sinon.stub().returns(uid);
    const psidToUidOnceStub = sinon.stub().withArgs(constants.DB_EVENT_NAME_VALUE).resolves({
      val: psidToUidValStub,
    });
    const userValStub = sinon.stub().returns({
      activeGroup: gid,
      groups: {},
    });
    const userOnceStub = sinon.stub().withArgs(constants.DB_EVENT_NAME_VALUE).resolves({
      val: userValStub,
    });
    const refStub = sinon.stub();
    refStub.withArgs(psidToUidRefParam).returns({ once: psidToUidOnceStub });
    refStub.withArgs(userRefParam).returns({ once: userOnceStub });
    const dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: refStub })));
    const newMessageRef = {};

    // Test saveMessageToGroup
    await rewire(lumiControllerFilePath).__get__('handleMessageToGroup')(psid, newMessageRef);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWith(psidToUidRefParam));
    chai.assert.isTrue(refStub.calledWith(userRefParam));
    chai.assert.isTrue(psidToUidOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(psidToUidValStub.calledOnce);
    chai.assert.isTrue(userOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(userValStub.calledOnce);

    // Restore DB functions to prior state
    dbStub.restore();
  });

  mocha.it('Handle message to group no UID', async () => {
    // Params for DB references
    const psid = 'PSID';
    const uid = '';
    const gid = 'GID';
    const psidToUidRefParam = `${constants.DB_PATH_USER_PSID_TO_UID}/${psid}`;
    const userRefParam = `${constants.DB_PATH_USERS}/${uid}`;

    // Method stubs
    const psidToUidValStub = sinon.stub().returns(uid);
    const psidToUidOnceStub = sinon.stub().withArgs(constants.DB_EVENT_NAME_VALUE).resolves({
      val: psidToUidValStub,
    });
    const userValStub = sinon.stub().returns({
      activeGroup: gid,
      groups: {},
    });
    const userOnceStub = sinon.stub().withArgs(constants.DB_EVENT_NAME_VALUE).resolves({
      val: userValStub,
    });
    const refStub = sinon.stub();
    refStub.withArgs(psidToUidRefParam).returns({ once: psidToUidOnceStub });
    refStub.withArgs(userRefParam).returns({ once: userOnceStub });
    const dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: refStub })));
    const newMessageRef = {};

    // Test saveMessageToGroup
    await rewire(lumiControllerFilePath).__get__('handleMessageToGroup')(psid, newMessageRef);
    chai.assert.isTrue(refStub.calledOnce);
    chai.assert.isTrue(refStub.calledWith(psidToUidRefParam));
    chai.assert.isFalse(refStub.calledWith(userRefParam));
    chai.assert.isTrue(psidToUidOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(psidToUidValStub.calledOnce);
    chai.assert.isFalse(userOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isFalse(userValStub.calledOnce);

    // Restore DB functions to prior state
    dbStub.restore();
  });

  mocha.it('Handle message to group no UID', async () => {
    // Params for DB references
    const psid = 'PSID';
    const uid = 'UID';
    const gid = '';
    const psidToUidRefParam = `${constants.DB_PATH_USER_PSID_TO_UID}/${psid}`;
    const userRefParam = `${constants.DB_PATH_USERS}/${uid}`;

    // Method stubs
    const psidToUidValStub = sinon.stub().returns(uid);
    const psidToUidOnceStub = sinon.stub().withArgs(constants.DB_EVENT_NAME_VALUE).resolves({
      val: psidToUidValStub,
    });
    const userValStub = sinon.stub().returns({
      activeGroup: gid,
      groups: {},
    });
    const userOnceStub = sinon.stub().withArgs(constants.DB_EVENT_NAME_VALUE).resolves({
      val: userValStub,
    });
    const refStub = sinon.stub();
    refStub.withArgs(psidToUidRefParam).returns({ once: psidToUidOnceStub });
    refStub.withArgs(userRefParam).returns({ once: userOnceStub });
    const dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: refStub })));
    const newMessageRef = {};

    // Test saveMessageToGroup
    await rewire(lumiControllerFilePath).__get__('handleMessageToGroup')(psid, newMessageRef);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWith(psidToUidRefParam));
    chai.assert.isTrue(refStub.calledWith(userRefParam));
    chai.assert.isTrue(psidToUidOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(psidToUidValStub.calledOnce);
    chai.assert.isTrue(userOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(userValStub.calledOnce);

    // Restore DB functions to prior state
    dbStub.restore();
  });
});


mocha.describe('Save message to group unit tests', () => {
  mocha.it('Save success', () => {
    const groupMessagesUpdateStub = sinon.stub();
    const groupMessagesRefStub = sinon.stub().returns({ update: groupMessagesUpdateStub });
    const dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: groupMessagesRefStub })));
    const stubMessageRef = ({
      key: 'TEST_KEY',
      update: sinon.stub(),
    });
    const stubGroupId = 'TEST_GROUP_ID';
    const groupMessagesRefParam = `${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${stubGroupId}`;
    rewire(lumiControllerFilePath).__get__('saveMessageToGroup')(stubMessageRef, stubGroupId);
    chai.assert.isTrue(stubMessageRef.update.calledOnceWithExactly({ group: stubGroupId }));
    chai.assert.isTrue(groupMessagesRefStub.calledOnceWithExactly(groupMessagesRefParam));
    chai.assert.isTrue(
      groupMessagesUpdateStub.calledOnceWithExactly({ [stubMessageRef.key]: true }));
    dbStub.restore();
  });
});


/**
 * Test that Lumi handles quick reply messages properly
 */
mocha.describe('Handle quick reply unit tests', () => {
  let rewiredLumiController;
  let revertLumiController;
  let getResponseStub;
  let saveMessageToGroupStub;
  let jsonStub;
  let utilsStub;
  const stubCode = 'CODE';
  const stubResponse = 'RESPONSE';
  mocha.before(() => {
    rewiredLumiController = rewire(lumiControllerFilePath);
  });
  mocha.beforeEach(() => {
    getResponseStub = sinon.stub().resolves(stubResponse);
    saveMessageToGroupStub = sinon.stub();
    revertLumiController = rewiredLumiController.__set__({
      getResponse: getResponseStub,
      saveMessageToGroup: saveMessageToGroupStub,
    });
    jsonStub = sinon.stub(JSON, 'parse').callsFake(object => object);
    utilsStub = sinon.stub(utils, 'responseCodeToMessageCategoryCode').returns(stubCode);
  });
  mocha.afterEach(() => {
    // Revert changes to affected modules
    revertLumiController();
    // Restore jsonStub and utilsStub after each test to verify called exactly once in each test
    jsonStub.restore();
    utilsStub.restore();
  });

  mocha.it('Handle quick reply chose group', async () => {
    const messageKey = 'MESSAGE_KEY';
    const responseCode = constants.RESPONSE_CODE_CHOSE_GROUP;
    const receivedMessage = {
      quick_reply: {
        payload: {
          code: responseCode,
          messageKey,
          isOriginalMessageText: true,
        },
      },
    };
    const webhookEvent = { message: receivedMessage };
    const messageRef = {
      update: sinon.stub(),
    };
    const messagesRef = {
      child: sinon.stub().returns(messageRef),
    };
    const userMessagesRef = {
      update: sinon.stub(),
    };

    const response = await rewiredLumiController
      .__get__('handleQuickReply')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(messageKey));
    chai.assert.isTrue(saveMessageToGroupStub.calledOnce);
    chai.assert.isFalse(userMessagesRef.update.called);
    chai.assert.isFalse(messageRef.update.called);
    chai.assert.isFalse(utilsStub.called);
    chai.assert.isTrue(getResponseStub
      .calledOnceWithExactly(webhookEvent, responseCode, messageRef, null, true));
  });

  mocha.it('Handle quick reply attach image', async () => {
    const messageKey = 'MESSAGE_KEY';
    const responseCode = constants.RESPONSE_CODE_ATTACH_IMAGE_YES;
    const receivedMessage = {
      quick_reply: {
        payload: {
          code: responseCode,
          messageKey,
          isOriginalMessageText: true,
        },
      },
    };
    const webhookEvent = { message: receivedMessage };
    const messageRef = {
      update: sinon.stub(),
    };
    const messagesRef = {
      child: sinon.stub().returns(messageRef),
    };
    const userMessagesRef = {
      update: sinon.stub(),
    };

    const response = await rewiredLumiController
      .__get__('handleQuickReply')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(messageKey));
    chai.assert.isFalse(saveMessageToGroupStub.called);
    chai.assert.isTrue(userMessagesRef.update.calledOnceWithExactly({ isAwaitingImage: true }));
    chai.assert.isFalse(messageRef.update.called);
    chai.assert.isFalse(utilsStub.called);
    chai.assert.isTrue(getResponseStub
      .calledOnceWithExactly(webhookEvent, responseCode, messageRef, null, true));
  });

  mocha.it('Handle quick reply attach text', async () => {
    const messageKey = 'MESSAGE_KEY';
    const responseCode = constants.RESPONSE_CODE_ATTACH_TEXT_YES;
    const receivedMessage = {
      quick_reply: {
        payload: {
          code: responseCode,
          messageKey,
          isOriginalMessageText: true,
        },
      },
    };
    const webhookEvent = { message: receivedMessage };
    const messageRef = {
      update: sinon.stub(),
    };
    const messagesRef = {
      child: sinon.stub().returns(messageRef),
    };
    const userMessagesRef = {
      update: sinon.stub(),
    };

    const response = await rewiredLumiController
      .__get__('handleQuickReply')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(messageKey));
    chai.assert.isFalse(saveMessageToGroupStub.called);
    chai.assert.isTrue(userMessagesRef.update.calledOnceWithExactly({ isAwaitingText: true }));
    chai.assert.isFalse(messageRef.update.called);
    chai.assert.isFalse(utilsStub.called);
    chai.assert.isTrue(getResponseStub
      .calledOnceWithExactly(webhookEvent, responseCode, messageRef, null, true));
  });

  mocha.it('Handle quick reply star', async () => {
    const messageKey = 'MESSAGE_KEY';
    const responseCode = constants.RESPONSE_CODE_STAR_YES;
    const receivedMessage = {
      quick_reply: {
        payload: {
          code: responseCode,
          messageKey,
          isOriginalMessageText: true,
        },
      },
    };
    const webhookEvent = { message: receivedMessage };
    const messageRef = {
      update: sinon.stub(),
    };
    const messagesRef = {
      child: sinon.stub().returns(messageRef),
    };
    const userMessagesRef = {
      update: sinon.stub(),
    };

    const response = await rewiredLumiController
      .__get__('handleQuickReply')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(messageKey));
    chai.assert.isFalse(saveMessageToGroupStub.called);
    chai.assert.isFalse(userMessagesRef.update.called);
    chai.assert.isTrue(messageRef.update.calledOnceWithExactly({ starred: true }));
    chai.assert.isFalse(utilsStub.called);
    chai.assert.isTrue(getResponseStub
      .calledOnceWithExactly(webhookEvent, responseCode, messageRef, null, true));
  });

  mocha.it('Handle quick reply category', async () => {
    const messageKey = 'MESSAGE_KEY';
    const responseCode = constants.RESPONSE_CODE_CATEGORY_OTHER;
    const receivedMessage = {
      quick_reply: {
        payload: {
          code: responseCode,
          messageKey,
          isOriginalMessageText: true,
        },
      },
    };
    const webhookEvent = { message: receivedMessage };
    const messageRef = {
      update: sinon.stub(),
    };
    const messagesRef = {
      child: sinon.stub().returns(messageRef),
    };
    const userMessagesRef = {
      update: sinon.stub(),
    };

    const response = await rewiredLumiController
      .__get__('handleQuickReply')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(messageKey));
    chai.assert.isFalse(saveMessageToGroupStub.called);
    chai.assert.isFalse(userMessagesRef.update.called);
    chai.assert.isTrue(messageRef.update.calledOnceWithExactly({ category: stubCode }));
    chai.assert.isTrue(utilsStub.calledOnceWithExactly(responseCode));
    chai.assert.isTrue(getResponseStub
      .calledOnceWithExactly(webhookEvent, responseCode, messageRef, null, true));
  });

  mocha.it('Handle quick reply other', async () => {
    const messageKey = 'MESSAGE_KEY';
    const responseCode = constants.RESPONSE_CODE_ATTACH_IMAGE_NO;
    const receivedMessage = {
      quick_reply: {
        payload: {
          code: responseCode,
          messageKey,
          isOriginalMessageText: true,
        },
      },
    };
    const webhookEvent = { message: receivedMessage };
    const messageRef = {
      update: sinon.stub(),
    };
    const messagesRef = {
      child: sinon.stub().returns(messageRef),
    };
    const userMessagesRef = {
      update: sinon.stub(),
    };

    const response = await rewiredLumiController
      .__get__('handleQuickReply')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(messageKey));
    chai.assert.isFalse(saveMessageToGroupStub.called);
    chai.assert.isFalse(userMessagesRef.update.called);
    chai.assert.isFalse(messageRef.update.called);
    chai.assert.isFalse(utilsStub.called);
    chai.assert.isTrue(getResponseStub
      .calledOnceWithExactly(webhookEvent, responseCode, messageRef, null, true));
  });
});


/**
 * Test that Lumi attaches attach messages to previous messages properly
 */
mocha.describe('Attach to prev message unit tests', () => {
  const isAwaitingImage = true;
  const isAwaitingText = true;
  const prevMessageKey = 'PREV_MESSAGE_KEY';
  const lastMessagesSnapshot = [
    { key: constants.IS_AWAITING_FLAG_TEXT },
    { key: constants.IS_AWAITING_FLAG_IMAGE },
    { key: prevMessageKey },
  ];
  const defaultResponseCode = 'DEFAULT_RESPONSE_CODE';
  const defaultShowInTimeline = 'DEFAULT_SHOW_IN_TIMELINE';
  const defaultMessageRef = 'DEFAULT_MESSAGE_REF';
  let prevMessageRef;
  let messagesRef;
  let orderedUserMessagesRef;
  let limitToLastStub;
  let userMessagesRef;
  let isAwaitingImageRef;
  let isAwaitingTextRef;
  mocha.beforeEach(() => {
    prevMessageRef = { update: sinon.stub() };
    messagesRef = { child: sinon.stub().returns(prevMessageRef) };
    orderedUserMessagesRef = { once: sinon.stub().returns(lastMessagesSnapshot) };
    limitToLastStub = sinon.stub().returns(orderedUserMessagesRef);
    userMessagesRef = { orderByKey: sinon.stub().returns({ limitToLast: limitToLastStub }) };
    isAwaitingImageRef = { remove: sinon.stub() };
    isAwaitingTextRef = { remove: sinon.stub() };
  });

  mocha.it('Attach image to prev message', async () => {
    const receivedMessage = {
      attachments: { 0: { type: 'image' } },
      text: '',
    };
    const responseInfo = await rewire(lumiControllerFilePath).__get__('attachToPrevMessage')(
      messagesRef, userMessagesRef, receivedMessage, isAwaitingImage, isAwaitingText,
      isAwaitingImageRef, isAwaitingTextRef, defaultResponseCode, defaultShowInTimeline,
      defaultMessageRef,
    );
    const expectedResponseInfo = {
      responseCode: constants.RESPONSE_CODE_ATTACHED_IMAGE,
      showInTimeline: false,
      messageRef: prevMessageRef,
    };
    chai.assert.deepEqual(responseInfo, expectedResponseInfo);
    chai.assert.isTrue(userMessagesRef.orderByKey.calledOnce);
    chai.assert.isTrue(limitToLastStub.calledOnceWithExactly(3));
    chai.assert.isTrue((
      orderedUserMessagesRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(prevMessageKey));
    chai.assert.isTrue(prevMessageRef.update.calledOnceWithExactly({
      attachments: receivedMessage.attachments,
    }));
    chai.assert.isTrue(isAwaitingImageRef.remove.calledOnce);
    chai.assert.isTrue(isAwaitingTextRef.remove.calledOnce);
  });

  mocha.it('Attach text to prev message', async () => {
    const receivedMessage = {
      attachments: { 0: { type: '' } },
      text: 'TEXT',
    };
    const responseInfo = await rewire(lumiControllerFilePath).__get__('attachToPrevMessage')(
      messagesRef, userMessagesRef, receivedMessage, isAwaitingImage, isAwaitingText,
      isAwaitingImageRef, isAwaitingTextRef, defaultResponseCode, defaultShowInTimeline,
      defaultMessageRef,
    );
    const expectedResponseInfo = {
      responseCode: constants.RESPONSE_CODE_ATTACHED_TEXT,
      showInTimeline: false,
      messageRef: prevMessageRef,
    };
    chai.assert.deepEqual(responseInfo, expectedResponseInfo);
    chai.assert.isTrue(userMessagesRef.orderByKey.calledOnce);
    chai.assert.isTrue(limitToLastStub.calledOnceWithExactly(3));
    chai.assert.isTrue((
      orderedUserMessagesRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(prevMessageKey));
    chai.assert.isTrue(prevMessageRef.update.calledOnceWithExactly({
      text: receivedMessage.text,
    }));
    chai.assert.isTrue(isAwaitingImageRef.remove.calledOnce);
    chai.assert.isTrue(isAwaitingTextRef.remove.calledOnce);
  });

  mocha.it('Attach nothing to prev message', async () => {
    const receivedMessage = {
      attachments: { 0: { type: '' } },
      text: '',
    };
    const responseInfo = await rewire(lumiControllerFilePath).__get__('attachToPrevMessage')(
      messagesRef, userMessagesRef, receivedMessage, isAwaitingImage, isAwaitingText,
      isAwaitingImageRef, isAwaitingTextRef, defaultResponseCode, defaultShowInTimeline,
      defaultMessageRef,
    );
    const expectedResponseInfo = {
      responseCode: defaultResponseCode,
      showInTimeline: defaultShowInTimeline,
      messageRef: prevMessageRef,
    };
    chai.assert.deepEqual(responseInfo, expectedResponseInfo);
    chai.assert.isTrue(userMessagesRef.orderByKey.calledOnce);
    chai.assert.isTrue(limitToLastStub.calledOnceWithExactly(3));
    chai.assert.isTrue((
      orderedUserMessagesRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue(messagesRef.child.calledOnceWithExactly(prevMessageKey));
    chai.assert.isFalse(prevMessageRef.update.called);
    chai.assert.isTrue(isAwaitingImageRef.remove.calledOnce);
    chai.assert.isTrue(isAwaitingTextRef.remove.calledOnce);
  });
});


/**
 * Test that Lumi handles text and attachment messages properly
 */
mocha.describe('Handle text and attachments unit tests', () => {
  const stubResponse = 'RESPONSE';
  const webhookEvent = {
    message: { test: 'test' },
    sender: { id: '' },
    timestamp: '',
  };
  const newMessageKey = 'NEW_MESSAGE_KEY';
  const newMessageRef = {
    key: newMessageKey,
  };
  const defaultResponseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
  const defaultShowInTimeline = true;
  const defaultMessageRef = null;
  const stubResponseInfo = {
    responseCode: 'RESPONSE_CODE',
    showInTimeline: 'SHOW_IN_TIMELINE',
    messageRef: 'MESSAGE_REF',
  };
  let rewiredLumiController;
  let revertLumiController;
  let messagesRef;
  let userMessagesRef;
  let isAwaitingImageRef;
  let isAwaitingImageSnapshot;
  let isAwaitingTextRef;
  let isAwaitingTextSnapshot;
  let attachToPrevMessageStub;
  let handleMessageToGroupStub;
  let getResponseStub;
  mocha.before(() => {
    rewiredLumiController = rewire(lumiControllerFilePath);
  });
  mocha.beforeEach(() => {
    messagesRef = {
      push: sinon.stub().returns(newMessageRef),
    };
    userMessagesRef = {
      child: sinon.stub(),
      update: sinon.stub(),
    };
    isAwaitingImageSnapshot = {
      val: sinon.stub(),
    };
    isAwaitingImageRef = {
      once: sinon.stub().resolves(isAwaitingImageSnapshot),
    };
    userMessagesRef.child.withArgs(constants.IS_AWAITING_FLAG_IMAGE).returns(isAwaitingImageRef);
    isAwaitingTextSnapshot = {
      val: sinon.stub(),
    };
    isAwaitingTextRef = {
      once: sinon.stub().resolves(isAwaitingTextSnapshot),
    };
    userMessagesRef.child.withArgs(constants.IS_AWAITING_FLAG_TEXT).returns(isAwaitingTextRef);
    attachToPrevMessageStub = sinon.stub().resolves(stubResponseInfo);
    handleMessageToGroupStub = sinon.stub().resolves([]);
    getResponseStub = sinon.stub().resolves(stubResponse);
    revertLumiController = rewiredLumiController.__set__({
      attachToPrevMessage: attachToPrevMessageStub,
      handleMessageToGroup: handleMessageToGroupStub,
      getResponse: getResponseStub,
    });
  });
  mocha.afterEach(() => {
    // Revert changes to affected modules
    revertLumiController();
  });

  mocha.it('Handle attaching image', async () => {
    // Set up stubs
    const isAwaitingImage = true;
    const isAwaitingText = false;
    isAwaitingImageSnapshot.val.returns(isAwaitingImage);
    isAwaitingTextSnapshot.val.returns(isAwaitingText);

    // Run code and asserts
    const response = await rewiredLumiController
      .__get__('handleTextAndAttachments')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(userMessagesRef.child.calledTwice);
    chai.assert.isTrue(userMessagesRef.child.calledWith(constants.IS_AWAITING_FLAG_IMAGE));
    chai.assert.isTrue(userMessagesRef.child.calledWith(constants.IS_AWAITING_FLAG_TEXT));
    chai.assert.isTrue((
      isAwaitingImageRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue((
      isAwaitingTextRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue(isAwaitingImageSnapshot.val.calledOnce);
    chai.assert.isTrue(isAwaitingTextSnapshot.val.calledOnce);
    chai.assert.isTrue(attachToPrevMessageStub.calledOnceWithExactly(
      messagesRef, userMessagesRef, webhookEvent.message, isAwaitingImage, isAwaitingText,
      isAwaitingImageRef, isAwaitingTextRef, defaultResponseCode, defaultShowInTimeline,
      defaultMessageRef,
    ));
    chai.assert.isTrue(messagesRef.push.calledOnceWithExactly({
      ...webhookEvent.message,
      senderPsid: webhookEvent.sender.id,
      showInTimeline: stubResponseInfo.showInTimeline,
      category: constants.MESSAGE_CATEGORY_CODE_OTHER,
      timestamp: webhookEvent.timestamp,
    }));
    chai.assert.isTrue(userMessagesRef.update.calledOnceWithExactly({ [newMessageKey]: true }));
    chai.assert.isTrue(handleMessageToGroupStub
      .calledOnceWithExactly(webhookEvent.sender.id, newMessageRef));
    chai.assert.isTrue(getResponseStub.calledOnceWithExactly(
      webhookEvent,
      stubResponseInfo.responseCode,
      stubResponseInfo.messageRef,
      [],
    ));
  });

  mocha.it('Handle attaching text', async () => {
    // Set up stubs
    const isAwaitingImage = false;
    const isAwaitingText = true;
    isAwaitingImageSnapshot.val.returns(isAwaitingImage);
    isAwaitingTextSnapshot.val.returns(isAwaitingText);

    // Run code and asserts
    const response = await rewiredLumiController
      .__get__('handleTextAndAttachments')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(userMessagesRef.child.calledTwice);
    chai.assert.isTrue(userMessagesRef.child.calledWith(constants.IS_AWAITING_FLAG_IMAGE));
    chai.assert.isTrue(userMessagesRef.child.calledWith(constants.IS_AWAITING_FLAG_TEXT));
    chai.assert.isTrue((
      isAwaitingImageRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue((
      isAwaitingTextRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue(isAwaitingImageSnapshot.val.calledOnce);
    chai.assert.isTrue(isAwaitingTextSnapshot.val.calledOnce);
    chai.assert.isTrue(attachToPrevMessageStub.calledOnceWithExactly(
      messagesRef, userMessagesRef, webhookEvent.message, isAwaitingImage, isAwaitingText,
      isAwaitingImageRef, isAwaitingTextRef, defaultResponseCode, defaultShowInTimeline,
      defaultMessageRef,
    ));
    chai.assert.isTrue(messagesRef.push.calledOnceWithExactly({
      ...webhookEvent.message,
      senderPsid: webhookEvent.sender.id,
      showInTimeline: stubResponseInfo.showInTimeline,
      category: constants.MESSAGE_CATEGORY_CODE_OTHER,
      timestamp: webhookEvent.timestamp,
    }));
    chai.assert.isTrue(userMessagesRef.update.calledOnceWithExactly({ [newMessageKey]: true }));
    chai.assert.isTrue(handleMessageToGroupStub
      .calledOnceWithExactly(webhookEvent.sender.id, newMessageRef));
    chai.assert.isTrue(getResponseStub.calledOnceWithExactly(
      webhookEvent,
      stubResponseInfo.responseCode,
      stubResponseInfo.messageRef,
      [],
    ));
  });

  mocha.it('Handle attaching nothing', async () => {
    // Set up stubs
    const isAwaitingImage = false;
    const isAwaitingText = false;
    isAwaitingImageSnapshot.val.returns(isAwaitingImage);
    isAwaitingTextSnapshot.val.returns(isAwaitingText);

    // Run code and asserts
    const response = await rewiredLumiController
      .__get__('handleTextAndAttachments')(webhookEvent, messagesRef, userMessagesRef);
    chai.assert.strictEqual(response, stubResponse);
    chai.assert.isTrue(userMessagesRef.child.calledTwice);
    chai.assert.isTrue(userMessagesRef.child.calledWith(constants.IS_AWAITING_FLAG_IMAGE));
    chai.assert.isTrue(userMessagesRef.child.calledWith(constants.IS_AWAITING_FLAG_TEXT));
    chai.assert.isTrue((
      isAwaitingImageRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue((
      isAwaitingTextRef.once.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE)));
    chai.assert.isTrue(isAwaitingImageSnapshot.val.calledOnce);
    chai.assert.isTrue(isAwaitingTextSnapshot.val.calledOnce);
    chai.assert.isFalse(attachToPrevMessageStub.called);
    chai.assert.isTrue(messagesRef.push.calledOnceWithExactly({
      ...webhookEvent.message,
      senderPsid: webhookEvent.sender.id,
      showInTimeline: defaultShowInTimeline,
      category: constants.MESSAGE_CATEGORY_CODE_OTHER,
      timestamp: webhookEvent.timestamp,
    }));
    chai.assert.isTrue(userMessagesRef.update.calledOnceWithExactly({ [newMessageKey]: true }));
    chai.assert.isTrue(handleMessageToGroupStub
      .calledOnceWithExactly(webhookEvent.sender.id, newMessageRef));
    chai.assert.isTrue(getResponseStub
      .calledOnceWithExactly(webhookEvent, defaultResponseCode, newMessageRef, []));
  });
});


/**
 * Test that Lumi handles messages properly
 */
mocha.describe('Handle message unit tests', () => {
  const defaultResponse = null;
  const stubResponse = 'RESPONSE';
  const senderPsid = 'SENDER_PSID';
  const messagesRef = 'MESSAGES_REF';
  const userMessagesRef = 'USER_MESSAGES_REF';
  const messagesRefParam = constants.DB_PATH_LUMI_MESSAGES;
  const userMessagesRefParam =
    `${constants.DB_PATH_LUMI_MESSAGES_USER}/${senderPsid}`;
  let rewiredLumiController;
  let revertLumiController;
  let dbStub;
  let jsonStub;
  let refStub;
  let handleQuickReplyStub;
  let handleTextAndAttachmentsStub;
  let callSendApiStub;
  mocha.before(() => {
    rewiredLumiController = rewire(lumiControllerFilePath);
  });
  mocha.beforeEach(() => {
    refStub = sinon.stub();
    refStub.withArgs(messagesRefParam).returns(messagesRef);
    refStub.withArgs(userMessagesRefParam).returns(userMessagesRef);
    dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: refStub })));
    jsonStub = sinon.stub(JSON, 'parse').callsFake(object => object);
    handleQuickReplyStub = sinon.stub().returns(stubResponse);
    handleTextAndAttachmentsStub = sinon.stub().resolves(stubResponse);
    callSendApiStub = sinon.stub();
    revertLumiController = rewiredLumiController.__set__({
      handleQuickReply: handleQuickReplyStub,
      handleTextAndAttachments: handleTextAndAttachmentsStub,
      callSendApi: callSendApiStub,
    });
  });
  mocha.afterEach(() => {
    // Revert changes to affected modules
    dbStub.restore();
    jsonStub.restore();
    revertLumiController();
  });

  mocha.it('Handle message quick reply', async () => {
    const webhookEvent = {
      message: {
        quick_reply: {
          payload: {
            code: 'CODE',
          },
        },
        text: null,
      },
      sender: { id: senderPsid },
    };
    await rewiredLumiController.__get__('handleMessage')(webhookEvent);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWith(messagesRefParam));
    chai.assert.isTrue(refStub.calledWith(userMessagesRefParam));
    chai.assert.isTrue(handleQuickReplyStub.calledOnceWithExactly(
      webhookEvent,
      messagesRef,
      userMessagesRef,
    ));
    chai.assert.isFalse(handleTextAndAttachmentsStub.called);
    chai.assert.isTrue(callSendApiStub.calledOnceWithExactly(senderPsid, stubResponse));
  });

  mocha.it('Handle message text and attachments', async () => {
    const webhookEvent = {
      message: {
        quick_reply: null,
        text: 'TEXT',
      },
      sender: { id: senderPsid },
    };
    await rewiredLumiController.__get__('handleMessage')(webhookEvent);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWith(messagesRefParam));
    chai.assert.isTrue(refStub.calledWith(userMessagesRefParam));
    chai.assert.isFalse(handleQuickReplyStub.called);
    chai.assert.isTrue(handleTextAndAttachmentsStub.calledOnceWithExactly(
      webhookEvent,
      messagesRef,
      userMessagesRef,
    ));
    chai.assert.isTrue(callSendApiStub.calledOnceWithExactly(senderPsid, stubResponse));
  });

  mocha.it('Handle neither message', async () => {
    const webhookEvent = {
      message: {
        quick_reply: null,
        text: null,
      },
      sender: { id: senderPsid },
    };
    await rewiredLumiController.__get__('handleMessage')(webhookEvent);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWith(messagesRefParam));
    chai.assert.isTrue(refStub.calledWith(userMessagesRefParam));
    chai.assert.isFalse(handleQuickReplyStub.called);
    chai.assert.isFalse(handleTextAndAttachmentsStub.called);
    chai.assert.isTrue(callSendApiStub.calledOnceWithExactly(senderPsid, defaultResponse));
  });
});


/**
 * Test that Lumi receives messages properly
 */
mocha.describe('Receive message unit tests', () => {
  let handleMessageStub;
  let res;
  let rewiredLumiController;
  let revertLumiController;
  mocha.before(() => {
    rewiredLumiController = rewire(lumiControllerFilePath);
  });
  mocha.beforeEach(() => {
    handleMessageStub = sinon.stub();
    res = {
      sendStatus: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    revertLumiController = rewiredLumiController.__set__('handleMessage', handleMessageStub);
  });
  mocha.afterEach(() => {
    // Revert changes to affected modules
    revertLumiController();
  });

  mocha.it('Test receive message success', async () => {
    const req = {
      body: {
        object: 'page',
        entry: [
          {
            messaging: [
              {
                message: 'MESSAGE',
              },
            ],
          },
        ],
      },
    };
    await rewiredLumiController.message(req, res);
    chai.assert.isFalse(res.sendStatus.called);
    chai.assert.isTrue(handleMessageStub.calledOnceWithExactly(req.body.entry[0].messaging[0]));
    chai.assert.isTrue(res.status.calledOnceWithExactly(200));
    chai.assert.isTrue(res.send.calledOnceWithExactly('EVENT_RECEIVED'));
  });

  mocha.it('Test receive message from non-page', async () => {
    const req = {
      body: {
        object: '',
        entry: [
          {
            messaging: [
              {
                message: 'MESSAGE',
              },
            ],
          },
        ],
      },
    };
    await rewiredLumiController.message(req, res);
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(404));
    chai.assert.isFalse(handleMessageStub.called);
    chai.assert.isFalse(res.status.called);
    chai.assert.isFalse(res.send.called);
  });

  mocha.it('Test receive message with no message', async () => {
    const req = {
      body: {
        object: 'page',
        entry: [
          {
            messaging: [
              {
                message: '',
              },
            ],
          },
        ],
      },
    };
    await rewiredLumiController.message(req, res);
    chai.assert.isFalse(res.sendStatus.called);
    chai.assert.isFalse(handleMessageStub.called);
    chai.assert.isTrue(res.status.calledOnceWithExactly(200));
    chai.assert.isTrue(res.send.calledOnceWithExactly('EVENT_RECEIVED'));
  });
});
