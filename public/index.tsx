import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Store from './pages/Store'
import './index.css'

function ScrollToTop() {
	const { pathname } = useLocation()
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])
	return null
}

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Checkout />} />
				<Route path="/confirmation" element={<OrderConfirmation />} />
				<Route path="/store" element={<Store />} />
			</Routes>
		</BrowserRouter>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)