import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import queryOverpass from 'query-overpass';
import {setStateValue, triggerMapUpdate} from '../actions/index';

class Overpass extends Component {
  constructor() {
    super();

    this.state = {
      focus: null,
      loading: false,
      searchTime: new Date(),
      overpassQuery: null
    };
  }

  onInput(e) {
    this.setState({
      overpassQuery: e.target.value
    });
  }

  onKeyDown(e) {
    switch (e.which) {
    // accept
    case 13:
      console.log(this.state.overpassQuery);
      console.log(queryOverpass(this.state.overpassQuery));
      break;

    default:
      break;
    }
  }

  render() {
    let input = <input
      ref={(input) => { this.input = input; }}
      className={this.props.inputClass}
      onInput={this.onInput.bind(this)}
      onKeyDown={this.onKeyDown.bind(this)}
      value={this.props.overpassQuery}
      onChange={this.onInput.bind(this)}
      placeholder='Overpass Query'
      type='text' />;

    return (

      <div className={this.styles.main}>
        <div className={this.styles.icon}>
          <svg className='icon color-gray'><use xlinkHref='#icon-search'></use></svg>
        </div>
        <div className='w-full'>
          {this.props.inputPosition === 'top' && input}
          {this.props.inputPosition === 'bottom' && input}
        </div>
        <CloseButton
          show={(this.props.overpassQuery !== '' || this.props.overpassQuery !== null)}
          onClick={() => this.closeSearch()}
        />
      </div>
    );
  }

  get styles() {
    return {
      main: 'absolute h42 w-full w420-mm bg-white shadow-darken25 flex-parent flex-parent--row flex-parent--space-between-main',
      icon: 'absolute flex-parent flex-parent--center-cross flex-parent--center-main w42 h42',
      input: 'input px42 h42 border--transparent',
      results: 'results bg-white shadow-darken25 mt6 border-darken10'
    };
  }

  componentDidMount() {
    if (this.props.focusOnMount) this.input.focus();
  }
}

Overpass.propTypes = {
  overpassQuery: PropTypes.string,
  triggerMapUpdate: PropTypes.func,
  writeOverpass: PropTypes.func,
  inputPosition: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  inputClass: PropTypes.string,
  proximity: PropTypes.string,
  bbox: PropTypes.string,
  focusOnMount: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    placeInfo: state.placeInfo,
    searchLocation: state.searchLocation,
    overpassQuery: state.overpassQuery,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    triggerMapUpdate: (repan) => dispatch(triggerMapUpdate(repan)),
    writeOverpass: (input) => dispatch(setStateValue('overpassQuery', input)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overpass);
