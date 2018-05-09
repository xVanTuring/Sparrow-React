import React from 'react';
// import { Map } from 'immutable';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from './containers/App';
import { configureStore } from './store/configureStore';
import './app.global.css';
import { setFolders } from './actions/folder';
import { setImage } from './actions/image';

const { ipcRenderer } = require('electron');

const imgPath = [
  '/home/xvan/Sparrow/1/1.png',
  '/home/xvan/Sparrow/2/2.jpg',
  '/home/xvan/Sparrow/3/3.jpg',
  '/home/xvan/Sparrow/4/4.jpg'
];
const store = configureStore();
ipcRenderer.on('metaLoaded', (event, msg) => {
  console.log('meta data Got');
  let data = JSON.parse(msg);
  store.dispatch(setFolders(data.folders));
  store.dispatch(setImage(imgPath));
});
// setTimeout(() => {
//   setInterval(() => {
//     store.dispatch(setFolders([1, 2, 3]));
//   }, 3000);
// }, 1000);
render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>

  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextRoot = require('./containers/App'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
