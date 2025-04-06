import { Bell, User } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="h-16 bg-[#7CCD65] flex items-center justify-between px-4">
      <div className="w-1/2">
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;