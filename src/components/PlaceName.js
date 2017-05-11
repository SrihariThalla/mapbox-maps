import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PlaceName extends Component {
  render() {
    if (this.props.location.place_name === undefined) return null;

    let parts = this.props.location.place_name.split(', ');
    if (parts.length < 1) return null;
    let main = parts[0];
    let rest = parts.slice(1).join(', ');

    let mainColor, restColor;
    if (this.props.colors === 'light') {
      mainColor = 'color-white';
      restColor = 'color-lighten50';
    } else {
      mainColor = 'color-black';
      restColor = 'color-darken50';
    }

    return (
      <div className='txt-truncate w-full' onClick={() => this.props.onClick()}>
        {
          main === '__loading'
          ? <div className={'loading loading--s ' + (this.props.colors === 'light' ? 'loading--dark' : '')}></div>
          : <div className={'inline pr6 ' + mainColor}>{main}</div>
        }
        <div className={'inline txt-s ' + restColor}>{rest}</div>
      </div>
    );
  }
}

PlaceName.propTypes = {
  colors: PropTypes.string,
  location: PropTypes.object,
  onClick: PropTypes.func
};

PlaceName.defaultProps = {
  onClick: function () {}
};

export default PlaceName;
