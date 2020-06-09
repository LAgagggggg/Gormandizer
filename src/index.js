import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, Input, Row, Col, Timeline } from 'antd';

ReactDOM.render(
    <React.StrictMode>
        <div className="gormandizer-title" ><b style={{ "font-size": 40 }} >Gormandizer</b></div>
        <div className="gormandizer-main">
            {/* <Space width='100%' align='center'> */}
            <Row gutter={30} className='main-grid'>
                <Col span={12}>
                    <Input.TextArea className="main-input" placeholder='请输入需要保存的内容' ></Input.TextArea>
                    <Button type="primary" size='large' block={true}>Commit</Button>
                </Col>
                <Col span={12}>
                    <Timeline className='main-timeline'>
                        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                        <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                        <Timeline.Item>Create a services site 2015dwadwadawdawdwadawdwadwadwadwadwadwadawdwaawd-09-01</Timeline.Item>
                        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                        <Timeline.Item>Technical testing 2015-09-0d1</Timeline.Item>
                    </Timeline>
                </Col>

            </Row>

            {/* </Space>  */}

        </div>
    </React.StrictMode>,
    document.getElementById('root')
);
