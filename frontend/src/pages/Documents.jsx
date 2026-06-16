import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Drawer,
  Form,
  Upload,
  Tabs,
  Card,
  Dropdown,
  message,
  Tooltip,
  Modal,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  MoreOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { uploadDocumentApi, uploadDocumentFromFileApi } from '../api/documentApi'

const { Option } = Select

const Documents = () => {
  const { userEmail, token } = useAuth()
  const navigate = useNavigate()
  
  // Table and filter states
  const [documents, setDocuments] = useState([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(false)

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [uploadMode, setUploadMode] = useState('file')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])

  // Load documents on mount
  useEffect(() => {
    const localDocs = JSON.parse(localStorage.getItem('docsign_documents') || '[]')
    setDocuments(localDocs)
  }, [])

  // Save documents list helper
  const saveDocuments = (newDocs) => {
    localStorage.setItem('docsign_documents', JSON.stringify(newDocs))
    setDocuments(newDocs)
  }

  // Handle document upload submit
  const handleUploadSubmit = async (values) => {
    setUploadLoading(true)
    try {
      let resultDoc
      const ownerEmail = values.ownerEmail || userEmail

      if (uploadMode === 'file') {
        const file = fileList[0]
        if (!file) {
          message.error('Please select a PDF file first')
          setUploadLoading(false)
          return
        }
        resultDoc = await uploadDocumentFromFileApi({
          file: file.originFileObj || file,
          title: values.title,
          ownerEmail,
        })
      } else {
        resultDoc = await uploadDocumentApi({
          title: values.title,
          fileUrl: values.fileUrl,
          ownerEmail,
        })
      }

      // Add audit history locally
      const docWithMeta = {
        ...resultDoc,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedDocs = [docWithMeta, ...documents]
      saveDocuments(updatedDocs)
      
      message.success(`Uploaded "${docWithMeta.title}" successfully!`)
      setDrawerOpen(false)
      form.resetFields()
      setFileList([])
    } catch (err) {
      message.error(err?.response?.data?.error || 'Upload failed. Please ensure file is valid.')
    } finally {
      setUploadLoading(false)
    }
  }

  // Action helpers
  const copyDocId = (id) => {
    navigator.clipboard.writeText(String(id))
    message.success(`Copied Document ID: ${id}`)
  }

  const deleteDocLocal = (id, title) => {
    Modal.confirm({
      title: 'Remove Document',
      content: `Are you sure you want to remove "${title}" from your dashboard view? (Note: This will only remove it from the frontend view)`,
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const updated = documents.filter((d) => d.id !== id)
        saveDocuments(updated)
        message.success('Document removed from list')
      },
    })
  }

  const downloadPdf = async (record) => {
    if (!record.fileUrl) {
      message.error('No file URL available for this document')
      return
    }

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
      const requestUrl = record.fileUrl.startsWith('http')
        ? record.fileUrl
        : baseUrl
          ? `${baseUrl}${record.fileUrl}`
          : record.fileUrl

      message.loading({ content: 'Downloading file...', key: 'dl' })

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = downloadUrl
      link.download = `${record.title.replace(/\s+/g, '-')}.pdf`
      link.click()
      URL.revokeObjectURL(downloadUrl)

      message.success({ content: 'Download completed', key: 'dl' })
    } catch {
      message.error({ content: 'Could not download signed PDF.', key: 'dl' })
    }
  }

  // Filtered documents list
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          String(doc.id).includes(searchText)
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Table columns definition
  const columns = [
    {
      title: 'Document Details',
      key: 'details',
      render: (_, record) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500 text-lg flex-shrink-0">
            <FilePdfOutlined />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 m-0 truncate max-w-[280px]">
              {record.title}
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">
              ID: {record.id}
            </span>
          </div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Owner',
      dataIndex: 'ownerEmail',
      key: 'ownerEmail',
      responsive: ['md'],
      render: (email) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {email}
        </span>
      ),
    },
    {
      title: 'Uploaded Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'DRAFT', value: 'DRAFT' },
        { text: 'SIGNED', value: 'SIGNED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const isSigned = status === 'SIGNED'
        return (
          <Tag color={isSigned ? 'success' : 'warning'} className="rounded-md px-2.5 py-0.5 font-bold border-none">
            {isSigned ? 'SIGNED' : 'DRAFT'}
          </Tag>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const actionMenu = {
          items: [
            {
              key: 'sign',
              icon: <EditOutlined />,
              label: 'Sign Document',
              onClick: () => navigate('/sign', { state: { documentId: record.id } }),
            },
            {
              key: 'download',
              icon: <DownloadOutlined />,
              label: 'Download PDF',
              onClick: () => downloadPdf(record),
            },
            {
              key: 'copy',
              icon: <CopyOutlined />,
              label: 'Copy ID',
              onClick: () => copyDocId(record.id),
            },
            { type: 'divider' },
            {
              key: 'delete',
              icon: <DeleteOutlined className="text-rose-500" />,
              label: <span className="text-rose-500">Remove</span>,
              onClick: () => deleteDocLocal(record.id, record.title),
            },
          ]
        }
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate('/sign', { state: { documentId: record.id } })}
              className="bg-blue-600 border-none"
            >
              Sign
            </Button>
            <Dropdown menu={actionMenu} trigger={['click']}>
              <Button type="text" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white title-font m-0">
            Documents Repository
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Search, filter, and upload documents for legal cursive approvals.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setDrawerOpen(true)
            form.setFieldsValue({ ownerEmail: userEmail })
          }}
          className="bg-blue-600 border-none shadow-md shadow-blue-500/20 h-10 px-5 font-semibold"
        >
          Upload Document
        </Button>
      </div>

      {/* Search and Filters Card */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800" bodyStyle={{ padding: '16px' }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search by title or document ID..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:max-w-md h-10 border-slate-200 dark:border-slate-800 dark:bg-slate-900"
            allowClear
          />

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 flex-shrink-0">
              <FilterOutlined /> Status Filter:
            </span>
            <Select
              defaultValue="ALL"
              onChange={(value) => setStatusFilter(value)}
              className="w-36 h-10"
              dropdownClassName="dark:bg-slate-950"
            >
              <Option value="ALL">All Documents</Option>
              <Option value="DRAFT">DRAFT</Option>
              <Option value="SIGNED">SIGNED</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main Datatable */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800" bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredDocs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            className: "px-6 py-4",
          }}
          className="documents-table"
        />
      </Card>

      {/* Document Upload Drawer */}
      <Drawer
        title={<span className="font-bold text-slate-800 dark:text-slate-100">Upload PDF Document</span>}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        <div className="tabs mb-6 border-b border-slate-200 dark:border-slate-800 flex">
          <button
            type="button"
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              uploadMode === 'file'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
            onClick={() => setUploadMode('file')}
          >
            Upload from PC
          </button>
          <button
            type="button"
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              uploadMode === 'url'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
            onClick={() => setUploadMode('url')}
          >
            Upload by URL
          </button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUploadSubmit}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="title"
            label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Document Title</span>}
            rules={[{ required: true, message: 'Please enter a document title' }]}
          >
            <Input placeholder="e.g. Sales Partnership NDA" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
          </Form.Item>

          {uploadMode === 'file' ? (
            <Form.Item
              name="file"
              label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">PDF File</span>}
              rules={[{ required: true, message: 'Please select a PDF file!' }]}
            >
              <Upload
                accept=".pdf"
                beforeUpload={(file) => {
                  setFileList([file])
                  return false; // prevent automatic upload
                }}
                fileList={fileList}
                onRemove={() => setFileList([])}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} className="w-full text-slate-500">Select PDF File</Button>
              </Upload>
            </Form.Item>
          ) : (
            <Form.Item
              name="fileUrl"
              label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Document File URL</span>}
              rules={[{ required: true, message: 'Please enter a PDF document URL' }]}
            >
              <Input placeholder="https://example.com/agreement.pdf" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
            </Form.Item>
          )}

          <Form.Item
            name="ownerEmail"
            label={<span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Owner Email</span>}
            rules={[
              { required: true, message: 'Please specify owner email' },
              { type: 'email', message: 'Must be a valid email!' }
            ]}
          >
            <Input placeholder="user@company.com" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={uploadLoading}
            className="w-full bg-blue-600 border-none font-semibold mt-4"
          >
            Submit Document
          </Button>
        </Form>
      </Drawer>
    </div>
  )
}

export default Documents
