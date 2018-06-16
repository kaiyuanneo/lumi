// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import GroupAddComponent from '../components/GroupAddComponent';
import GroupAddCreateOrJoinContainer from '../containers/GroupAddCreateOrJoinContainer';
import GroupAddCreateContainer from '../containers/GroupAddCreateContainer';
import GroupAddJoinContainer from '../containers/GroupAddJoinContainer';
import * as constants from '../static/constants';


const mapStateToProps = (state) => {
  let groupAddFormContainer;
  switch (state.group.groupAddState) {
    case constants.GROUP_ADD_STATE_CREATE_OR_JOIN:
      groupAddFormContainer = <GroupAddCreateOrJoinContainer />;
      break;
    case constants.GROUP_ADD_STATE_CREATE:
      groupAddFormContainer = <GroupAddCreateContainer />;
      break;
    case constants.GROUP_ADD_STATE_JOIN:
      groupAddFormContainer = <GroupAddJoinContainer />;
      break;
    default:
      groupAddFormContainer = <GroupAddCreateOrJoinContainer />;
  }
  return {
    firstName: state.auth.firstName,
    groupAddFormContainer,
  };
};


export const _getUserFirstName = async (dispatch) => {
  const { uid } = firebase.auth().currentUser;
  const firstNameRef = firebase.database().ref(`${constants.DB_PATH_USERS}/${uid}/firstName`);
  firstNameRef.on(constants.DB_EVENT_NAME_VALUE, (firstNameSnapshot) => {
    // Do nothing if first name is not yet populated
    if (!firstNameSnapshot.val()) {
      return;
    }
    // Remove callback on firstNameRef
    firstNameRef.off();
    dispatch(actions.saveAuthUserFirstName(firstNameSnapshot.val()));
  });
};


const mapDispatchToProps = dispatch => ({
  getUserFirstName: () => _getUserFirstName(dispatch),
});


const GroupAddContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupAddComponent);

export default GroupAddContainer;
