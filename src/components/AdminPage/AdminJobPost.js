import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Form, Card, Table, Avatar, message } from 'antd'; // Import message for notifications
import { useNavigate } from 'react-router-dom'; 
import './AdminJobPost.css';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons'; 

const AdminJobPost = () => {
  const navigate = useNavigate(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const [applicants, setApplicants] = useState([]);

  // Fetch job posts function
  const fetchJobPosts = async () => {
    try {
      const response = await fetch('http://superkingsoft.com/demo/crud_api/admin.php?action=listAllJD');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setJobPosts(data.jdList || []);
    } catch (error) {
      console.error('Error fetching job posts:', error);
    }
  };

  useEffect(() => {
    fetchJobPosts(); // Fetch job posts on component mount
  }, []);

  const gradients = [
    'linear-gradient(-135deg, #1de9b6 0%, #1dc4e9 100%)',
    'linear-gradient(-135deg, #899FD4 0%, #A389D4 100%)',
    'linear-gradient(-135deg, #4a90e2 0%, #5d9cec 100%)',
    'linear-gradient(-135deg, #00c6ff 0%, #0072ff 100%)',
    'linear-gradient(-135deg, #6a82fb 0%, #fc5c7d 100%)',
    'linear-gradient(-135deg, #8e44ad 0%, #3498db 100%)',
  ];

  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://superkingsoft.com/demo/crud_api/admin.php?action=saveJD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      await fetchJobPosts();
      handleCancel();
    } catch (error) {
      console.error('Error creating job description:', error);
    }
  };

  const handleCardClick = async (job) => {
    setSelectedJob(job);
    
    try {
      const response = await fetch('http://superkingsoft.com/demo/crud_api/admin.php?action=roleBasedUserList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_role: job.role }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setApplicants(data.userList || []);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const copyToClipboard = async () => {
    if (selectedJob) {
      const url = `http://localhost:3000/register/${selectedJob.id}`;
      try {
        await navigator.clipboard.writeText(url);
        message.success('URL copied to clipboard!'); // Show success message
      } catch (err) {
        console.error('Failed to copy URL: ', err);
      }
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" style={{ marginRight: 8 }} />
          <a onClick={() => navigate(`/user/${record.userid}`)}>{text}</a>
        </div>
      ),
    },
    {
      title: 'Experience (Years)',
      dataIndex: 'required_experience',
      key: 'required_experience',
    },
    {
      title: 'User ID',
      dataIndex: 'userid',
      key: 'userid',
    },
  ];

  return (
    <div className="admin-jobpost-page">
      <div className="content-container">
        <Card className="create-job-card">
          <div className="text-content">
            <h2 className="portal-title">Job Portal</h2>
            <p className="portal-description">
              Begin by creating new job vacancies and managing interviews for applicants.
            </p>
          </div>
          <div className="button-container">
            <Button type="primary" onClick={showModal} className="create-job-button">
              <PlusOutlined style={{ marginRight: '8px' }} />
              Create JD
            </Button>
          </div>
        </Card>

        <div className="jobpost-scroll">
          {jobPosts.map((job, index) => (
            <Card 
              key={index}
              className="job-card"
              style={{ background: gradients[index % gradients.length] }} 
              onClick={() => handleCardClick(job)}
              hoverable
            >
              <p className="job-role">{job.role}</p>
              <h6 className="experience">{`Experience: ${job.required_experience} years`}</h6>
              <h4 className="applied-count">{`Applied: ${job.applied_count}`}</h4>
            </Card>
          ))}
        </div>

        {selectedJob && (
          <div className="recent-users card" style={{ padding: '16px', marginTop: '16px' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {`${selectedJob.role} Applicants`}
              </h5>
              <Input
                readOnly
                value={`http://localhost:3000/register/${selectedJob.id}`}
                addonAfter={<CopyOutlined onClick={copyToClipboard} style={{ cursor: 'pointer' }} />}
                style={{ width: '300px', marginLeft: '16px' }} // Adjust width as necessary
              />
            </div>
            <div className="px-0 py-2 card-body">
              <div className="table-responsive">
                <Table
                  dataSource={applicants}
                  columns={columns}
                  rowKey="userid"
                  pagination={false}
                />
              </div>
            </div>
          </div>
        )}

        <Modal
          title="Create Job Description"
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item 
              name="job_role" 
              label="Job Role" 
              rules={[{ required: true, message: 'Please input the job role!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="job_description" 
              label="Job Description" 
              rules={[{ required: true, message: 'Please input the description!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              name="required_skills" 
              label="Required Skills" 
              rules={[{ required: true, message: 'Please input the skills required!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="required_experience" 
              label="Experience Required (Years)" 
              rules={[{ required: true, message: 'Please input the required experience!' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item 
              name="salary_package" 
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
      </div>
    </div>
  );
};

export default AdminJobPost;
