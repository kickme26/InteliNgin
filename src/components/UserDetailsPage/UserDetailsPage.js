import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Form, Input, Button, Select, DatePicker,message, Avatar, Modal, Table, Steps, Checkbox } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import './UserDetailsPage.css';
import { FloatButton,Dropdown, Menu } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

import { CustomerServiceOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Step } = Steps;

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [interviewData, setInterviewData] = useState([]);
  const [selectedTestDetails, setSelectedTestDetails] = useState(null);
  const [currentModalType, setCurrentModalType] = useState('');
  const [testDetailsModalVisible, setTestDetailsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
  
    const handleMenuClick = () => {
      setMenuVisible((prev) => !prev);
    };
  
    const handleMenuMouseLeave = () => {
      setMenuVisible(false);
    };
  const apiEndpoints = {
    "Aptitude Adventure Round": 'http://superkingsoft.com/demo/crud_api/admin.php?action=saveAIAptitude',
    "AI Tech Talk Round": 'http://superkingsoft.com/demo/crud_api/admin.php?action=saveChatWithAI',
    "AI Confirmation Assistant": 'http://superkingsoft.com/demo/crud_api/admin.php?action=saveCallBackAI',
    "Human Interaction Round": 'http://superkingsoft.com/demo/crud_api/admin.php?action=saveChatWithHuman',
  };

  const requestBodyTemplates = {
    "Aptitude Adventure Round": (values) => ({
      userid: String(userId),
      level_number: values.level_number,
      level_name: "aptitude",
      no_of_questions: values.no_of_questions,
      scheduled_time: values.scheduled_time.format('YYYY-MM-DD HH:mm:ss'),
      status: "pending",
      timer: values.timer,
    }),
    "AI Tech Talk Round": (values) => ({
      userid: String(userId),
      level_number: values.level_number,
      level_name: "chat",
      no_of_questions: values.no_of_questions,
      scheduled_time: values.scheduled_time.format('YYYY-MM-DD HH:mm:ss'),
      skills: values.skills.join(','),
      hr_name: values.hr_name,
      status: "pending",
      review: "good",
    }),
    "AI Confirmation Assistant": (values) => ({
      userid: String(userId),
      level_number: values.level_number,
      level_name: "callback",
      scheduled_time: values.scheduled_time.format('YYYY-MM-DD HH:mm:ss'),
      no_of_question: values.questions.length,
      questions: values.questions.join(', '),
      status: "pending",
    }),
    "Human Interaction Round": (values) => ({
      userid: String(userId),
      level_number: values.level_number,
      level_name: "human",
      scheduled_time: values.scheduled_date_time.format('YYYY-MM-DD HH:mm:ss'),
      interviewer_name: values.interviewer_name,
      meet_link: values.meetingLink || '',
      feedback: values.feedback || '',
      status: 'pending',
    }),
  };

  const [personalForm] = Form.useForm();
  const [professionalForm] = Form.useForm();

  // Meeting link state
  const [createMeetingLink, setCreateMeetingLink] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
    // Dynamically require all avatar images
    const requireAvatar = require.context('../../../public/image/avatar', false, /\.(png|jpe?g|svg)$/);
    const avatars = requireAvatar.keys().map(requireAvatar);

    // Function to select a random avatar
    const getRandomAvatar = () => {
        const randomIndex = Math.floor(Math.random() * avatars.length);
        return avatars[randomIndex];
    };

    const [profileAvatar, setProfileAvatar] = useState(getRandomAvatar());

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        console.error("User ID is undefined");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post('http://superkingsoft.com/demo/crud_api/admin.php?action=userCompleteDetail', {
          userid: userId 
        });
        setUserDetails(response.data);
        setInterviewData(response.data.interview_table || []);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        message.error("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId, form]);

  useEffect(() => {
    if (userDetails) {
      personalForm.setFieldsValue({
        name: userDetails.name,
        mobile_number: userDetails.mobile_number,
        email: userDetails.email,
        address: userDetails.address,
        date_of_birth: userDetails.date_of_birth,
      });

      professionalForm.setFieldsValue({
        apply_for_role: userDetails.apply_for_role,
        source_of_interview: userDetails.source_of_interview,
        is_fresher: userDetails.is_fresher,
        is_experienced: userDetails.is_experienced,
        years_of_experience: userDetails.years_of_experience,
        ug_degree_name: userDetails.ug_degree_name,
        ug_completed_year: userDetails.ug_completed_year,
        ug_mark_percent: userDetails.ug_mark_percent,
        twelvth_completed_year: userDetails.twelvth_completed_year,
        twelvth_mark_percent: userDetails.twelvth_mark_percent,
        tenth_completed_year: userDetails.tenth_completed_year,
        tenth_mark_percent: userDetails.tenth_mark_percent,
        passport_number: userDetails.passport_number,
        aadhar_number: userDetails.aadhar_number,
      });
    }
  }, [userDetails]);  

  const handleEdit = () => setIsEditing(true);
  const handleModalCancel = () => setModalVisible(false);

  const handleAddInterview = async (values) => {
    const selectedEndpoint = apiEndpoints[currentModalType];

    // Build the request body based on the current modal type
    let requestBody = {};
    
    // Ensure the correct request body is being created
    requestBody = requestBodyTemplates[currentModalType](values);
    requestBody.meet_link = values.meet_link || ''; 
    
    try {
        const response = await fetch(selectedEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (data.message === "success") {  // Check for "success" in message
            message.success('Interview scheduled successfully!');
            form.resetFields();
            setModalVisible(false);
            window.location.reload(); // Refresh the page
        } else {
            message.error('Failed to schedule the interview. Please try again.');
        }
    } catch (error) {
        message.error('An error occurred. Please try again later.');
    }
};


  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setCreateMeetingLink(isChecked);
    
    if (isChecked) {
      const generatedLink = 'https://meet.google.com/hjb-rhku-csr';
      setMeetingLink(generatedLink);
      form.setFieldsValue({ meet_link: generatedLink }); // Set the form field value
    } else {
      setMeetingLink('');
      form.setFieldsValue({ meet_link: '' }); // Clear the form field
    }
  };

  const showModal = (type) => {
    setCurrentModalType(type);
    setModalVisible(true);
    form.resetFields(); // Only reset fields related to the interview modal
    setCreateMeetingLink(false);
    setMeetingLink('');
  };

  const menu = (
    <Menu>
      <Menu.Item key="selected" onClick={() => { updateStatus('Selected'); setMenuVisible(false); }}>Selected</Menu.Item>
      <Menu.Item key="rejected" onClick={() => { updateStatus('Rejected'); setMenuVisible(false); }}>Rejected</Menu.Item>
      <Menu.Item key="onHold" onClick={() => { updateStatus('On Hold'); setMenuVisible(false); }}>On Hold</Menu.Item>
    </Menu>
  );

  if (!userDetails) return <div>Loading...</div>;

  const predefinedQuestions = [
    "Do you still look for a job?",
    "Are you servicing notice period?",
    "Do you have another offer?",
    "Is defined package okay?",
    "Are you okay for relocation?",
  ];
  
  const interviewCards = [
    {
      title: 'Aptitude Adventure Round',
      fields: (
        <>
          <Form.Item name="level_number" label="Level Number" rules={[{ required: true, message: 'Please select a level!' }]}>
            <Select placeholder="Select level">
              <Option value="1">L1</Option>
              <Option value="2">L2</Option>
              <Option value="3">L3</Option>
              <Option value="4">L4</Option>
              <Option value="5">L5</Option>
              <Option value="6">L6</Option>
            </Select>
          </Form.Item>
          <Form.Item name="no_of_questions" label="No of Questions" rules={[{ required: true, message: 'Please enter the number of questions!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="scheduled_time" label="Scheduled Time" rules={[{ required: true, message: 'Please select a scheduled time!' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="timer" label="Timer (minutes)" rules={[{ required: true, message: 'Please enter the timer!' }]}>
            <Input type="number" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'AI Tech Talk Round',
      fields: (
        <>
          <Form.Item name="level_number" label="Level Number" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="1">L1</Select.Option>
              <Select.Option value="2">L2</Select.Option>
              <Select.Option value="3">L3</Select.Option>
              <Select.Option value="4">L4</Select.Option>
              <Select.Option value="5">L5</Select.Option>
              <Select.Option value="6">L6</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="scheduled_time" label="Scheduled Time" rules={[{ required: true, message: 'Please select a scheduled time!' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="timer" label="Timer (in minutes)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="no_of_questions" label="Number of Questions" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="hr_name" label="HR Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="skills" label="Skills" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Add skills" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'AI Confirmation Assistant',
      fields: (
        <>
          <Form.Item name="level_number" label="Level Number" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="1">L1</Select.Option>
              <Select.Option value="2">L2</Select.Option>
              <Select.Option value="3">L3</Select.Option>
              <Select.Option value="4">L4</Select.Option>
              <Select.Option value="5">L5</Select.Option>
              <Select.Option value="6">L6</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="scheduled_time" label="Scheduled Time" rules={[{ required: true, message: 'Please select a scheduled time!' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        <Form.Item name="questions" label="Questions" rules={[{ required: true }]}>
          <Select mode="tags" placeholder="Select or add questions">
          {predefinedQuestions.map((question) => (
            <Option key={question} value={question}>
              {question}
            </Option>
          ))}
        </Select>
      </Form.Item>
        </>
      ),
    },
    {
      title: 'Human Interaction Round',
      fields: (
        <>
          <Form.Item name="level_number" label="Level Number" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="1">L1</Select.Option>
              <Select.Option value="2">L2</Select.Option>
              <Select.Option value="3">L3</Select.Option>
              <Select.Option value="4">L4</Select.Option>
              <Select.Option value="5">L5</Select.Option>
              <Select.Option value="6">L6</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="interviewer_name" label="Interviewer Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="scheduled_date_time" label="Scheduled Time" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Checkbox onChange={handleCheckboxChange}>
              Create Google Meet Link
            </Checkbox>
          </Form.Item>
          {createMeetingLink && (
            <Form.Item label="Google Meet Link" name="meet_link">
              <Input value={meetingLink} readOnly />
            </Form.Item>
          )}
          <Form.Item name="feedback" label="Feedback">
            <Input.TextArea />
          </Form.Item>
        </>
      ),
    },    
  ];  
// Function to handle saving personal information
const handleSave = (form) => {
  form.validateFields()
    .then(values => {
      // Update userDetails state with new values
      setUserDetails(prevDetails => ({ ...prevDetails, ...values }));

      // Show success message
      message.success('Personal information saved successfully!');
      
      // Exit editing mode
      setIsEditing(false);
    })
    .catch(info => {
      console.log('Validate Failed:', info);
      // Optionally, display a message to inform the user of validation errors
      message.error('Please correct the errors in the form.');
    });
};


const handleProfessionalSave = (form) => {
  form.validateFields()
    .then(values => {
      setUserDetails({ ...userDetails, ...values });
      message.success('Professional information saved successfully!');
      setIsEditingProfessional(false);
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
};


const showTestDetailsModal = (testDetails) => {
  setSelectedTestDetails(testDetails);
  setTestDetailsModalVisible(true);
};

const handleTestDetailsModalCancel = () => {
  setTestDetailsModalVisible(false);
  setSelectedTestDetails(null);
};

const columns = [
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level_no',
  },
  {
    title: 'Level Name',
    dataIndex: 'level_name',
    key: 'level_name',
    render: (text, record) => (
      <a onClick={() => showTestDetailsModal(record.test_details)} style={{ cursor: 'pointer' }}>
        {text}
      </a>
    ),
  },
  {
    title: 'Scheduled Time',
    dataIndex: 'schedule_date_time',
    key: 'schedule_date_time',
    render: (text) => new Date(text).toLocaleString(),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

const currentLevel = userDetails ? (userDetails.current_interview_level === "registered" ? 0 : userDetails.number_of_levels_completed) : 0;

const updateStatus = async (status) => {
  try {
    const response = await fetch('http://superkingsoft.com/demo/crud_api/user.php?action=userOnboardStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userId,
        status: status,
      }),
    });

    const result = await response.json();
    
    // Use '===' for comparison and 'success' as a string
    if (result.message === "success") {  
      message.success(`Status updated to ${status}`);
    } else {
      message.error('Failed to update status');
    }
  } catch (error) {
    message.error('Error updating status');
  }
};


return (
  <Row gutter={[16, 16]}>
    {/* Left Column - 35% */}
    <Col xs={24} sm={10} md={8} className="left-column">
                    <Card className="custom-card user-details-card" title="User Details">
                        <Row align="middle">
                            <Col span={8}>
                                <Avatar size={100} src={profileAvatar} icon={<UserOutlined />} />
                            </Col>
                            <Col span={16}>
                                <h4 style={{ fontWeight: 'bold', fontSize: '1.5rem', margin: 0 }}>
                                    {userDetails.name}
                                </h4>
                                <p style={{ margin: 0 }}>{userDetails.user_id}</p>
                            </Col>
                        </Row>
                    </Card>

     {/* Personal Information */}
<Card className="custom-card user-details-card" title="Personal Information" bordered={false}>
  <Form form={personalForm} layout="vertical">
    <Form.Item 
      name="name" 
      label="Name" 
      rules={[{ required: true, message: 'Please enter your name!' }]}
    >
      <Input disabled={!isEditing} size="small" />
    </Form.Item>
    <Form.Item 
      name="mobile_number" 
      label="Mobile Number" 
      rules={[{ required: true, message: 'Please enter your mobile number!' }]}
    >
      <Input disabled={!isEditing} size="small" />
    </Form.Item>
    <Form.Item 
      name="email" 
      label="Email Address" 
      rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
    >
      <Input disabled={!isEditing} size="small" />
    </Form.Item>
    <Form.Item name="address" label="Address">
      <Input disabled={!isEditing} size="small" />
    </Form.Item>
    <Form.Item 
      name="date_of_birth" 
      label="Date of Birth" 
      rules={[{ required: true, message: 'Please enter your date of birth!' }]}
    >
      <Input disabled={!isEditing} placeholder="YYYY-MM-DD" size="small" />
    </Form.Item>
    <div style={{ marginTop: '16px' }}>
      {isEditing ? (
        <Button type="primary" size="small" onClick={() => handleSave(personalForm)}>
        Save
      </Button>
      ) : (
        <Button type="link" size="small" onClick={handleEdit}>
          Edit
        </Button>
      )}
    </div>
  </Form>
</Card>

    </Col>

    {/* Right Column - 60% */}
      {/* Interview Process Timeline */}
      <Col xs={24} sm={14} md={16} className="right-column">
        {/* Interview Process Timeline */}
        <Card className="custom-card user-details-card" title="Interview Process" bordered={false} style={{ marginBottom: '16px', fontSize: '14px' }}>
    <Steps current={currentLevel} direction="horizontal">
        <Step 
            title="Applied" 
            description="Application submitted" 
            status="finish" 
            style={{ color: 'blue' }} 
        />
        {interviewData.map((interview, index) => {
            let status = "wait"; 
            if (interview.status === "completed") {
                status = "finish"; 
            } else if (interview.selection_status === "Rejected") {
                status = "error"; 
            } else if (currentLevel === index + 1) {
                status = "process"; 
            }

            return (
                <Step
                    key={index}
                    title={`L${interview.level}`}
                    description={interview.level_name}
                    status={status}
                    style={{
                        color: status === "finish" ? 'blue' : status === "error" ? 'red' : 'black',
                    }}
                />
            );
        })}
        <Step 
            title={
                <div 
                    className="final-round-container"
                    onClick={handleMenuClick} 
                    onMouseLeave={handleMenuMouseLeave}
                >
                    <span className="heartbeat final-round-title">
                        {userDetails.status === "Rejected" 
                            ? <span style={{ color: 'red' }}>Final Round <span role="img" aria-label="cross">❌</span></span>
                            : userDetails.status === "Selected"
                                ? <span style={{ color: 'green' }}>Final Round <span role="img" aria-label="check">✔️</span></span>
                                : "Final Round"}
                    </span>
                    {menuVisible && (
                        <Dropdown overlay={menu} trigger={['click']} visible={menuVisible}>
                            <span className="dropdown-trigger" style={{ marginLeft: '10px', cursor: 'pointer' }}>
                                {/* You can place an icon here if desired */}
                            </span>
                        </Dropdown>
                    )}
                </div>
            } 
            description={
                userDetails.status === "Selected" 
                    ? "Candidate selected! Waiting for the onboarding process."
                    : userDetails.status === "Rejected" 
                        ? "Candidate Rejected."
                        : "Click here to make your final choice"
            } 
            status={currentLevel >= interviewData.length + 1 ? "finish" : "wait"}
            style={{ color: currentLevel >= interviewData.length + 1 ? 'blue' : 'black', position: 'relative' }} 
        />
    </Steps>
</Card>


      {/* Interview Schedule */}
      <Card bordered={false} className="custom-card user-details-card" title="Schedule Interview">
        <Row gutter={[16, 16]} justify="space-between">
          {interviewCards.map((card, index) => (
            <Col key={index} xs={12} sm={6}>
              <Card
                onClick={() => showModal(card.title)}
                className={`interview-card card-${index}`} // Add custom class
                bordered={true}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <h3 style={{ flexGrow: 1 }}>{card.title}</h3>
              </Card>
            </Col>
          ))}
        </Row>
        <Table
          columns={columns} // Define your columns here
          dataSource={interviewData}
          pagination={false}
          style={{ marginTop: 16 }}
        />
      </Card>
      {/* Professional Information */}
<Card className="custom-card user-details-card" title="Professional Information" bordered={false}>
  <Form form={professionalForm} layout="vertical">
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="apply_for_role" label="Apply for Role">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="source_of_interview" label="Source of Interview">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="is_fresher" label="Is Fresher">
          <Select disabled={!isEditingProfessional} size="small">
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="is_experienced" label="Is Experienced">
          <Select disabled={!isEditingProfessional} size="small">
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="years_of_experience" label="Years of Experience">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="ug_degree_name" label="UG Degree Name">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="ug_completed_year" label="UG Completed Year">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="ug_mark_percent" label="UG Mark Percent">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="twelvth_completed_year" label="12th Completed Year">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="twelvth_mark_percent" label="12th Mark Percent">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="tenth_completed_year" label="10th Completed Year">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="tenth_mark_percent" label="10th Mark Percent">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="passport_number" label="Passport Number">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="aadhar_number" label="Aadhar Number">
          <Input disabled={!isEditingProfessional} size="small" />
        </Form.Item>
      </Col>
    </Row>
    <div style={{ marginTop: '16px' }}>
      {isEditingProfessional ? (
        <Button type="primary" size="small" onClick={() => handleProfessionalSave(professionalForm)}>
          Save
        </Button>
      ) : (
        <Button type="link" size="small" onClick={() => setIsEditingProfessional(true)}>
          Edit
        </Button>
      )}
    </div>
  </Form>
</Card>

{/* Modal for Adding Interview */}
<Modal
  title={`Add Interview - ${currentModalType}`}
  visible={modalVisible}
  onCancel={handleModalCancel}
  footer={null}
>
  <Card bordered={false}>
    <Form form={form} onFinish={handleAddInterview}>
      {interviewCards.find(card => card.title === currentModalType)?.fields}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="custom-button">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </Card>
</Modal>



      {/* Modal for Test Details */}
      <Modal
        title="Test Details"
        visible={testDetailsModalVisible}
        onCancel={handleTestDetailsModalCancel}
        footer={null}
      >
        {selectedTestDetails ? (
          <Card bordered={false}>
            <h4>Test Details:</h4>
            <p><strong>Total Questions:</strong> {selectedTestDetails.total_question}</p>
            <p><strong>Total Time Taken:</strong> {selectedTestDetails.total_time_taken} minutes</p>
            <p><strong>Total Correct:</strong> {selectedTestDetails.total_correct}</p>
            <p><strong>Total Incorrect:</strong> {selectedTestDetails.total_incorrect}</p>
            <p><strong>Total Skipped:</strong> {selectedTestDetails.total_skipped}</p>
            <p><strong>Completed Time:</strong> {new Date(selectedTestDetails.completed_time).toLocaleString()}</p>
            <p><strong>Started Time:</strong> {new Date(selectedTestDetails.started_time).toLocaleString()}</p>
            <p><strong>Question Level:</strong> {selectedTestDetails.question_level}</p>
          </Card>
        ) : (
          <div>No test details available.</div>
        )}
      </Modal>
    </Col>
  </Row>
);
}
export default UserDetailsPage;