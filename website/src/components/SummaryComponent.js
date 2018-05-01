import Flexbox from 'flexbox-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import * as constants from '../static/constants';


class SummaryComponent extends Component {
  componentDidMount() {
    this.props.syncMessages();
  }
  render() {
    // Use random image as background from images that belong to a given filter
    const wrapWithImageContainer = (images, text) => (
      <div className="summary-card-container">
        <img
          src={images[Math.floor(Math.random() * images.length)]}
          alt="blabla"
          className="summary-card-background-image"
        />
        <div className="summary-card-text">
          {text}
        </div>
      </div>
    );
    // Show default background when there are no images for a given filter
    const wrapWithDefaultContainer = text => (
      <div className="summary-card-container">
        <div className="summary-card-background-default">
          <div className="summary-card-text">
            {text}
          </div>
        </div>
      </div>
    );

    // Create local vars for brevity
    const numTotalMomentsText = `${this.props.messageStats.numMessages} moments`;
    const numStarredMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_STAR]} starred moments`;
    const numActivityMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_ACTIVITY]} activity moments`;
    const numBehaviourMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]} behaviour moments`;
    const numMoodMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_MOOD]} mood moments`;
    const numMemoryMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_MEMORY]} memory moments`;
    const numMedicalMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_MEDICAL]} medical moments`;
    const numCaregiverMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_CAREGIVER]} caregiver moments`;
    const numOtherMomentsText =
      `${this.props.messageStats[constants.TIMELINE_CATEGORY_CODE_OTHER]} other moments`;

    // Create local vars for brevity
    const starImages = this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_STAR}Images`];
    const activityImages =
      this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_ACTIVITY}Images`];
    const behaviourImages =
      this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR}Images`];
    const moodImages = this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_MOOD}Images`];
    const memoryImages =
      this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_MEMORY}Images`];
    const medicalImages =
      this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_MEDICAL}Images`];
    const caregiverImages =
      this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_CAREGIVER}Images`];
    const otherImages = this.props.messageStats[`${constants.TIMELINE_CATEGORY_CODE_OTHER}Images`];

    const numTotalMomentsElement = this.props.messageStats.allImages.length > 0 ?
      wrapWithImageContainer(this.props.messageStats.allImages, numTotalMomentsText) :
      wrapWithDefaultContainer(numTotalMomentsText);
    const numStarredMomentsElement = starImages.length > 0 ?
      wrapWithImageContainer(starImages, numStarredMomentsText) :
      wrapWithDefaultContainer(numStarredMomentsText);
    const numActivityMomentsElement = activityImages.length > 0 ?
      wrapWithImageContainer(activityImages, numActivityMomentsText) :
      wrapWithDefaultContainer(numActivityMomentsText);
    const numBehaviourMomentsElement = behaviourImages.length > 0 ?
      wrapWithImageContainer(behaviourImages, numBehaviourMomentsText) :
      wrapWithDefaultContainer(numBehaviourMomentsText);
    const numMoodMomentsElement = moodImages.length > 0 ?
      wrapWithImageContainer(moodImages, numMoodMomentsText) :
      wrapWithDefaultContainer(numMoodMomentsText);
    const numMemoryMomentsElement = memoryImages.length > 0 ?
      wrapWithImageContainer(memoryImages, numMemoryMomentsText) :
      wrapWithDefaultContainer(numMemoryMomentsText);
    const numMedicalMomentsElement = medicalImages.length > 0 ?
      wrapWithImageContainer(medicalImages, numMedicalMomentsText) :
      wrapWithDefaultContainer(numMedicalMomentsText);
    const numCaregiverMomentsElement = caregiverImages.length > 0 ?
      wrapWithImageContainer(caregiverImages, numCaregiverMomentsText) :
      wrapWithDefaultContainer(numCaregiverMomentsText);
    const numOtherMomentsElement = otherImages.length > 0 ?
      wrapWithImageContainer(otherImages, numOtherMomentsText) :
      wrapWithDefaultContainer(numOtherMomentsText);

    return (
      <Flexbox flexDirection="column" alignItems="center">
        <h4>{this.props.groupName} Group Summary</h4>
        {numTotalMomentsElement}
        <br />
        {numStarredMomentsElement}
        <br />
        {numActivityMomentsElement}
        <br />
        {numBehaviourMomentsElement}
        <br />
        {numMoodMomentsElement}
        <br />
        {numMemoryMomentsElement}
        <br />
        {numMedicalMomentsElement}
        <br />
        {numCaregiverMomentsElement}
        <br />
        {numOtherMomentsElement}
        <br />
      </Flexbox>
    );
  }
}

SummaryComponent.propTypes = {
  groupName: PropTypes.string,
  messageStats: PropTypes.shape({
    numMessages: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_STAR]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_ACTIVITY]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_MOOD]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_MEMORY]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_MEDICAL]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_CAREGIVER]: PropTypes.number,
    [constants.TIMELINE_CATEGORY_CODE_OTHER]: PropTypes.number,
    allImages: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_STAR}Images`]: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_ACTIVITY}Images`]: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_BEHAVIOUR}Images`]: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_MOOD}Images`]: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_MEMORY}Images`]: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_MEDICAL}Images`]: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_CAREGIVER}Images`]: PropTypes.array,
    [`${constants.TIMELINE_CATEGORY_CODE_OTHER}Images`]: PropTypes.array,
  }).isRequired,
  syncMessages: PropTypes.func.isRequired,
};

SummaryComponent.defaultProps = {
  groupName: null,
};

export default SummaryComponent;
