import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Input, Row, Col, Timeline, Space } from 'antd';

const request = require('request');

const backendURL = 'http://127.0.0.1:3001';

class EditSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textContent: "",
            isSubmitting: false
        };
    }

    handleChange(event) {
        this.setState({ textContent: event.target.value });
    }

    handleSubmit() {
        this.setState({ isSubmitting: true })
        request.post({
            url:backendURL + '/commit',
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({content: this.state.textContent}) 
        }, (err, res, body) => {
            this.setState({ isSubmitting: false })
            if (err) { return console.log(err); }
        });
    }

    render() {
        return (
            <div>
                <Input.TextArea
                    className="main-input"
                    value={this.state.textContent}
                    onChange={(e) => this.handleChange(e)}
                    placeholder='请输入需要保存的内容' >

                </Input.TextArea>
                <Button type="primary"
                    size='large'
                    block={true}
                    loading={this.state.isSubmitting}
                    onClick={()=>this.handleSubmit()}
                    disabled={this.state.textContent.length === 0}
                    style={{ marginTop: "10px", borderRadius: "10px" }}>
                    Commit
                </Button>
            </div>
        );
    }
}

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: []
        };
    }

    componentDidMount() {
        request.get(backendURL + '/history', (err, res, body) => {
            if (err) { return console.log(err); };
            let history = JSON.parse(body);
            if (!Array.isArray(history)) {
                history = [];
            }
            this.setState({
                history: history
            })
        });
    }

    render() {
        const timeLineItems = this.state.history.map((content) => {
            return (
            <Timeline.Item>
            <Button>
                {content}
            </Button>
            </Timeline.Item>
            )
        });
        return (
            <Timeline className='main-timeline'>
                {timeLineItems}
            </Timeline>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="gormandizer-main">
                <Row gutter={30} className='main-grid'>
                    <Col span={12} style={{ marginTop: "35px" }}>
                        <EditSection />
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <b>History</b>
                            <b></b>
                            <History/>
                        </Space>
                    </Col>
                </Row>
            </div>
        )
    }
}

ReactDOM.render(
    <React.StrictMode>
        <div className="gormandizer-title" ><b style={{ "font-size": 40 }} >Gormandizer</b></div>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
