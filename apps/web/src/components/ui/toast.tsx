"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, type = 'info' }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "p-4 pl-5 rounded-3xl brut flex justify-between items-start gap-3 text-text-primary animate-in fade-in slide-in-from-bottom-2 duration-300",
              t.type === 'success' && "bg-fill-mint",
              t.type === 'error' && "bg-fill-rose",
              (t.type === 'info' || !t.type) && "bg-surface"
            )}
          >
            <div>
              <h4 className="font-bold text-[15px] leading-snug">{t.title}</h4>
              {t.description && <p className="text-sm text-text-primary/80 mt-0.5 leading-snug">{t.description}</p>}
            </div>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-text-secondary hover:text-text-primary" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
