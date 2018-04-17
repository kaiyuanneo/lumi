import * as firebase from 'firebase';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import sinon from 'sinon';

import App from '../App';
import AuthComponent from '../components/AuthComponent';
import BootstrapStyleComponent from '../components/BootstrapStyleComponent';
import SummaryBasicInfoComponent from '../components/SummaryBasicInfoComponent';
import SummaryCareInfoComponent from '../components/SummaryCareInfoComponent';
import SummaryComponent from '../components/SummaryComponent';
import SummaryEditWrapperComponent from '../components/SummaryEditWrapperComponent';
import SummaryMedicalInfoComponent from '../components/SummaryMedicalInfoComponent';
import SummaryNewMemberComponent from '../components/SummaryNewMemberComponent';
import SummaryNewMemberFormFieldComponent from '../components/SummaryNewMemberFormFieldComponent';
import SummarySelectCareRecipientComponent from '../components/SummarySelectCareRecipientComponent';
import GroupCreateComponent from '../components/GroupCreateComponent';
import GroupJoinComponent from '../components/GroupJoinComponent';
import HomeComponent from '../components/HomeComponent';
import NavBottomComponent from '../components/NavBottomComponent';
import NavTopComponent from '../components/NavTopComponent';
import NewUserComponent from '../components/NewUserComponent';
import RootComponent from '../components/RootComponent';
import TimelineComponent from '../components/TimelineComponent';


describe('App', () => {
  let authStub;
  beforeAll(() => {
    authStub = sinon.stub(firebase, 'auth').returns({
      onAuthStateChanged: sinon.stub(),
    });
  });

  afterAll(() => {
    authStub.restore();
  });

  it('App renders', () => {
    const component = TestRenderer.create(<App />).toTree();
    expect(component).toBeTruthy();
  });
});


it('AuthComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <AuthComponent
      firebaseAuth={() => {}}
      uiConfig={{}}
    />
  ));
  expect(component).toMatchSnapshot();
});


it('BootstrapStyleComponent', () => {
  const component = TestRenderer.create(<BootstrapStyleComponent />).toJSON();
  expect(component).toMatchSnapshot();
});


it('SummaryBasicInfoComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<SummaryBasicInfoComponent />);
  expect(component).toMatchSnapshot();
});


it('SummaryCareInfoComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<SummaryCareInfoComponent />);
  expect(component).toMatchSnapshot();
});


it('SummaryComponent', () => {
  const component = TestRenderer.create((
    <SummaryComponent
      contentComponent={<div />}
      fetched={false}
      firstName=""
      lastName=""
      getCareRecipient={() => {}}
      infoCategory=""
      profilePic=""
      saveSummaryInfoCategory={() => {}}
      uid=""
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('SummaryEditWrapperComponent', () => {
  const component = TestRenderer.create((
    <SummaryEditWrapperComponent
      cancelEdits={() => {}}
      displayFieldValue=""
      enterEditMode={() => {}}
      formField={<div />}
      isInEditMode={false}
      saveButtonDisabled={false}
      saveFieldValueToDb={() => {}}
      title=""
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('SummaryMedicalInfoComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<SummaryMedicalInfoComponent />);
  expect(component).toMatchSnapshot();
});


it('SummaryNewMemberComponent', () => {
  const component = TestRenderer.create((
    <SummaryNewMemberComponent
      firstNameFormField={<div />}
      lastNameFormField={<div />}
      birthdayFormField={<div />}
      genderFormField={<div />}
      emailFormField={<div />}
      addressFormField={<div />}
      typeOfDementiaFormField={<div />}
      dateOfDiagnosisFormField={<div />}
      medicationsFormField={<div />}
      providersFormField={<div />}
      needsAndPreferencesFormField={<div />}
      thingsThatDelightFormField={<div />}
      placesOfInterestFormField={<div />}
      isSaveButtonDisabled={false}
      saveNewMember={() => {}}
      unmountFunc={() => {}}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('SummaryNewMemberFormFieldComponent', () => {
  const component = TestRenderer.create((
    <SummaryNewMemberFormFieldComponent
      fieldTitle=""
      formField={<div />}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('SummarySelectCareRecipientComponent', () => {
  const component = TestRenderer.create((
    <SummarySelectCareRecipientComponent
      fetchGroupMembers={() => {}}
      memberList={[]}
      selectedMember=""
      shouldRenderNewMemberForm={false}
      isSelectButtonDisabled={false}
      updateSelectedMember={() => {}}
      handleClickSelect={() => {}}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('GroupCreateComponent', () => {
  const component = TestRenderer.create((
    <GroupCreateComponent
      groupNameFieldValue=""
      isCreateButtonDisabled={false}
      createGroup={() => {}}
      handleChange={() => {}}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('GroupJoinComponent', () => {
  const component = TestRenderer.create((
    <GroupJoinComponent
      groupIdFieldValue=""
      isJoinButtonDisabled={false}
      joinGroup={() => {}}
      handleChange={() => {}}
      handle
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('HomeComponent', () => {
  const component = TestRenderer.create((
    <HomeComponent
      getIsAuthUserInGroup={() => {}}
      shouldComponentRender={false}
      productComponent={<div />}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('NavBottomComponent', () => {
  const component = TestRenderer.create((
    <NavBottomComponent
      activeKey=""
      switchProduct={() => {}}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('NavTopComponent', () => {
  const component = TestRenderer.create((
    <NavTopComponent
      getGroupInfo={() => {}}
      signOut={() => {}}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('NewUserComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <NewUserComponent
      firstName=""
      getUserFirstName={() => {}}
    />
  ));
  expect(component).toMatchSnapshot();
});


it('RootComponent', () => {
  const component = TestRenderer.create((
    <RootComponent
      getIsSignedIn={() => {}}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('TimelineComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <TimelineComponent
      filterMessages={() => {}}
      getCategoryName={() => {}}
      getLocalDateString={() => {}}
      shouldRenderMessage={() => {}}
      sortedMessages={new Map()}
      syncMessages={() => {}}
    />
  ));
  expect(component).toMatchSnapshot();
});
