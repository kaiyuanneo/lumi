import firebase from 'firebase';
import Flexbox from 'flexbox-react';
import React, { Component } from 'react';
import { Tab, Table, Tabs } from 'react-bootstrap';

import * as constants from '../static/constants';


class TimelineComponent extends Component {
  constructor(props) {
    super(props);

    // Initialise local message state
    this.state = {
      messages: [],
      messageCategory: constants.TIMELINE_CATEGORY_CODE_ALL,
    };

    // Sync local message state with auth user message state in Firebase
    const db = firebase.database();
    const authUser = firebase.auth().currentUser;
    if (!authUser) {
      throw new Error('Rendering Timeline component when no user has logged in');
    }
    const authUserPsidRef = db.ref(`${constants.DB_PATH_USERS}/${authUser.uid}/psid`);
    authUserPsidRef.on(constants.DB_EVENT_NAME_VALUE, (authUserPsidSnapshot) => {
      // Wait until auth user PSID is populated before listening on user messages
      const authUserPsid = authUserPsidSnapshot.val();
      if (!authUserPsid) {
        return;
      }
      // Turn off this listener once auth user PSID is populated
      authUserPsidRef.off(constants.DB_EVENT_NAME_VALUE);
      // Activate listener on auth user's messages
      const messagesRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${authUserPsid}`);
      messagesRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, (messageSnapshot) => {
        this.setState({
          ...this.state,
          messages: this.state.messages.concat(messageSnapshot.val()),
        });
      });
    });
  }

  render() {
    const filterMessages = (category) => {
      this.setState({
        ...this.state,
        messageCategory: category,
      });
    };
    const shouldRenderMessage = (message) => {
      if (this.state.messageCategory === constants.TIMELINE_CATEGORY_CODE_ALL) {
        return true;
      }
      if (message.category === this.state.messageCategory) {
        return true;
      }
      if (message.category === undefined &&
          this.state.messageCategory === constants.TIMELINE_CATEGORY_CODE_GENERAL) {
        return true;
      }
      return false;
    };
    const getMessageCategoryNameFromCode = (messageCategoryCode) => {
      switch (messageCategoryCode) {
        case undefined:
        case constants.TIMELINE_CATEGORY_CODE_GENERAL:
          return constants.TIMELINE_CATEGORY_NAME_GENERAL;
        case constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR:
          return constants.TIMELINE_CATEGORY_NAME_BEHAVIOUR;
        case constants.TIMELINE_CATEGORY_CODE_MEMORY:
          return constants.TIMELINE_CATEGORY_NAME_MEMORY;
        case constants.TIMELINE_CATEGORY_CODE_MEDICAL:
          return constants.TIMELINE_CATEGORY_NAME_MEDICAL;
        default:
          return 'NA';
      }
    };
    const messageToTableRow = (message) => {
      if (!shouldRenderMessage(message)) {
        return null;
      }
      return (
        <tr key={message.mid}>
          <td>{getMessageCategoryNameFromCode(message.category)}</td>
          <td>{message.text}</td>
        </tr>
      );
    };
    const messages = this.state.messages.map(messageToTableRow);
    return (
      <div>
        <Flexbox flexDirection="row">
          <Tabs
            defaultActiveKey={constants.TIMELINE_CATEGORY_CODE_ALL}
            className="timeline-tabs"
            id="timeline-tabs"
            onSelect={filterMessages}
          >
            <Tab
              eventKey={constants.TIMELINE_CATEGORY_CODE_ALL}
              title={constants.TIMELINE_CATEGORY_NAME_ALL}
            />
            <Tab
              eventKey={constants.TIMELINE_CATEGORY_CODE_GENERAL}
              title={constants.TIMELINE_CATEGORY_NAME_GENERAL}
            />
            <Tab
              eventKey={constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR}
              title={constants.TIMELINE_CATEGORY_NAME_BEHAVIOUR}
            />
            <Tab
              eventKey={constants.TIMELINE_CATEGORY_CODE_MEMORY}
              title={constants.TIMELINE_CATEGORY_NAME_MEMORY}
            />
            <Tab
              eventKey={constants.TIMELINE_CATEGORY_CODE_MEDICAL}
              title={constants.TIMELINE_CATEGORY_NAME_MEDICAL}
            />
          </Tabs>
        </Flexbox>
        <Table bordered condensed hover>
          <thead>
            <tr>
              <th className="timeline-table-header">{constants.TIMELINE_TABLE_HEADER_CATEGORY}</th>
              <th className="timeline-table-header">{constants.TIMELINE_TABLE_HEADER_NOTE}</th>
            </tr>
          </thead>
          <tbody>
            {messages}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default TimelineComponent;
