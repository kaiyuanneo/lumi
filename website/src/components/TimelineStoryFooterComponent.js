import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Image } from 'react-bootstrap';
import StarIcon from 'react-icons/lib/fa/star';


const TimelineStoryFooterComponent = (props) => {
  const messageCategory = props.getCategoryName(props.messageValue.category);
  const starIcon = props.messageValue.starred ? (
    <Flexbox alignItems="center">
      &nbsp;•&nbsp;
      <div className="timeline-story-footer-star"><StarIcon /></div>
    </Flexbox>
  ) : null;
  const senderFullName =
    `${props.messageValue.senderFirstName} ${props.messageValue.senderLastName}`;
  return (
    <Flexbox
      alignItems="center"
      justifyContent="space-between"
      className="timeline-story-padding timeline-story-width-content"
    >
      <Flexbox>
        <div className="timeline-story-footer-category">{messageCategory}</div>
        {starIcon}
      </Flexbox>
      <Flexbox alignItems="center" className="timeline-story-footer-profile">
        <Image
          className="timeline-story-footer-profile-image"
          src={props.messageValue.senderProfilePic}
          circle
        />
        <span className="space-horizontal" />
        <div>{senderFullName}</div>
      </Flexbox>
    </Flexbox>
  );
};

TimelineStoryFooterComponent.propTypes = {
  getCategoryName: PropTypes.func.isRequired,
  messageValue: PropTypes.shape({
    category: PropTypes.string,
    senderFirstName: PropTypes.string,
    senderLastName: PropTypes.string,
    senderProfilePic: PropTypes.string,
    starred: PropTypes.bool,
    timestamp: PropTypes.number,
  }).isRequired,
};

export default TimelineStoryFooterComponent;
