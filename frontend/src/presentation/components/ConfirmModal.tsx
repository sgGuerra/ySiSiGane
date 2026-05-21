'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ConfirmModalVariant = 'danger' | 'warning';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  icon: string;
  variant?: ConfirmModalVariant;
}

export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  icon,
  variant = 'warning',
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const confirmButtonClass =
    variant === 'danger'
      ? 'w-full sm:flex-1 bg-primary-container text-white text-sm md:text-base font-bold py-3 md:py-4 rounded-xl hover:brightness-125 transition-all'
      : 'w-full sm:flex-1 bg-gradient-to-r from-[#dc2626] to-[#fbbf24] text-white text-sm md:text-base font-bold py-3 md:py-4 rounded-xl hover:brightness-125 transition-all';

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 md:p-10 border-2 border-primary-container/20 animate-fade-in-up m-4">
        <div className="text-center space-y-3 md:space-y-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
            <span className="material-symbols-outlined text-3xl md:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
          <p className="text-sm md:text-base text-on-surface-variant px-2">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6">
            <button onClick={onConfirm} className={confirmButtonClass}>
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="w-full sm:flex-1 bg-white/5 text-white text-sm md:text-base font-bold py-3 md:py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
