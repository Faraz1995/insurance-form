// src/components/ApplicationList.tsx
import React, { useState, useEffect, ChangeEvent } from 'react'
import axiosInstance from '../util/axiosInstance'

interface Application {
  [key: string]: any
}

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([
    'name',
    'age',
    'insuranceType',
    'city',
    'status'
  ])
  const [sortField, setSortField] = useState<string>('name')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const pageSize = 10 // Fixed page size for simplicity.

  // Fetch submitted applications from API.
  useEffect(() => {
    axiosInstance
      .get('/api/insurance/forms/submissions')
      .then((response) => setApplications(response.data))
      .catch((err) => console.error('Error fetching applications', err))
  }, [])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  // Filter applications based on search input.
  console.log('applications====', applications)
  const filteredApps = applications?.data
    ? applications.data.filter((app) =>
        Object.values(app).join(' ').toLowerCase().includes(search.toLowerCase())
      )
    : []

  console.log({ filteredApps })

  // Sort applications by the selected field.
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1
    if (a[sortField] > b[sortField]) return 1
    return 0
  })

  // Simple pagination logic.
  const paginatedApps = sortedApps.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div>
      <h2>Submitted Applications</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor='search'>Search: </label>
        <input
          id='search'
          type='text'
          value={search}
          onChange={handleSearchChange}
          placeholder='Search applications...'
        />
      </div>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => setSortField(col)}
                style={{ cursor: 'pointer' }}
              >
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedApps.map((app, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>{app[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button
          disabled={page * pageSize >= sortedApps.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ApplicationList
