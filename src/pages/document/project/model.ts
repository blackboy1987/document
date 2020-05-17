import { Effect, Reducer } from 'umi';

import { list, download, downloadHits } from './service';
import { ProjectItem } from '@/pages/document/project/data';

export interface StateType {
  list: ProjectItem[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    list: Effect;
    download: Effect;
    downloadHits: Effect;
  };
  reducers: {
    listInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'project',

  state: {
    list: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'listInfo',
        payload: Array.isArray(response) ? response : [],
      });
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

  reducers: {
    listInfo(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },
};

export default Model;
