// src/App.tsx
import React from 'react'
import { Routes, Route, Link } from 'react-router'
import DynamicForm from './container/DynamicForm'
import ApplicationList from './container/ApplicationList'

const App: React.FC = () => {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem' }}>
          <li>
            <Link to='/'>Apply for Insurance</Link>
          </li>
          <li>
            <Link to='/applications'>View Applications</Link>
          </li>
        </ul>
      </nav>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path='/' element={<DynamicForm />} />
          <Route path='/applications' element={<ApplicationList />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
