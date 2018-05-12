import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { modalClosed } from '../actions';
import { getModals } from '../selectors';

export const MODAL_PORTAL_ID = 'modal-container-portal';
export const MODAL_CLOSE_EVENT = 'modalClose';

export const getModalsHostRef = () =>
  document.getElementById(`#${MODAL_PORTAL_ID}`);

export const dispatchCloseEvent = (id) => {
  const event = new CustomEvent(MODAL_CLOSE_EVENT, {
    cancelable: true,
    detail: id
  });

  getModalsHostRef().dispatchEvent(event);

  return !event.defaultPrevented;
};

const ModalsHostView = ({
  onModalClosed,
  onModalRefAvailable,
  modals,
  ...props
}) => (
  <div {...props} className="modal-container-portal">
    {modals.map(({ id, props: params, renderer }) =>
      renderer(
        id,
        (modalRef) => onModalRefAvailable(id, modalRef),
        (node) => onModalClosed(id, node),
        params
      )
    )}
  </div>
);

ModalsHostView.propTypes = {
  id: PropTypes.string.isRequired,
  modals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      props: PropTypes.shape({}),
      renderer: PropTypes.func.isRequired
    })
  ).isRequired,
  onModalClosed: PropTypes.func.isRequired,
  onModalRefAvailable: PropTypes.func.isRequired
};

/**
 * Must be instantiated only once and be availabe all the time to properly
 * display modals
 */
class ModalsHost extends Component {
  propTypes = {
    modals: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onModalClosed: PropTypes.func.isRequired
  };

  portalRef = null;
  modalRefs = {};

  onPortalRefAvaialble = (ref) => {
    if (this.portalRef) {
      this.portalRef.removeEventListener(MODAL_CLOSE_EVENT, this.onModalClose);
    }

    this.portalRef = ref;

    if (this.portalRef) {
      this.portalRef.addEventListener(MODAL_CLOSE_EVENT, this.onModalClose);
    }
  };

  onModalRefAvailable = (id, ref) => {
    this.modalRefs[id] = ref;
  };

  onModalClose = ({ detail: id }) => {
    if (this.modalRefs[id]) {
      this.modalRefs[id].close();
    }
  };

  onModalClosed = (id) => {
    const { onModalClosed } = this.props;

    onModalClosed(id);
  };

  render() {
    const { modals } = this.props;
    return (
      <ModalsHostView
        ref={this.onPortalRefAvaialble}
        modals={modals}
        onModalClosed={this.onModalClosed}
        onModalRefAvailable={this.onModalRefAvailable}
        id={MODAL_PORTAL_ID}
      />
    );
  }
}

export default connect(
  (state) => ({
    modals: getModals(state)
  }),
  (dispatch) => ({
    onModalClosed: (id) => dispatch(modalClosed(id))
  })
)(ModalsHost);
