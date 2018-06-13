import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Image } from 'react-bootstrap';


const TimelineStoryContentComponent = (props) => {
  let imageContent = null;
  if ('attachments' in props.messageValue) {
    imageContent = (
      <Image
        className="timeline-story-width-content"
        src={props.messageValue.attachments[0].payload.url}
        responsive
      />
    );
  }
  return (
    <Flexbox flexDirection="column" alignItems="flex-start">
      <div className="timeline-story-padding">
        {props.messageValue.text}
      </div>
      {imageContent}
    </Flexbox>
  );
};

TimelineStoryContentComponent.propTypes = {
  messageValue: PropTypes.shape({
    text: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.shape({
      payload: PropTypes.shape({
        url: PropTypes.string,
      }),
    })),
  }).isRequired,
};

export default TimelineStoryContentComponent;
