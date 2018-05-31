import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Slider from 'rc-slider';
import { setImageHeight } from '../../actions/image';

type TopControllerProps = {
  setImageHieght: (height) => void
};

class TopController extends PureComponent<TopControllerProps> {
  handleSliderChange = (v) => {
    this.props.setImageHieght(Math.ceil(200 * v));
  }
  render() {
    return (
      <div
        className="bottom_border"
        style={{
          height: 32,
          background: '#535353',
        }}
      >
        <Slider
          style={{
            width: 120,
            margin: '8px auto'
          }}
          min={0.5}
          max={2}
          step={0.1}
          defaultValue={1}
          onChange={this.handleSliderChange}
        />
      </div>
    );
  }
}
const mapStateToProps = () => (
  {
  }
);
const mapDispatchToProps = (dispatch) => (
  {
    setImageHieght: (height) => {
      dispatch(setImageHeight(height));
    }
  }
);
export default connect(mapStateToProps, mapDispatchToProps)(TopController);
