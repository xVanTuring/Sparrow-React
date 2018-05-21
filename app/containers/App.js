import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Left from '../components/left/Left';
import Center from '../components/center/Center';
import Right from '../components/right/Right';
import { setAlt } from '../actions/keys';

type Props = {
  setAltStatus: (status: boolean) => void
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
      <div className="App">
        <Left />
        <Center />
        <Right />
      </div>

    );
  }
}
const mapStateToProps = (state) => {
  return {
  };
};
const mapDispatchToProps = (dispatch) => ({
  setAltStatus: (status) => {
    dispatch(setAlt(status));
  }

});


const ContextApp = DragDropContext(HTML5Backend)(App);
export default connect(mapStateToProps, mapDispatchToProps)(ContextApp);
