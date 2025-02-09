'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  const handleGoBack = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <a
      href="#"
      onClick={handleGoBack}
      className="absolute left-0 top-10 flex items-center gap-2 text-lg font-semibold text-gray-600 hover:text-gray-800 transition-transform duration-300 ml-6 mt-2 md:ml-4 md:top-4 cursor-pointer"
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </a>
  );
}