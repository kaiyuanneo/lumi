import * as firebase from 'firebase';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import sinon from 'sinon';

import App from '../App';
import AddGroupComponent from '../components/AddGroupComponent';
import AuthComponent from '../components/AuthComponent';
import BootstrapStyleComponent from '../components/BootstrapStyleComponent';
import CareProfileBasicInfoComponent from '../components/CareProfileBasicInfoComponent';
import CareProfileCareInfoComponent from '../components/CareProfileCareInfoComponent';
import CareProfileComponent from '../components/CareProfileComponent';
import CareProfileEditWrapperComponent from '../components/CareProfileEditWrapperComponent';
import CareProfileMedicalInfoComponent from '../components/CareProfileMedicalInfoComponent';
import CareProfileNewMemberComponent from '../components/CareProfileNewMemberComponent';
import CareProfileNewMemberFormFieldComponent from '../components/CareProfileNewMemberFormFieldComponent';
import CareProfileSelectCareRecipientComponent from '../components/CareProfileSelectCareRecipientComponent';
import GroupCreateComponent from '../components/GroupCreateComponent';
import GroupJoinComponent from '../components/GroupJoinComponent';
import HomeComponent from '../components/HomeComponent';
import NavBottomComponent from '../components/NavBottomComponent';
import NavTopComponent from '../components/NavTopComponent';
import RootComponent from '../components/RootComponent';
import TimelineComponent from '../components/TimelineComponent';
import TimelineStoryHeaderComponent from '../components/TimelineStoryHeaderComponent';
import TimelineStoryContentComponent from '../components/TimelineStoryContentComponent';


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


it('AddGroupComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <AddGroupComponent
      firstName=""
      getUserFirstName={() => {}}
    />
  ));
  expect(component).toMatchSnapshot();
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


it('CareProfileBasicInfoComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<CareProfileBasicInfoComponent />);
  expect(component).toMatchSnapshot();
});


it('CareProfileCareInfoComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<CareProfileCareInfoComponent />);
  expect(component).toMatchSnapshot();
});


it('CareProfileComponent', () => {
  const component = TestRenderer.create((
    <CareProfileComponent
      contentComponent={<div />}
      fetched={false}
      fullName=""
      getCareRecipient={() => {}}
      infoCategory=""
      profilePic=""
      saveCareProfileInfoCategory={() => {}}
      uid=""
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('CareProfileEditWrapperComponent', () => {
  const component = TestRenderer.create((
    <CareProfileEditWrapperComponent
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


it('CareProfileMedicalInfoComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<CareProfileMedicalInfoComponent />);
  expect(component).toMatchSnapshot();
});


it('CareProfileNewMemberComponent', () => {
  const component = TestRenderer.create((
    <CareProfileNewMemberComponent
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


it('CareProfileNewMemberFormFieldComponent', () => {
  const component = TestRenderer.create((
    <CareProfileNewMemberFormFieldComponent
      fieldTitle=""
      formField={<div />}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('CareProfileSelectCareRecipientComponent', () => {
  const component = TestRenderer.create((
    <CareProfileSelectCareRecipientComponent
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
      firstNameFieldValue=""
      lastNameFieldValue=""
      isCreateButtonDisabled={false}
      createGroup={() => {}}
      saveCareProfileFirstName={() => {}}
      saveCareProfileLastName={() => {}}
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
      saveWindowWidth={() => {}}
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
      groups={[]}
      disableCopyButton={false}
      getGroupInfo={() => {}}
      handleNavSelect={() => {}}
    />
  )).toJSON();
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
      numMessages={0}
      sortedMessages={new Map()}
      syncMessages={() => {}}
      shouldRenderMessage={() => {}}
      windowWidth={0}
    />
  ));
  expect(component).toMatchSnapshot();
});

it('TimelineStoryHeaderComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <TimelineStoryHeaderComponent
      getCategoryName={() => {}}
      getLocalDateString={() => {}}
      messageValue={{}}
    />
  ));
  expect(component).toMatchSnapshot();
});

it('TimelineStoryContentComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <TimelineStoryContentComponent
      messageValue={{ attachments: [{ payload: { url: '' } }] }}
    />
  ));
  expect(component).toMatchSnapshot();
});
