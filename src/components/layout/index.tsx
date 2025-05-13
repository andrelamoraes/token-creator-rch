import { Outlet } from 'react-router-dom';
import { Menu } from './Menu';

export const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Menu />
    <main className="flex-grow container mx-auto px-4 py-6">
      <Outlet />
    </main>
    <footer className="bg-gray-100 py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-gray-600">
        © 2023 Create Token App. All rights reserved.
      </div>
    </footer>
  </div>
);