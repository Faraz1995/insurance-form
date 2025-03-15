import React from 'react'
import { Routes, Route, Link } from 'react-router'
import DynamicForm from './container/DynamicForm'
import ApplicationList from './container/ApplicationList'
import ThemeToggle from './components/ThemeToggle'

const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-200'>
      <nav className='px-4 py-3 bg-gray-100 dark:bg-gray-800 shadow'>
        <div className='container mx-auto flex justify-between items-center'>
          <ul className='flex space-x-6'>
            <li>
              <Link
                to='/'
                className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
              >
                Apply for Insurance
              </Link>
            </li>
            <li>
              <Link
                to='/applications'
                className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
              >
                View Applications
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>
      <div className='container mx-auto p-4'>
        <Routes>
          <Route path='/' element={<DynamicForm />} />
          <Route path='/applications' element={<ApplicationList />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
