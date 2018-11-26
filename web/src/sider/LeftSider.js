import React from 'react'
import {Layout, Menu, Button} from 'antd'
import 'antd/dist/antd.css';
const {SubMenu} = Menu;
const {Sider} = Layout;

const menus = [];

export default class LeftSider extends React.Component{
    constructor(props){
        super(props);
        const config = props.config;
        for(let i = 0; i < config.components.items.length; i++){
            const component = config.components.items[i];
            const submenus = [];
            for(let j = 0; j < component.subcomponents.items.length; j++){
                const subcomponent = component.subcomponents.items[j];
                submenus.push(<Menu.Item onClick={() => this.setCurrentPage(i,j)} key={subcomponent.name.toLowerCase()}>
                    {subcomponent.name}
                </Menu.Item>);
            }
            menus.push(<SubMenu key={component.name.toLowerCase()} title={component.name}>
                {submenus}
            </SubMenu>);
        }
    }
    setCurrentPage = (i, j) => {
        this.props.resetIndex(i,j);
    }
    render(){
        return (<Sider width={250}>
            <Menu mode="inline"
                  defaultSelectedKeys={['placements']}
                  defaultOpenKeys={['ads']}
                  style={{ height: '100%' }}>
                {menus}
            </Menu>
        </Sider>);
    }
}