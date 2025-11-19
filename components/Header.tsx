'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mapier
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              功能
            </Link>
            <Link href="#team" className="text-gray-600 hover:text-gray-900 transition-colors">
              团队
            </Link>
            <Link href="#waitlist" className="text-gray-600 hover:text-gray-900 transition-colors">
              加入等待列表
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

