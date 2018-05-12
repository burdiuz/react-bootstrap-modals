import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { translateJQueryEventsToDOM } from '../utils';

const SHOW_JQUERY_EVENT = 'show.bs.modal';
const SHOWN_JQUERY_EVENT = 'shown.bs.modal';
const HIDE_JQUERY_EVENT = 'hide.bs.modal';
const HIDDEN_JQUERY_EVENT = 'hidden.bs.modal';

const SHOW_EVENT = 'show';
const SHOWN_EVENT = 'shown';
const HIDE_EVENT = 'hide';
const HIDDEN_EVENT = 'hidden';

translateJQueryEventsToDOM()(
  SHOW_JQUERY_EVENT,
  SHOWN_JQUERY_EVENT,
  HIDE_JQUERY_EVENT,
  HIDDEN_JQUERY_EVENT
);

export const ModalCloseButton = ({ onClick, className, ...props }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames('close', className)}
    data-dismiss={onClick ? undefined : 'modal'}
    aria-label="Close"
    {...props}
  >
    <span aria-hidden="true">&times;</span>
  </button>
);

ModalCloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};
ModalCloseButton.defaultProps = {
  className: undefined,
  onClick: undefined
};

export const ModalHeader = ({
  modalId,
  children,
  cancelable,
  onClose,
  className,
  ...props
}) => {
  let title = children;
  let button = null;

  if (typeof children === 'string') {
    title = <h5 className="modal-title">{children}</h5>;
  }

  if (cancelable) {
    button = <ModalCloseButton onClick={onClose} />;
  }

  return (
    <div className={classNames('modal-header', className)} {...props}>
      {title}
      {button}
    </div>
  );
};

ModalHeader.propTypes = {
  className: PropTypes.string,
  cancelable: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
};

ModalHeader.defaultProps = {
  className: undefined,
  cancelable: undefined,
  onClose: undefined,
  children: undefined
};

export const ModalFooter = ({
  children,
  actions,
  onAction,
  className,
  ...props
}) => (
  <div className={classNames('modal-footer', className)} {...props}>
    {children}
  </div>
);

ModalFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

ModalFooter.defaultProps = {
  className: undefined,
  children: undefined
};

const BaseModalView = ({
  header,
  footer,
  children,
  cancelable,
  className,
  ...props
}) => {
  const backdrop = cancelable ? 'static' : undefined;
  let content = children;

  if (typeof children === 'string') {
    content = <p>{children}</p>;
  }

  return (
    <div
      className={classNames('modal', className)}
      tabIndex="-1"
      role="dialog"
      data-backdrop={backdrop}
      data-keyboard={cancelable}
      {...props}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {header}
          <div className="modal-body">{content}</div>
          {footer}
        </div>
      </div>
    </div>
  );
};

BaseModalView.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  cancelable: PropTypes.bool,
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node
};

BaseModalView.defaultProps = {
  id: undefined,
  className: undefined,
  cancelable: undefined,
  children: undefined,
  header: undefined,
  footer: undefined
};

class BaseModal extends Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    cancelable: PropTypes.bool,
    buttons: PropTypes.node,
    onClose: PropTypes.func,
    onShow: PropTypes.func,
    onShown: PropTypes.func,
    onHide: PropTypes.func,
    onHidden: PropTypes.func,
    onModalRefAvailable: PropTypes.func,
    children: PropTypes.node,
    header: PropTypes.node,
    footer: PropTypes.node
  };

  static defaultProps = {
    id: undefined,
    title: undefined,
    className: undefined,
    cancelable: true,
    buttons: undefined,
    onClose: undefined,
    onShow: undefined,
    onShown: undefined,
    onHide: undefined,
    onHidden: undefined,
    onModalRefAvailable: undefined,
    children: undefined,
    header: undefined,
    footer: undefined
  };

  componentWillUnmount() {
    this.removeListeners();
  }

  onModalRefAvailable = (ref) => {
    const { onModalRefAvailable } = this.props;
    this.removeListeners();
    this.modalRef = ref;
    this.addListeners();

    if (onModalRefAvailable) {
      onModalRefAvailable(ref);
    }
  };

  onShow = () => {
    const { onShow } = this.props;
    if (onShow) {
      onShow(this.modalRef);
    }
  };

  onShown = () => {
    const { onShown } = this.props;
    if (onShown) {
      onShown(this.modalRef);
    }
  };

  onHide = () => {
    const { onHide } = this.props;
    if (onHide) {
      onHide(this.modalRef);
    }
  };

  onHidden = () => {
    const { onHidden } = this.props;
    if (onHidden) {
      onHidden(this.modalRef);
    }
  };

  modalRef = null;

  addListeners() {
    if (this.modalRef) {
      this.modalRef.addEventListener(SHOW_EVENT, this.onShow);
      this.modalRef.addEventListener(SHOWN_EVENT, this.onShown);
      this.modalRef.addEventListener(HIDE_EVENT, this.onHide);
      this.modalRef.addEventListener(HIDDEN_EVENT, this.onHidden);
    }
  }

  removeListeners() {
    if (this.modalRef) {
      this.modalRef.removeEventListener(SHOW_EVENT, this.onShow);
      this.modalRef.removeEventListener(SHOWN_EVENT, this.onShown);
      this.modalRef.removeEventListener(HIDE_EVENT, this.onHide);
      this.modalRef.removeEventListener(HIDDEN_EVENT, this.onHidden);
    }
  }

  renderHeader() {
    const { onClose, title, cancelable } = this.props;

    return (
      <ModalHeader onClose={onClose} cancelable={cancelable}>
        {title}
      </ModalHeader>
    );
  }

  renderFooter() {
    const { buttons } = this.props;

    return <ModalFooter>{buttons}</ModalFooter>;
  }

  renderContent() {
    return this.props.children;
  }

  render() {
    const {
      header,
      footer,
      children,
      onShow,
      onShown,
      onHide,
      onHidden,
      onModalRefAvailable,
      ...props
    } = this.props;

    return (
      <BaseModalView
        ref={this.onModalRefAvailable}
        header={header || this.renderHeader()}
        footer={footer || this.renderFooter()}
        {...props}
      >
        {this.renderContent()}
      </BaseModalView>
    );
  }
}

export default BaseModal;
