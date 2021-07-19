import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Input, Row, Col, Timeline, Space, message, Alert } from 'antd';
import copy from 'copy-to-clipboard';

const request = require('request');

const backendURL = 'http://39.99.162.127:5556';

class EditSection extends React.Component {
    render() {
        return (
            <div>
                <Input.TextArea
                    className="main-input"
                    value={this.props.textContent}
                    onChange={this.props.handleChange}
                    placeholder='请输入需要保存的内容' 
                    onPressEnter={this.props.handleEnterPressed}
                >
                </Input.TextArea>
                <Button type="primary"
                    size='large'
                    block={true}
                    loading={this.props.isSubmitting}
                    onClick={this.props.handleSubmit}
                    disabled={this.props.textContent.length == 0}
                    style={{ marginTop: "10px", borderRadius: "10px" }}>
                    Commit
                </Button>
            </div>
        );
    }
}

class History extends React.Component {

    handleClick(i) {
        copy(this.props.history[i])
        message.success('已复制到剪切板', 1)
    }

    render() {
        const timeLineItems = this.props.history.map((content, index) => {
            return (
                <Timeline.Item key={index}>
                    <Button onClick={()=>this.handleClick(index)}>
                        {content.length<60 ? content : content.slice(0, 60) + '...'}
                    </Button>
                </Timeline.Item>
            )
        });
        return (
            <Timeline className='main-timeline' reverse={false}>
                {timeLineItems}
            </Timeline>
        )
    }
}

class App extends React.Component {
    showingTodo = false;

    constructor(props) {
        super(props);
        this.state = {
            history: [],
            textContent: "",
            isSubmitting: false,
            showingTodo: false,
        };
    }

    handleChange(event) {
        this.setState({ textContent: event.target.value });
    }

    handleEnterPressed(event) {
        if (event.keyCode === 13 && !event.shiftKey && this.state.textContent.length != 0) {
            this.handleSubmit()
            event.preventDefault();
        }
    }

    handleSubmit() {
        this.setState({ isSubmitting: true })
        let content = this.state.textContent;
        if (content.startsWith('todo') || content.startsWith('td')) {
            this.handleTodoSubmit(content);
            return;
        }
        else {
            this.showingTodo = false;
        }

        request.post({
            url: backendURL + '/commit',
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ content: content })
        }, (err, res, body) => {
            this.setState({ 
                isSubmitting: false,
                textContent: ""
            })
            if (err) { return console.log(err); }
            this.reloadHistory();
        });
    }

    handleTodoSubmit(content) {
        if (content == 'todo' || content == 'td') {
            this.showingTodo = true;
            this.setState({ 
                isSubmitting: false,
                textContent: "",
            })
            this.reloadHistory();
        }
        else if (content.startsWith('todo add ')) {
            request.post({
                url: backendURL + '/add_todo',
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ content: content.replace('todo add ', '') })
            }, (err, res, body) => {
                this.setState({ 
                    isSubmitting: false,
                    textContent: ""
                })
                if (err) { return console.log(err); }
                this.reloadHistory();
            });
        }
        else if (content.startsWith('tda ')) {
            request.post({
                url: backendURL + '/add_todo',
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ content: content.replace('tda ', '') })
            }, (err, res, body) => {
                this.setState({ 
                    isSubmitting: false,
                    textContent: ""
                })
                if (err) { return console.log(err); }
                this.reloadHistory();
            });
        }
        else if (content == 'tdrf') {
            request.post({
                url: backendURL + '/rm_todo_of_index',
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ index: 0 })
            }, (err, res, body) => {
                this.setState({ 
                    isSubmitting: false,
                    textContent: ""
                })
                if (err) { return console.log(err); }
                this.reloadHistory();
            });
        }
        else if (content.startsWith('todo rm ')) {
            request.post({
                url: backendURL + '/rm_todo',
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ content: content.replace('todo rm ', '') })
            }, (err, res, body) => {
                this.setState({ 
                    isSubmitting: false,
                    textContent: ""
                })
                if (err) { return console.log(err); }
                this.reloadHistory();
            });
        }
        else if (content == 'todo.'|| content == 'td.') {
            this.showingTodo = false;
            this.setState({ 
                isSubmitting: false,
                textContent: "",
            })
            this.reloadHistory();
        }
        else {
            message.info('todo what?', 1)
            this.setState({ 
                isSubmitting: false,
                textContent: "",
            })
        }
    }

    reloadHistory() {
        let query = this.showingTodo ? '/todo_list' : '/history';
        request.get(backendURL + query, (err, res, body) => {
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

    componentDidMount() {
        this.reloadHistory();
    }

    render() {
        return (
            <div className="gormandizer-main">
                <Row>
                    <Col span={24}>
                        <div className="gormandizer-title" ><b style={{ "font-size": 40 }} >Gormandizer</b></div>
                    </Col>
                </Row>
                <Row gutter={30} className='main-grid'>
                    <Col span={12} style={{ marginTop: "35px" }}>
                        <EditSection 
                            textContent={this.state.textContent}
                            handleSubmit={()=>this.handleSubmit()}
                            handleChange={(e) => this.handleChange(e)} 
                            isSubmitting={this.state.isSubmitting}
                            handleEnterPressed={(e) => this.handleEnterPressed(e)}
                        />
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <div className="history-title"><b style={{ "margin-top": "50pt" }} >{this.showingTodo ? 'Todo' : 'Historyyyyyy'}</b></div>
                            <b></b>
                            <History history={this.state.history}/>
                        </Space>
                    </Col>
                </Row>
            </div>
        )
    }
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
