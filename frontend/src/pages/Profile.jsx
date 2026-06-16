import { useState } from 'react'
import { Card, Tabs, Form, Input, Button, Avatar, Upload, Table, Tag, message, Modal } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  UploadOutlined,
  HistoryOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { userEmail } = useAuth()
  
  // Profile settings state
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  const handleProfileUpdate = (values) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('Account profile updated successfully!')
    }, 1000)
  }

  const handlePasswordUpdate = (values) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      passwordForm.resetFields()
      message.success('Account password updated successfully!')
    }, 1500)
  }

  // Mock Active session logs
  const sessionColumns = [
    {
      title: 'Browser / Device',
      dataIndex: 'device',
      key: 'device',
      render: (text) => <span className="font-semibold text-xs text-slate-700 dark:text-slate-200">{text}</span>,
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: (text) => <span className="text-xs text-slate-400 font-medium">{text}</span>,
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (text) => <span className="text-xs text-slate-450">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Current Session' ? 'success' : 'default'} className="rounded-md border-none font-bold text-[9px]">
          {status}
        </Tag>
      ),
    },
  ]

  const sessionData = [
    { key: 1, device: 'Chrome on Windows 11', ip: '192.168.1.45', lastActive: 'Just now', status: 'Current Session' },
    { key: 2, device: 'Safari on iPhone 15 Pro', ip: '192.168.1.18', lastActive: '3 hours ago', status: 'Active' },
    { key: 3, device: 'Firefox on macOS Sonoma', ip: '82.24.120.10', lastActive: '2 days ago', status: 'Active' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white title-font m-0">
          Account Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
          Manage your cursive signatures parameters, change security passwords, and track active sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Avatar & Summary Profile Card */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 text-center py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar
                size={96}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1677FF' }}
                className="shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
                {userEmail ? userEmail.split('@')[0] : 'Workspace User'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 m-0">{userEmail}</p>
            </div>

            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader()
                reader.onload = (e) => setAvatarUrl(e.target.result)
                reader.readAsDataURL(file)
                message.success('Avatar updated locally')
                return false // prevent uploading
              }}
            >
              <Button icon={<UploadOutlined />} size="small" className="mt-2 text-xs font-semibold text-slate-500">
                Upload Avatar
              </Button>
            </Upload>

            <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-6 pt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Account Role</span>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 block mt-1">USER</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Signature Pen</span>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 block mt-1">Cursive Scripts</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Tab Panels (Personal, Security, Active Sessions) */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 lg:col-span-2" bodyStyle={{ padding: '24px' }}>
          <Tabs
            defaultActiveKey="personal"
            items={[
              {
                key: 'personal',
                icon: <UserOutlined />,
                label: 'Personal Info',
                children: (
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleProfileUpdate}
                    initialValues={{ email: userEmail, role: 'USER' }}
                    className="mt-4"
                    size="large"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="firstName"
                        label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">First Name</span>}
                      >
                        <Input placeholder="e.g. John" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                      </Form.Item>
                      <Form.Item
                        name="lastName"
                        label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Last Name</span>}
                      >
                        <Input placeholder="e.g. Doe" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="email"
                      label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Email Address</span>}
                    >
                      <Input prefix={<MailOutlined className="text-slate-400" />} disabled className="dark:bg-slate-900" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600 border-none font-semibold mt-2">
                      Save Profile Changes
                    </Button>
                  </Form>
                ),
              },
              {
                key: 'security',
                icon: <SafetyCertificateOutlined />,
                label: 'Security & Password',
                children: (
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordUpdate}
                    className="mt-4"
                    size="large"
                  >
                    <Form.Item
                      name="oldPassword"
                      label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Current Password</span>}
                      rules={[{ required: true, message: 'Please enter current password!' }]}
                    >
                      <Input.Password prefix={<LockOutlined className="text-slate-400" />} placeholder="••••••••" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                    </Form.Item>

                    <Form.Item
                      name="newPassword"
                      label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">New Password</span>}
                      rules={[
                        { required: true, message: 'Please enter new password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined className="text-slate-400" />} placeholder="••••••••" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600 border-none font-semibold mt-2">
                      Update Security Password
                    </Button>
                  </Form>
                ),
              },
              {
                key: 'sessions',
                icon: <HistoryOutlined />,
                label: 'Active Sessions',
                children: (
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Below is a list of devices that have recently signed in or accessed your DocSign workspace. Revoke any unfamiliar devices.
                    </p>
                    <Table
                      columns={sessionColumns}
                      dataSource={sessionData}
                      pagination={false}
                      size="small"
                      className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden"
                    />
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  )
}

export default Profile
