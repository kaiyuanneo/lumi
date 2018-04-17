import chai from 'chai';
import * as firebase from 'firebase';
import React from 'react';
import sinon from 'sinon';

import * as SummarySelectCareRecipientContainer from '../containers/SummarySelectCareRecipientContainer';
import * as constants from '../static/constants';


describe('Get member list', () => {
  it('Get success', async () => {
    const stubSelectCrMembers = new Map();
    const stubMemberId = 'TEST_MEMBER_ID';
    const stubMemberName = 'TEST_MEMBER_NAME';
    stubSelectCrMembers.set(stubMemberId, stubMemberName);
    const stubState = { summary: { selectCrMembers: stubSelectCrMembers } };
    const expectedMemberList = [
      (
        <option
          key={constants.SUMMARY_CODE_UNSPECIFIED}
          value={constants.SUMMARY_CODE_UNSPECIFIED}
        >
          {constants.SUMMARY_NAME_UNSPECIFIED}
        </option>
      ),
      (
        <option
          key={stubMemberId}
          value={stubMemberId}
        >
          {stubMemberName}
        </option>
      ),
      (
        <option
          key={constants.SUMMARY_CR_CODE_NEW_MEMBER}
          value={constants.SUMMARY_CR_CODE_NEW_MEMBER}
        >
          {constants.SUMMARY_CR_NAME_NEW_MEMBER}
        </option>
      ),

    ];
    const memberList = SummarySelectCareRecipientContainer._getMemberList(stubState);
    chai.assert.deepEqual(memberList, expectedMemberList);
  });
});


describe('Fetch group members', () => {
  it('Fetch success', async () => {
    const stubAuthUid = 'AUTH_UID';
    const stubActiveGroup = 'TEST_GROUP';
    const stubMemberId = 'TEST_MEMBER_ID';
    const stubMember = {
      firstName: 'TEST_FIRST_NAME',
      lastName: 'TEST_LAST_NAME',
    };

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
    const memberIdsRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}/members`;
    const memberRefParam = `${constants.DB_PATH_USERS}/${stubMemberId}`;

    const activeGroupValStub = sinon.stub().returns(stubActiveGroup);
    const activeGroupOnceStub = sinon.stub().resolves({ val: activeGroupValStub });
    const memberIdsOnceStub = sinon.stub().resolves([{ key: stubMemberId }]);
    const memberValStub = sinon.stub().returns(stubMember);
    const memberOnceStub = sinon.stub().resolves({ val: memberValStub });
    const refStub = sinon.stub();
    refStub.withArgs(activeGroupRefParam).returns({ once: activeGroupOnceStub });
    refStub.withArgs(memberIdsRefParam).returns({ once: memberIdsOnceStub });
    refStub.withArgs(memberRefParam).returns({ once: memberOnceStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });
    const stubDispatchProps = { updateMembers: sinon.stub() };

    const members =
      await SummarySelectCareRecipientContainer._fetchGroupMembers(stubDispatchProps);
    chai.assert
      .strictEqual(members.get(stubMemberId), `${stubMember.firstName} ${stubMember.lastName}`);
    chai.assert.isTrue(stubDispatchProps.updateMembers.calledOnce);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledThrice);
    chai.assert.isTrue(refStub.calledWithExactly(activeGroupRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(memberIdsRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(memberRefParam));
    chai.assert.isTrue(activeGroupOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(activeGroupValStub.calledOnce);
    chai.assert.isTrue(memberIdsOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(memberOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(memberValStub.calledOnce);

    dbStub.restore();
    authStub.restore();
  });
});


describe('Handle click select', () => {
  it('Selected member is not new member', async () => {
    const stubAuthUid = 'AUTH_UID';
    const stubActiveGroup = 'TEST_GROUP';
    const stubSelectedMember = 'TEST_SELECTED_MEMBER';

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}`;

    const activeGroupValStub = sinon.stub().returns(stubActiveGroup);
    const activeGroupOnceStub = sinon.stub().resolves({ val: activeGroupValStub });
    const groupUpdateStub = sinon.stub().resolves({ val: activeGroupValStub });

    const refStub = sinon.stub();
    refStub.withArgs(activeGroupRefParam).returns({ once: activeGroupOnceStub });
    refStub.withArgs(groupRefParam).returns({ update: groupUpdateStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });

    const stubStateProps = { selectedMember: stubSelectedMember };
    const stubDispatchProps = { toggleUserClickedSelect: sinon.stub() };

    await SummarySelectCareRecipientContainer
      ._handleClickSelect(stubStateProps, stubDispatchProps);
    chai.assert.isTrue(stubDispatchProps.toggleUserClickedSelect.calledOnce);
    chai.assert.isTrue(dbStub.calledOnce);
    chai.assert.isTrue(authStub.calledOnce);
    chai.assert.isTrue(refStub.calledTwice);
    chai.assert.isTrue(refStub.calledWithExactly(activeGroupRefParam));
    chai.assert.isTrue(refStub.calledWithExactly(groupRefParam));
    chai.assert.isTrue(activeGroupOnceStub.calledOnceWithExactly(constants.DB_EVENT_NAME_VALUE));
    chai.assert.isTrue(activeGroupValStub.calledOnce);
    chai.assert.isTrue(groupUpdateStub.calledOnceWithExactly({
      activeCareRecipient: stubStateProps.selectedMember,
    }));

    dbStub.restore();
    authStub.restore();
  });

  it('Selected member is new member', async () => {
    const stubAuthUid = 'AUTH_UID';
    const stubActiveGroup = 'TEST_GROUP';
    const stubSelectedMember = constants.SUMMARY_CR_CODE_NEW_MEMBER;

    const activeGroupRefParam = `${constants.DB_PATH_USERS}/${stubAuthUid}/activeGroup`;
    const groupRefParam = `${constants.DB_PATH_LUMI_GROUPS}/${stubActiveGroup}`;

    const activeGroupValStub = sinon.stub().returns(stubActiveGroup);
    const activeGroupOnceStub = sinon.stub().resolves({ val: activeGroupValStub });
    const groupUpdateStub = sinon.stub().resolves({ val: activeGroupValStub });

    const refStub = sinon.stub();
    refStub.withArgs(activeGroupRefParam).returns({ once: activeGroupOnceStub });
    refStub.withArgs(groupRefParam).returns({ update: groupUpdateStub });
    const dbStub = sinon.stub(firebase, 'database').returns({ ref: refStub });
    const authStub = sinon.stub(firebase, 'auth').returns({ currentUser: { uid: stubAuthUid } });

    const stubStateProps = { selectedMember: stubSelectedMember };
    const stubDispatchProps = { toggleUserClickedSelect: sinon.stub() };

    await SummarySelectCareRecipientContainer
      ._handleClickSelect(stubStateProps, stubDispatchProps);
    chai.assert.isTrue(stubDispatchProps.toggleUserClickedSelect.calledOnce);
    chai.assert.isFalse(dbStub.called);
    chai.assert.isFalse(authStub.called);
    chai.assert.isFalse(refStub.called);
    chai.assert.isFalse(activeGroupOnceStub.called);
    chai.assert.isFalse(activeGroupValStub.called);
    chai.assert.isFalse(groupUpdateStub.called);

    dbStub.restore();
    authStub.restore();
  });
});
