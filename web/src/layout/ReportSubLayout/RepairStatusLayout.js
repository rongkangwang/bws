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


class RepairStatusLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updaterepair: null,
            users: props.users
        };
    }
    componentDidMount() {
        this.getRepairs();
    }
    getRepairs = () => {
        this.setState({loading:true});
        axios.get( SERVER+'/repairs').then(res => {
            if(res.status === 200){
                this.setState({datasource:res.data, loading:false});
            } else {
                this.setState({loading:false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all repairs error!');
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
                    values.date = values.date.format("YYYY-MM-DD");
                    axios.put(SERVER + '/repair', values).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Add repair successfully!');
                                this.getRepairs();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Add repair error!');
                    });
                    this.setState({
                        visible: false,
                    });
                } else if(this.state.modalstatus === "update"){
                    const updateset = {};
                    const {updaterepair} = this.state;
                    for(let key in updaterepair){
                        if(updaterepair[key]!==values[key]){
                            updateset[key] = values[key];
                        }
                    }
                    axios.post(SERVER + '/repair/'+updaterepair.id, updateset).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Update repair successfully!');
                                this.getRepairs();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Update repair error!');
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
    removeRepair = (id) => {
        axios.delete( SERVER+'/repair/'+id).then(res => {
            if (res.status === 200) {
                if(res.data.errno){
                    message.error(res.data.sqlMessage);
                } else {
                    message.success('Remove repair successfully!');
                    this.getRepairs();
                }
            }
        }).catch((error) => {
            console.log(error);
            message.error('Remove repair error!');
        });
    }
    updateRepair = (record) => {
        record.date = moment(record.date);
        this.props.form.setFieldsValue(record);
        this.setState({
            visible: true,
            modalstatus: "update",
            updaterepair: record
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
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            render: (text) => moment(text).format("YYYY-MM-DD")
        }, {
            title: '故障现象',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '维修内容',
            dataIndex: 'content',
            key: 'content',
        }, {
            title: '维修器材',
            dataIndex: 'material',
            key: 'material',
        },{
            title: '维修人员',
            dataIndex: 'staff',
            key: 'staff',
        },{
            title: '用户',
            dataIndex: 'username',
            key: 'username',
        }, { title: '',
            dataIndex: '',
            key: 'action',
            render: (record) => {return (<div><a onClick={()=>this.updateRepair(record)}>更新</a>&nbsp;
                <Popconfirm
                    title="确定删除?"
                    onConfirm={() => this.removeRepair(record.id)}>
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
                    <Button style={{marginBottom:'5px'}} onClick={this.showModal}>添加报警系统维修情况</Button>
                    <Table size="small" columns={columns} loading={this.state.loading} dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add"?"添加报警系统维修情况":"更新报警系统维修情况"}
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
                        <FormItem {...formItemLayout} label="日期">
                            {getFieldDecorator('date',{
                                rules: [{ required: true, message: '请输入日期!' }],
                            })(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="选择日期"
                                    style={{width:"90%"}}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="故障现象">
                            {getFieldDecorator('status',{
                                rules: [{ required: true, message: '请选择故障现象!' }],
                            })(
                                <Select  placeholder="选择故障现象" style={{width:"90%"}}>
                                    <Option value="柜台按钮误报">柜台按钮误报</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="维修内容">
                            {getFieldDecorator('content',{
                                rules: [{ required: true, message: '请选择维修内容!' }],
                            })(
                                <Select  placeholder="选择维修内容" style={{width:"90%"}}>
                                    <Option value="更换线路">更换线路</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="维修器材">
                            {getFieldDecorator('material',{
                                rules: [{ required: true, message: '请选择维修器材!' }],
                            })(
                                <Select  placeholder="选择维修器材" style={{width:"90%"}}>
                                    <Option value="4*0.3线缆30m">更换线路</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="维修人员">
                            {getFieldDecorator('staff',{
                                rules: [{ required: true, message: '请选择维修人员!' }],
                            })(
                                <Select  placeholder="选择维修人员" style={{width:"90%"}}>
                                    <Option value="李冉">李冉</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>
         );
    }
}
export default Form.create()(RepairStatusLayout);