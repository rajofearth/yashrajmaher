'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { design } from '@/lib/design-system';

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
      className="flex items-center gap-1 text-[#7c6e58] hover:text-[#493e35] transition-colors mb-2"
      style={{ fontFamily: design.fonts.serif }}
    >
      <ChevronLeft className="h-full w-4" />
      Back
    </a>
  );
}