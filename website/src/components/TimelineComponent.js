import firebase from 'firebase';
import Flexbox from 'flexbox-react';
import React, { Component } from 'react';
import { Tab, Table, Tabs } from 'react-bootstrap';

import * as constants from '../static/constants';
import * as utils from '../utils';


class TimelineComponent extends Component {
  constructor(props) {
    super(props);

    // Initialise local message state
    this.state = {
      messages: new Map(),
      messageCategory: constants.TIMELINE_CATEGORY_CODE_ALL,
    };

    // Sync local message state with auth user message state in Firebase
    const db = firebase.database();
    const authUser = firebase.auth().currentUser;
    if (!authUser) {
      throw new Error('Rendering Timeline component when no user has logged in');
    }

    // Listen on auth user activeGid to determine when it has been populated
    const authUserActiveGidRef = db.ref(`${constants.DB_PATH_USERS}/${authUser.uid}/activeGid`);
    authUserActiveGidRef.on(constants.DB_EVENT_NAME_VALUE, (authUserActiveGidSnapshot) => {
      // Wait until auth user active GID is populated before listening on group messages
      const authUserActiveGid = authUserActiveGidSnapshot.val();
      if (!authUserActiveGid) {
        return;
      }
      // Turn off listener on auth user activeGid once auth user activeGid is populated
      authUserActiveGidRef.off();

      // Sync a message's value locally and sync any time its value changes
      const syncMessageLocally = (groupMessageSnapshot) => {
        const messageRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${groupMessageSnapshot.key}`);
        messageRef.on(constants.DB_EVENT_NAME_VALUE, (messageSnapshot) => {
          this.state.messages.set(messageSnapshot.key, messageSnapshot.val());
          // Trigger component re-render
          this.setState({ ...this.state });
        });
      };
      // Delete a message locally
      const deleteMessageLocally = (groupMessageSnapshot) => {
        this.state.messages.delete(groupMessageSnapshot.key);
        // Trigger component re-render
        this.setState({ ...this.state });
      };

      // Listen on auth user's active group's messages to update local state when messages change
      const groupMessagesRef =
        db.ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${authUserActiveGid}`);
      groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, syncMessageLocally);
      groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_REMOVED, deleteMessageLocally);
    });
  }

  render() {
    const shouldRenderMessage = (message) => {
      if (!message.show_in_timeline) {
        return false;
      }
      if (this.state.messageCategory === constants.TIMELINE_CATEGORY_CODE_ALL) {
        return true;
      }
      if (message.category === this.state.messageCategory) {
        return true;
      }
      return false;
    };
    const messageToTableRow = ([messageKey, messageValue]) => {
      if (!shouldRenderMessage(messageValue)) {
        return null;
      }
      return (
        <tr key={messageKey}>
          <td>{new Date(messageValue.timestamp).toLocaleString()}</td>
          <td>{utils.categoryCodeToName(messageValue.category)}</td>
          <td>{messageValue.text}</td>
        </tr>
      );
    };
    const filterMessages = (category) => {
      this.setState({
        ...this.state,
        messageCategory: category,
      });
    };
    const getTabComponent = categoryCode => (
      <Tab
        eventKey={categoryCode}
        title={utils.categoryCodeToName(categoryCode)}
      />
    );
    const messages = Array.from(this.state.messages, messageToTableRow);
    return (
      <div>
        <Flexbox flexDirection="row">
          <Tabs
            defaultActiveKey={constants.TIMELINE_CATEGORY_CODE_ALL}
            className="timeline-tabs"
            id="timeline-tabs"
            onSelect={filterMessages}
          >
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_ALL)}
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_ACTIVITY)}
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR)}
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_MOOD)}
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_MEMORY)}
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_MEDICAL)}
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_CAREGIVER)}
            {getTabComponent(constants.TIMELINE_CATEGORY_CODE_OTHER)}
          </Tabs>
        </Flexbox>
        <Table bordered condensed hover>
          <thead>
            <tr>
              <th className="timeline-table-header">{constants.TIMELINE_TABLE_HEADER_TIMESTAMP}</th>
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
