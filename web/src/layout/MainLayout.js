import React from 'react'
import {Layout, Input, Breadcrumb, Card, Row, Col, Button, Table, List, Select, Icon, Drawer, message, Divider, Radio} from 'antd'
import axios from 'axios'
import ReactJson from 'react-json-view'
const {Content} = Layout;
const {Option} = Select;
const InputGroup = Input.Group;

import '../style/style.css'

import {SERVER} from "../config/config"

export default class MainLayout extends React.Component{
    constructor(props) {
        super(props);
        const state = {
            category: props.category,
            page: props.page,
            loading: false,
            dataSource : [],
            show_type : props.page.show_types?(props.page.show_types.length>0?props.page.show_types[0]:(props.show_type?props.show_type:"")):(props.show_type?props.show_type:""),
            drawer_visible: false,
            drawer_list:[],
            jsonDisplay: "none",
            jsonDataSource: {}
        };
        for(let i = 0; i < props.page.search_fields.length; i++){
            state[props.page.search_fields[i]] = "";
        }
        if(props.page.search_params) {
            for (let i = 0; i < props.page.search_params.length; i++) {
                state[props.page.search_params[i]] = "";
            }
        }
        // if(props.page.sub_resources) {
        //     for (let i = 0; i < props.page.sub_resources.length; i++) {
        //         state[props.page.sub_resources[i][props.page.sub_resources[i].resource + "isselect"]] = false;
        //         state[props.page.sub_resources[i].resource] = "";
        //     }
        // }
        this.state = state;
    }
    componentWillReceiveProps(nextProps) {
        const state = {
            loading:false,
            category: nextProps.category,
            page: nextProps.page,
            loading: false,
            dataSource : [],
            show_type : nextProps.page.show_types?(nextProps.page.show_types.length>0?nextProps.page.show_types[0]:(nextProps.show_type?nextProps.show_type:"")):(nextProps.show_type?nextProps.show_type:""),
            jsonDisplay: "none",
            jsonDataSource: {}
        };
        for(let i = 0; i < nextProps.page.search_fields.length; i++){
            state[nextProps.page.search_fields[i]] = "";
        }
        if(nextProps.page.search_params) {
            for (let i = 0; i < nextProps.page.search_params.length; i++) {
                state[nextProps.page.search_params[i]] = "";
            }
        }
        if(nextProps.page.sub_resources) {
            for (let i = 0; i < nextProps.page.sub_resources.length; i++) {
                state[nextProps.page.sub_resources[i][nextProps.page.sub_resources[i].resource + "isselect"]] = false;
                state[nextProps.page.sub_resources[i].resource] = "";
            }
        }
        // if(nextProps.page.service) {
        //     this.setState({loading: true});
        //     this.getAllData(state);
        // } else {
        //     this.setState(state);
        // }
        this.setState(state);
    }
    getAllData = (state) => {
        const {page} = state;
        const search = {};
        search["domain"] = page.service;
        search["endpoint"] = page.endpoint;
        this.setState({loading:true});
        axios.get(SERVER + '/api/items', {
            params: search
        }).then(res => {
            console.log(res);
            if(res.status === 200){
                state.dataSource =  res.data.data.items;
                this.setState(state);
            } else {
                state.loading = false;
                this.setState(state);
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get placements error!');
            state.loading = false;
            this.setState(state);
        });
    }
    setValue = (e) => {
        const state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    setShowtypeValue = (value) => {
        this.setState({show_type:value});
    }
    viewInfo = () => {
        const headers = JSON.parse(sessionStorage.getItem("headers"));
        // console.log(headers);
        if(!headers||!headers.network_id||!headers.user_id){
            location.pathname = "/";
            return;
        }
        const {page, show_type} = this.state;
        const search = {search_fields:"", search_params:""};
        search["domain"] = page.service;
        search["endpoint"] = page.endpoint;
        search["show_type"] = show_type;
        search["network_id"] = headers.network_id;
        search["user_id"] = headers.user_id;

        for(let i = 0; i < page.search_fields.length; i++){
            if(this.state[page.search_fields[i]]){
                search.search_fields +=  this.state[page.search_fields[i]];
            }
        }
        // if(page.sub_resources){
        //     for (let i = 0; i < page.sub_resources.length; i++) {
        //         if(this.state[page.sub_resources[i].resource+"isselect"] === true){
        //             search.search_fields += "/" + page.sub_resources[i].resource;
        //             if(this.state[page.sub_resources[i].resource]){
        //                 search.search_fields += "/" + this.state[page.sub_resources[i].resource];
        //             }
        //         }
        //     }
        // }
        if(page.search_params) {
            if(page.search_params.length > 0){
                if(this.state[page.search_params[0]]) {
                    search.search_params += page.search_params[0] + "=" + this.state[page.search_params[0]];
                }
            }

            for (let i = 1; i < page.search_params.length; i++) {
                if (this.state[page.search_params[i]]) {
                    search.search_params += "&" + page.search_params[i] + "=" + this.state[page.search_params[i]];
                }
            }
        }
        if(!search.search_fields&&!search.search_params){
            message.error("Please check your search!");
            return;
        }
        this.setState({loading:true});
        // var instance = axios.create({
        //     baseURL: SERVER,
        //     timeout: 1000,
        //     proxy: {
        //         host: '127.0.0.1',
        //         port: 8082
        //     },
        //     params: {
        //         ID: search
        //     },
        // });
        // instance.get('/item').then(res=>{
        //     console.log(res.data);
        // });
        axios.get('/api/item', {
            params: search
        }).then(res => {
            console.log(res);
            if(res.status === 200){
                if(res.data.errors){
                    this.setState({loading:false});
                    message.error(res.data.errors[0].message);
                    return;
                }
                const data = [];
                if(Array.isArray(res.data.data)){
                    this.setState({loading:false, dataSource:res.data.data});
                } else{
                    data.push(res.data.data);
                    this.setState({loading:false, dataSource:data});
                }
            }
        }).catch((error) => {
            this.setState({loading:false});
            console.log(error);
            message.error('Get ' + page.name + ' error!');
        });
    }
    showDrawer = (index) => {
        const {page, dataSource} = this.state;
        const ps = [];
        for(let i = 0; i < page.show_fields.length; i++){
            ps.push(<div><b>{page.show_field_titles?page.show_field_titles[i]:page.show_fields[i].toUpperCase()}:</b><p> {dataSource[index][page.show_fields[i]]}</p></div>)
        }
        this.setState({
            drawer_list:ps,
            drawer_visible: true,
        });
    }
    closeDrawer = () => {
        this.setState({
            drawer_visible: false,
        });
    };
    renderItem = (item) => {
        const items = [];
        const {page} = this.state;
        for(let i = 0; i < page.show_fields.length; i++){
            items.push(<Col span={4}><div><List.Item.Meta title={page.show_fields[i].toUpperCase()} description={item[page.show_fields[i]]}></List.Item.Meta></div></Col>);
        }
        const rows = [];
        const s = parseInt(items.length/6);
        for(let i = 0; i < s+1; i++){
            rows.push(<Row>{items.slice(i*6, (i+1)*6)}</Row>);
        }
        return (
        <List.Item>
            <div>{rows}</div>
        </List.Item>
    )}
    expandedRowRender = (record) => {
        return (<ReactJson name="json" src={record} iconStyle="square"/>);
    }
    selectresource = (value, option, text) => {
        if(value!=="0"){
            this.state[text + "isselect"] = true;
        }else {
            this.state[text + "isselect"] = false;
        }
    }
    showSubresources = (subresource) => {
        const headers = JSON.parse(sessionStorage.getItem("headers"));
        // console.log(headers);
        if(!headers||!headers.network_id||!headers.user_id){
            location.pathname = "/";
            return;
        }
        const {page, show_type} = this.state;
        const search = {search_fields:"", search_params:""};
        search["domain"] = page.service;
        search["endpoint"] = page.endpoint;
        search["show_type"] = show_type;
        search["subresource"] = subresource;
        search["network_id"] = headers.network_id;
        search["user_id"] = headers.user_id;

        for(let i = 0; i < page.search_fields.length; i++){
            if(this.state[page.search_fields[i]]){
                search.search_fields += this.state[page.search_fields[i]];
            }
        }
        if(page.search_params) {
            if(page.search_params.length > 0){
                if(this.state[page.search_params[0]]) {
                    search.search_params += page.search_params[0] + "=" + this.state[page.search_params[0]];
                }
            }

            for (let i = 1; i < page.search_params.length; i++) {
                if (this.state[page.search_params[i]]) {
                    search.search_params += "&" + page.search_params[i] + "=" + this.state[page.search_params[i]];
                }
            }
        }
        if(!search.search_fields&&!search.search_params){
            message.error("Please check your search!");
            return;
        }
        axios.get('/api/item', {
            params: search
        }).then(res => {
            console.log(res);
            if(res.status === 200){
                this.setState({jsonDisplay:"block", jsonDataSource:res.data.data});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get sub resources error!');
        });
    }
    stringprintf = (string, jsonObj) => {
        return string.replace(/\$\{(.+?)\}/g, function (match, key) {
            const replacer = jsonObj[key];
            return replacer;
        });
    }
    render(){
        const {category, page, loading, dataSource, show_type, drawer_visible, drawer_list, jsonDisplay, jsonDataSource} = this.state;
        let fields = [];
        const rows = [];
        let col = 24;
        for(let i = 0; i < page.search_fields.length; i++){
            if(col >= 4){
                fields.push(<Col span={4} style={{padding:"0 5px 0 0"}}><Input value={this.state[page.search_fields[i]]} name={page.search_fields[i]} onChange={this.setValue} addonBefore={page.search_fields[i]}/></Col>);
                col = col - 4;
            } else {
                rows.push(<Row>{fields}</Row>);
                fields = [];
                col = 24;
                fields.push(<Col span={4} style={{padding:"0 5px 0 0"}}><Input value={this.state[page.search_fields[i]]} name={page.search_fields[i]} onChange={this.setValue} addonBefore={page.search_fields[i]}/></Col>);
                col = col - 4;
            }
        }
        // if(page.sub_resources){
        //     if(page.sub_resources.length > 0){
        //         for(let i = 0; i < page.sub_resources.length; i++) {
        //             if(col >= 6){
        //                 fields.push(
        //                     <Col span={6}>
        //                         <InputGroup compact style={{padding: "0 5px 0 0"}}>
        //                             <Select onChange={(...arg)=> {
        //                                 this.selectresource(...arg, page.sub_resources[i].resource);
        //                             }} name={page.sub_resources[i].resource} defaultValue="0" style={{width:"40%"}} dropdownMatchSelectWidth={false}>
        //                                 <Option value="0">Select</Option>
        //                                 <Option value={page.sub_resources[i].resource}>{page.sub_resources[i].resource}</Option>
        //                             </Select>
        //                             <Input value={this.state[page.sub_resources[i].resource]} name={page.sub_resources[i].resource} onChange={this.setValue} style={{width:"60%"}}/>
        //                         </InputGroup>
        //                     </Col>
        //                 );
        //                 col = col - 6;
        //             }else{
        //                 rows.push(<Row>{fields}</Row>);
        //                 fields = [];
        //                 col = 24;
        //                 fields.push(
        //                     <Col span={6}>
        //                         <InputGroup compact style={{padding: "0 5px 0 0"}}>
        //                             <Select onChange={this.selectresource} name={page.sub_resources[i].resource} defaultValue="0" style={{width:"40%"}} dropdownMatchSelectWidth={false}>
        //                                 <Option value="0">Select</Option>
        //                                 <Option value={page.sub_resources[i].resource}>{page.sub_resources[i].resource}</Option>
        //                             </Select>
        //                             <Input value={this.state[page.sub_resources[i].resource]} name={page.sub_resources[i].resource} onChange={this.setValue} style={{width:"60%"}}/>
        //                         </InputGroup>
        //                     </Col>
        //                 );
        //                 col = col - 6;
        //             }
        //         }
        //     }
        // }
        if(page.search_params){
            // if(page.search_params.length > 0){
            //     fields.push(<Col span={1}></Col>);
            // }
            for(let i = 0; i < page.search_params.length; i++){
                if(col >= 4){
                    fields.push(<Col span={4} style={{padding:"0 5px 0 0"}}><Input value={this.state[page.search_params[i]]} name={page.search_params[i]} onChange={this.setValue} addonBefore={page.search_params[i]}/></Col>);
                    col = col - 4;
                } else {
                    rows.push(<Row>{fields}</Row>);
                    fields = [];
                    col = 24;
                    fields.push(<Col span={4} style={{padding:"0 5px 0 0"}}><Input value={this.state[page.search_params[i]]} name={page.search_params[i]} onChange={this.setValue} addonBefore={page.search_params[i]}/></Col>);
                    col = col - 4;
                }
            }
        }
        if(page.show_types && page.show_types.length > 0) {
            const options = [];
            for (let i = 0; i < page.show_types.length; i++) {
                options.push(<Option value={page.show_types[i]}>{page.show_types[i]}</Option>);
            }
            if(col >= 4){
                fields.push(<Col span={4} style={{padding: "0 5px 0 0"}}><Select value={show_type} style={{width: "100%"}} onChange={this.setShowtypeValue}>{options}</Select></Col>);
                col = col - 4;
            } else {
                rows.push(<Row>{fields}</Row>);
                fields = [];
                col = 24;
                fields.push(<Col span={4} style={{padding: "0 5px 0 0"}}><Select value={show_type} style={{width: "100%"}} onChange={this.setShowtypeValue}>{options}</Select></Col>);
                col = col - 4;
            }
        }
        if(col >= 4){
            fields.push(<Col span={4}><Button type="primary" onClick={this.viewInfo}>View Info</Button></Col>);
            // col = col - 4;
        } else {
            rows.push(<Row>{fields}</Row>);
            fields = [];
            col = 24;
            fields.push(<Col span={4}><Button type="primary" onClick={this.viewInfo}>View Info</Button></Col>);
            // col = col - 4;
        }
        if(fields.length > 0){
            rows.push(<Row>{fields}</Row>);
        }
        // const second_fields = [];
        // rows.push(<Row>{fields}</Row>);
        // if(second_fields.length > 0){
        //     rows.push(<Row style={{marginTop:5}}>{second_fields}</Row>);
        // }
        const columns = [];
        if(page.mrm_ui){
            columns.push({
                title: 'MRM UI',
                key: 'mrm_ui',
                render: (text, record, index) => {
                    return (
                        <a href={this.stringprintf(page.mrm_ui, record)} target="_blank">
                            Link
                        </a>
                    );
                }
            });
        }
        for(let i = 0; i < page.show_fields.length; i++){
            columns.push({
                title: page.show_field_titles?page.show_field_titles[i]:page.show_fields[i].toUpperCase(),
                dataIndex: page.show_fields[i],
                key: page.show_fields[i],
            });
        }
        if(page.sub_resources){
            if(page.sub_resources.length > 0){
                const resources = [];
                for(let i = 0; i<page.sub_resources.length; i++){
                    resources.push(<div><a onClick={()=>this.showSubresources(page.sub_resources[i].resource)}>{page.sub_resources[i].resource}</a><Divider type="vertical"/></div>);
                }
                columns.push({
                    title: "Sub Resources",
                    key: "sub_resources",
                    render: (text, record, index) => {
                        return (
                            <div>
                                {resources}
                            </div>
                        );
                    }
                });
            }
        }
        columns.push(
            {
                title: "",
                key: "show_details",
                render: (text, record, index) => {
                    return (
                        <div>
                            <Icon type="info-circle-o" onClick={() => this.showDrawer(index)}/>
                        </div>
                    );
                }
            }
        );
        return (<Content>
            <Breadcrumb style={{ margin: '10px 5px' }}>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item>{category.name}</Breadcrumb.Item>
                <Breadcrumb.Item>{page.name}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{padding:'0 10px'}}>
                <Card title={page.name} style={{minHeight: '85vh'}}>
                    <div>
                        {rows}
                    </div>
                    <div style={{marginTop:5}}>
                        <Table size="small" bordered loading={loading} dataSource={dataSource} columns={columns} pagination={false} expandedRowRender={this.expandedRowRender}/>
                        {/*<List bordered loading={loading} dataSource={dataSource} pagination={false} renderItem={this.renderItem}/>*/}
                        <div className='jsonbox' style={{display: jsonDisplay}}>
                            <ReactJson name="json" src={jsonDataSource} iconStyle="square"/>
                        </div>
                    </div>
                </Card>
            </div>
            <Drawer
                title="Details"
                placement="right"
                closable={false}
                onClose={this.closeDrawer}
                visible={drawer_visible}>
                {drawer_list}
            </Drawer>
        </Content>);
    }
}