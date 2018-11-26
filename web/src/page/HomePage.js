import React from 'react'
import {Layout, Input, Divider, Row, Col, Form, Button, message} from 'antd'

import '../style/style.css'

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            network_id : "",
            user_id : ""
        }
    }
    setNetworkId = (e) => {
        this.setState({network_id:e.target.value});
    }
    setUserId = (e) => {
        this.setState({user_id:e.target.value});
    }
    enter = () => {
        const headers = this.state;
        if(!headers.network_id||!headers.user_id){
            message.error("Please enter your NETWORK_ID and USER_ID!")
            return;
        }
        sessionStorage.setItem("headers", JSON.stringify(headers));
        location.pathname = "/main";
    }
    render() {
        const {network_id, user_id} = this.state;
        return (
            <div className="home-div">
                <div className="home-container">
                    <h2>Config</h2>
                    <Divider/>
                    <Row className="home-input">
                        <Col span={8}><label>X-FreeWheel-Network-ID:</label></Col>
                        <Col span={16}><Input value={network_id} onChange={this.setNetworkId}/></Col>
                    </Row>
                    <Row className="home-input">
                        <Col span={8}><label>X-FreeWheel-User-ID:</label></Col>
                        <Col span={16}><Input value={user_id} onChange={this.setUserId}/></Col>
                    </Row>
                    <div style={{padding:"0 20px 0 20px"}}>
                        <Button block className="home-input" type="primary" onClick={this.enter}>Enter</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;