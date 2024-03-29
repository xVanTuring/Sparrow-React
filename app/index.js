import React from 'react';
// import _ from 'lodash';
import { List, Set } from 'immutable';
import { ipcRenderer } from 'electron';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
// import { resetApp, setInitStatus } from './actions/app';
// import { addImages, updateImages } from './actions/image';
import './app.global.css';
import App from './containers/App';
import Loading from './components/welcome/Loading';
import { configureStore } from './store/configureStore';
import { resetApp } from './actions/app';
import { addImages, updateImages } from './actions/image';

let store = null;

ipcRenderer.on('go-welcome', () => {
  console.log('go-welcome');
  store = configureStore();
  doRender();
});
ipcRenderer.on('done-loadLibrary', (event, data) => {
  console.log('done-loadLibrary');
  if (store != null) {
    console.log('233');
    store.dispatch(resetApp(data));
  } else {
    store = configureStore({
      initStatus: false,
      folders: data.folders,
      images: List(data.images),
      tags: Set(data.tags)
    });
    doRender();
  }
});
ipcRenderer.on('imageAdded', (event, imgMeta) => {
  store.dispatch(addImages([imgMeta]));
});
ipcRenderer.on('imageUpdated', (eve, newImageMeta) => {
  store.dispatch(updateImages([newImageMeta]));
});
function doRender() {
  setTimeout(() => {
    render(
      <AppContainer>
        <Provider store={store}>
          <App />
        </Provider>

      </AppContainer>,
      document.getElementById('root')
    );
  }, 100);
}

render(
  <Loading />,
  document.getElementById('root')
);

