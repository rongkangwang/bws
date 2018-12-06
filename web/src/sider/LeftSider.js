import React from 'react'
import {Layout, Menu, Icon} from 'antd'
import {NavLink} from "react-router-dom";
import 'antd/dist/antd.css';
const {Sider} = Layout;

import '../style/style.css';

export default class LeftSider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
        };
        console.log(this.props);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.collapsed !== this.props.collapsed) {
            this.setState({
                collapsed: nextProps.collapsed,
            });
        }
    }
    // onCollapse = (collapsed) => {
    //     this.setState({ collapsed });
    // }
    render(){
        return (<Sider trigger={null} collapsible collapsed={this.state.collapsed} defaultCollapsed={true}>
            <Menu theme="dark" mode="inline"
                  defaultSelectedKeys="2"
                  style={{ height: '100%' }}>
                <Menu.Item key="2">
                    <NavLink to="/main">
                        <Icon type="warning" />
                        <span>报警事件管理</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="1">
                    <NavLink to="/user">
                        <Icon type="user" />
                        <span>用户管理</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
        </Sider>);
    }
}