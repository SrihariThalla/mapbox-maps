import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import MapComponent from './Map';
import Search from './Search';
import Directions from './Directions';
import Overpass from './Overpass';
// import StyleSwitch from './StyleSwitch';

class App extends Component {
  render() {
    return (
      <div className='root'>
        <MapComponent/>
        <div className='relative m12 m24-mm w420-mm flex-parent flex-parent--column'>
          {
            <Overpass
              onSelect={(data) => this.onSelect(data)}
              resultsClass={this.styles.results}
              inputClass={this.styles.input}
              focusOnMount
              inputPosition="top"
            />
          }
        </div>

        {
          /*(window.innerWidth > 640)
          ? <div className='style-switch absolute bottom mb36 mx12 border border--2 border--white shadow-darken25'>
            <StyleSwitch/>
          </div>
          : null*/
        }
      </div>
    );
  }

  switchModes() {
    let mode;

    console.log(this.props.mode);

    switch (this.props.mode) {
      case 'search':
        mode = <Search/>;
        break;

      case 'directions':
        mode = <Directions/>;
        break;

      case 'overpass':
        mode = <Overpass/>;
        break

      default:
        mode = <Search/>;
    }

    return mode;
  }

  get styles() {
    return {
      main: 'absolute h42 w-full w420-mm bg-white shadow-darken25 flex-parent flex-parent--row flex-parent--space-between-main',
      icon: 'absolute flex-parent flex-parent--center-cross flex-parent--center-main w42 h42',
      input: 'input px42 h42 border--transparent',
      results: 'results bg-white shadow-darken25 mt6 border-darken10'
    };
  }
}

App.propTypes = {
  mode: PropTypes.string,
  route: PropTypes.object,
  routeStatus: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    route: state.route,
    routeStatus: state.routeStatus
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
