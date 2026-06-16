import { useState, useEffect } from 'react'
import { Card, Table, Input, Button, Timeline, Tag, message } from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  HistoryOutlined,
  UserOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import { getAuditsApi } from '../api/documentApi'

const AuditLogs = () => {
  const [audits, setAudits] = useState([])
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load audit logs
  useEffect(() => {
    const loadAudits = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAuditsApi()
        if (Array.isArray(data) && data.length > 0) {
          setAudits(data)
        } else {
          // Fallback: Generate mock audit records based on localStorage documents
          const localDocs = JSON.parse(localStorage.getItem('docsign_documents') || '[]')
          const mockAudits = localDocs.flatMap((doc, index) => {
            const logs = [
              {
                id: `audit-up-${doc.id}`,
                actor: doc.ownerEmail || 'user@company.com',
                action: `UPLOADED DOCUMENT`,
                details: `Title: "${doc.title}" (ID: ${doc.id}), Url: ${doc.fileUrl}`,
                createdAt: doc.createdAt || new Date(Date.now() - 3600000 * (index + 1)).toISOString(),
              }
            ]
            if (doc.status === 'SIGNED') {
              logs.unshift({
                id: `audit-sig-${doc.id}`,
                actor: 'signer@company.com',
                action: `SIGNED DOCUMENT`,
                details: `Signed document "${doc.title}" (ID: ${doc.id}) under coordinates (x: 120, y: 180)`,
                createdAt: doc.updatedAt || new Date(Date.now() - 1800000 * (index + 1)).toISOString(),
              })
            }
            return logs
          })
          setAudits(mockAudits)
        }
      } catch {
        setError('Could not fetch audit logs.')
      } finally {
        setLoading(false)
      }
    }

    loadAudits()
  }, [])

  // Export logs to CSV file (UI Only)
  const exportToCSV = () => {
    if (audits.length === 0) {
      message.warning('No audit logs available to export')
      return
    }

    const headers = ['ID', 'Actor', 'Action', 'Details', 'Timestamp']
    const rows = audits.map((a) => [
      a.id,
      a.actor,
      a.action,
      a.details || 'N/A',
      new Date(a.createdAt).toLocaleString(),
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map(val => `"${val}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'docsign_audit_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    message.success('Audit report exported successfully!')
  }

  // Filter logs by search term
  const filteredAudits = audits.filter(
    (a) =>
      a.actor.toLowerCase().includes(searchText.toLowerCase()) ||
      a.action.toLowerCase().includes(searchText.toLowerCase()) ||
      (a.details && a.details.toLowerCase().includes(searchText.toLowerCase()))
  )

  // Table columns definition
  const columns = [
    {
      title: 'Actor',
      dataIndex: 'actor',
      key: 'actor',
      render: (text) => (
        <div className="flex items-center gap-2 py-0.5">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-semibold text-slate-500 text-[10px]">
            <UserOutlined />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{text}</span>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => {
        const isSign = action.includes('SIGN')
        return (
          <Tag color={isSign ? 'blue' : 'orange'} className="rounded-md border-none px-2 py-0.5 font-bold text-[10px]">
            {action}
          </Tag>
        )
      },
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      responsive: ['md'],
      render: (text) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {text || 'System operation executed.'}
        </span>
      ),
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {new Date(date).toLocaleString()}
        </span>
      ),
    },
  ]

  // Timeline representation list
  const timelineItems = filteredAudits.slice(0, 10).map((a) => ({
    color: a.action.includes('SIGN') ? 'green' : 'blue',
    children: (
      <div className="flex flex-col gap-0.5 text-xs">
        <span className="text-[10px] text-slate-400 font-semibold">{new Date(a.createdAt).toLocaleString()}</span>
        <p className="text-slate-700 dark:text-slate-300 m-0">
          <strong>{a.actor}</strong> {a.action.toLowerCase()}: {a.details || 'executed system events'}
        </p>
      </div>
    ),
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white title-font m-0">
            Enterprise Audit Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Chronological log of document operations, uploads, and signature execution events.
          </p>
        </div>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportToCSV}
          className="bg-blue-600 border-none shadow-md shadow-blue-500/20 h-10 px-5 font-semibold"
        >
          Export CSV Report
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Table representation (Takes 2 cols) */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800" bodyStyle={{ padding: '16px' }}>
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search actor, action, or details..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-10 border-slate-200 dark:border-slate-800"
              allowClear
            />
          </Card>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800" bodyStyle={{ padding: 0 }}>
            <Table
              columns={columns}
              dataSource={filteredAudits}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>

        {/* Timeline representation (Takes 1 col) */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <HistoryOutlined className="text-slate-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Chronological Flow</span>
            </div>
          }
          className="shadow-sm border-slate-200 dark:border-slate-800"
        >
          {timelineItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No events matched.</div>
          ) : (
            <div className="mt-2 pr-2 max-h-[460px] overflow-y-auto pt-2">
              <Timeline items={timelineItems} />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AuditLogs
