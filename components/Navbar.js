import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <a className="text-xl font-bold">EduHub Study Materials</a>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/">
              <a className="hover:text-indigo-200 transition-colors">Home</a>
            </Link>
            <Link href="/policies/contact">
              <a className="hover:text-indigo-200 transition-colors">Contact</a>
            </Link>
            <Link href="/policies/terms">
              <a className="hover:text-indigo-200 transition-colors">Terms</a>
            </Link>
            <Link href="/policies/refund">
              <a className="hover:text-indigo-200 transition-colors">Refund Policy</a>
            </Link>
          </div>

          <button className="md:hidden focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
