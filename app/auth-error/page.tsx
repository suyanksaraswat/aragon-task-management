"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Redirect back to login with error message
    const errorMessage = error === "CredentialsSignin" 
      ? "Invalid email or password" 
      : "Authentication failed";
    
    toast.error(errorMessage);
    router.replace("/login");
  }, [error, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
}

