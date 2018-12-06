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
    Popconfirm,
    Row,
    Col
} from 'antd'
import axios from 'axios'

const {Content} = Layout;
const FormItem = Form.Item;

import '../../style/style.css'
import {SERVER} from "../../config/config";


class UserSubLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updateuser: null,
            usertypes: props.usertypes,
            usertypevisible:false,
            insertusertype:null,
            removeusertype:null,
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
    showUserTypeModal = () => {
        this.setState({
            usertypevisible: true
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
    handleUserTypeCancel = (e) => {
        this.setState({
            usertypevisible: false,
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
    addUserType = () => {
        const {insertusertype} = this.state;
        if(!insertusertype){
            message.error("请输入要添加的用户类型！");
        } else {
            axios.put(SERVER + '/usertype', {type:insertusertype}).then(res => {
                if (res.status === 200) {
                    if(res.data.errno){
                        message.error(res.data.sqlMessage);
                    } else {
                        message.success('Add usertype successfully!');
                        this.props.getUserTypes();
                    }
                }
            }).catch((error) => {
                console.log(error);
                message.error('Add usertype error!');
            });
        }
    }
    setInsertUserType = (e) => {
        this.setState({insertusertype:e.target.value});
    }
    setRemoveUserType = (value) => {
        this.setState({removeusertype:value});
    }
    deleteUserType = () => {
        const {removeusertype} = this.state;
        if(!removeusertype){
            message.error("请选择要删除的用户类型！");
        } else {
            axios.delete( SERVER+'/usertype/'+removeusertype).then(res => {
                if (res.status === 200) {
                    if(res.data.errno){
                        message.error(res.data.sqlMessage);
                    } else {
                        message.success('Remove usertype successfully!');
                        this.props.getUserTypes();
                    }
                }
            }).catch((error) => {
                console.log(error);
                message.error('Remove usertype error!');
            });
        }
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
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
        const {usertypes} = this.state;
        const options = [];
        usertypes.forEach(function (v) {
            options.push(<Option value={v.id}>{v.type}</Option>)
        });
        return (
            <Layout>
                <Content style={{ background: '#fff', minHeight: 280}}>
                    <Button style={{marginBottom:'5px'}} onClick={this.showModal}><Icon type="user-add"/>添加用户</Button>&nbsp;<Button style={{marginBottom:'5px'}} onClick={this.showUserTypeModal} ><Icon type="setting"/>管理用户类型</Button>
                    <Table size="small" columns={columns} loading={this.state.loading} dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add"?"添加用户":"更新用户"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确定"
                >
                    <Form>
                        <FormItem {...formItemLayout} label="用户类型">
                            {getFieldDecorator('usertype_id',{
                                rules: [{ required: true, message: '请选择用户类型!' }],
                            })(
                                <Select style={{width:"90%"}} showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="选择用户类型">
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户">
                            {getFieldDecorator('username',{
                                rules: [{ required: true, message: '请输入用户!' }],
                            })(
                                <Input placeholder="用户" style={{width:"90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="地址">
                            {getFieldDecorator('address')(
                                <Input placeholder="地址" style={{width:"90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="设备号">
                            {getFieldDecorator('device_id',{
                                rules: [{ required: true, message: '请输入设备号!' }],
                            })(
                                <Input placeholder="设备号" style={{width:"90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="设备电话">
                            {getFieldDecorator('device_phone')(
                                <Input placeholder="设备电话" style={{width:"90%"}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                <Modal
                    title={"添加/删除用户类型"}
                    onCancel={this.handleUserTypeCancel}
                    visible={this.state.usertypevisible}
                    footer={null}
                >
                    <Row style={{marginTop:"10px"}} gutter={8}><Col span={18}><Input placeholder="请输入用户类型" onChange={this.setInsertUserType}/></Col><Col span={6}><Button type="primary" onClick={this.addUserType}>添加用户类型</Button></Col></Row>
                    <Row style={{marginTop:"10px"}} gutter={8}>
                    <Col span={18}><Select onChange={this.setRemoveUserType} style={{width:"100%"}} showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="选择用户类型">
                        {options}
                    </Select></Col><Col span={6}><Button onClick={this.deleteUserType} type="danger">删除用户类型</Button></Col>
                    </Row>
                </Modal>
            </Layout>
         );
    }
}
export default Form.create()(UserSubLayout);