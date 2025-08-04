import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import CreatePage from './pages/CreatePage'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import MovieDetailsPage from './pages/MovieDetailsPage'

function App() {
	const [searchTerm, setSearchTerm] = useState('')

	const handleSearch = (term) => {
		setSearchTerm(term)
	}

	return (
		<div className="app-container">
			<Navbar onSearch={handleSearch} searchTerm={searchTerm} />
			<Routes>
				<Route path='/' element={<HomePage searchTerm={searchTerm} />} />
				<Route path='/:id' element={<MovieDetailsPage />} />
				<Route path='/create' element={<CreatePage />} />
			</Routes>
		</div>
	)
}

export default App