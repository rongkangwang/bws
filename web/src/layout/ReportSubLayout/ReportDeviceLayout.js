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
    DatePicker, AutoComplete
} from 'antd'
import axios from 'axios'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

import '../../style/style.css'
import {SERVER} from "../../config/config";
import moment from "moment";
import lodash from "lodash";


class ReportDeviceLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            origindatasource:[],
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updatedevice: null,
            users: props.users
        };
    }
    componentDidMount() {
        this.getDevices();
    }
    getDevices = () => {
        this.setState({loading:true});
        axios.get( SERVER+'/devices').then(res => {
            if(res.status === 200){
                this.setState({origindatasource:res.data,datasource:res.data, loading:false});
            } else {
                this.setState({loading:false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all devices error!');
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
                    axios.put(SERVER + '/device', values).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Add device successfully!');
                                this.getDevices();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Add device error!');
                    });
                    this.setState({
                        visible: false,
                    });
                } else if(this.state.modalstatus === "update"){
                    const updateset = {};
                    const {updatedevice} = this.state;
                    for(let key in updatedevice){
                        if(updatedevice[key]!==values[key]){
                            updateset[key] = values[key];
                        }
                    }
                    axios.post(SERVER + '/device/'+updatedevice.id, updateset).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Update device successfully!');
                                this.getDevices();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Update device error!');
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
    removeDevice = (id) => {
        axios.delete( SERVER+'/device/'+id).then(res => {
            if (res.status === 200) {
                if(res.data.errno){
                    message.error(res.data.sqlMessage);
                } else {
                    message.success('Remove device successfully!');
                    this.getDevices();
                }
            }
        }).catch((error) => {
            console.log(error);
            message.error('Remove device error!');
        });
    }
    updateDevice = (record) => {
        record.date = moment(record.date);
        this.props.form.setFieldsValue(record);
        this.setState({
            visible: true,
            modalstatus: "update",
            updatedevice: record
        });
    }
    statusFilterOnChange = (value) => {
        const {origindatasource} = this.state;
        if(!value){
            this.setState({datasource: origindatasource});
        }else {
            this.setState({datasource: lodash.filter(origindatasource, (o) => o.status == value||o.status.includes(value))});
        }
    }
    userFilterOnChange = (value) => {
        const {origindatasource} = this.state;
        if(!value){
            this.setState({datasource: origindatasource});
        } else {
            this.setState({datasource: lodash.filter(origindatasource, (o) => o.username == value || o.username.includes(value)||o.device_id==value||o.device_id.includes(value)||(o.username+"-"+o.device_id).includes(value))});
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
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            render: (text) => moment(text).format("YYYY-MM-DD")
        }, {
            title: '故障概况',
            dataIndex: 'status',
            key: 'status',
            filterDropdown: () => <div className="custom-filter-dropdown"><AutoComplete autoFocus={true} allowClear={true} onChange={this.statusFilterOnChange} dataSource={lodash.uniq(lodash.map(this.state.origindatasource,"status"))}/></div>
        }, {
            title: '处理办法',
            dataIndex: 'solution',
            key: 'solution',
        }, {
            title: '用户',
            dataIndex: 'username',
            key: 'username',
            filterDropdown: () => <div className="custom-filter-dropdown"><AutoComplete  dropdownMatchSelectWidth={false} autoFocus={true} allowClear={true} onChange={this.userFilterOnChange} dataSource={lodash.uniq(lodash.map(this.state.origindatasource,function(o) { return o.username+"-"+o.device_id; }))}/></div>
        }, { title: '',
            dataIndex: '',
            key: 'action',
            render: (record) => {return (<div><a onClick={()=>this.updateDevice(record)}>更新</a>&nbsp;
                <Popconfirm
                    title="确定删除?"
                    onConfirm={() => this.removeDevice(record.id)}>
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
                    <Button style={{marginBottom:'5px'}} onClick={this.showModal}>添加报警设备自检异常情况</Button>
                    <Table size="small" columns={columns} loading={this.state.loading} dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add"?"添加报警设备自检异常情况":"更新报警设备自检异常情况"}
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
                                <Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="选择用户" style={{width:"90%"}}>
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
                        <FormItem {...formItemLayout} label="故障概况">
                            {getFieldDecorator('status',{
                                rules: [{ required: true, message: '请输入故障概况!' }],
                            })(
                                <Input placeholder="输入故障概况" style={{width:"90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="处理办法">
                            {getFieldDecorator('solution')(
                                <TextArea rows={4} placeholder="输入处理办法" style={{width:"90%"}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>
         );
    }
}
export default Form.create()(ReportDeviceLayout);