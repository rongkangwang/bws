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
    DatePicker,
    AutoComplete
} from 'antd'

const Search = Input.Search;
import axios from 'axios'

const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

import '../../style/style.css'
import {SERVER} from "../../config/config";
import moment from "moment";
import lodash from "lodash";


class RepairStatusLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            origindatasource: [],
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updaterepair: null,
            users: props.users,
            stafffiltervalue: null,
            userfiltervalue: null,
            staffdropdownvisible: false,
            userdropdownvisible: false,
            laststafffiltervalue: null,
            lastuserfiltervalue: null,
        };
    }

    componentDidMount() {
        this.getRepairs();
    }

    getRepairs = () => {
        this.setState({loading: true});
        axios.get(SERVER + '/repairs').then(res => {
            if (res.status === 200) {
                this.setState({origindatasource: res.data, datasource: res.data, loading: false});
            } else {
                this.setState({loading: false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all repairs error!');
            this.setState({loading: false});
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
            if (!err) {
                if (this.state.modalstatus === "add") {
                    values.date = values.date.format("YYYY-MM-DD");
                    axios.put(SERVER + '/repair', values).then(res => {
                        if (res.status === 200) {
                            if (res.data.errno) {
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
                } else if (this.state.modalstatus === "update") {
                    const updateset = {};
                    const {updaterepair} = this.state;
                    for(let key in updaterepair){
                        if(key!=="id" && key!=="username" && key!=="device_id" && updaterepair[key]!==values[key]){
                            updateset[key] = values[key];
                        }
                    }
                    if(Object.keys(updateset).length===0){
                        message.error("没有要更新的数据！");
                        return;
                    }
                    axios.post(SERVER + '/repair/' + updaterepair.id, updateset).then(res => {
                        if (res.status === 200) {
                            if (res.data.errno) {
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
        axios.delete(SERVER + '/repair/' + id).then(res => {
            if (res.status === 200) {
                if (res.data.errno) {
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
    filterOnChange = () => {
        this.setState({userdropdownvisible: false, staffdropdownvisible: false});
        const {origindatasource, userfiltervalue, stafffiltervalue, lastuserfiltervalue, laststafffiltervalue} = this.state;
        if (lastuserfiltervalue !== userfiltervalue || laststafffiltervalue !== stafffiltervalue) {
            this.setState({loading: true});
            if (!userfiltervalue && !stafffiltervalue) {
                this.setState({
                    loading: false,
                    lastuserfiltervalue: userfiltervalue,
                    laststafffiltervalue: stafffiltervalue,
                    datasource: origindatasource
                });
            } else if (userfiltervalue && !stafffiltervalue) {
                this.setState({
                    loading: false, lastuserfiltervalue: userfiltervalue, laststafffiltervalue: stafffiltervalue,
                    datasource: lodash.filter(origindatasource, (o) => o.username == userfiltervalue || o.username.includes(userfiltervalue) || o.device_id == userfiltervalue || o.device_id.includes(userfiltervalue) || (o.username + "-" + o.device_id).includes(userfiltervalue))
                });
            } else if (!userfiltervalue && stafffiltervalue) {
                this.setState({
                    loading: false, lastuserfiltervalue: userfiltervalue, laststafffiltervalue: stafffiltervalue,
                    datasource: lodash.filter(origindatasource, o => o.staff == stafffiltervalue || o.staff.includes(stafffiltervalue))
                });
            } else {
                this.setState({
                    loading: false, lastuserfiltervalue: userfiltervalue, laststafffiltervalue: stafffiltervalue,
                    datasource: lodash.filter(origindatasource, (o) => (o.staff == stafffiltervalue || o.staff.includes(stafffiltervalue)) && (o.username == userfiltervalue || o.username.includes(userfiltervalue) || o.device_id == userfiltervalue || o.device_id.includes(userfiltervalue) || (o.username + "-" + o.device_id).includes(userfiltervalue)))
                });
            }
        }
    }
    staffFilterOnChange = (value) => {
        this.setState({stafffiltervalue: value});
    }
    userFilterOnChange = (value) => {
        this.setState({userfiltervalue: value});
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 19},
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
        }, {
            title: '维修人员',
            dataIndex: 'staff',
            key: 'staff',
            filterDropdownVisible: this.state.staffdropdownvisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({staffdropdownvisible: visible});
            },
            filterDropdown: () => <div className="custom-filter-dropdown"><AutoComplete defaultActiveFirstOption={false}
                                                                                        autoFocus={true}
                                                                                        onChange={this.staffFilterOnChange}
                                                                                        onSelect={this.filterOnChange}
                                                                                        dataSource={lodash.uniq(lodash.map(this.state.origindatasource, "staff"))}><Search
                onSearch={this.filterOnChange} onBlur={this.filterOnChange}/></AutoComplete></div>
        }, {
            title: '用户',
            dataIndex: 'username',
            key: 'username',
            filterDropdownVisible: this.state.userdropdownvisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({userdropdownvisible: visible});
            },
            filterDropdown: () => <div className="custom-filter-dropdown"><AutoComplete defaultActiveFirstOption={false}
                                                                                        dropdownMatchSelectWidth={false}
                                                                                        autoFocus={true}
                                                                                        onChange={this.userFilterOnChange}

                                                                                        filterOption={(inputValue, option) => option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
                                                                                        dataSource={lodash.uniq(lodash.map(this.state.origindatasource, function (o) {
                                                                                            return o.username + "-" + o.device_id;
                                                                                        }))}><Search
                onSearch={this.filterOnChange} onBlur={this.filterOnChange}/></AutoComplete></div>
        }, {
            title: '',
            dataIndex: '',
            key: 'action',
            render: (record) => {
                return (<div><a onClick={() => this.updateRepair(record)}>更新</a>&nbsp;
                    <Popconfirm
                        title="确定删除?"
                        onConfirm={() => this.removeRepair(record.id)}>
                        <a>删除</a>
                    </Popconfirm>
                </div>);
            }
        }];
        const {getFieldDecorator} = this.props.form;
        const {users} = this.state;
        const options = [];
        users.forEach(function (v) {
            options.push(<Option value={v.id}>{v.username + "-" + v.device_id}</Option>)
        });
        return (
            <Layout>
                <Content style={{background: '#fff', minHeight: 280}}>
                    <Button style={{marginBottom: '5px'}} onClick={this.showModal}>添加报警系统维修情况</Button>
                    <Table size="small" columns={columns} loading={this.state.loading}
                           dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add" ? "添加报警系统维修情况" : "更新报警系统维修情况"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确定"
                >
                    <Form>
                        <FormItem {...formItemLayout} label="用户">
                            {getFieldDecorator('user_id', {
                                rules: [{required: true, message: '请选择用户!'}],
                            })(
                                <Select showSearch optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        placeholder="选择用户" style={{width: "90%"}}>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="日期">
                            {getFieldDecorator('date', {
                                rules: [{required: true, message: '请输入日期!'}],
                            })(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="选择日期"
                                    style={{width: "90%"}}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="故障现象">
                            {getFieldDecorator('status', {
                                rules: [{required: true, message: '请输入故障现象!'}],
                            })(
                                <Input placeholder="输入故障现象" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="维修内容">
                            {getFieldDecorator('content', {
                                rules: [{required: true, message: '请选择维修内容!'}],
                            })(
                                <Input placeholder="输入维修内容" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="维修器材">
                            {getFieldDecorator('material', {
                                rules: [{required: true, message: '请输入维修器材!'}],
                            })(
                                <Input placeholder="输入维修器材" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="维修人员">
                            {getFieldDecorator('staff', {
                                rules: [{required: true, message: '请输入维修人员!'}],
                            })(
                                <Input placeholder="输入维修人员" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>
        );
    }
}

export default Form.create()(RepairStatusLayout);