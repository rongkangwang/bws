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


class UserTestLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            origindatasource: [],
            datasource: [],
            loading: false,
            visible: false,
            modalstatus: "",
            updatetest: null,
            users: props.users,
            userfiltervalue: null,
            userdropdownvisible: false,
            lastuserfiltervalue: null,
        };
    }

    componentDidMount() {
        this.getTests();
    }

    getTests = () => {
        this.setState({loading: true});
        axios.get(SERVER + '/tests').then(res => {
            if (res.status === 200) {
                this.setState({origindatasource: res.data, datasource: res.data, loading: false});
            } else {
                this.setState({loading: false});
            }
        }).catch((error) => {
            console.log(error);
            message.error('Get all tests error!');
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
                    // console.log(values);
                    // console.log(values.datetime.format("YYYY-MM-DD HH:mm:ss"));
                    // console.log(values);
                    values.datetime = values.datetime.format("YYYY-MM-DD HH:mm:ss");
                    axios.put(SERVER + '/test', values).then(res => {
                        if (res.status === 200) {
                            if (res.data.errno) {
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
                } else if (this.state.modalstatus === "update") {
                    const updateset = {};
                    const {updatetest} = this.state;
                    for (let key in updatetest) {
                        if (updatetest[key] !== values[key]) {
                            updateset[key] = values[key];
                        }
                    }
                    axios.post(SERVER + '/test/' + updatetest.id, updateset).then(res => {
                        if (res.status === 200) {
                            if (res.data.errno) {
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
        axios.delete(SERVER + '/test/' + id).then(res => {
            if (res.status === 200) {
                if (res.data.errno) {
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
    filterOnChange = () => {
        this.setState({userdropdownvisible: false});
        const {origindatasource, userfiltervalue, lastuserfiltervalue} = this.state;
        if (lastuserfiltervalue !== userfiltervalue) {
            this.setState({loading: true});
            if (!userfiltervalue) {
                this.setState({loading: false, lastuserfiltervalue: userfiltervalue, datasource: origindatasource});
            } else {
                this.setState({
                    loading: false, lastuserfiltervalue: userfiltervalue,
                    datasource: lodash.filter(origindatasource, (o) => (o.username == userfiltervalue || o.username.includes(userfiltervalue) || o.device_id == userfiltervalue || o.device_id.includes(userfiltervalue) || (o.username + "-" + o.device_id).includes(userfiltervalue)))
                });
            }
        }
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
        }, {
            title: '防区位置',
            dataIndex: 'position',
            key: 'position',
        }, {
            title: '报警次数',
            dataIndex: 'report_num',
            key: 'report_num',
        }, {
            title: '用户电话',
            dataIndex: 'phone_number',
            key: 'phone_number',
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
                                                                                        onSelect={this.filterOnChange}
                                                                                        dataSource={lodash.uniq(lodash.map(this.state.origindatasource, function (o) {
                                                                                            return o.username + "-" + o.device_id;
                                                                                        }))}><Search
                onSearch={this.filterOnChange} onBlur={this.filterOnChange}/></AutoComplete></div>
        }, {
            title: '',
            dataIndex: '',
            key: 'action',
            render: (record) => {
                return (<div><a onClick={() => this.updateTest(record)}>更新</a>&nbsp;
                    <Popconfirm
                        title="确定删除?"
                        onConfirm={() => this.removeTest(record.id)}>
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
                    <Button style={{marginBottom: '5px'}} onClick={this.showModal}>添加用户测试</Button>
                    <Table size="small" columns={columns} loading={this.state.loading}
                           dataSource={this.state.datasource}/>
                </Content>
                <Modal
                    title={this.state.modalstatus === "add" ? "添加用户测试" : "更新用户测试"}
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
                        <FormItem {...formItemLayout} label="时间">
                            {getFieldDecorator('datetime', {
                                rules: [{required: true, message: '请输入时间!'}],
                            })(
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择时间"
                                    style={{width: "90%"}}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="测试类型">
                            {getFieldDecorator('test_type', {
                                rules: [{required: true, message: '请选择测试类型!'}],
                            })(
                                <Select placeholder="选择测试类型" style={{width: "90%"}}>
                                    <Option value="手动测试">手动测试</Option>
                                    <Option value="自动测试">自动测试</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="报警防区">
                            {getFieldDecorator('sector', {
                                rules: [{required: true, message: '请输入报警防区!'}],
                            })(
                                <Input placeholder="输入报警防区" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="防区位置">
                            {getFieldDecorator('position', {
                                rules: [{required: true, message: '请输入防区位置!'}],
                            })(
                                <Input placeholder="输入防区位置" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="报警次数">
                            {getFieldDecorator('report_num', {
                                rules: [{required: true, message: '请输入报警次数!'}],
                            })(
                                <Input placeholder="输入报警次数" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户电话">
                            {getFieldDecorator('phone_number', {
                                rules: [{required: true, message: '请输入用户电话!'}],
                            })(
                                <Input placeholder="输入用户电话" style={{width: "90%"}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>
        );
    }
}

export default Form.create()(UserTestLayout);