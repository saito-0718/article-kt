import ArticleList from './components/ArticleList'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>掲示板</h1>
      </header>
      <main className="app-main">
        <ArticleList />
      </main>
    </div>
  )
}
