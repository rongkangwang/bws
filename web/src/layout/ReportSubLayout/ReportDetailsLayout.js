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


class ReportDetailsLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            origindatasource:[],
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updateevent: null,
            users: props.users
        };
    }
    componentDidMount() {
        this.getEvents();
    }
    getEvents = () => {
        this.setState({loading:true});
        axios.get( SERVER+'/events').then(res => {
            if(res.status === 200){
                this.setState({origindatasource:res.data,datasource:res.data, loading:false});
            } else {
                this.setState({loading:false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all events error!');
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
                    axios.put(SERVER + '/event', values).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Add event successfully!');
                                this.getEvents();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Add event error!');
                    });
                    this.setState({
                        visible: false,
                    });
                } else if(this.state.modalstatus === "update"){
                    const updateset = {};
                    const {updateevent} = this.state;
                    for(let key in updateevent){
                        if(updateevent[key]!==values[key]){
                            updateset[key] = values[key];
                        }
                    }
                    axios.post(SERVER + '/event/'+updateevent.id, updateset).then(res => {
                        if (res.status === 200) {
                            if(res.data.errno){
                                message.error(res.data.sqlMessage);
                            } else {
                                message.success('Update event successfully!');
                                this.getEvents();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        message.error('Update event error!');
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
    removeEvent = (id) => {
        axios.delete( SERVER+'/event/'+id).then(res => {
            console.log(id);
            if (res.status === 200) {
                if(res.data.errno){
                    message.error(res.data.sqlMessage);
                } else {
                    message.success('Remove event successfully!');
                    this.getEvents();
                }
            }
        }).catch((error) => {
            console.log(error);
            message.error('Remove event error!');
        });
    }
    updateEvent = (record) => {
        record.datetime = moment(record.datetime);
        this.props.form.setFieldsValue(record);
        this.setState({
            visible: true,
            modalstatus: "update",
            updateevent: record
        });
    }
    detectorFilterOnChange = (value) => {
        const {origindatasource} = this.state;
        if(!value){
            this.setState({datasource: origindatasource});
        }else {
            this.setState({datasource: lodash.filter(origindatasource, (o) => o.detector_type == value || o.detector_type.includes(value))});
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
            title: '时间',
            dataIndex: 'datetime',
            key: 'datetime',
            render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss")
        }, {
            title: '探测器类型',
            dataIndex: 'detector_type',
            key: 'detector_type',
            filterDropdown: () => <div className="custom-filter-dropdown"><AutoComplete autoFocus={true} allowClear={true} onChange={this.detectorFilterOnChange} dataSource={lodash.uniq(lodash.map(this.state.origindatasource,"detector_type"))}/></div>
        }, {
            title: '防区位置',
            dataIndex: 'position',
            key: 'position',
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
            render: (record) => {return (<div><a onClick={()=>this.updateEvent(record)}>更新</a>&nbsp;
                <Popconfirm
                    title="确定删除?"
                    onConfirm={() => this.removeEvent(record.id)}>
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
                    <Button style={{marginBottom:'5px'}} onClick={this.showModal}>添加报警事件</Button>
                    <Table size="small" columns={columns} loading={this.state.loading} dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add"?"添加报警事件":"更新报警事件"}
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
                        <FormItem {...formItemLayout} label="探测器类型">
                            {getFieldDecorator('detector_type',{
                                rules: [{ required: true, message: '请选择探测器类型!' }],
                            })(
                                <Select  placeholder="选择探测器类型" style={{width:"90%"}}>
                                    <Option value="紧急按钮">紧急按钮</Option>
                                    <Option value="双鉴">双鉴</Option>
                                    <Option value="震动">震动</Option>
                                    <Option value="玻璃破碎">玻璃破碎</Option>
                                    <Option value="门磁">门磁</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="防区位置">
                            {getFieldDecorator('position',{
                                rules: [{ required: true, message: '请输入防区位置!' }],
                            })(
                                <Input placeholder="输入防区位置" style={{width:"90%"}}/>
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
export default Form.create()(ReportDetailsLayout);