import chai from 'chai';
import { EventEmitter } from 'events';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import mocha from 'mocha';
import nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import rewire from 'rewire';
import sinon from 'sinon';

import * as constants from '../lib/static/constants';

// NB: We cannot stub private functions of controllers in integration tests, because
// the controller modules are imported by the Express applications directly and not executed
// in the context of this test file.


mocha.describe('Webhook integration tests', () => {
  const testToken = 'TEST_TOKEN';
  let adminInitStub;
  let adminCredentialCertStub;
  let configStub;
  let cloudFunctions;
  mocha.before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp');
    adminCredentialCertStub = sinon.stub(admin.credential, 'cert');
    configStub = sinon.stub(functions, 'config').returns({
      // Needed to initialise firebase admin module
      databaseURL: 'DATABASE_URL',
      storageBucket: 'STORAGE_BUCKET',
      // Parameters for verify
      lumi: {
        env: constants.ENV_TEST,
        service_account_private_key: 'TEST_PRIVATE_KEY',
        token_verify: testToken,
        token_app_access: 'TOKEN_APP_ACCESS',
        token_app_access_staging: 'TOKEN_APP_ACCESS_STAGING',
      },
      pwfn: {
        token: testToken,
      },
    });

    // Need to use require syntax to import after stubbing
    // Disable ESLint's require rule so we can load the app module synchronously post-stub
    cloudFunctions = rewire('../lib/app'); // eslint-disable-line global-require
  });
  mocha.after(() => {
    adminInitStub.restore();
    adminCredentialCertStub.restore();
    configStub.restore();
    // Stop Express server so that test can exit. This is exposed as a private function
    // only accessible in local tests.
    cloudFunctions.__get__('stop')();
  });

  mocha.describe('Lumi tests', () => {
    /**
     * Test that Messenger can verify authenticity of Lumi's webhook
     */
    mocha.describe('Verify tests', () => {
      mocha.it('Verify success', () => {
        const challenge = 'TEST_CHALLENGE';
        const req = httpMocks.createRequest({
          method: 'GET',
          url: `${constants.ROUTE_LUMI}${constants.ROUTE_LUMI_ROOT}`,
          query: {
            'hub.mode': 'subscribe',
            'hub.verify_token': testToken,
            'hub.challenge': challenge,
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 200);
        chai.assert.strictEqual(res._getData(), challenge);
      });

      mocha.it('Verify failure', () => {
        const challenge = 'TEST_CHALLENGE';
        const req = httpMocks.createRequest({
          method: 'GET',
          url: `${constants.ROUTE_LUMI}${constants.ROUTE_LUMI_ROOT}`,
          query: {
            'hub.mode': 'INVALID_MODE',
            'hub.verify_token': testToken,
            'hub.challenge': challenge,
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 403);
      });
    });

    /**
     * Test that messages sent by Messenger are received properly by Lumi's webhook
     */
    mocha.describe('Message tests', () => {
      mocha.it('Message success', (done) => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_LUMI}${constants.ROUTE_LUMI_ROOT}`,
          body: {
            object: 'page',
            entry: [
              {
                messaging: [
                  {
                    // Do not send message to avoid invoking Firebase services that need mocking
                    message: '',
                  },
                ],
              },
            ],
          },
        });
        const res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        res.on('send', () => {
          // If we don't include the try catch, assert failures cause unhandle promise rejections
          try {
            chai.assert.strictEqual(res.statusCode, 200);
            chai.assert.strictEqual(res._getData(), 'EVENT_RECEIVED');
            done();
          } catch (e) {
            done(new Error(e));
          }
        });
        cloudFunctions.webhook(req, res);
      });

      mocha.it('Message failure non-page', (done) => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_LUMI}${constants.ROUTE_LUMI_ROOT}`,
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
        });
        const res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        // 'sendStatus' isn't an event we can listen on. It apparently uses 'send' under the hood.
        res.on('send', () => {
          // If we don't include the try catch, assert failures cause unhandle promise rejections.
          try {
            chai.assert.strictEqual(res.statusCode, 404);
            done();
          } catch (e) {
            done(new Error(e));
          }
        });
        cloudFunctions.webhook(req, res);
      });
    });

    /**
     * Test PSID lookup from ASID
     */
    mocha.describe('Get PSID from ASID tests', () => {
      mocha.it('Get PSID from ASID success', (done) => {
        const testAsid = 'TEST_ASID';
        // Stub HTTP request to avoid call to Facebook
        nock(constants.URL_FB_GRAPH_API)
          .get(`/${testAsid}`)
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
        const req = httpMocks.createRequest({
          method: 'GET',
          url: `${constants.ROUTE_LUMI}${constants.ROUTE_LUMI_PSID}`,
          query: {
            asid: testAsid,
          },
        });
        const res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        const expectedData = JSON.stringify({ psid: 'TEST_ID_2' });
        // 'json' isn't an event we can listen on. It apparently uses 'send' under the hood.
        res.on('send', () => {
          // If we don't include the try catch, assert failures cause unhandle promise rejections.
          try {
            chai.assert.strictEqual(res.statusCode, 200);
            chai.assert.strictEqual(res.getHeader('Access-Control-Allow-Origin'), '*');
            chai.assert.isTrue(res._isJSON());
            chai.assert.deepEqual(res._getData(), expectedData);
            done();
          } catch (e) {
            done(new Error(e));
          }
        });
        cloudFunctions.webhook(req, res);
      });

      mocha.it('Get PSID from ASID no PSID', (done) => {
        const testAsid = 'TEST_ASID';
        // Stub HTTP request to avoid call to Facebook
        nock(constants.URL_FB_GRAPH_API)
          .get(`/${testAsid}`)
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
        const req = httpMocks.createRequest({
          method: 'GET',
          url: `${constants.ROUTE_LUMI}${constants.ROUTE_LUMI_PSID}`,
          query: {
            asid: testAsid,
          },
        });
        const res = httpMocks.createResponse({ eventEmitter: EventEmitter });

        const expectedData = JSON.stringify({ psid: '' });
        // 'json' isn't an event we can listen on. It apparently uses 'send' under the hood.
        res.on('send', () => {
          // If we don't include the try catch, assert failures cause unhandle promise rejections.
          try {
            chai.assert.strictEqual(res.statusCode, 200);
            chai.assert.strictEqual(res.getHeader('Access-Control-Allow-Origin'), '*');
            chai.assert.isTrue(res._isJSON());
            chai.assert.deepEqual(res._getData(), expectedData);
            done();
          } catch (e) {
            done(new Error(e));
          }
        });
        cloudFunctions.webhook(req, res);
      });
    });

    mocha.describe('Get permanent image URL tests', () => {
      mocha.it('Get permanent URL success', (done) => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_LUMI}${constants.ROUTE_LUMI_SAVE_IMAGE}`,
          // Do not send URL to avoid invoking Firebase services that need mocking
          body: { tempUrl: '' },
        });
        const res = httpMocks.createResponse({ eventEmitter: EventEmitter });
        const expectedData = JSON.stringify({ permUrl: '' });
        // 'json' isn't an event we can listen on. It apparently uses 'send' under the hood.
        res.on('send', () => {
          // If we don't include the try catch, assert failures cause unhandle promise rejections.
          try {
            chai.assert.strictEqual(res.statusCode, 200);
            chai.assert.strictEqual(res.getHeader('Access-Control-Allow-Origin'), '*');
            chai.assert.isTrue(res._isJSON());
            chai.assert.strictEqual(res._getData(), expectedData);
            done();
          } catch (e) {
            done(new Error(e));
          }
        });
        cloudFunctions.webhook(req, res);
      });
    });
  });

  mocha.describe('PWFN tests', () => {
    mocha.describe('Receive message tests', () => {
      let dbStub;
      let refStub;
      let pushStub;
      mocha.beforeEach(() => {
        pushStub = sinon.stub();
        refStub = sinon.stub().returns({ push: pushStub });
        dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: refStub })));
      });
      mocha.afterEach(() => {
        dbStub.restore();
      });

      mocha.it('Receive message URL verification', () => {
        const challenge = 'CHALLENGE';
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_PWFN}${constants.ROUTE_PWFN_ROOT}`,
          body: {
            challenge,
            event: {
              attachments: [
                {
                  fallback: '',
                },
              ],
              channel: '',
              type: '',
            },
            event_time: '',
            token: '',
            type: 'url_verification',
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 200);
        chai.assert.strictEqual(res._getData(), challenge);
      });

      mocha.it('Receive message success', () => {
        const challenge = 'CHALLENGE';
        const userId = 'USER_ID';
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_PWFN}${constants.ROUTE_PWFN_ROOT}`,
          body: {
            challenge,
            event: {
              attachments: [
                {
                  fallback: `${constants.URL_PWFN_MEMBER_PREFIX}${userId}|`,
                },
              ],
              channel: constants.SLACK_CHANNEL_ID_PWFN,
              type: 'message',
            },
            event_time: '',
            token: testToken,
            type: 'event_callback',
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 200);
      });

      mocha.it('Receive message Slack-webhook token mismatch', () => {
        const challenge = 'CHALLENGE';
        const userId = 'USER_ID';
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_PWFN}${constants.ROUTE_PWFN_ROOT}`,
          body: {
            challenge,
            event: {
              attachments: [
                {
                  fallback: `${constants.URL_PWFN_MEMBER_PREFIX}${userId}|`,
                },
              ],
              channel: constants.SLACK_CHANNEL_ID_PWFN,
              type: 'message',
            },
            event_time: '',
            token: 'INVALID_TOKEN',
            type: 'event_callback',
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 401);
      });

      mocha.it('Receive message non-relevant channel', () => {
        const challenge = 'CHALLENGE';
        const userId = 'USER_ID';
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_PWFN}${constants.ROUTE_PWFN_ROOT}`,
          body: {
            challenge,
            event: {
              attachments: [
                {
                  fallback: `${constants.URL_PWFN_MEMBER_PREFIX}${userId}|`,
                },
              ],
              channel: 'INVALID_CHANNEL',
              type: 'message',
            },
            event_time: '',
            token: testToken,
            type: 'event_callback',
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 200);
      });

      mocha.it('Receive message non-message event type', () => {
        const challenge = 'CHALLENGE';
        const userId = 'USER_ID';
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_PWFN}${constants.ROUTE_PWFN_ROOT}`,
          body: {
            challenge,
            event: {
              attachments: [
                {
                  fallback: `${constants.URL_PWFN_MEMBER_PREFIX}${userId}|`,
                },
              ],
              channel: constants.SLACK_CHANNEL_ID_PWFN,
              type: 'INVALID_TYPE',
            },
            event_time: '',
            token: testToken,
            type: 'event_callback',
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 404);
      });

      mocha.it('Receive message invalid type', () => {
        const challenge = 'CHALLENGE';
        const userId = 'USER_ID';
        const req = httpMocks.createRequest({
          method: 'POST',
          url: `${constants.ROUTE_PWFN}${constants.ROUTE_PWFN_ROOT}`,
          body: {
            challenge,
            event: {
              attachments: [
                {
                  fallback: `${constants.URL_PWFN_MEMBER_PREFIX}${userId}|`,
                },
              ],
              channel: constants.SLACK_CHANNEL_ID_PWFN,
              type: 'message',
            },
            event_time: '',
            token: testToken,
            type: 'INVALID_TYPE',
          },
        });
        const res = httpMocks.createResponse();
        cloudFunctions.webhook(req, res);
        chai.assert.strictEqual(res.statusCode, 200);
      });
    });
  });
});
