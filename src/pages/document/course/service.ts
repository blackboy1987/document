import request from '@/utils/request';
import constants from '@/utils/constants';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function list(params: LoginParamsType) {
  return request(`${constants.memberUrl}course/index`, {
    method: 'POST',
    data: params,
  });
}

export async function download(params: LoginParamsType) {
  return request(`${constants.memberUrl}course/download`, {
    method: 'POST',
    data: params,
  });
}

export async function downloadHits(params: LoginParamsType) {
  return request(`${constants.memberUrl}course/download_hits`, {
    method: 'POST',
    data: params,
  });
}
