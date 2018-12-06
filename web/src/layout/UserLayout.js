import React from 'react'
import {
    Layout,
    Input,
    Breadcrumb,
    Table,
    Select,
    message,
    Icon,
    Button,
    Modal,
    Form,
    Popconfirm, Row, Tabs, Card
} from 'antd'
import axios from 'axios'

const {Content} = Layout;
const FormItem = Form.Item;

import '../style/style.css'
import {SERVER} from "../config/config";
import ReportDetailsLayout from "./ReportSubLayout/ReportDetailsLayout";
import ReportDeviceLayout from "./ReportSubLayout/ReportDeviceLayout";
import RepairStatusLayout from "./ReportSubLayout/RepairStatusLayout";
import UserTestLayout from "./ReportSubLayout/UserTestLayout";
import UserSubLayout from "./UserSubLayout/UserSubLayout";


class UserLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            usertypes:[]
        };
    }
    componentDidMount() {
        this.getUserTypes();
    }
    getUserTypes = () => {
        this.setState({loading:true});
        axios.get( SERVER+'/usertypes').then(res => {
            if(res.status === 200){
                this.setState({usertypes:res.data, loading:false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all usertypes error!');
        });
    }
    render() {
        return (
            <Layout>
                <Breadcrumb style={{margin: '10px 16px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                <Card loading={this.state.loading} style={{margin: '0px 16px 10px 16px', background: '#fff', minHeight: '100vh'}}>
                    <UserSubLayout usertypes={this.state.usertypes} getUserTypes={this.getUserTypes}/>
                </Card>
            </Layout>
         );
    }
}
export default Form.create()(UserLayout);