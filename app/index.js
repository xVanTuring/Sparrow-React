import React from 'react';
// import { Map } from 'immutable';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { resetApp } from './actions/app';
import { addImages, updateImages } from './actions/image';
import './app.global.css';
import App from './containers/App';
import { configureStore } from './store/configureStore';
import { setFolders } from './actions/folder';

const { ipcRenderer } = require('electron');

const store = configureStore();
ipcRenderer.on('metaLoaded', (event, data) => {
  // full app
  store.dispatch(resetApp(data));
});
ipcRenderer.on('addImages', (event, images) => {
  store.dispatch(addImages(images));
});
ipcRenderer.on('setFolders', (event, folders) => {
  store.dispatch(setFolders(folders));
});
ipcRenderer.on('updateImages', (event, updated) => {
  store.dispatch(updateImages(updated));
  // console.log(updated);
});

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
