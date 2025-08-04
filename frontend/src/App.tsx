import { Box } from '@chakra-ui/react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import CreatePage from './pages/CreatePage'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import MovieDetailsPage from './pages/MovieDetailsPage'

function App() {

	return (
		<>
			<Box minH={"100vh"}>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/:id' element={<MovieDetailsPage />} />
					<Route path='/create' element={<CreatePage />} />
				</Routes>
			</Box>
		</>
	)
}

export default App
