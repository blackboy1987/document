import { Effect, Reducer } from 'umi';

import { ResourceListItem } from '@/pages/document/data';
import { list, downloadHits,detail } from './service';

export interface StateType {
  list: ResourceListItem[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    list: Effect;
    downloadHits: Effect;
    detail: Effect;
  };
  reducers: {
    listInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'course',

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
    *downloadHits({ payload, callback }, { call }) {
      const response = yield call(downloadHits, payload);
      if (callback) {
        callback(response);
      }
    },

    *detail({ payload, callback }, { call }) {
      const response = yield call(detail, payload);
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
