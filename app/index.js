import React from 'react';
import _ from 'lodash';
import { Set } from 'immutable';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { resetApp } from './actions/app';
import { addImages, updateImages } from './actions/image';
import './app.global.css';
import App from './containers/App';
import { configureStore } from './store/configureStore';
import { setFolders } from './actions/folder';
import updateFolders from './utils/utils';
import { ImageType } from './types/app';
import { setTags } from './actions/tags';

const { ipcRenderer } = require('electron');

const store = configureStore();
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
  store.dispatch(setFolders(folders));
});
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
