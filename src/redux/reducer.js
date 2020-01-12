
import { combineReducers } from 'redux'

import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER,
  REQ_MENU_LIST
} from './action-types'
import { reqMenuTree } from '../api/index'

import storageUtils from "../utils/storageUtils"

import { resolve } from 'path'
const initHeadTitle = ''

function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}

/*
用来管理当前登陆用户的reducer函数
 */
const initUser = storageUtils.getUser()

function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg
      // state.errorMsg = errorMsg  // 不要直接修改原本状态数据
      return { ...state, errorMsg }
    case RESET_USER:
      window.location.reload();
      return {}

    default:
      return state
  }
}

function menuList(state = [], action) {
  switch (action.type) {
    case REQ_MENU_LIST:
      if (!action.data) return state;
      return action.data;
    default:
      return state
  }
}

/*
向外默认暴露的是合并产生的总的reducer函数
管理的总的state的结构:
  {
    headTitle: '首页',
    user: {}
  }
 */
export default combineReducers({
  headTitle,
  user,
  menuList
})