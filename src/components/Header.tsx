'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Package, 
  Tag, 
  Warehouse, 
  ShoppingCart, 
  CreditCard, 
  BarChart2,
  Users,
  Settings,
  LogOut,
  Factory,
  Truck
} from 'lucide-react';

// Define available user roles
const userRoles = {
  ADMIN: 'admin',
  CASHIER: 'cashier',
  PRODUCTION: 'production',
  SUPPLIER: 'supplier'
} as const;

type UserRole = typeof userRoles[keyof typeof userRoles];

// Define navigation items per role
const navigationConfig = {
  [userRoles.ADMIN]: [
    { title: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { title: 'Product', path: '/product', icon: <Package className="w-5 h-5 mr-2" /> },
    { title: 'Sales', path: '/sales', icon: <Tag className="w-5 h-5 mr-2" /> },
    { title: 'Inventory', path: '/inventory', icon: <Warehouse className="w-5 h-5 mr-2" /> },
    { title: 'Purchases', path: '/purchases', icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
    { title: 'Payments', path: '/payments', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { title: 'Report', path: '/report', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { title: 'Users', path: '/users', icon: <Users className="w-5 h-5 mr-2" /> },
    { title: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  ],
  [userRoles.CASHIER]: [
    { title: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { title: 'Sales', path: '/sales', icon: <Tag className="w-5 h-5 mr-2" /> },
    { title: 'Payments', path: '/paymentactions', icon: <CreditCard className="w-5 h-5 mr-2" /> },
  ],
  [userRoles.PRODUCTION]: [
    { title: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { title: 'Production', path: '/task', icon: <Factory className="w-5 h-5 mr-2" /> },
    { title: 'Inventory', path: '/inventory', icon: <Warehouse className="w-5 h-5 mr-2" /> },
  ],
  [userRoles.SUPPLIER]: [
    { title: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { title: 'Orders', path: '/supplier/orders', icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
    { title: 'Deliveries', path: '/supplier/deliveries', icon: <Truck className="w-5 h-5 mr-2" /> },
  ],
};

const Header = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRoles.ADMIN);
  const [navItems, setNavItems] = useState(navigationConfig[userRoles.ADMIN]);

  // Update navigation items when role changes
  useEffect(() => {
    setNavItems(navigationConfig[selectedRole]);
    // Redirect to the appropriate dashboard when role changes
    // router.push(`/${selectedRole === 'admin' ? 'dashboard' : selectedRole + '/dashboard'}`);
    if (selectedRole == 'cashier') router.push('/dashboard');
    if (selectedRole == 'admin') router.push('/dashboard');
    // router.push(`/${selectedRole === 'admin' ? 'dashboard' : selectedRole + '/dashboard'}`);
  }, [selectedRole, router]);

  return (
    <div className="h-full flex flex-col">
      {/* Logo and Role Selector */}
      <div className="bg-[#7CCD65] p-4">
        <div className="text-black text-xl font-semibold flex items-center mb-4">
          <span className="text-[#7CCD65] text-2xl mr-1">C</span> Logo
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          className="w-full p-2 rounded-lg border border-green-400 bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value={userRoles.ADMIN}>Admin</option>
          <option value={userRoles.CASHIER}>Cashier</option>
          <option value={userRoles.PRODUCTION}>Production</option>
          <option value={userRoles.SUPPLIER}>Supplier</option>
        </select>
      </div>

      {/* Role Display */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="text-gray-600 font-medium capitalize">{selectedRole}</div>
      </div>
      
      {/* Dynamic Navigation */}
      <nav className="flex-1 bg-gray-50">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center px-4 py-3 text-gray-600 hover:bg-green-100 ${
              currentPath === item.path ? 'bg-[#7CCD65] text-white' : ''
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
    
      {/* Logout Section */}
      <div className="p-4 bg-gray-50 border-t">
        <Link 
          href=""
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;