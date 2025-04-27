import { Routes, Route } from 'react-router-dom'
import './styles/App.css'

// Import pages when they are created
// import Home from './pages/Home'
// import About from './pages/About'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Social Good Platform</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/about" element={<div>About Page</div>} />
        </Routes>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Social Good Platform</p>
      </footer>
    </div>
  )
}

export default App 