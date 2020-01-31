import React, { useEffect } from 'react'
import UserModel from '../../models/user';
import { Layout } from 'antd'

import Home from '../home/home'
import Role from '../role/role'
import User from '../user/user'
import Header from '../../components/header'
import Menu from '../../models/menu';
import Category from '../category/category'
import Product from '../product/product'
import { reqMenuList, setHeadTitle } from '../../redux/actions'
import LeftNav from '../../components/left-nav';

import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'

const { Redirect, Route, Switch } = require('react-router-dom')

const { connect } = require('react-redux')

const { Footer, Sider, Content } = Layout

function Admin(props: any) {

  const user = props.user
  // 如果内存没有存储user ==> 当前没有登陆
  if (!user || !user._id) {
    // 自动跳转到登陆(在render()中)
    return <Redirect to='/login' />
  }

  return (
    <Layout style={{ minHeight: '100%' }}>

      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{ margin: 20, backgroundColor: '#fff' }}>
          <Switch>
            <Redirect exact from='/' to='/home' />
            <Route path='/home' component={Home} />
            <Route path='/category' component={Category} />
            <Route path='/product' component={Product} />
            <Route path='/role' component={Role} />
            <Route path='/user' component={User} />
            <Route path='/charts/bar' component={Bar} />
            <Route path='/charts/line' component={Line} />
            <Route path='/charts/pie' component={Pie} />
            <Route component={NotFound} /> {/*上面没有一个匹配, 直接显示*/}
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#cccccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
      </Layout>
    </Layout>
  )
}

export default connect(
  (state: { user: UserModel; menuList: Array<Menu> }) => ({ user: state.user, menuList: state.menuList }),
  { reqMenuList, setHeadTitle }
)(Admin)