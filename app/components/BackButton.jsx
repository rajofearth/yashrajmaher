'use client'

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { design } from "@/lib/design-system";

export default function BackButton({ text = "Back" }) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 px-4 py-2 mt-4 ml-4 text-[#7c6e58] hover:text-[#493e35] transition-colors"
    >
      <ChevronLeft className="h-full w-4" />
      {text}
    </button>
  );
} 