import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import './index.css'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Checkout />} />
				<Route path="/confirmation" element={<OrderConfirmation />} />
			</Routes>
		</BrowserRouter>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)