import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Table, Tag, Button, Steps, Progress, Tooltip, Empty } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from '@ant-design/icons'

const SignRequests = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    const localDocs = JSON.parse(localStorage.getItem('docsign_documents') || '[]')
    setDocuments(localDocs)
    if (localDocs.length > 0) {
      setSelectedDoc(localDocs[0])
    }
  }, [])

  // Columns for documents checklist
  const requestColumns = [
    {
      title: 'Document Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">{text}</span>
        </div>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => {
        const percent = record.status === 'SIGNED' ? 100 : 50
        const status = record.status === 'SIGNED' ? 'success' : 'active'
        return <Progress percent={percent} status={status} size="small" className="w-24 m-0" />
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const isSigned = status === 'SIGNED'
        return (
          <Tag color={isSigned ? 'success' : 'warning'} className="rounded-md border-none font-bold">
            {isSigned ? 'COMPLETED' : 'PENDING'}
          </Tag>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => setSelectedDoc(record)}
          className="font-semibold"
        >
          View Timeline
        </Button>
      ),
    },
  ]

  // Timeline Steps generation
  const getTimelineSteps = (doc) => {
    if (!doc) return []

    const isSigned = doc.status === 'SIGNED'
    const docDate = doc.createdAt ? new Date(doc.createdAt).toLocaleString() : 'N/A'
    const signDate = doc.updatedAt && isSigned ? new Date(doc.updatedAt).toLocaleString() : 'Awaiting signature...'

    return [
      {
        title: 'Document Created',
        description: `Uploaded by ${doc.ownerEmail || 'owner'} at ${docDate}`,
        status: 'finish',
      },
      {
        title: 'Signer Assigned',
        description: `Pending approval from ${isSigned ? 'signer@company.com' : 'assigned signer'}`,
        status: 'finish',
      },
      {
        title: 'Cursive Signature Applied',
        description: isSigned ? `Completed at ${signDate}` : 'Awaiting coordination placement',
        status: isSigned ? 'finish' : 'process',
      },
      {
        title: 'Final Execution',
        description: isSigned ? 'PDF secured, sealed and downloadable' : 'Waiting on signature application',
        status: isSigned ? 'finish' : 'wait',
      },
    ]
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white title-font m-0">
          Signature Workflows
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
          Monitor and track signer progress and audit timelines for outstanding files.
        </p>
      </div>

      {documents.length === 0 ? (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 text-center py-16">
          <Empty description={<span className="text-sm text-slate-400">No active signing workflows found.</span>} />
          <Link to="/documents" className="mt-4 inline-block">
            <Button type="primary">Upload a document to start</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows list */}
          <Card
            title={<span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Active Signing Processes</span>}
            className="shadow-sm border-slate-200 dark:border-slate-800 lg:col-span-2"
            bodyStyle={{ padding: 0 }}
          >
            <Table
              dataSource={documents}
              columns={requestColumns}
              rowKey="id"
              pagination={{ pageSize: 8 }}
            />
          </Card>

          {/* Stepper Timeline Panel */}
          <Card
            title={
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-850 dark:text-slate-150 text-sm">Workflow Timeline</span>
                <span className="text-[10px] text-slate-400 truncate font-semibold block">
                  {selectedDoc?.title || 'No file selected'}
                </span>
              </div>
            }
            className="shadow-sm border-slate-200 dark:border-slate-800"
          >
            {selectedDoc ? (
              <div className="mt-2">
                <Steps
                  direction="vertical"
                  current={selectedDoc.status === 'SIGNED' ? 4 : 2}
                  items={getTimelineSteps(selectedDoc)}
                  size="small"
                />
                
                {selectedDoc.status !== 'SIGNED' && (
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => navigate('/sign', { state: { documentId: selectedDoc.id } })}
                      className="bg-blue-600 border-none font-semibold w-full"
                    >
                      Sign Document Now
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Select a document to inspect its step timeline.
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default SignRequests
