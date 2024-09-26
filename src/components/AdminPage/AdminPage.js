import React, { useEffect, useState } from 'react';
import { Table, Layout, Button, Typography, Avatar, Radio, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import AdminPageCalendar from './AdminPageCalendar';
 // Ensure correct paths for icons

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const AdminPage = ({ onLogout }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const dollor = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z"
        fill="#fff"
      ></path>
      <path
        d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z"
        fill="#fff"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V5.09199C8.3784 5.20873 7.80348 5.43407 7.32398 5.75374C6.6023 6.23485 6 7.00933 6 8C6 8.99067 6.6023 9.76515 7.32398 10.2463C7.80348 10.5659 8.37841 10.7913 9.00001 10.908L9.00002 12.8492C8.60902 12.7223 8.31917 12.5319 8.15667 12.3446C7.79471 11.9275 7.16313 11.8827 6.74599 12.2447C6.32885 12.6067 6.28411 13.2382 6.64607 13.6554C7.20855 14.3036 8.05956 14.7308 9 14.9076L9 15C8.99999 15.5523 9.44769 16 9.99998 16C10.5523 16 11 15.5523 11 15L11 14.908C11.6216 14.7913 12.1965 14.5659 12.676 14.2463C13.3977 13.7651 14 12.9907 14 12C14 11.0093 13.3977 10.2348 12.676 9.75373C12.1965 9.43407 11.6216 9.20873 11 9.09199L11 7.15075C11.391 7.27771 11.6808 7.4681 11.8434 7.65538C12.2053 8.07252 12.8369 8.11726 13.254 7.7553C13.6712 7.39335 13.7159 6.76176 13.354 6.34462C12.7915 5.69637 11.9405 5.26915 11 5.09236V5Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  // Sample data for the cards layout
  const count = [
    {
      today: "Total Rejected candidates this month",
      title: "120",
      persent: "+30%",
      bnb: "bnb2",
    },
    {
      today: "Total selected candidates this month",
      title: "33",
      persent: "+20%",
      bnb: "bnb2",
    },
    {
      today: "Total Registered candidates this month",
      title: "470",
      persent: "-20%",
      bnb: "redtext",
    },
    {
      today: "Total candidates on hold this month",
      title: "60",
      persent: "10%",
      bnb: "bnb2",
    },
  ];

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/data');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter data when selected date or filter changes
  useEffect(() => {
    filterTable(filter, selectedDate);
  }, [selectedDate, filter, data]);

  // Handle date change from the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date ? date.toDate() : null);
  };

  // Handle filter change for radio buttons
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter table data based on selected date and status filter
  const filterTable = (filter, date) => {
    let filtered = data;

    // Filter by date if a date is selected
    if (date) {
      filtered = filtered.filter((item) => {
        const registeredDate = new Date(item.registered_date);
        return registeredDate.toDateString() === date.toDateString();
      });
    }

    // Filter by status based on the selected filter
    if (filter === 'online') {
      filtered = filtered.filter((item) => item.status === 'online');
    } else if (filter === 'store') {
      filtered = filtered.filter((item) => item.status === 'store');
    }

    setFilteredData(filtered);
  };

  // Table columns configuration
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
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
  ];

  return (
    <Layout className="layout">

  <Layout>
    <Header className="layout-header">
      <div className="header-item header-label">
        <span className="header-label-text">Admin Dashboard</span>
      </div>
      <div className="header-item header-avatar">
        <Button onClick={onLogout}>Logout</Button>
      </div>
    </Header>
    <Content className="layout-content">
      {/* Four cards layout */}
      <Row className="rowgap-vbox" gutter={[24, 0]} style={{ marginBottom: '24px' }}>
        {count.map((c, index) => (
          <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox">
              <div className="number">
                <Row align="middle" gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{c.today}</span>
                    <Title level={3}>
                      {c.title} <small className={c.bnb}></small>
                    </Title>
                  </Col>
                  <Col xs={6}>
                    <div className="icon-box">{c.icon}</div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Calendar and Table */}
      <div className="scrollable-content" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingBottom: '24px' }}>
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Admin Table"
              extra={
                <Radio.Group onChange={handleFilterChange} defaultValue="all">
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="online">TODAY</Radio.Button>
                  <Radio.Button value="store">TOMORROW</Radio.Button>
                </Radio.Group>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 'max-content', y: 300 }}
                  rowKey="user_id"
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>

        <div className="calendar-container" style={{ marginTop: '16px' }}>
          <AdminPageCalendar users={data} onDateChange={handleDateChange} />
        </div>
      </div>
    </Content>
    <Footer className="layout-footer">
    <div className="footer-content">
    <span>© 2024, made with G.O.A.T Team for a better web.</span>
    <span className="footer-credits">Creative Tim | Developed by (Sathya, Sandhya, Guna, Monish)</span>
    </div>
    </Footer>
  </Layout>
</Layout>

  );
};

export default AdminPage;
