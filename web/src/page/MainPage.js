import React from 'react'
import {Layout,Icon} from 'antd'
const {Header,Content} = Layout;
import LeftSider from '../sider/LeftSider'

import '../style/style.css'
import {Redirect, Route, Switch} from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import ReportLayout from "../layout/ReportLayout";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                </Header>
                <Layout>
                    <LeftSider collapsed={this.state.collapsed}/>
                            <Switch>
                                <Route exact path='/' component={ReportLayout}/>
                                <Route path='/main' component={ReportLayout}/>
                                <Route path='/user' component={UserLayout}/>
                                <Redirect to="/" />
                            </Switch>
                </Layout>
            </Layout>
        );
    }
}

export default MainPage;