import React from 'react'
import {Layout} from 'antd'
import LeftSider from '../sider/LeftSider'
import MainLayout from '../layout/MainLayout'
const {Footer} = Layout;

const config = require("../../components");

class MainPage extends React.Component {
    constructor(props) {
        const headers = JSON.parse(sessionStorage.getItem("headers"));
        if(!headers||!headers.network_id||!headers.user_id){
            location.pathname = "/";
            return;
        }
        super(props);
        this.state = {
            index: [0, 0],
            category: config.components.items[0],
            page: config.components.items[0].subcomponents.items[0]
        }
    }

    resetIndex = (i, j) => {
        console.log("update page...");
        this.setState({
            index: [i, j],
            category: config.components.items[i],
            page: config.components.items[i].subcomponents.items[j]
        });
    }

    render() {
        const {category, page} = this.state;
        return (
            <Layout style={{minHeight: '100vh'}}>
                <LeftSider config={config} resetIndex={this.resetIndex}/>
                <Layout>
                    <MainLayout category={category} page={page}/>
                    <Footer style={{ textAlign: 'center' }}>
                        FreeWheel ©2018 Created by UI
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default MainPage;