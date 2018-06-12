import chai from 'chai';
import mocha from 'mocha';
import sinon from 'sinon';

import * as constants from '../lib/static/constants';
import * as utils from '../lib/utils';


mocha.describe('Response code to messenger category code tests', () => {
  mocha.it('Activity category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_ACTIVITY;
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, constants.MESSAGE_CATEGORY_CODE_ACTIVITY);
  });
  mocha.it('Behaviour category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR;
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, constants.MESSAGE_CATEGORY_CODE_BEHAVIOUR);
  });
  mocha.it('Mood category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MOOD;
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, constants.MESSAGE_CATEGORY_CODE_MOOD);
  });
  mocha.it('Memory category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MEMORY;
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, constants.MESSAGE_CATEGORY_CODE_MEMORY);
  });
  mocha.it('Medical category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MEDICAL;
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, constants.MESSAGE_CATEGORY_CODE_MEDICAL);
  });
  mocha.it('Caregiver category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_CAREGIVER;
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, constants.MESSAGE_CATEGORY_CODE_CAREGIVER);
  });
  mocha.it('Other category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_OTHER;
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, constants.MESSAGE_CATEGORY_CODE_OTHER);
  });
  mocha.it('Invalid category', () => {
    const responseCode = 'INVALID_CODE';
    const messageCategoryCode = utils.responseCodeToMessageCategoryCode(responseCode);
    chai.assert.strictEqual(messageCategoryCode, 'NA');
  });
});


mocha.describe('Response code to quick reply title tests', () => {
  mocha.it('Attach image yes', () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_IMAGE_YES;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_YES);
  });
  mocha.it('Attach text yes', () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_TEXT_YES;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_YES);
  });
  mocha.it('Attach image no', () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_IMAGE_NO;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_NO);
  });
  mocha.it('Attach text no', () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_TEXT_NO;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_NO);
  });
  mocha.it('Star yes', () => {
    const responseCode = constants.RESPONSE_CODE_STAR_YES;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_YES);
  });
  mocha.it('Star no', () => {
    const responseCode = constants.RESPONSE_CODE_STAR_NO;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_NO);
  });
  mocha.it('Activity category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_ACTIVITY;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_CATEGORY_ACTIVITY);
  });
  mocha.it('Behaviour category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_CATEGORY_BEHAVIOUR);
  });
  mocha.it('Mood category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MOOD;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_CATEGORY_MOOD);
  });
  mocha.it('Memory category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MEMORY;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_CATEGORY_MEMORY);
  });
  mocha.it('Medical category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MEDICAL;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_CATEGORY_MEDICAL);
  });
  mocha.it('Caregiver category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_CAREGIVER;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_CATEGORY_CAREGIVER);
  });
  mocha.it('Other category', () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_OTHER;
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, constants.QUICK_REPLY_TITLE_CATEGORY_OTHER);
  });
  mocha.it('Invalid response code', () => {
    const responseCode = 'INVALID_CODE';
    const quickReplyTitle = utils.responseCodeToQuickReplyTitle(responseCode);
    chai.assert.strictEqual(quickReplyTitle, 'NA');
  });
});


mocha.describe('Response code to response message tests', () => {
  const quickReplyTitle = 'QUICK_REPLY_TITLE';
  const userFirstName = 'USER_FIRST_NAME';
  const expectedResponseMessageCategory = (
    `${constants.RESPONSE_MESSAGE_CATEGORY_1}${quickReplyTitle}` +
    `${constants.RESPONSE_MESSAGE_CATEGORY_2}`
  );
  let responseCodeToQuickReplyTitleStub;
  let getUserFirstNameStub;
  mocha.beforeEach(() => {
    responseCodeToQuickReplyTitleStub =
      sinon.stub(utils, 'responseCodeToQuickReplyTitle').returns(quickReplyTitle);
    getUserFirstNameStub = sinon.stub(utils, 'getUserFirstName').resolves(userFirstName);
  });
  mocha.afterEach(() => {
    // Revert changes to affected modules
    responseCodeToQuickReplyTitleStub.restore();
    getUserFirstNameStub.restore();
  });

  mocha.it('New message multiple groups', async () => {
    const responseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, null, ['GROUP']);
    chai.assert
      .strictEqual(responseMessage, constants.RESPONSE_MESSAGE_NEW_MESSAGE_MULTIPLE_GROUPS);
  });
  mocha.it('Activity category', async () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_ACTIVITY;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode);
    chai.assert.strictEqual(responseMessage, expectedResponseMessageCategory);
  });
  mocha.it('Behaviour category', async () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_BEHAVIOUR;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode);
    chai.assert.strictEqual(responseMessage, expectedResponseMessageCategory);
  });
  mocha.it('Mood category', async () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MOOD;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode);
    chai.assert.strictEqual(responseMessage, expectedResponseMessageCategory);
  });
  mocha.it('Memory category', async () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MEMORY;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode);
    chai.assert.strictEqual(responseMessage, expectedResponseMessageCategory);
  });
  mocha.it('Medical category', async () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_MEDICAL;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode);
    chai.assert.strictEqual(responseMessage, expectedResponseMessageCategory);
  });
  mocha.it('Caregiver category', async () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_CAREGIVER;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode);
    chai.assert.strictEqual(responseMessage, expectedResponseMessageCategory);
  });
  mocha.it('Other category', async () => {
    const responseCode = constants.RESPONSE_CODE_CATEGORY_OTHER;
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode);
    chai.assert.strictEqual(responseMessage, expectedResponseMessageCategory);
  });
  mocha.it('Chose group, original message text', async () => {
    const responseCode = constants.RESPONSE_CODE_CHOSE_GROUP;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage =
      await utils.responseCodeToResponseMessage(responseCode, webhookEvent, null, true);
    chai.assert
      .strictEqual(responseMessage, constants.RESPONSE_MESSAGE_NEW_MESSAGE_TEXT(userFirstName));
  });
  mocha.it('Chose group, original message image', async () => {
    const responseCode = constants.RESPONSE_CODE_CHOSE_GROUP;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage =
      await utils.responseCodeToResponseMessage(responseCode, webhookEvent, null, false);
    chai.assert
      .strictEqual(responseMessage, constants.RESPONSE_MESSAGE_NEW_MESSAGE_IMAGE(userFirstName));
  });
  mocha.it('New message text', async () => {
    const responseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
    const text = 'TEXT';
    const webhookEvent = {
      message: { text },
      sender: { id: 'ID' },
    };
    const expectedResponseMessage = constants.RESPONSE_MESSAGE_NEW_MESSAGE_TEXT(userFirstName);
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, expectedResponseMessage);
  });
  mocha.it('New message image', async () => {
    const responseCode = constants.RESPONSE_CODE_NEW_MESSAGE;
    const webhookEvent = {
      message: {},
      sender: { id: 'ID' },
    };
    const expectedResponseMessage = constants.RESPONSE_MESSAGE_NEW_MESSAGE_IMAGE(userFirstName);
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, expectedResponseMessage);
  });
  mocha.it('Attach image yes', async () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_IMAGE_YES;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_ATTACH_IMAGE_YES);
  });
  mocha.it('Attach text yes', async () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_TEXT_YES;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_ATTACH_TEXT_YES);
  });
  mocha.it('Attach image no', async () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_IMAGE_NO;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_ATTACH_NO);
  });
  mocha.it('Attach text no', async () => {
    const responseCode = constants.RESPONSE_CODE_ATTACH_TEXT_NO;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_ATTACH_NO);
  });
  mocha.it('Attached image', async () => {
    const responseCode = constants.RESPONSE_CODE_ATTACHED_IMAGE;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_ATTACHED_IMAGE);
  });
  mocha.it('Attached text', async () => {
    const responseCode = constants.RESPONSE_CODE_ATTACHED_TEXT;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_ATTACHED_TEXT);
  });
  mocha.it('Starred yes', async () => {
    const responseCode = constants.RESPONSE_CODE_STAR_YES;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_STARRED_YES);
  });
  mocha.it('Starred no', async () => {
    const responseCode = constants.RESPONSE_CODE_STAR_NO;
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.RESPONSE_MESSAGE_STARRED_NO);
  });
  mocha.it('Invalid response code', async () => {
    const responseCode = 'INVALID_CODE';
    const webhookEvent = { sender: { id: 'ID' } };
    const responseMessage = await utils.responseCodeToResponseMessage(responseCode, webhookEvent);
    chai.assert.strictEqual(responseMessage, constants.DEFAULT_ERROR_MESSAGE);
  });
});
