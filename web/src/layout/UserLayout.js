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
    Popconfirm
} from 'antd'
import axios from 'axios'

const {Content} = Layout;
const FormItem = Form.Item;

import '../style/style.css'
import {SERVER} from "../config/config";


class UserLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updateuser: null
        };
    }
    componentDidMount() {
        this.getUsers();
    }
    getUsers = () => {
        this.setState({loading:true});
        axios.get( SERVER+'/users').then(res => {
            if(res.status === 200){
                this.setState({datasource:res.data, loading:false});
            } else {
                this.setState({loading:false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all users error!');
            this.setState({loading:false});
        });
    }
    showModal = () => {
        this.props.form.resetFields();
        this.setState({
            visible: true,
            modalstatus: "add"
        });
    }

    handleOk = (e) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                if(this.state.modalstatus === "add") {
                    console.log(values);
                    axios.put(SERVER + '/user', values).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Add user successfully!');
                                this.getUsers();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Add user error!');
                    });
                    this.setState({
                        visible: false,
                    });
                } else if(this.state.modalstatus === "update"){
                    const updateset = {};
                    const {updateuser} = this.state;
                    for(let key in updateuser){
                        if(updateuser[key]!==values[key]){
                            updateset[key] = values[key];
                        }
                    }
                    axios.post(SERVER + '/user/'+updateuser.id, updateset).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Update user successfully!');
                                this.getUsers();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Update user error!');
                    });
                    this.setState({
                        visible: false,
                    });
                }
            }
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    removeUser = (id) => {
        axios.delete( SERVER+'/user/'+id).then(res => {
            if (res.status === 200) {
                if(res.data.errno){
                    message.error(res.data.sqlMessage);
                } else {
                    message.success('Remove user successfully!');
                    this.getUsers();
                }
            }
        }).catch((error) => {
            console.log(error);
            message.error('Remove user error!');
        });
    }
    updateUser = (record) => {
        this.props.form.setFieldsValue(record);
        this.setState({
            visible: true,
            modalstatus: "update",
            updateuser: record
        });
    }
    render() {
        const columns = [{
            title: '用户',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: '设备号',
            dataIndex: 'device_id',
            key: 'device_id',
        }, {
            title: '设备电话',
            dataIndex: 'device_phone',
            key: 'device_phone',
        }, { title: '',
            dataIndex: '',
            key: 'action',
            render: (record) => {return (<div><a onClick={()=>this.updateUser(record)}>更新</a>&nbsp;
                <Popconfirm
                    title="确定删除?"
                    onConfirm={() => this.removeUser(record.id)}>
                    <a>删除</a>
                </Popconfirm>
            </div>);}
        }];
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout>
                <Breadcrumb style={{margin: '10px 16px'}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{margin: '0px 16px 10px 16px', padding: 24, background: '#fff', minHeight: 280}}>
                    <Button style={{marginBottom:'5px'}} onClick={this.showModal}><Icon type="user-add"/>添加用户</Button>
                    <Table size="small" columns={columns} loading={this.state.loading} dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add"?"添加用户":"更新用户"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={300}
                    cancelText="取消"
                    okText="确定"
                >
                    <Form>
                        <FormItem>
                            {getFieldDecorator('username',{
                                rules: [{ required: true, message: '请输入用户!' }],
                            })(
                                <Input placeholder="用户"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('address')(
                                <Input placeholder="地址"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('device_id',{
                                rules: [{ required: true, message: '请输入设备号!' }],
                            })(
                                <Input placeholder="设备号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('device_phone')(
                                <Input placeholder="设备电话"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>
         );
    }
}
export default Form.create()(UserLayout);