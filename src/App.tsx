import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ItemsPage } from './pages/ItemsPage';
import { AboutPage } from './pages/AboutPage';
import { Layout } from './components/layout';
import { toast, ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ItemsPage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
    
  );
}

export default App;