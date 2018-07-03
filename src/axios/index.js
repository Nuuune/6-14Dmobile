import axios from 'axios';
import { config } from './config';
import qs from 'qs';

const header_config = {
  corpKey: `4`,
  token: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjYjkwYjdhZGEwMTA0NDc0OGY1MjIwMzJkNjJmMDYxZiIsInVuaW9uaWQiOiJjYjkwYjdhZGEwMTA0NDc0OGY1MjIwMzJkNjJmMDYxZiIsImlzcyI6ImxhbmRhIiwiYXVkIjoiTEFOREFfTUFTX1NTTyIsImV4cCI6MTUyOTgzNDE3NCwibmJmIjoxNTI5NjYxMzc0fQ.hYpA4pU8T6oLJ4TVjMFg3Uz1kA3fE8Sh5VHY554trCw`
};

function _change_token(newOne) {
  header_config.token = newOne;
};

function _change_corpKey(newOne) {
  header_config.corpKey = newOne;
};

export function set_headerConf(config = {}) {
  config.token && _change_token(config.token);
  config.corp_key && _change_corpKey(config.corp_key);
};

const instance = axios.create(config);
// formdata格式传递数据
// export const get = function(url, params) {
//   const fd = new FormData();
//   if (params) {
//     for (const item in params) {
//       fd.append(item, params[item]);
//     }
//   }
//   return new Promise((resolve, reject) => {
//     instance.get(url, fd)
//     .then(resp => {
//       // 网络出错
//       if (resp.status !== 200) {
//         reject(`网络出错`);
//       } else {
//         // 服务器内部信息
//         if (resp.data.errcode !== 40000) {
//           reject(resp.data.errmsg);
//         } else {
//           resolve(resp.data.data);
//         }
//       }
//     })
//     .catch(() => {
//       reject(`请求出错`);
//     });
//   });
// };
//
// export const post = function(url, params) {
//   const fd = new FormData();
//   if (params) {
//     for (const item in params) {
//       fd.append(item, params[item]);
//     }
//   }
//   return new Promise((resolve, reject) => {
//     instance.post(url, fd)
//     .then(resp => {
//       // 网络出错
//       if (resp.status !== 200) {
//         reject(`网络出错`);
//       } else {
//         // 服务器内部信息
//         if (resp.data.errcode !== 40000) {
//           reject(resp.data.errmsg);
//         } else {
//           resolve(resp.data.data);
//         }
//       }
//     })
//     .catch(() => {
//       reject(`请求出错`);
//     });
//   });
// };

// json格式传递数据
export const get = function(url, params) {
  const _qs = params ? qs.stringify(params, { arrayFormat: 'brackets' }) : null;
  let _url;
  if (_qs) {
    _url = `${url}?${_qs}`;
  } else {
    _url = url;
  }
  return new Promise((resolve, reject) => {
    instance.get(_url, { headers: header_config })
    .then(resp => {
      // 网络出错
      if (resp.status !== 200) {
        reject(`网络出错`);
      } else {
        // 服务器内部信息
        if (resp.data.errcode !== `40000`) {
          reject(resp.data.errmsg);
        } else {
          resolve(resp.data.data);
        }
      }
    })
    .catch(() => {
      reject(`请求出错`);
    });
  });
};

export const post = function(url, params) {
  return new Promise((resolve, reject) => {
    // const _qs = params ? qs.stringify(params, { arrayFormat: 'brackets' }) : null;
    // let _url;
    // if (_qs) {
    //   _url = `${url}?${_qs}`;
    // } else {
    //   _url = url;
    // }
    instance.post(url, params, { headers: header_config })
    .then(resp => {
      // 网络出错
      if (resp.status !== 200) {
        reject(`网络出错`);
      } else {
        // 服务器内部信息
        if (resp.data.errcode !== `40000`) {
          reject(resp.data.errmsg);
        } else {
          resolve(resp.data.data);
        }
      }
    })
    .catch(() => {
      reject(`请求出错`);
    });
  });
};
