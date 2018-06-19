import * as firebase from 'firebase';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import sinon from 'sinon';

import App from '../App';
import AuthComponent from '../components/AuthComponent';
import BootstrapStyleComponent from '../components/BootstrapStyleComponent';
import CareProfileInfoBasicComponent from '../components/CareProfileInfoBasicComponent';
import CareProfileInfoMedicalComponent from '../components/CareProfileInfoMedicalComponent';
import CareProfileInfoCareComponent from '../components/CareProfileInfoCareComponent';
import CareProfileComponent from '../components/CareProfileComponent';
import CareProfileNewMemberComponent from '../components/CareProfileNewMemberComponent';
import CareProfileNewMemberFormFieldComponent from '../components/CareProfileNewMemberFormFieldComponent';
import CareProfileSelectCareRecipientComponent from '../components/CareProfileSelectCareRecipientComponent';
import GroupAddComponent from '../components/GroupAddComponent';
import GroupAddCreateComponent from '../components/GroupAddCreateComponent';
import GroupAddJoinComponent from '../components/GroupAddJoinComponent';
import HomeComponent from '../components/HomeComponent';
import NavBottomComponent from '../components/NavBottomComponent';
import NavTopComponent from '../components/NavTopComponent';
import RootComponent from '../components/RootComponent';
import TimelineComponent from '../components/TimelineComponent';
import TimelineStoryHeaderComponent from '../components/TimelineStoryHeaderComponent';
import TimelineStoryContentComponent from '../components/TimelineStoryContentComponent';
import TimelineStoryFooterComponent from '../components/TimelineStoryFooterComponent';


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


it('CareProfileInfoBasicComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<CareProfileInfoBasicComponent
    isInEditMode={false}
    saveButtonDisabled={false}
    displayFieldValueFirstName=""
    displayFieldValueLastName=""
    displayFieldValueBirthday=""
    displayFieldValueGender=""
    displayFieldValueEmail=""
    displayFieldValueAddress=""
    formFieldValueFirstName=""
    formFieldValueLastName=""
    formFieldValueBirthday=""
    formFieldValueGender=""
    formFieldValueEmail=""
    formFieldValueAddress=""
    getOnChangeFuncDate={() => {}}
    getOnChangeFuncNormal={() => {}}
    enterEditMode={() => {}}
    cancelEdits={() => {}}
    saveFieldValuesToDb={() => {}}
  />);
  expect(component).toMatchSnapshot();
});


it('CareProfileInfoMedicalComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<CareProfileInfoMedicalComponent
    isInEditMode
    displayFieldValueTypeOfDementia=""
    displayFieldValueDateOfDiagnosis=""
    displayFieldValueMedications=""
    displayFieldValueProviders=""
    formFieldValueTypeOfDementia=""
    formFieldValueDateOfDiagnosis=""
    formFieldValueMedications=""
    formFieldValueProviders=""
    getOnChangeFuncDate={() => {}}
    getOnChangeFuncNormal={() => {}}
    enterEditMode={() => {}}
    cancelEdits={() => {}}
    saveFieldValuesToDb={() => {}}
  />);
  expect(component).toMatchSnapshot();
});


it('CareProfileInfoCareComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render(<CareProfileInfoCareComponent
    isInEditMode={false}
    displayFieldValueNeedsAndPreferences=""
    displayFieldValueThingsThatDelight=""
    displayFieldValuePlacesOfInterest=""
    formFieldValueNeedsAndPreferences=""
    formFieldValueThingsThatDelight=""
    formFieldValuePlacesOfInterest=""
    getOnChangeFuncNormal={() => {}}
    enterEditMode={() => {}}
    cancelEdits={() => {}}
    saveFieldValuesToDb={() => {}}
  />);
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
      logPanelSelection={() => {}}
      uid=""
    />
  )).toJSON();
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


it('GroupAddComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <GroupAddComponent
      firstName=""
      groupAddFormContainer={<div />}
      getUserFirstName={() => {}}
    />
  ));
  expect(component).toMatchSnapshot();
});


it('GroupAddCreateComponent', () => {
  const component = TestRenderer.create((
    <GroupAddCreateComponent
      firstNameFieldValue=""
      lastNameFieldValue=""
      isCreateButtonDisabled={false}
      createGroup={() => {}}
      saveCareProfileFirstName={() => {}}
      saveCareProfileLastName={() => {}}
      clearGroupAddState={() => {}}
    />
  )).toJSON();
  expect(component).toMatchSnapshot();
});


it('GroupAddJoinComponent', () => {
  const component = TestRenderer.create((
    <GroupAddJoinComponent
      groupIdFieldValue=""
      isJoinButtonDisabled={false}
      joinGroup={() => {}}
      handleChange={() => {}}
      clearGroupAddState={() => {}}
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
      copyGroupId={() => {}}
      getGroupInfo={() => {}}
      handleNavSelect={() => {}}
      logTapsBrand={() => {}}
      logTapsHamburger={() => {}}
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
      getDateString={() => {}}
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

it('TimelineStoryFooterComponent', () => {
  const renderer = new ShallowRenderer();
  const component = renderer.render((
    <TimelineStoryFooterComponent
      getCategoryName={() => {}}
      messageValue={{}}
    />
  ));
  expect(component).toMatchSnapshot();
});
