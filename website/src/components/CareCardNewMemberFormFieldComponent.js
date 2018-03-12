import PropTypes from 'prop-types';
import React from 'react';


const CareCareNewMemberFormFieldComponent = props => (
  <tr>
    <td>{props.fieldTitle}</td>
    <td>{props.formField}</td>
  </tr>
);

CareCareNewMemberFormFieldComponent.propTypes = {
  fieldTitle: PropTypes.string.isRequired,
  formField: PropTypes.element.isRequired,
};

export default CareCareNewMemberFormFieldComponent;
