import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Avatar,
  Steps,
  Table,
  Modal,
  DatePicker,
  Checkbox,
} from 'antd';
import { useParams } from 'react-router-dom';
import './UserDetailsPage.css';
import userData from '../../data/registeredusers.json'; // Initial data source

const { Option } = Select;
const { Step } = Steps;

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [interviewData, setInterviewData] = useState([]);

  const profilavatar = 'https://via.placeholder.com/150'; // Placeholder avatar image

  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('registeredusers')) || userData;
    const user = storedUserDetails.find(user => user.user_id === userId);

    if (user) {
      setUserDetails(user);
      form.setFieldsValue(user);
      setInterviewData(user.interviews || []);
    } else {
      console.error('User not found with userId:', userId);
    }
  }, [userId, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        const updatedUserDetails = JSON.parse(localStorage.getItem('registeredusers')) || userData;
        const updatedUsers = updatedUserDetails.map(user => 
          user.user_id === userId ? { ...user, ...values } : user
        );

        localStorage.setItem('registeredusers', JSON.stringify(updatedUsers));
        message.success('User details saved successfully!');
        setIsEditing(false);
        setUserDetails({ ...userDetails, ...values });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const showAddModal = () => {
    setModalVisible(true);
  };

  const handleAddInterview = (values) => {
    const newInterview = {
      key: interviewData.length + 1,
      level: values.level,
      level_name: values.level_name, // Ensure the level name is captured
      time: values.scheduleTime.format('YYYY-MM-DD HH:mm:ss'),
      link: values.scheduleMeet ? `https://dummyteams.url/${Math.random().toString(36).substring(7)}` : '',
    };

    setInterviewData([...interviewData, newInterview]);
    setModalVisible(false);
    message.success('Interview scheduled successfully!');
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  if (!userDetails) return <div>Loading...</div>;

  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Level Name',
      dataIndex: 'level_name', // Ensure this is referenced correctly
      key: 'level_name',
    },
    {
      title: 'Scheduled Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: () => <a>Approve</a>,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* Left Column - 35% */}
      <Col xs={24} sm={10} md={8} className="left-column">
        <Card className="custom-card user-details-card" title="User Details">
          <Row justify="center">
            <Avatar size={100} shape="square" src={profilavatar} />
          </Row>
          <Row justify="center">
            <h4>{userDetails.name}</h4>
            <p>{userDetails.user_id}</p>
          </Row>
        </Card>

        {/* Personal Information */}
        <Card className="user-info-card personal-info" title="Personal Information" bordered={false}>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name">
              <Input disabled={!isEditing} size="small" />
            </Form.Item>
            <Form.Item name="phone_number" label="Phone Number">
              <Input disabled={!isEditing} size="small" />
            </Form.Item>
            <Form.Item name="email" label="Email Address">
              <Input disabled={!isEditing} size="small" />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input disabled={!isEditing} size="small" />
            </Form.Item>
            <Form.Item name="date_of_birth" label="Date of Birth">
              <Input disabled={!isEditing} placeholder="YYYY-MM-DD" size="small" />
            </Form.Item>
            <Form.Item name="degree_completed_year" label="Degree Completed Year">
              <Input disabled={!isEditing} size="small" />
            </Form.Item>
          </Form>
          {isEditing ? (
            <Button type="primary" size="small" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button type="link" size="small" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </Card>
      </Col>

      {/* Right Column - 60% */}
      <Col xs={24} sm={14} md={16} className="right-column">
        {/* Interview Process */}
        <Card title="Interview Process" bordered={false} className="interview-process">
          <Steps current={parseInt(userDetails.current_interview_level.slice(-1), 10) - 1} direction="horizontal">
            <Step title="L1" description="Aptitude" />
            <Step title="L2" description="Technical 1" />
            <Step title="L3" description="Technical 2" />
            <Step title="L4" description="Final Round" />
          </Steps>
        </Card>

        {/* Interview Details */}
        <Card title="Professional Details" bordered={false} className="interview-details">
          <Descriptions>
            <Descriptions.Item label="Experience Level">
              {userDetails.experience_level}
            </Descriptions.Item>
            <Descriptions.Item label="Graduated Year">
              {userDetails.degree_completed_year}
            </Descriptions.Item>
            <Descriptions.Item label="Graduated Percent">
              {"89%"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Interview Schedule */}
        <Card title="Interview Schedule" bordered={false} className="interview-schedule">
          <Button type="primary" className="interview-Add-Interview" onClick={showAddModal} style={{ marginBottom: 16 }}>
            Add Interview
          </Button>
          <Table
            columns={columns}
            dataSource={interviewData}
            expandable={{
              expandedRowRender: (record) => (
                record.link ? (
                  <p>
                    <strong>Meet Link: </strong>
                    <a href={record.link} target="_blank" rel="noopener noreferrer">{record.link}</a>
                  </p>
                ) : null
              ),
              rowExpandable: (record) => !!record.link,
            }}
            pagination={false}
          />
        </Card>

        {/* Modal for Adding Interview */}
        <Modal
          title="Add Interview"
          visible={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Card bordered={false}>
            <Form onFinish={handleAddInterview}>
              <Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please select a level' }]}>
                <Select placeholder="Select Level">
                  <Option value="L1">L1</Option>
                  <Option value="L2">L2</Option>
                  <Option value="L3">L3</Option>
                  <Option value="L4">L4</Option>
                </Select>
              </Form.Item>
              <Form.Item name="level_name" label="Level Name" rules={[{ required: true, message: 'Please select a level name' }]}>
                <Select placeholder="Select Level Name">
                  <Option value="Aptitude">Aptitude</Option>
                  <Option value="CallBack">CallBack</Option>
                  <Option value="Technical AI">Technical AI</Option>
                  <Option value="Technical Human">Technical Human</Option>
                  <Option value="HR">HR</Option>
                </Select>
              </Form.Item>
              <Form.Item name="scheduleTime" label="Schedule Time" rules={[{ required: true, message: 'Please select a time' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="scheduleMeet" valuePropName="checked">
                <Checkbox>Schedule Meet Link</Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="custom-button">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      </Col>
    </Row>
  );
};

export default UserDetailsPage;
