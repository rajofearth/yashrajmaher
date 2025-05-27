'use client'

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ text = "Back" }) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 px-4 py-2 mt-4 ml-4 text-foreground hover:text-primary transition-colors"
    >
      <ChevronLeft className="h-full w-4" />
      {text}
    </button>
  );
} 