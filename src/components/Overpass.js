import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import {getOverpassData, setStateValue, triggerMapUpdate} from '../actions/index';

class Overpass extends Component {
  constructor() {
    super();

    this.state = {
      focus: null,
      loading: false,
    };
  }

  onInput(e) {
    this.props.writeOverpassQuery(e.target.value);
  }

  onKeyPress(e) {
    if (e.which === 13) {
      this.props.getOverpassData(this.props.overpassQuery);
    }
  }

  render() {
    let input = <input
      ref={(input) => { this.input = input; }}
      className={this.props.inputClass}
      // onInput={this.onInput.bind(this)}
      onKeyPress={this.onKeyPress.bind(this)}
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
          {input}
        </div>
        <CloseButton
          show={(this.props.overpassQuery !== '' && this.state.overpassQuery !== null)}
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
  getOverpassData: PropTypes.func,
  focusOnMount: PropTypes.bool,
  inputPlaceholder: PropTypes.string,
  inputClass: PropTypes.string,
  overpassQuery: PropTypes.string,
  overpassData: PropTypes.object,
  triggerMapUpdate: PropTypes.func,
  writeOverpassData: PropTypes.func,
  writeOverpassQuery: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    overpassQuery: state.overpassQuery,
    overpassData: state.overpassData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOverpassData: (query) => dispatch(getOverpassData(query)),
    triggerMapUpdate: (repan) => dispatch(triggerMapUpdate(repan)),
    writeOverpassQuery: (query) => dispatch(setStateValue('overpassQuery', query)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overpass);
