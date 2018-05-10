import React from 'react';
// import { Map } from 'immutable';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from './containers/App';
import { configureStore } from './store/configureStore';
import './app.global.css';
import { resetApp } from './actions/app';
import { addImages } from './actions/image';
// import { setFolders } from './actions/folder';
// import { setImage } from './actions/image';

const { ipcRenderer } = require('electron');

const store = configureStore();
ipcRenderer.on('metaLoaded', (event, data) => {
  store.dispatch(resetApp(data));
});
ipcRenderer.on('addImages', (event, images) => {
  store.dispatch(addImages(images));
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
