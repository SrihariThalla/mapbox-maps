import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

var ImageWithFallback = createReactClass({
  getInitialState() {
    return {
      status: 'primary'
    };
  },

  render() {
    if (this.props.primary === '' && this.props.secondary === '') return null;

    if (this.state.status === 'primary') {
      return <img
        className={this.props.className}
        src={this.props.primary}
        onError={() => this.setState({status: 'secondary'})}
        alt={this.props.alt}
      />;
    } else if (this.state.status === 'secondary') {
      return <img
        className={this.props.className}
        src={this.props.secondary}
        onError={() => this.setState({status: 'error'})}
        alt={this.props.alt}
      />;
    } else return null;
  },

  propTypes: {
    alt: PropTypes.string,
    className: PropTypes.string,
    primary: PropTypes.string,
    secondary: PropTypes.string,
  }
});

export default ImageWithFallback;
