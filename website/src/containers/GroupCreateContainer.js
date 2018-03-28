import { connect } from 'react-redux';
import * as firebase from 'firebase';

import * as actions from '../actions';
import GroupCreateComponent from '../components/GroupCreateComponent';
import * as constants from '../static/constants';
import * as utils from '../utils';


const mapStateToProps = state => ({
  groupCreateValidationState: state.group.groupCreateValidationState,
  groupNameFieldValue: state.group.groupNameFieldValue,
  isCreateButtonDisabled: state.group.groupCreateValidationState !== 'success',
});


const mapDispatchToProps = dispatch => ({
  handleChange: e => dispatch(actions.saveGroupNameFieldValue(e.target.value)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  createGroup: () => {
    // Create group record in lumi-groups and add user to the group
    const newGroupRef = firebase.database().ref(constants.DB_PATH_LUMI_GROUPS).push({
      name: stateProps.groupNameFieldValue,
    });
    utils.addUserToGroup(newGroupRef.key);
  },
});

const GroupCreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(GroupCreateComponent);

export default GroupCreateContainer;
