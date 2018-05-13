import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import StarIcon from 'react-icons/lib/fa/star';


const TimelineStoryFooterComponent = (props) => {
  const messageCategory = props.getCategoryName(props.messageValue.category);
  const starIcon = props.messageValue.starred ? (
    <Flexbox alignItems="center">
      &nbsp;•&nbsp;
      <div className="timeline-story-footer-star"><StarIcon /></div>
    </Flexbox>
  ) : null;
  return (
    <Flexbox alignItems="center" className="timeline-story-padding">
      <span className="space-horizontal" />
      <Flexbox>
        <div className="timeline-story-footer-category">{messageCategory}</div>
        {starIcon}
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
