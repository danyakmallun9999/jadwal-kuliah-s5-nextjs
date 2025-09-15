'use client';

import { Home, Calendar, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'schedule',
      label: 'Jadwal',
      icon: Calendar,
    },
    {
      id: 'stats',
      label: 'Statistik',
      icon: BarChart2,
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-100 dark:border-gray-700 p-2">
        <ul className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <li key={tab.id} className="flex-1">
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'w-full flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200',
                    isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
