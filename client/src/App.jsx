import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Projects from './pages/Projects'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminOnlyPrivateRoute from './components/AdminOnlyPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import ViewPost from './pages/ViewPost'


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminOnlyPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/post/:postSlug" element={<ViewPost />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
