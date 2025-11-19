'use client';

export default function Footer() {
  return (
    <footer className="py-12 px-6 sm:px-8 bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mapier
            </span>
            <p className="text-sm mt-2">AI驱动的智能导航应用</p>
          </div>
          <div className="text-sm">
            <p>&copy; {new Date().getFullYear()} Mapier. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

