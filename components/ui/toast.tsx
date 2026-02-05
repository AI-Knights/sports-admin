"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

export const ToastProvider = ToastPrimitive.Provider;

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
};

export function toast({ title, description, variant = "default" }: ToastOptions) {
  const event = new CustomEvent("show-toast", {
    detail: { title, description, variant },
  });
  window.dispatchEvent(event);
}

// Toast root
export function ToastContainer() {
  const [toasts, setToasts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const handler = (e: any) => {
      setToasts((prev) => [...prev, { id: Date.now(), ...e.detail }]);
    };
    window.addEventListener("show-toast", handler);
    return () => window.removeEventListener("show-toast", handler);
  }, []);

  return (
    <ToastPrimitive.Root>
      {toasts.map((t) => (
        <ToastPrimitive.Root key={t.id}>
          <ToastPrimitive.Title>{t.title}</ToastPrimitive.Title>
          <ToastPrimitive.Description>{t.description}</ToastPrimitive.Description>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Root>
  );
}
