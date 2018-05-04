// NB: Private functions are underscore-prefixed and exported for tests
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import NewUserComponent from '../components/AddGroupComponent';
import * as constants from '../static/constants';


const mapStateToProps = state => ({
  firstName: state.auth.firstName,
});


export const _getUserFirstName = async (dispatch) => {
  const { uid } = firebase.auth().currentUser;
  const firstNameRef = firebase.database().ref(`${constants.DB_PATH_USERS}/${uid}/firstName`);
  const firstNameSnapshot = await firstNameRef.once(constants.DB_EVENT_NAME_VALUE);
  dispatch(actions.saveAuthUserFirstName(firstNameSnapshot.val()));
};


const mapDispatchToProps = dispatch => ({
  getUserFirstName: () => _getUserFirstName(dispatch),
});


const NewUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewUserComponent);

export default NewUserContainer;
