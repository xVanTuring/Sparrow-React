import React from 'react';
import _ from 'lodash';
import { Set } from 'immutable';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { resetApp, setInitStatus } from './actions/app';
import { addImages, updateImages } from './actions/image';
import './app.global.css';
import App from './containers/App';
import { configureStore } from './store/configureStore';
import { setFolders } from './actions/folder';
import updateFolders from './utils/utils';
import { ImageType } from './types/app';
import { setTags } from './actions/tags';

const { ipcRenderer, remote } = require('electron');
const fse = require('fs-extra');
const settings = require('electron-settings');

const { app } = remote;
let store = null;
const worker = new Worker('./worker.js');
const rootDir = settings.get('rootDir');
worker.onmessage = (e) => {
  switch (e.data.id) {
    case 'done-loadLibrary':
      store = configureStore({
        initStatus: false
      });
      doRender();
      break;
    case 'done-createLibrary':
      store.dispatch(setInitStatus(false));
      break;
    default:
      break;
  }
};
worker.postMessage({
  id: 'setDefaultValue',
  data: {
    appName: app.getName(),
    configPath: app.getPath('userData')
  }
});
if (rootDir == null) {
  store = configureStore({
    initStatus: true
  });
  doRender();
} else {
  const exists = fse.existsSync(rootDir);
  if (exists) {
    worker.postMessage({
      id: 'loadLibrary',
      data: {
        libraryPath: rootDir
      }
    });
  } else {
    store = configureStore({
      initStatus: true
    });
    doRender();
  }
}


ipcRenderer.on('metaLoaded', (event, data: { folders: [], images: ImageType[], basePath: string, historyTags: [] }) => {
  const newData = _.cloneDeep(data);
  updateFolders(newData.folders);
  let tags = Set(newData.historyTags);
  delete newData.historyTags;
  newData.images.forEach(item => {
    tags = tags.union(item.tags);
  });
  newData.tags = tags.toArray();
  store.dispatch(resetApp(newData));
});
ipcRenderer.on('addImages', (event, data) => {
  store.dispatch(addImages(data));
});
ipcRenderer.on('setFolders', (event, folders) => {
  updateFolders(folders);
  store.dispatch(setFolders(folders));
});
// [updatedImageMeta:[],updatedHistoryTags]
ipcRenderer.on('updateImages', (event, data) => {
  store.dispatch(updateImages(data[0]));
  let tags = Set(store.getState().tags);
  if (data[1]) {
    // hist updated
    tags = Set(data[1]);
  }
  store.getState().images.forEach(item => {
    tags = tags.union(item.tags);
  });
  console.log(tags);
  store.dispatch(setTags(tags.toArray()));
});
ipcRenderer.on('setLibraryPath', (event, libraryPath) => {
  settings.set('rootDir', libraryPath);
  worker.postMessage({
    id: 'createLibrary',
    data: {
      libraryPath
    }
  });
});

function doRender() {
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
}

