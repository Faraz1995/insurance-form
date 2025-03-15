import React, { useState, useEffect, ChangeEvent } from 'react'
import axiosInstance from '../util/axiosInstance'
import TextInput from '../components/TextInput'
import SelectInput from '../components/SelectInput'
import Loading from '../components/Loading'

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
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({})
  const [sortField, setSortField] = useState<keyof Application>('Full Name')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false)

  useEffect(() => {
    axiosInstance({
      method: 'get',
      url: '/api/insurance/forms/submissions'
    })
      .then((res) => {
        const fetchedColumns = res.data.columns
        setColumns(fetchedColumns)

        const initialVisibleColumns: { [key: string]: boolean } = {}
        fetchedColumns.forEach((col: string) => {
          initialVisibleColumns[col] = true
        })
        setVisibleColumns(initialVisibleColumns)

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

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const toggleAllColumns = (checked: boolean) => {
    const updatedColumns: { [key: string]: boolean } = {}
    columns.forEach((col) => {
      updatedColumns[col] = checked
    })
    setVisibleColumns(updatedColumns)
  }

  const getVisibleColumns = () => {
    return columns.filter((col) => visibleColumns[col])
  }

  if (columns.length === 0) {
    return <Loading />
  }

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
  const activeColumns = getVisibleColumns()
  const columnCount = activeColumns.length || 1

  return (
    <div className='p-6 bg-gray-100 dark:bg-gray-900'>
      <h2 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100'>
        Submitted Applications
      </h2>

      <div className='mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-950'>
        <div className='flex gap-4 flex-col sm:flex-row mb-4'>
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

        <div className='flex justify-end'>
          <button
            onClick={() => setShowColumnSelector((prev) => !prev)}
            className='px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md flex items-center text-gray-800 dark:text-gray-200'
          >
            {showColumnSelector ? 'Hide Columns' : 'Show Columns'}
          </button>
        </div>

        {showColumnSelector && (
          <div className='mt-4 p-4 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700'>
            <div className='mb-2 flex justify-between items-center'>
              <h3 className='font-medium text-gray-800 dark:text-gray-200'>
                Toggle Columns
              </h3>
              <div className='flex space-x-4'>
                <button
                  onClick={() => toggleAllColumns(true)}
                  className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                >
                  Select All
                </button>
                <button
                  onClick={() => toggleAllColumns(false)}
                  className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
              {columns.map((column) => (
                <div key={column} className='flex items-center'>
                  <input
                    type='checkbox'
                    id={`column-${column}`}
                    checked={!!visibleColumns[column]}
                    onChange={() => handleColumnToggle(column)}
                    className='mr-2 h-4 w-4 text-blue-600 dark:text-blue-500'
                  />
                  <label
                    htmlFor={`column-${column}`}
                    className='text-sm text-gray-800 dark:text-gray-200'
                  >
                    {column}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md'>
        <div
          className='grid border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(120px, 1fr))`
          }}
        >
          {activeColumns.map((column) => (
            <div
              key={column}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
            >
              {column}
            </div>
          ))}
        </div>

        <div className='divide-y divide-gray-200 dark:divide-gray-700'>
          {paginatedApps.length > 0 ? (
            paginatedApps.map((app, index) => (
              <div
                key={app.id || index}
                className={
                  index % 2 === 0
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-700'
                }
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columnCount}, minmax(120px, 1fr))`
                }}
              >
                {activeColumns.map((column) => (
                  <div
                    key={`${app.id}-${column}`}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200'
                  >
                    {app[column as keyof Application]}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'>
              No applications found
            </div>
          )}
        </div>
      </div>

      {activeColumns.length === 0 && (
        <div className='mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-400'>
          Please select at least one column to display data
        </div>
      )}

      <div className='flex justify-between items-center mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md'>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 transition-colors hover:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800/50'
        >
          Previous
        </button>

        <div className='flex items-center'>
          <span className='text-sm text-gray-700 dark:text-gray-300'>
            Page <span className='font-medium'>{page}</span> of{' '}
            <span className='font-medium'>{totalPages || 1}</span>
          </span>
        </div>

        <button
          disabled={page * pageSize >= sortedApps.length}
          onClick={() => setPage(page + 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 transition-colors hover:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800/50'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ApplicationList
