import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from 'antd'

import LinkButton from '../link-button'
import { reqWeather } from '../../api'
import { formateDate } from '../../utils/dateUtils'
import './index.less'
import { logout, reqMenuList, setHeadTitle } from '../../redux/actions'
import User from '../../models/user'
import Menu from '../../models/menu'
import Weather from '../../models/weather'
import menuService  from "../../service/MenuService"

const { connect } = require('react-redux')
const { withRouter } = require('react-router-dom')


interface HeaderReduxTypes {
  headTitle: any;
  user: User;
  menuList: Menu[]
}

interface HeaderTypes extends HeaderReduxTypes {
  setHeadTitle(title: string): Function
  logout(): any;
  reqMenuList(x:any): Function
  location: any;
}
/*
 头部的组件
 */
const Header = (props: HeaderTypes) => {


  // 当前时间字符串
  const [currentTime, setCurrentTime] = useState(formateDate(Date.now()));
  // 天气质量
  const [quality, setQuality] = useState('');
  // 天气的文本
  const [weather, setWeather] = useState('');
  const [intervalId, setIntervalId] = useState();

  const getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    const interId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      setCurrentTime(currentTime);
    }, 1000)
    setIntervalId(interId);
  }

  const getWeather = async () => {
    // 调用接口请求异步获取数据
    const weather: Weather = await reqWeather('101010100')//杭州的城市编码
    // 更新状态
    // setQuality(weather.quality);
    // setWeather(weather.wendu);
  }

  menuService.reqMenuTree().then((x:any)=>{
    props.reqMenuList(x)
  })

  useEffect(() => {
    
    getWeather();
    getTitle();
  }, [props.location.pathname])



  const getTitle = () => {
    const path =props.location.pathname
    // 得到当前请求路径
    let data =  props.menuList
    if(!(data instanceof Array))return;
    data.every((item: Menu) => {
      if (item.key === path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        props.setHeadTitle(item.title)
        return false;
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        // 如果有值才说明有匹配的
        if (cItem) {
          // 取出它的title
          props.setHeadTitle(item.title)
          return false;
        }
      }
    })
  }

  /*
  退出登陆
   */
  const logoutTip = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        logout()
      }
    })
  }

  /*
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
   */
  useEffect(() => {
    console.log("getTime()");
    getTime();
    getWeather();
    // 当前组件卸载之前调用
    return clearInterval(intervalId)
  }, [])

  const username = props.user.username

  // 得到当前需要显示的title
  // const title = this.getTitle()
  const title = props.headTitle
  return (
    <div className="header">
      <div className="header-top">
        <span>欢迎, {username}</span>
        <LinkButton onClick={() => logoutTip()}>退出</LinkButton>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">{title}</div>
        <div className="header-bottom-right">
          <span>{currentTime}</span>
          <span>空气质量：{quality}</span>
          <span>温度：{weather} ℃</span>
        </div>
      </div>
    </div>
  )

}

export default connect(
  (state: HeaderReduxTypes) => ({   headTitle: state.headTitle,
    user: state.user,
    menuList: state.menuList }),
  { logout, reqMenuList, setHeadTitle }
)(withRouter(Header))