import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<ChakraProvider value={defaultSystem}>
				<App />
			</ChakraProvider>
		</BrowserRouter>
	</StrictMode>,
)
