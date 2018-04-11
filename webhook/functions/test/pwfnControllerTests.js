import chai from 'chai';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import mocha from 'mocha';
import sinon from 'sinon';

import * as constants from '../lib/static/constants';
import * as pwfnController from '../lib/controllers/pwfnController';


mocha.describe('Received message unit tests', () => {
  const userId = 'USER_ID';
  const refParam = `${constants.DB_PATH_PWFN_MESSAGES}/${userId}`;
  const token = 'TOKEN';
  let configStub;
  let dbStub;
  let refStub;
  let pushStub;
  let res;
  mocha.beforeEach(() => {
    configStub = sinon.stub(functions, 'config').returns({
      pwfn: {
        token,
      },
    });
    pushStub = sinon.stub();
    refStub = sinon.stub().returns({ push: pushStub });
    dbStub = sinon.stub(admin, 'database').get(() => (() => ({ ref: refStub })));
    res = {
      send: sinon.stub(),
      sendStatus: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };
  });
  mocha.afterEach(() => {
    configStub.restore();
    dbStub.restore();
  });

  mocha.it('Receive message success', () => {
    const req = {
      body: {
        challenge: 'CHALLENGE',
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
        token,
        type: 'event_callback',
      },
    };
    pwfnController.message(req, res);
    chai.assert.isFalse(res.status.called);
    chai.assert.isFalse(res.send.called);
    chai.assert.isTrue(configStub.calledOnce);
    chai.assert.isTrue(refStub.calledOnceWithExactly(refParam));
    chai.assert.isTrue(pushStub.calledOnceWithExactly({
      ...req.body.event.attachments[0],
      timestamp: req.body.event_time,
    }));
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(200));
  });

  mocha.it('Receive message URL verification', () => {
    const req = {
      body: {
        challenge: 'CHALLENGE',
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
        token,
        type: 'url_verification',
      },
    };
    pwfnController.message(req, res);
    chai.assert.isTrue(res.status.calledOnceWithExactly(200));
    chai.assert.isTrue(res.send.calledOnceWithExactly(req.body.challenge));
    chai.assert.isFalse(configStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(pushStub.called);
    chai.assert.isFalse(res.sendStatus.called);
  });

  mocha.it('Receive message Slack-webhook token mismatch', () => {
    const req = {
      body: {
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
    };
    pwfnController.message(req, res);
    chai.assert.isFalse(res.status.called);
    chai.assert.isFalse(res.send.called);
    chai.assert.isTrue(configStub.calledOnce);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(pushStub.called);
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(401));
  });

  mocha.it('Receive message wrong Slack channel', () => {
    const req = {
      body: {
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
        token,
        type: 'event_callback',
      },
    };
    pwfnController.message(req, res);
    chai.assert.isFalse(res.status.called);
    chai.assert.isFalse(res.send.called);
    chai.assert.isTrue(configStub.calledOnce);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(pushStub.called);
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(200));
  });

  mocha.it('Receive message event type not message', () => {
    const req = {
      body: {
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
        token,
        type: 'event_callback',
      },
    };
    pwfnController.message(req, res);
    chai.assert.isFalse(res.status.called);
    chai.assert.isFalse(res.send.called);
    chai.assert.isTrue(configStub.calledOnce);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(pushStub.called);
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(404));
  });

  mocha.it('Receive message no attachments', () => {
    const req = {
      body: {
        event: {},
        event_time: '',
        token,
        type: 'event_callback',
      },
    };
    pwfnController.message(req, res);
    chai.assert.isFalse(res.status.called);
    chai.assert.isFalse(res.send.called);
    chai.assert.isTrue(configStub.calledOnce);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(pushStub.called);
    chai.assert.isTrue(res.sendStatus.calledOnceWithExactly(200));
  });

  mocha.it('Receive message unrecognised request type', () => {
    const req = {
      body: {
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
        token,
        type: 'INVALID_TYPE',
      },
    };
    pwfnController.message(req, res);
    chai.assert.isFalse(res.status.called);
    chai.assert.isFalse(res.send.called);
    chai.assert.isFalse(configStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(pushStub.called);
    chai.assert.isFalse(res.sendStatus.called);
  });
});
