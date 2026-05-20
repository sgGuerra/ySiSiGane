'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Ticket } from '@/src/domain/entities';
import { TicketService } from '@/src/application/services/TicketService';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  ticket?: Ticket | null;
}

const gameTypes = ['Lotería', 'Rifa', 'Sorteo', 'Boleta', 'Juego ocasional'];
const statuses = ['Pendiente', 'Ganado', 'Perdido'];

export function TicketModal({ isOpen, onClose, onSaved, ticket }: TicketModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    gameNumber: '',
    gameDate: '',
    amount: '',
    place: '',
    gameType: 'Lotería',
    status: 'Pendiente',
    notes: '',
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        gameNumber: ticket.gameNumber || '',
        gameDate: ticket.gameDate ? ticket.gameDate.split('T')[0] : '',
        amount: ticket.amount?.toString() || '',
        place: ticket.place || '',
        gameType: ticket.gameType || 'Lotería',
        status: ticket.status || 'Pendiente',
        notes: ticket.notes || '',
      });
    } else {
      setFormData({
        title: '', gameNumber: '', gameDate: '', amount: '',
        place: '', gameType: 'Lotería', status: 'Pendiente', notes: '',
      });
    }
    setError(null);
    setShowDeleteConfirm(false);
    setShowSaveConfirm(false);
  }, [ticket, isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ticket) {
      setShowSaveConfirm(true);
    } else {
      await executeSave();
    }
  };

  const executeSave = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const payload: Partial<Ticket> = {
        title: formData.title,
        gameType: formData.gameType as Ticket['gameType'],
        gameDate: formData.gameDate,
        status: formData.status as Ticket['status'],
        gameNumber: formData.gameNumber || undefined,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        place: formData.place || undefined,
        notes: formData.notes || undefined,
      };

      if (ticket) {
        await TicketService.updateTicket(ticket.id, payload);
      } else {
        await TicketService.createTicket(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la boleta.');
      setShowSaveConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!ticket) return;
    setIsLoading(true);
    try {
      await TicketService.deleteTicket(ticket.id);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  // Delete confirmation modal
  if (showDeleteConfirm) {
    return createPortal(
      <div 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowDeleteConfirm(false);
        }}
      >
        <div className="glass-panel w-full max-w-md rounded-2xl p-6 md:p-10 border-2 border-primary-container/20 animate-fade-in-up m-4">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
              <span className="material-symbols-outlined text-3xl md:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">¿Confirmar Eliminación?</h3>
            <p className="text-sm md:text-base text-on-surface-variant px-2">
              Esta acción eliminará permanentemente el registro de la boleta <strong>{ticket?.title}</strong>. No se puede deshacer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full sm:flex-1 bg-primary-container text-white text-sm md:text-base font-bold py-3 md:py-4 rounded-xl hover:brightness-125 transition-all disabled:opacity-70"
              >
                {isLoading ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full sm:flex-1 bg-white/5 text-white text-sm md:text-base font-bold py-3 md:py-4 rounded-xl hover:bg-white/10 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Save confirmation modal
  if (showSaveConfirm) {
    return createPortal(
      <div 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowSaveConfirm(false);
        }}
      >
        <div className="glass-panel w-full max-w-md rounded-2xl p-6 md:p-10 border-2 border-primary-container/20 animate-fade-in-up m-4">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
              <span className="material-symbols-outlined text-3xl md:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">¿Guardar Cambios?</h3>
            <p className="text-sm md:text-base text-on-surface-variant px-2">
              ¿Estás seguro de que deseas guardar las modificaciones realizadas en la boleta <strong>{ticket?.title}</strong>?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6">
              <button
                onClick={executeSave}
                disabled={isLoading}
                className="w-full sm:flex-1 bg-gradient-to-r from-[#dc2626] to-[#fbbf24] text-white text-sm md:text-base font-bold py-3 md:py-4 rounded-xl hover:brightness-125 transition-all disabled:opacity-70"
              >
                {isLoading ? 'Guardando...' : 'Sí, Guardar'}
              </button>
              <button
                onClick={() => setShowSaveConfirm(false)}
                disabled={isLoading}
                className="w-full sm:flex-1 bg-white/5 text-white text-sm md:text-base font-bold py-3 md:py-4 rounded-xl hover:bg-white/10 transition-all disabled:opacity-70"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-[900px] rounded-xl p-6 md:p-10 relative overflow-hidden animate-fade-in-up my-8 md:my-16 mx-auto">
        {/* Background Accent Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">{ticket ? 'Detalle de Boleta' : 'Nueva Boleta'}</h2>
            <p className="text-on-surface-variant text-xs md:text-sm mt-1">
              {ticket ? 'Gestione la información de su jugada.' : 'Registre su próxima apuesta en el sistema de rastreo de élite.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/50 text-error font-body-sm text-center relative z-10">
            <span className="material-symbols-outlined text-[14px] mr-1">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del sorteo */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nombre del sorteo</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange} required
              placeholder="Ej. Lotería de Medellín"
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all"
            />
          </div>

          {/* Número jugado */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Número jugado <span className="opacity-50 text-[10px] lowercase normal-case">(Opcional)</span>
            </label>
            <input
              type="text" name="gameNumber" value={formData.gameNumber} onChange={handleChange}
              placeholder="0000"
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-2.5 md:py-3 rounded-lg font-mono text-sm md:text-base transition-all"
            />
          </div>

          {/* Fecha del sorteo */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Fecha del sorteo</label>
            <div className="relative">
              <input
                type="date" name="gameDate" value={formData.gameDate} onChange={handleChange} required
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all appearance-none"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">calendar_today</span>
            </div>
          </div>

          {/* Valor apostado */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Valor apostado <span className="opacity-50 text-[10px] lowercase normal-case">(Opcional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-bold">$</span>
              <input
                type="number" name="amount" value={formData.amount} onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface pl-8 pr-4 py-2.5 md:py-3 rounded-lg font-mono text-sm md:text-base transition-all"
              />
            </div>
          </div>

          {/* Lugar de compra */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Lugar de compra</label>
            <input
              type="text" name="place" value={formData.place} onChange={handleChange}
              placeholder="Establecimiento o plataforma"
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all"
            />
          </div>

          {/* Tipo de juego */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tipo de juego</label>
            <div className="relative">
              <select
                name="gameType" value={formData.gameType} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all appearance-none"
              >
                {gameTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Estado</label>
            <div className="relative">
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all appearance-none"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block"></div>

          {/* Notas */}
          <div className="flex flex-col gap-1.5 md:gap-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Notas adicionales</label>
            <textarea
              name="notes" value={formData.notes} onChange={handleChange}
              placeholder="Detalles adicionales sobre la apuesta..."
              rows={3}
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-2 md:mt-4">
            {ticket && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full sm:w-auto px-6 border-2 border-primary-container text-primary text-sm md:text-base font-bold py-3 md:py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/10 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Eliminar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-lg border-2 border-secondary text-secondary text-sm md:text-base font-bold hover:bg-secondary/10 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-3.5 rounded-lg bg-gradient-to-r from-[#dc2626] to-[#fbbf24] text-white text-sm md:text-base font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  {ticket ? 'Guardar Cambios' : 'Guardar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
