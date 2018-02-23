import firebase from 'firebase';
import Flexbox from 'flexbox-react';
import React, { Component } from 'react';
import { Image, Table, Tabs } from 'react-bootstrap';

import * as constants from '../static/constants';
import * as utils from '../utils';


class TimelineComponent extends Component {
  constructor(props) {
    super(props);

    // Initialise local message state
    this.state = {
      messages: {},
      messageCategory: constants.TIMELINE_CATEGORY_CODE_ALL,
    };

    // Sync local message state with auth user message state in Firebase
    const db = firebase.database();
    const authUser = firebase.auth().currentUser;
    if (!authUser) {
      throw new Error('Rendering Timeline component when no user has logged in');
    }

    // Listen on auth user activeGroup to determine when it has been populated
    const authUserActiveGroupRef = db.ref(`${constants.DB_PATH_USERS}/${authUser.uid}/activeGroup`);
    authUserActiveGroupRef.on(constants.DB_EVENT_NAME_VALUE, (authUserActiveGroupSnapshot) => {
      // Wait until auth user active group is populated before listening on group messages
      const authUserActiveGroup = authUserActiveGroupSnapshot.val();
      if (!authUserActiveGroup) {
        return;
      }
      // Turn off listener on auth user activeGroup once auth user activeGroup is populated
      authUserActiveGroupRef.off();

      // Sync a message's value and sender name locally and sync any time its value changes
      const syncMessageLocally = (groupMessageSnapshot) => {
        const messageRef = db.ref(`${constants.DB_PATH_LUMI_MESSAGES}/${groupMessageSnapshot.key}`);
        messageRef.on(constants.DB_EVENT_NAME_VALUE, async (messageSnapshot) => {
          // Store message locally and add message sender's name to local state
          const message = messageSnapshot.val();
          // There should always be a relevant entry in user-psid-to-uid because in order to have
          // their message referenced by a group, a user must have signed into lumicares.
          const uidRef = db.ref(`${constants.DB_PATH_USER_PSID_TO_UID}/${message.senderPsid}`);
          const uidSnapshot = await uidRef.once(constants.DB_EVENT_NAME_VALUE);
          const userRef = db.ref(`${constants.DB_PATH_USERS}/${uidSnapshot.val()}`);
          const userSnapshot = await userRef.once(constants.DB_EVENT_NAME_VALUE);
          const user = userSnapshot.val();
          const updatedMessages = {
            ...this.state.messages,
            [messageSnapshot.key]: {
              ...message,
              senderFirstName: user.firstName,
              senderLastName: user.lastName,
            },
          };
          // Trigger component re-render
          this.setState({
            ...this.state,
            messages: updatedMessages,
          });
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
        db.ref(`${constants.DB_PATH_LUMI_MESSAGES_GROUP}/${authUserActiveGroup}`);
      groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_ADDED, syncMessageLocally);
      groupMessagesRef.on(constants.DB_EVENT_NAME_CHILD_REMOVED, deleteMessageLocally);
    });
  }

  render() {
    // We cannot depend on messages to come in order from realtime database because it takes
    // varying amounts of time to look up user information for the sender of each message.
    const sortMessagesByKey = () => {
      const sortedMessageKeys = Object.keys(this.state.messages).sort().reverse();
      const sortedMessageMap = new Map();
      for (let i = 0; i < sortedMessageKeys.length; i += 1) {
        sortedMessageMap.set(sortedMessageKeys[i], this.state.messages[sortedMessageKeys[i]]);
      }
      return sortedMessageMap;
    };
    const shouldRenderMessage = (message) => {
      if (!message.showInTimeline) {
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
      let messageContent;
      if ('attachments' in messageValue) {
        messageContent = (
          <Image
            className="timeline-image"
            src={messageValue.attachments[0].payload.url}
            responsive
          />
        );
      } else {
        messageContent = messageValue.text;
      }
      return (
        <tr key={messageKey}>
          <td>{new Date(messageValue.timestamp).toLocaleString()}</td>
          <td>{messageValue.senderFirstName} {messageValue.senderLastName}</td>
          <td>{utils.categoryCodeToName(messageValue.category)}</td>
          <td>{messageContent}</td>
        </tr>
      );
    };
    const filterMessages = (category) => {
      this.setState({
        ...this.state,
        messageCategory: category,
      });
    };
    // Order messages in descending order with newest messages first
    const messagesMap = sortMessagesByKey();
    const messages = Array.from(messagesMap, messageToTableRow);
    return (
      <div>
        <Flexbox>
          <Tabs
            defaultActiveKey={constants.TIMELINE_CATEGORY_CODE_ALL}
            className="product-tabs"
            id="timeline-tabs"
            onSelect={filterMessages}
          >
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_ALL)}
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_ACTIVITY)}
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR)}
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_MOOD)}
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_MEMORY)}
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_MEDICAL)}
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_CAREGIVER)}
            {utils.getTabComponent(constants.TIMELINE_CATEGORY_CODE_OTHER)}
          </Tabs>
        </Flexbox>
        <Table bordered condensed hover>
          <thead>
            <tr>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_TIME}</th>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_USER}</th>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_CATEGORY}</th>
              <th className="product-table-header">{constants.TIMELINE_TABLE_HEADER_NOTE}</th>
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
