import { BrowserRouter as Router } from "react-router-dom"
import { QueryProvider } from "./app/providers/QueryProvider"
import Header from "./pages/layout/Header.tsx"
import Footer from "./pages/layout/Footer.tsx"
import PostsManagerPage from "./pages/PostsManagerPage"

const App = () => {
  return (
    <QueryProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </Router>
    </QueryProvider>
  )
}

export default App
