import chai from 'chai';
import * as firebase from 'firebase';
import sinon from 'sinon';
import hash from 'string-hash';

import * as SummaryEditWrapperContainer from '../containers/SummaryEditWrapperContainer';
import * as constants from '../static/constants';
import * as utils from '../utils';


describe('Get display field value', () => {
  it('No modifications to form field value', () => {
    const stubFieldValue = 'TEST_FIELD_VALUE';
    const stubStateProps = { formFieldValue: stubFieldValue };
    const stubOwnProps = { fieldId: '' };
    const displayFieldValue =
      SummaryEditWrapperContainer._getDisplayFieldValue(stubStateProps, stubOwnProps);
    const expectedDisplayFieldValue = stubFieldValue;
    chai.assert.strictEqual(displayFieldValue, expectedDisplayFieldValue);
  });

  it('No display field value', () => {
    const stubStateProps = { formFieldValue: '' };
    const stubOwnProps = { fieldId: '' };
    const displayFieldValue =
      SummaryEditWrapperContainer._getDisplayFieldValue(stubStateProps, stubOwnProps);
    const expectedDisplayFieldValue = 'Unspecified';
    chai.assert.strictEqual(displayFieldValue, expectedDisplayFieldValue);
  });

  it('Gender field', () => {
    const stubFormFieldValue = 'TEST_FORM_FIELD_VALUE';
    const stubDisplayFieldValue = 'TEST_DISPLAY_FIELD_VALUE';
    const stubStateProps = { formFieldValue: stubFormFieldValue };
    const stubOwnProps = { fieldId: constants.SUMMARY_FIELD_ID_GENDER };
    const utilsStub = sinon.stub(utils, 'genderCodeToName').returns(stubDisplayFieldValue);
    const displayFieldValue =
      SummaryEditWrapperContainer._getDisplayFieldValue(stubStateProps, stubOwnProps);
    const expectedDisplayFieldValue = stubDisplayFieldValue;
    chai.assert.strictEqual(displayFieldValue, expectedDisplayFieldValue);
    utilsStub.restore();
  });

  it('Type of dementia field', () => {
    const stubFormFieldValue = 'TEST_FORM_FIELD_VALUE';
    const stubDisplayFieldValue = 'TEST_DISPLAY_FIELD_VALUE';
    const stubStateProps = { formFieldValue: stubFormFieldValue };
    const stubOwnProps = { fieldId: constants.SUMMARY_FIELD_ID_TYPE_OF_DEMENTIA };
    const utilsStub = sinon.stub(utils, 'dementiaCodeToName').returns(stubDisplayFieldValue);
    const displayFieldValue =
      SummaryEditWrapperContainer._getDisplayFieldValue(stubStateProps, stubOwnProps);
    const expectedDisplayFieldValue = stubDisplayFieldValue;
    chai.assert.strictEqual(displayFieldValue, expectedDisplayFieldValue);
    utilsStub.restore();
  });
});

describe('Get misc props', () => {
  it('Date field', () => {
    const stubFormFieldValue = 'TEST_FORM_FIELD_VALUE';
    const stubStateProps = { formFieldValue: stubFormFieldValue };
    const stubDispatchProps = { saveFieldValueLocally: sinon.stub() };
    const stubOwnProps = {
      isDateField: true,
      fieldId: 'TEST_FIELD_ID',
    };
    const stubFormFieldValueIso = 'TEST_FORM_FIELD_VALUE_ISO';
    const utilsStub = sinon.stub(utils, 'usToIsoDate').returns(stubFormFieldValueIso);
    const miscProps =
      SummaryEditWrapperContainer._getMiscProps(stubStateProps, stubDispatchProps, stubOwnProps);
    const expectedMiscProps = {
      formFieldValue: stubFormFieldValueIso,
      saveButtonDisabled: false,
    };
    chai.assert.strictEqual(miscProps.formFieldValue, expectedMiscProps.formFieldValue);
    // Unable to test function equality, use substring as proxy
    chai.assert.isTrue(miscProps.onChangeFunc.toString().includes('(value, formattedValue)'));
    chai.assert.isFalse(miscProps.onChangeFunc.toString().includes('e.target.value'));
    chai.assert.strictEqual(miscProps.saveButtonDisabled, expectedMiscProps.saveButtonDisabled);
    chai.assert.isTrue(utilsStub.calledOnceWithExactly(stubFormFieldValue));
    utilsStub.restore();
  });

  it('Email field invalid email', () => {
    const stubFormFieldValue = 'TEST_FORM_FIELD_VALUE';
    const stubStateProps = { formFieldValue: stubFormFieldValue };
    const stubDispatchProps = { saveFieldValueLocally: sinon.stub() };
    const stubOwnProps = {
      isDateField: false,
      fieldId: constants.SUMMARY_FIELD_ID_EMAIL,
    };
    const stubFormFieldValueIso = 'TEST_FORM_FIELD_VALUE_ISO';
    const utilsStub = sinon.stub(utils, 'usToIsoDate').returns(stubFormFieldValueIso);
    const miscProps =
      SummaryEditWrapperContainer._getMiscProps(stubStateProps, stubDispatchProps, stubOwnProps);
    const expectedMiscProps = {
      formFieldValue: stubFormFieldValue,
      saveButtonDisabled: true,
    };
    chai.assert.strictEqual(miscProps.formFieldValue, expectedMiscProps.formFieldValue);
    // Unable to test function equality, use substring as proxy
    chai.assert.isFalse(miscProps.onChangeFunc.toString().includes('(value, formattedValue)'));
    chai.assert.isTrue(miscProps.onChangeFunc.toString().includes('e.target.value'));
    chai.assert.strictEqual(miscProps.saveButtonDisabled, expectedMiscProps.saveButtonDisabled);
    chai.assert.isFalse(utilsStub.called);
    utilsStub.restore();
  });

  it('Neither date nor email field', () => {
    const stubFormFieldValue = 'TEST_FORM_FIELD_VALUE';
    const stubStateProps = { formFieldValue: stubFormFieldValue };
    const stubDispatchProps = { saveFieldValueLocally: sinon.stub() };
    const stubOwnProps = {
      isDateField: false,
      fieldId: 'TEST_FIELD_ID',
    };
    const stubFormFieldValueIso = 'TEST_FORM_FIELD_VALUE_ISO';
    const utilsStub = sinon.stub(utils, 'usToIsoDate').returns(stubFormFieldValueIso);
    const miscProps =
      SummaryEditWrapperContainer._getMiscProps(stubStateProps, stubDispatchProps, stubOwnProps);
    const expectedMiscProps = {
      formFieldValue: stubFormFieldValue,
      saveButtonDisabled: false,
    };
    chai.assert.strictEqual(miscProps.formFieldValue, expectedMiscProps.formFieldValue);
    // Unable to test function equality, use substring as proxy
    chai.assert.isFalse(miscProps.onChangeFunc.toString().includes('(value, formattedValue)'));
    chai.assert.isTrue(miscProps.onChangeFunc.toString().includes('e.target.value'));
    chai.assert.strictEqual(miscProps.saveButtonDisabled, expectedMiscProps.saveButtonDisabled);
    chai.assert.isFalse(utilsStub.called);
    utilsStub.restore();
  });
});

describe('Save field value to DB', () => {
  it('Save success email field', async () => {
    const stubAuthUid = 'AUTH_UID';
    const stubCareRecipientUid = 'CR_UID';
    const stubActiveGroup = 'TEST_GROUP';

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
    const careRecipientUidRefParam =
      `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}/activeCareRecipient`;
    const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;
    const userEmailToUidRefParam = constants.DB_PATH_USER_EMAIL_TO_UID;

    const activeGroupValStub = sinon.stub().returns(stubActiveGroup);
    const activeGroupOnceStub = sinon.stub().resolves({ val: activeGroupValStub });

    const careRecipientUidValStub = sinon.stub().returns(stubCareRecipientUid);
    const careRecipientUidOnceStub = sinon.stub().resolves({ val: careRecipientUidValStub });

    const careRecipientUpdateStub = sinon.stub();
    const userEmailToUidUpdateStub = sinon.stub();

    const refStub = sinon.stub();
    refStub.withArgs(activeGroupRefParam).returns({ once: activeGroupOnceStub });
    refStub.withArgs(careRecipientUidRefParam).returns({ once: careRecipientUidOnceStub });
    refStub.withArgs(careRecipientRefParam).returns({ update: careRecipientUpdateStub });
    refStub.withArgs(userEmailToUidRefParam).returns({ update: userEmailToUidUpdateStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });

    const stubDbFieldValue = 'TEST_DB_FIELD_VALUE';
    const stubFormFieldValue = 'TEST_FORM_FIELD_VALUE';
    const stubStateProps = {
      dbFieldValue: stubDbFieldValue,
      formFieldValue: stubFormFieldValue,
    };
    const saveFieldIsInEditModeStub = sinon.stub();
    const stubDispatchProps = { saveFieldIsInEditMode: saveFieldIsInEditModeStub };
    const stubOwnProps = { fieldId: constants.SUMMARY_FIELD_ID_EMAIL };

    await SummaryEditWrapperContainer
      ._saveFieldValueToDb(stubStateProps, stubDispatchProps, stubOwnProps, stubFormFieldValue);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.strictEqual(refStub.callCount, 4);
    chai.assert.isTrue(refStub.calledWithExactly(activeGroupRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(careRecipientUidRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(careRecipientRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(userEmailToUidRefParam));
    chai.assert.isTrue(activeGroupOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(activeGroupValStub.calledOnce);
    chai.assert
      .isTrue(careRecipientUidOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(careRecipientUidValStub.calledOnce);
    chai.assert.isTrue(careRecipientUpdateStub.calledOnceWithExactly({
      [stubOwnProps.fieldId]: stubStateProps.formFieldValue,
    }));
    chai.assert.isTrue(userEmailToUidUpdateStub.calledOnceWithExactly({
      [hash(stubStateProps.dbFieldValue)]: null,
      [hash(stubFormFieldValue)]: stubCareRecipientUid,
    }));
    chai.assert.isTrue(saveFieldIsInEditModeStub.calledOnceWithExactly(false));

    dbStub.restore();
    authStub.restore();
  });

  it('Save success non-email field', async () => {
    const stubAuthUid = 'AUTH_UID';
    const stubCareRecipientUid = 'CR_UID';
    const stubActiveGroup = 'TEST_GROUP';

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
    const careRecipientUidRefParam =
      `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}/activeCareRecipient`;
    const careRecipientRefParam = `${constants.DB_PATH_USERS}/${stubCareRecipientUid}`;
    const userEmailToUidRefParam = constants.DB_PATH_USER_EMAIL_TO_UID;

    const activeGroupValStub = sinon.stub().returns(stubActiveGroup);
    const activeGroupOnceStub = sinon.stub().resolves({ val: activeGroupValStub });

    const careRecipientUidValStub = sinon.stub().returns(stubCareRecipientUid);
    const careRecipientUidOnceStub = sinon.stub().resolves({ val: careRecipientUidValStub });

    const careRecipientUpdateStub = sinon.stub();
    const userEmailToUidUpdateStub = sinon.stub();

    const refStub = sinon.stub();
    refStub.withArgs(activeGroupRefParam).returns({ once: activeGroupOnceStub });
    refStub.withArgs(careRecipientUidRefParam).returns({ once: careRecipientUidOnceStub });
    refStub.withArgs(careRecipientRefParam).returns({ update: careRecipientUpdateStub });
    refStub.withArgs(userEmailToUidRefParam).returns({ update: userEmailToUidUpdateStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });

    const stubDbFieldValue = 'TEST_DB_FIELD_VALUE';
    const stubFormFieldValue = 'TEST_FORM_FIELD_VALUE';
    const stubStateProps = {
      dbFieldValue: stubDbFieldValue,
      formFieldValue: stubFormFieldValue,
    };
    const saveFieldIsInEditModeStub = sinon.stub();
    const stubDispatchProps = { saveFieldIsInEditMode: saveFieldIsInEditModeStub };
    const stubOwnProps = { fieldId: 'TEST_FIELD_ID' };

    await SummaryEditWrapperContainer
      ._saveFieldValueToDb(stubStateProps, stubDispatchProps, stubOwnProps, stubFormFieldValue);

    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledThrice);
    chai.assert.isTrue(refStub.calledWithExactly(activeGroupRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(careRecipientUidRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(careRecipientRefParam));
    chai.assert.isFalse(refStub.calledWithExactly(userEmailToUidRefParam));
    chai.assert.isTrue(activeGroupOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(activeGroupValStub.calledOnce);
    chai.assert
      .isTrue(careRecipientUidOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(careRecipientUidValStub.calledOnce);
    chai.assert.isTrue(careRecipientUpdateStub.calledOnceWithExactly({
      [stubOwnProps.fieldId]: stubStateProps.formFieldValue,
    }));
    chai.assert.isFalse(userEmailToUidUpdateStub.called);
    chai.assert.isTrue(saveFieldIsInEditModeStub.calledOnceWithExactly(false));

    dbStub.restore();
    authStub.restore();
  });
});
