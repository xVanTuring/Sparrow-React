import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Left from '../components/left/Left';
import Center from '../components/center/Center';
import Right from '../components/right/Right';

type Props = {
  store: {}
};
class App extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <div className="App">
          <Left />
          <Center />
          <Right />
        </div>
      </Provider>
    );
  }
}

export default App;
