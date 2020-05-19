import { Effect } from 'umi';

import { ToolListItem } from '@/pages/document/tool/data';
import { list, download, downloadHits } from './service';

export interface StateType {
  list: ToolListItem[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    list: Effect;
    download: Effect;
    downloadHits: Effect;
  };
}

const Model: ModelType = {
  namespace: 'tool',

  state: {
    list: [],
  },

  effects: {
    *list({ payload, callback }, { call }) {
      const response = yield call(list, payload);
      if (callback) {
        callback(Array.isArray(response) ? response : []);
      }
    },
    *download({ payload, callback }, { call }) {
      const response = yield call(download, payload);
      if (callback) {
        callback(response);
      }
    },
    *downloadHits({ payload, callback }, { call }) {
      const response = yield call(downloadHits, payload);
      if (callback) {
        callback(response);
      }
    },
  },
};

export default Model;
