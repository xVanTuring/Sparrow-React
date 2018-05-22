import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Left from '../components/left/Left';
import Center from '../components/center/Center';
import Right from '../components/right/Right';
import { setAlt } from '../actions/keys';
import WelCome from '../components/welcome/Welcome';


type Props = {
  setAltStatus: (status: boolean) => void,
  initStatus: boolean
};
class App extends Component<Props> {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
  handleKeyDown = (e) => {
    if (e.keyCode === 18) {
      this.props.setAltStatus(true);
    }
  }
  handleKeyUp = (e) => {
    if (e.keyCode === 18) {
      this.props.setAltStatus(false);
    }
  }

  render() {
    return (
      <div
        className="App"
      >

        {
          this.props.initStatus ? <WelCome /> :
            (
              [
                <Left key="left" />,
                <Center key="center" />,
                <Right key="right" />
              ]
            )
        }


      </div>

    );
  }
}
const mapStateToProps = (state) => {
  return {
    initStatus: state.initStatus
  };
};
const mapDispatchToProps = (dispatch) => ({
  setAltStatus: (status) => {
    dispatch(setAlt(status));
  }

});


const ContextApp = DragDropContext(HTML5Backend)(App);
export default connect(mapStateToProps, mapDispatchToProps)(ContextApp);
