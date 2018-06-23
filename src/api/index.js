import { get, post, set_headerConf } from '@/axios';

/**
 * 登陆服务器拿到服务器那边的token
 * @param  {Object} option {
 *  Params Object 所需的一些请求body
 *  success fn 成功之后的回调
 *  fail fn 失败之后的回调
 * }
 * @return void
 */
export const api_login = function(option = {}) {
  const params = option.params ? option.params : {};
  console.log(params);
  post(`/app/login`, params)
  .then(data => {
    set_headerConf({
      token: data.access_token
    });
    option.success && option.success(data);
  })
  .catch(errMsg => {
    option.fail && option.fail(errMsg);
  });
};

/**
 * 打卡操作
 * @param  {Object} option {
 *  Params Object 所需的一些请求body
 *  success fn 成功之后的回调
 *  fail fn 失败之后的回调
 * }
 * @return void
 */
export const api_checkin = function(option = {}) {
  const params = option.params ? option.params : {};
  post(`/app/checkin`, params)
  .then(data => {
    option.success && option.success(data);
  })
  .catch(errMsg => {
    option.fail && option.fail(errMsg);
  });
};

export const api_records = function(option = {}) {
  const params = option.params ? option.params : {};
  get(`/app/records`, params)
  .then(data => {
    option.success && option.success(data);
  })
  .catch(errMsg => {
    option.fail && option.fail(errMsg);
  });
};

export const api_stat = function(option = {}) {
  const params = option.params ? option.params : {};
  get(`/app/stat`, params)
  .then(data => {
    option.success && option.success(data);
  })
  .catch(errMsg => {
    option.fail && option.fail(errMsg);
  });
};
