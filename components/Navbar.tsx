'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: '홈', href: '/' },
  { name: '소개', href: '/about' },
  { name: '메뉴', href: '/menu' },
  { name: '원데이 클래스', href: '/classes' },
  { name: '예약', href: '/reservation' },
  { name: '오시는 길', href: '/location' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) return; // lg 이상은 무시
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 40) {
        setShowNavbar(false); // 아래로 스크롤 시 숨김
      } else {
        setShowNavbar(true); // 위로 스크롤 시 보임
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-white shadow-sm transition-transform duration-300 lg:static lg:translate-y-0 fixed top-0 w-full z-50 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} `}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-3 sm:p-4 lg:p-6 lg:px-8 transition-all duration-300"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600 whitespace-nowrap">알록달록 테이블</span>
          </Link>
        </div>
        {/* 모바일: 메뉴를 한 줄로 가로 배치 */}
        <div className="flex-1 flex justify-center items-center gap-2 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-pink-600 px-2 py-1 whitespace-nowrap"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {/* 햄버거 메뉴 아이콘 (모바일) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">메뉴 열기</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {/* 데스크탑: 기존 메뉴 */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-pink-600"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      {/* Mobile menu (슬라이드 오버) */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-lg sm:text-xl font-bold text-pink-600 whitespace-nowrap">알록달록 테이블</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">메뉴 닫기</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 flow-root">
            <div className="-my-4 divide-y divide-gray-500/10">
              <div className="space-y-1 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-2 block rounded-lg px-2 py-2 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 