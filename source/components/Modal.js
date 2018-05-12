import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BaseModal from './BaseModal';

class Modal extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onClosed: PropTypes.func,
  };

  static defaultProps = {
    onClosed: undefined,
  };

  state = { shown: false, closed: false };

  componentWillUnmount() {
    const { onClosed } = this.props;
    if (!this.state.closed && onClosed) {
      onClosed();
    }
  }

  onModalRefAvailable = () => {
    this.setState(
      {
        shown: true,
      },
      () => {
        const jQuery = window.$;
        jQuery(`#${this.props.id}`).modal('show');
      },
    );
  };

  onClose = () => {
    const jQuery = window.$;
    jQuery(`#${this.props.id}`).modal('hide');
  };

  onHidden = () => {
    if (!this.state.closed) {
      this.setState({ shown: false, closed: true }, () => {
        const { onClosed } = this.props;

        if (onClosed) {
          onClosed();
        }
      });
    }
  };

  close() {
    if (this.state.shown) {
      this.setState({ shown: false });
    }
  }

  render() {
    const { onClosed, ...props } = this.props;

    return (
      <BaseModal
        data-focus
        {...props}
        className="fade"
        onModalRefAvailable={this.onModalRefAvailable}
        onClose={this.onClose}
        onHidden={this.onHidden}
      />
    );
  }
}

export default Modal;
