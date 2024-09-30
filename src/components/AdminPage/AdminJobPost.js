import React, { useState } from 'react';
import { Button, Modal, Input, Form, Card, Row, Col, Table, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './AdminJobPost.css';

const AdminJobPost = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobPosts = [
    {
      id: 1,
      jobRole: "Java Developer",
      noOfVacancies: 3,
      jobDescription: "Develop and maintain Java applications.",
      salaryPackage: "$80,000",
      experienceRequired: 3,
      skillsRequired: "Java, Spring Boot",
      candidatesApplied: 7,
      applicants: [
        {
          name: "John Doe",
          phone_number: "+1234567890",
          email: "johndoe@example.com",
          address: "123 Main St, Cityville, State, ZIP",
          date_of_birth: "1995-06-15",
          degree_completed_year: 2020,
          source_of_interview: "SocialMedia",
          experience_level: "Fresher",
          current_interview_level: "L2", // Current interview level
          start_date: "2024-09-21T09:00:00",
          end_date: "2024-09-30T17:00:00",
          number_of_levels_completed: 1,
          interviewer_name: "Alice Carter",
          registered_date: "2024-09-21T12:00:00",
          batch_code: "BATCH001",
          user_id: "USER123",
          is_selected: true,
          scheduled_level: "L3", // Scheduled level
          scheduled_date: "2024-10-01T10:00:00", // Scheduled date
          role: "user",
          experience: 4,
          status: "Shortlisted"
        },
        {
          name: "Jane Smith",
          phone_number: "+0987654321",
          email: "janesmith@example.com",
          address: "456 Elm St, Townsville, State, ZIP",
          date_of_birth: "1994-07-20",
          degree_completed_year: 2019,
          source_of_interview: "JobFair",
          experience_level: "Experienced",
          current_interview_level: "L1", // Current interview level
          start_date: "2024-09-22T09:00:00",
          end_date: "2024-10-05T17:00:00",
          number_of_levels_completed: 1,
          interviewer_name: "Bob Brown",
          registered_date: "2024-09-22T11:00:00",
          batch_code: "BATCH002",
          user_id: "USER456",
          is_selected: false,
          scheduled_level: "L2", // Scheduled level
          scheduled_date: "2024-09-30T12:30:00", // Scheduled date
          role: "user",
          experience: 2,
          status: "Processed to L1"
        },
        {
          name: "Michael Johnson",
          phone_number: "+1122334455",
          email: "michaeljohnson@example.com",
          address: "789 Maple St, Villagetown, State, ZIP",
          date_of_birth: "1992-02-12",
          degree_completed_year: 2018,
          source_of_interview: "Referral",
          experience_level: "Fresher",
          current_interview_level: "registered", // Current interview level
          start_date: "2024-09-23T09:00:00",
          end_date: "2024-09-30T17:00:00",
          number_of_levels_completed: 0,
          interviewer_name: "Cathy White",
          registered_date: "2024-09-23T10:00:00",
          batch_code: "BATCH003",
          user_id: "USER789",
          is_selected: false,
          scheduled_level: null, // No scheduled level yet
          scheduled_date: null, // No scheduled date yet
          role: "user",
          experience: 1,
          status: "Applied"
        },
        {
          name: "Emily Davis",
          phone_number: "+2233445566",
          email: "emilydavis@example.com",
          address: "321 Oak St, Foresttown, State, ZIP",
          date_of_birth: "1990-01-30",
          degree_completed_year: 2015,
          source_of_interview: "JobPortal",
          experience_level: "Experienced",
          current_interview_level: "hold", // Current interview level
          start_date: "2024-09-25T09:00:00",
          end_date: "2024-10-05T17:00:00",
          number_of_levels_completed: 0,
          interviewer_name: "Diana Prince",
          registered_date: "2024-09-25T11:00:00",
          batch_code: "BATCH004",
          user_id: "USER001",
          is_selected: false,
          scheduled_level: null, // No scheduled level yet
          scheduled_date: null, // No scheduled date yet
          role: "user",
          experience: 5,
          status: "On Hold"
        },
        {
          name: "Oliver Twist",
          phone_number: "+3344556677",
          email: "olivertwist@example.com",
          address: "654 Pine St, Cityland, State, ZIP",
          date_of_birth: "1988-11-12",
          degree_completed_year: 2016,
          source_of_interview: "Friend",
          experience_level: "Experienced",
          current_interview_level: "rejected", // Current interview level
          start_date: "2024-09-29T09:00:00",
          end_date: "2024-10-10T17:00:00",
          number_of_levels_completed: 2,
          interviewer_name: "Peter Parker",
          registered_date: "2024-09-29T12:00:00",
          batch_code: "BATCH005",
          user_id: "USER002",
          is_selected: false,
          scheduled_level: null, // No scheduled level yet
          scheduled_date: null, // No scheduled date yet
          role: "user",
          experience: 3,
          status: "Rejected"
        },
        {
          name: "Sophia Brown",
          phone_number: "+5566778899",
          email: "sophiabrown@example.com",
          address: "789 Birch St, Townsville, State, ZIP",
          date_of_birth: "1995-05-20",
          degree_completed_year: 2021,
          source_of_interview: "OnlineAd",
          experience_level: "Fresher",
          current_interview_level: "registered", // Current interview level
          start_date: "2024-09-30T09:00:00",
          end_date: "2024-10-05T17:00:00",
          number_of_levels_completed: 0,
          interviewer_name: "Clark Kent",
          registered_date: "2024-09-30T10:00:00",
          batch_code: "BATCH006",
          user_id: "USER003",
          is_selected: false,
          scheduled_level: "L1", // Scheduled level
          scheduled_date: "2024-10-01T12:30:00", // Scheduled date
          role: "user",
          experience: 0,
          status: "Applied"
        },
        {
          name: "Lucas Green",
          phone_number: "+6677889900",
          email: "lucasgreen@example.com",
          address: "159 Cedar St, Hilltown, State, ZIP",
          date_of_birth: "1993-08-15",
          degree_completed_year: 2019,
          source_of_interview: "JobFair",
          experience_level: "Experienced",
          current_interview_level: "L3", // Current interview level
          start_date: "2024-09-28T09:00:00",
          end_date: "2024-10-06T17:00:00",
          number_of_levels_completed: 3,
          interviewer_name: "Bruce Wayne",
          registered_date: "2024-09-28T11:00:00",
          batch_code: "BATCH007",
          user_id: "USER004",
          is_selected: true,
          scheduled_level: null, // No scheduled level yet
          scheduled_date: null, // No scheduled date yet
          role: "user",
          experience: 6,
          status: "Selected"
        },
      ]
    },
    // Add more job posts if needed
  ];
  
  
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    console.log('Submitted values:', values);
    setIsModalOpen(false); // Close the modal after submission
  };

  const handleCardClick = (job) => {
    setSelectedJob(job);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" style={{ marginRight: 8 }} />
          <a onClick={() => navigate(`/user/${record.user_id}`)}>{text}</a>
        </div>
      ),
    },
    {
      title: 'Experience (Years)',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div className="admin-jobpost-page">
      <Button type="primary" onClick={showModal} className="create-job-button">
        Create JD
      </Button>

      <Modal
        title="Create Job Description"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item 
            name="jobRole" 
            label="Job Role" 
            rules={[{ required: true, message: 'Please input the job role!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="experienceRequired" 
            label="Experience Required (Years)" 
            rules={[{ required: true, message: 'Please input the required experience!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item 
            name="salaryPackage" 
            label="Salary Package" 
            rules={[{ required: true, message: 'Please input the salary package!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="jobpost-grid">
        <Row gutter={[16, 16]}>
          {jobPosts.map((job) => (
            <Col key={job.id} xs={24} sm={12} lg={6}>
              <Card 
                className="job-card" 
                onClick={() => handleCardClick(job)}
                hoverable
              >
                <p>{job.jobRole}</p>
                <h6>{`Experience: ${job.experienceRequired} years`}</h6>
                <h4>{`Applied: ${job.candidatesApplied}`}</h4>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {selectedJob && (
        <div className="recent-users card">
          <div className="card-header">
            <h5 className="card-title">{`${selectedJob.jobRole} Applicants`}</h5>
          </div>
          <div className="px-0 py-2 card-body">
            <div className="table-responsive">
              <Table 
                dataSource={selectedJob.applicants} 
                columns={columns} 
                rowKey="user_id" // Changed to user_id for unique keys
                pagination={false} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobPost;
