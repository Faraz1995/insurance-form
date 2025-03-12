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
    return <div>Loading...</div>
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
  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4'>Submitted Applications</h2>
      <div className='mb-6 bg-white p-6 rounded-lg shadow-md'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <TextInput
              id='search'
              label='search'
              value={search}
              onChange={handleSearchChange}
              placeholder='Search applications...'
            />
          </div>

          <div className='flex-1'>
            <SelectInput
              id='sort'
              label='Sort By'
              value={sortField}
              onChange={handleSortChange}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        {paginatedApps.map((app, index) => (
          <div key={index} className='p-4 bg-white rounded-lg shadow-md'>
            {columns.map((col) => (
              <div key={col} className='flex justify-between py-1'>
                <span className='font-semibold'>{col}</span>
                <span>{app[col as keyof Application]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center mt-4'>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50'
        >
          Prev
        </button>
        <span className='text-lg font-medium'>Page {page}</span>
        <button
          disabled={page * pageSize >= sortedApps.length}
          onClick={() => setPage(page + 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ApplicationList
