import React from 'react'
import {
    Layout,
    Breadcrumb,
    Card,
    Button,
    message,
    Tabs,
    DatePicker,
    Row,
    Select
} from 'antd'
import axios from 'axios'

const {TabPane} = Tabs;
const { MonthPicker } = DatePicker;
const Option = Select.Option;

import '../style/style.css'
import ReportDetailsLayout from "./ReportSubLayout/ReportDetailsLayout";
import {SERVER} from "../config/config";
import ReportDeviceLayout from "./ReportSubLayout/ReportDeviceLayout";
import RepairStatusLayout from "./ReportSubLayout/RepairStatusLayout";
import UserTestLayout from "./ReportSubLayout/UserTestLayout";
import moment from "moment";

export default class ReportLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usertypes: [],
            loading: false,
            date: null,
            user_id: undefined,
            usertype_id: undefined,
            usertypedisabled: false,
            userdisabled:false,
            tabtitle: "报警事件详情"
        }
    }
    componentDidMount() {
        this.getUsers();
    }
    getUsers = () => {
        this.setState({loading:true});
        axios.get( SERVER+'/users').then(res => {
            if(res.status === 200){
                const users = res.data;
                axios.get( SERVER+'/usertypes').then(result => {
                    const usertypes = result.data;
                    if(res.status === 200){
                        this.setState({users:users,usertypes:usertypes, loading:false});
                    }
                }).catch((error) => {
                    console.log(error);
                    message.error('Get all usertypes error!');
                });
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all users error!');
        });
    }
    generatePDF = () => {
        const {usertype_id, user_id, date} = this.state;
        if(!user_id&&!usertype_id){
            message.error("请选择用户类型或用户！");
            return;
        }
        if(user_id&&usertype_id){
            message.error("请确定按照用户类型或用户生成文件！");
            return;
        }
        if(!date){
            message.error("请输入日期！");
            return;
        }
        if(user_id) {
            window.open(SERVER + '/pdf?user_id=' + user_id + '&date=' + date);
        }
        if(usertype_id){
            window.open(SERVER + '/usertypepdf?usertype_id=' + usertype_id + '&date=' + date);
        }
        // axios.get( SERVER+'/pdf').then(res => )
        //     .then(blob => URL.createObjectURL(blob))
        //     .then(url => window.open(url))
        //     .catch((error) => {
        // });
    }
    monthChange = (value) => {
        if(value) {
            this.setState({date: value.format('YYYY-MM')});
        }else {
            this.setState({date: null});
        }
    }
    userChange = (value) => {
        if(value) {
            this.setState({user_id: value, usertype_id:undefined, usertypedisabled:true});
        } else {
            this.setState({user_id:undefined, usertypedisabled:false});
        }
    }
    userTypeChange = (value) => {
        if(value) {
            this.setState({usertype_id: value, user_id:undefined, userdisabled:true});
        } else {
            this.setState({usertype_id:undefined, userdisabled:false});
        }
    }
    tabOnChange = (activeKey) => {
        if(activeKey === "1"){
            this.setState({tabtitle:"报警事件详情"});
        }else if(activeKey === "2"){
            this.setState({tabtitle:"报警设备自检异常情况"});
        }else if(activeKey === "3"){
            this.setState({tabtitle:"报警系统维修情况"});
        }else{
            this.setState({tabtitle:"用户测试"});
        }
    }
    render() {
        const monthFormat = 'YYYY-MM';
        const {users, usertypes} = this.state;
        const options = [];
        users.forEach(function (v) {
            options.push(<Option value={v.id}>{v.username+"-"+v.device_id}</Option>)
        });
        const usertypeoptions = [];
        usertypes.forEach(function (v) {
            usertypeoptions.push(<Option value={v.id}>{v.type}</Option>)
        });
        return (
            <Layout>
                <Breadcrumb style={{margin: '10px 16px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>报警事件管理</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.tabtitle}</Breadcrumb.Item>
                </Breadcrumb>
                    <Card loading={this.state.loading} style={{margin: '0px 16px 10px 16px', background: '#fff', minHeight: '100vh'}}>
                        <Row>
                            <div style={{float:"right"}}>
                                <Select disabled={this.state.usertypedisabled} value={this.state.usertype_id} allowClear showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="选择用户类型" style={{width:"200px"}} dropdownMatchSelectWidth={false} onChange={this.userTypeChange}>{usertypeoptions}</Select>&nbsp;
                                <Select disabled={this.state.userdisabled} value={this.state.user_id} allowClear showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="选择用户" style={{width:"200px"}} dropdownMatchSelectWidth={false} onChange={this.userChange}>{options}</Select>&nbsp;
                                <MonthPicker format={monthFormat} onChange={this.monthChange}/>&nbsp;
                                <Button type="primary" onClick={this.generatePDF}>生成表格文件</Button>
                            </div>
                        </Row>
                        <Row><Tabs defaultActiveKey="1" onChange={this.tabOnChange}>
                            <TabPane tab="报警事件详情" key="1"><ReportDetailsLayout users={this.state.users}/></TabPane>
                            <TabPane tab="报警设备自检异常情况" key="2"><ReportDeviceLayout users={this.state.users}/></TabPane>
                            <TabPane tab="报警系统维修情况" key="3"><RepairStatusLayout users={this.state.users}/></TabPane>
                            <TabPane tab="用户测试" key="4"><UserTestLayout users={this.state.users}/></TabPane>
                        </Tabs></Row>
                    </Card>
            </Layout>
        );
    }
}