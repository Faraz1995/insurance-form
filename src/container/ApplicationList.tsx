import React, { useState, useEffect, ChangeEvent } from 'react'
import axiosInstance from '../util/axiosInstance'
import TextInput from '../components/TextInput'
import SelectInput from '../components/SelectInput'

type Application = {
  id: string
  'Full Name': string
  Age: number
  Gender: string
  'Insurance Type': string
  City: string
}
const pageSize = 10

const sortOptions = [
  { value: 'Full Name', label: 'Full Name' },
  { value: 'Insurance Type', label: 'Insurance Type' }
]

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Application>('Full Name')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    axiosInstance({
      method: 'get',
      url: '/api/insurance/forms/submissions'
    })
      .then((res) => {
        setColumns(res.data.columns)
        setApplications(res.data.data)
      })
      .catch((err) => console.error('Error fetching applications', err))
  }, [])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as keyof Application)
  }

  if (columns.length === 0) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  // Filter applications based on search input.
  const filteredApps =
    applications.length > 0
      ? applications.filter((app) => {
          return app['Full Name'].toLowerCase().includes(search.toLowerCase())
        })
      : []

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1
    if (a[sortField] > b[sortField]) return 1
    return 0
  })

  const paginatedApps = sortedApps.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(sortedApps.length / pageSize)

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4'>Submitted Applications</h2>

      <div className='mb-6 bg-white p-6 rounded-lg shadow-md'>
        <div className='flex gap-4 flex-col sm:flex-row'>
          <div className='flex-1'>
            <TextInput
              id='search'
              name='search'
              label='Search'
              value={search}
              onChange={handleSearchChange}
              placeholder='Search applications...'
            />
          </div>

          <div className='flex-1'>
            <SelectInput
              id='sort'
              name='sort'
              label='Sort By'
              value={sortField}
              onChange={handleSortChange}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className='overflow-x-auto bg-white rounded-lg shadow-md'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-b border-gray-200 bg-gray-50'>
          {columns.map((column) => (
            <div
              key={column}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              {column}
            </div>
          ))}
        </div>

        <div className='divide-y divide-gray-200'>
          {paginatedApps.length > 0 ? (
            paginatedApps.map((app, index) => (
              <div
                key={app.id || index}
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {columns.map((column) => (
                  <div
                    key={`${app.id}-${column}`}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                  >
                    {app[column as keyof Application]}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className='px-6 py-4 text-center text-sm text-gray-500'>
              No applications found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className='flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-md'>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 transition-colors hover:bg-blue-600'
        >
          Previous
        </button>

        <div className='flex items-center'>
          <span className='text-sm text-gray-700'>
            Page <span className='font-medium'>{page}</span> of{' '}
            <span className='font-medium'>{totalPages || 1}</span>
          </span>
        </div>

        <button
          disabled={page * pageSize >= sortedApps.length}
          onClick={() => setPage(page + 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 transition-colors hover:bg-blue-600'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ApplicationList
