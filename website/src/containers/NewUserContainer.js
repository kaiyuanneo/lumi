import * as firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';
import NewUserComponent from '../components/NewUserComponent';
import * as constants from '../static/constants';


const mapStateToProps = state => ({
  firstName: state.auth.firstName,
});

const mapDispatchToProps = dispatch => ({
  getUserFirstName: () => {
    const { uid } = firebase.auth().currentUser;
    const firstNameRef = firebase.database().ref(`${constants.DB_PATH_USERS}/${uid}/firstName`);
    firstNameRef.once(constants.DB_EVENT_NAME_VALUE, firstNameSnapshot =>
      dispatch(actions.saveAuthUserFirstName(firstNameSnapshot.val())));
  },
});

const NewUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewUserComponent);

export default NewUserContainer;
