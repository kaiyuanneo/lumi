import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';

import * as constants from '../static/constants';


const GroupAddCreateOrJoinComponent = props => (
  <div>
    <div className="group-add-subtitle">{constants.GROUP_ADD_CREATE_OR_JOIN_SUBTITLE}</div>
    <br />
    <Flexbox flexDirection="column">
      <Button
        className="button-primary"
        bsSize="large"
        onClick={props.navigateToGroupAddCreate}
      >
        {constants.GROUP_ADD_CREATE_BUTTON_TEXT}
      </Button>
      <br />
      <Button
        className="button-default"
        bsSize="large"
        onClick={props.navigateToGroupAddJoin}
      >
        {constants.GROUP_ADD_JOIN_BUTTON_TEXT}
      </Button>
    </Flexbox>
  </div>
);

GroupAddCreateOrJoinComponent.propTypes = {
  navigateToGroupAddCreate: PropTypes.func.isRequired,
  navigateToGroupAddJoin: PropTypes.func.isRequired,
};

export default GroupAddCreateOrJoinComponent;
