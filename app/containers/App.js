import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Left from '../components/left/Left';
import Center from '../components/center/Center';
import Right from '../components/right/Right';

type Props = {
};
class App extends Component<Props> {
  // componentDidMount() {
  //   document.addEventListener('keydown', this.escFunction, false);
  // }
  // componentWillUnmount() {
  //   document.addEventListener('keydown', this.escFunction, false);
  // }
  // escFunction = (event) => {
  //   if (event.keyCode === 27) {
  //     console.log('ESC');
  //   }
  // }
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
  onEscClicked: () => {

  }

});


const ContextApp = DragDropContext(HTML5Backend)(App);
export default connect(mapStateToProps, mapDispatchToProps)(ContextApp);
