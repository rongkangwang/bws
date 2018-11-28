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
    DatePicker
} from 'antd'
import axios from 'axios'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

import '../../style/style.css'
import {SERVER} from "../../config/config";
import moment from "moment";


class UserTestLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updatetest: null,
            users: props.users
        };
    }
    componentDidMount() {
        this.getTests();
    }
    getTests = () => {
        this.setState({loading:true});
        axios.get( SERVER+'/tests').then(res => {
            if(res.status === 200){
                this.setState({datasource:res.data, loading:false});
            } else {
                this.setState({loading:false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all tests error!');
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
                    // console.log(values);
                    // console.log(values.datetime.format("YYYY-MM-DD HH:mm:ss"));
                    // console.log(values);
                    values.datetime = values.datetime.format("YYYY-MM-DD HH:mm:ss");
                    axios.put(SERVER + '/test', values).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Add test successfully!');
                                this.getTests();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Add test error!');
                    });
                    this.setState({
                        visible: false,
                    });
                } else if(this.state.modalstatus === "update"){
                    const updateset = {};
                    const {updatetest} = this.state;
                    for(let key in updatetest){
                        if(updatetest[key]!==values[key]){
                            updateset[key] = values[key];
                        }
                    }
                    axios.post(SERVER + '/test/'+updatetest.id, updateset).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Update test successfully!');
                                this.getTests();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Update test error!');
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
    removeTest = (id) => {
        axios.delete( SERVER+'/test/'+id).then(res => {
            if (res.status === 200) {
                if(res.data.errno){
                    message.error(res.data.sqlMessage);
                } else {
                    message.success('Remove test successfully!');
                    this.getTests();
                }
            }
        }).catch((error) => {
            console.log(error);
            message.error('Remove test error!');
        });
    }
    updateTest = (record) => {
        record.datetime = moment(record.datetime);
        this.props.form.setFieldsValue(record);
        this.setState({
            visible: true,
            modalstatus: "update",
            updatetest: record
        });
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
            title: '时间',
            dataIndex: 'datetime',
            key: 'datetime',
            render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss")
        }, {
            title: '测试类型',
            dataIndex: 'test_type',
            key: 'test_type',
        }, {
            title: '报警防区',
            dataIndex: 'sector',
            key: 'sector',
        },{
            title: '防区位置',
            dataIndex: 'position',
            key: 'position',
        }, {
            title: '报警次数',
            dataIndex: 'report_num',
            key: 'report_num',
        },{
            title: '用户电话',
            dataIndex: 'phone_number',
            key: 'phone_number',
        }, {
            title: '用户',
            dataIndex: 'username',
            key: 'username',
        }, { title: '',
            dataIndex: '',
            key: 'action',
            render: (record) => {return (<div><a onClick={()=>this.updateTest(record)}>更新</a>&nbsp;
                <Popconfirm
                    title="确定删除?"
                    onConfirm={() => this.removeTest(record.id)}>
                    <a>删除</a>
                </Popconfirm>
            </div>);}
        }];
        const { getFieldDecorator } = this.props.form;
        const {users} = this.state;
        const options = [];
        users.forEach(function (v) {
            options.push(<Option value={v.id}>{v.username+"-"+v.device_id}</Option>)
        });
        return (
            <Layout>
                <Content style={{background: '#fff', minHeight: 280}}>
                    <Button style={{marginBottom:'5px'}} onClick={this.showModal}>添加用户测试</Button>
                    <Table size="small" columns={columns} loading={this.state.loading} dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add"?"添加用户测试":"更新用户测试"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确定"
                >
                    <Form>
                        <FormItem {...formItemLayout} label="用户">
                            {getFieldDecorator('user_id', {
                                rules: [{ required: true, message: '请选择用户!' }],
                            })(
                                <Select placeholder="选择用户" style={{width:"90%"}}>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="时间">
                            {getFieldDecorator('datetime',{
                                rules: [{ required: true, message: '请输入时间!' }],
                            })(
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择时间"
                                    style={{width:"90%"}}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="测试类型">
                            {getFieldDecorator('test_type',{
                                rules: [{ required: true, message: '请选择测试类型!' }],
                            })(
                                <Select  placeholder="选择测试类型" style={{width:"90%"}}>
                                    <Option value="手动测试">手动测试</Option>
                                    <Option value="自动测试">自动测试</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="报警防区">
                            {getFieldDecorator('sector',{
                                rules: [{ required: true, message: '请选择报警防区!' }],
                            })(
                                <Select placeholder="选择报警防区" style={{width:"90%"}}>
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="防区位置">
                            {getFieldDecorator('position',{
                                rules: [{ required: true, message: '请选择防区位置!' }],
                            })(
                                <Select placeholder="选择防区位置" style={{width:"90%"}}>
                                    <Option value="大厅">大厅</Option>
                                    <Option value="正门门口">正门门口</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="报警次数">
                            {getFieldDecorator('report_num',{
                                rules: [{ required: true, message: '请输入报警次数!' }],
                            })(
                                <Input placeholder="输入报警次数"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户电话">
                            {getFieldDecorator('phone_number',{
                                rules: [{ required: true, message: '请输入用户电话!' }],
                            })(
                                <Input placeholder="输入用户电话"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>
         );
    }
}
export default Form.create()(UserTestLayout);