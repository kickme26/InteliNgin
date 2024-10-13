import React, { useEffect, useState } from 'react';
import { Table, Layout, Button, Avatar, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import AdminPageCalendar from './AdminPageCalendar';
import { PlusOutlined } from '@ant-design/icons';
import { FaTimesCircle, FaCheckCircle, FaRegUser, FaHourglass } from 'react-icons/fa'; // Example icons

const { Header, Footer, Content } = Layout;

const AdminPage = ({ onLogout }) => {
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State to hold filtered users
  const [totalCounts, setTotalCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://superkingsoft.com/demo/crud_api/admin.php?action=currentUserList');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setUserList(result.userList || []);
        setFilteredUsers(result.userList || []); // Initialize filtered users
        setTotalCounts({
          totalRejected: result.totalRejected,
          totalSelected: result.totalSelected,
          totalRegistered: result.totalRegistered,
          totalOnHold: result.totalOnHold,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const newFilteredUsers = userList.filter(user => {
      const scheduledDate = user.scheduled_time ? user.scheduled_time.split(' ')[0] : null;
      return scheduledDate === formattedDate;
    });
    setFilteredUsers(newFilteredUsers);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
      title: 'Level Name',
      dataIndex: 'interview_level_name',
      key: 'interview_level_name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <Layout className="layout">
      <Header className="admin-layout-header">
        <div className="header-item admin-header-label">
          <span className="header-label-text">Admin Dashboard</span>
        </div>
        <div className="header-item header-avatar">
          <Button icon={<PlusOutlined />} onClick={() => navigate(`/jobpost`)} style={{ marginRight: '10px' }}>Create JD</Button>
          <Button onClick={onLogout}>Logout</Button>
        </div>
      </Header>
      <Content className="layout-content">
      <Row gutter={16} style={{ margin: '5px 0px 15px 0px' }}>
      <Col xs={24} xl={6}>
      <Card
                    title={<span style={{ color: '#fff',fontWeight: 'bold' }}>Total Rejected</span>}
                    bordered={false}
                    style={{ backgroundColor: '#ff4d4f', color: '#fff' }} // Solid color
                >
                    <FaTimesCircle style={{ fontSize: '36px', marginRight: '10px' }} />
                    <span style={{ fontSize: '36px', fontWeight: 'normal' }}>{totalCounts.totalRejected || 0}</span>
                </Card>
            </Col>
            <Col xs={24} xl={6}>
                <Card
                    title={<span style={{ color: '#fff',fontWeight: 'bold' }}>Total Selected</span>}
                    bordered={false}
                    style={{ backgroundColor: '#52c41a', color: '#fff' }} // Solid color
                >
                    <FaCheckCircle style={{ fontSize: '36px', marginRight: '10px' }} />
                    <span style={{ fontSize: '36px', fontWeight: 'normal' }}>{totalCounts.totalSelected || 0}</span>
                </Card>
            </Col>
            <Col xs={24} xl={6}>
                <Card
                    title={<span style={{ color: '#fff',fontWeight: 'bold' }}>Total Registered</span>}
                    bordered={false}
                    style={{ backgroundColor: '#1890ff', color: '#fff' }} // Solid color
                >
                    <FaRegUser style={{ fontSize: '36px', marginRight: '10px' }} />
                    <span style={{ fontSize: '36px', fontWeight: 'normal' }}>{totalCounts.totalRegistered || 0}</span>
                </Card>
            </Col>
            <Col xs={24} xl={6}>
                <Card
                    title={<span style={{ color: '#fff',fontWeight: 'bold' }}>Total on Hold</span>}
                    bordered={false}
                    style={{ backgroundColor: '#ffcc00', color: '#856404' }} // Solid color
                >
                    <FaHourglass style={{ fontSize: '36px', marginRight: '10px' }} />
                    <span style={{ fontSize: '36px', fontWeight: 'normal' }}>{totalCounts.totalOnHold || 0}</span>
                </Card>
</Col>

</Row>


        <Row gutter={16} style={{ margin: '5px 0px 15px 0px' }}>
          <Col xs={24} xl={6}>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={filteredUsers} // Use filtered users here
                pagination={{ pageSize: 10 }}
                rowKey="userid"
                className="ant-border-space"
              />
            </div>
          </Col>
          <Col xs={24} xl={18}>
            <div className="calendar-container">
              <AdminPageCalendar users={userList} onDateChange={handleDateChange} />
            </div>
          </Col>
        </Row>

      </Content>
      <Footer className="layout-footer">
        <div className="footer-content">
          <span>© 2024, made with G.O.A.T Team for a better web.</span>
          <span className="footer-credits"> Developed by (Sathya, Sandhya, Guna, Monish)</span>
        </div>
      </Footer>
    </Layout>
  );
};

export default AdminPage;
