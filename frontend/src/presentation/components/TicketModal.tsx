'use client';

import { useState, useEffect } from 'react';
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
  }, [ticket, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (!isOpen) return null;

  // Delete confirmation modal
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="glass-panel w-full max-w-md rounded-2xl p-12 border-2 border-primary-container/20 animate-fade-in-up">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className="font-headline-mobile text-white">¿Confirmar Eliminación?</h3>
            <p className="font-body-lg text-on-surface-variant">
              Esta acción eliminará permanentemente el registro de la boleta <strong>{ticket?.title}</strong>. No se puede deshacer.
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full bg-primary-container text-white font-title-lg py-4 rounded-xl hover:brightness-125 transition-all disabled:opacity-70"
              >
                {isLoading ? 'Eliminando...' : 'Sí, Eliminar Registro'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full bg-white/5 text-white font-title-lg py-4 rounded-xl hover:bg-white/10 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-[900px] rounded-xl p-8 md:p-12 relative overflow-hidden animate-fade-in-up my-8">
        {/* Background Accent Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="font-display-md text-on-surface tracking-tighter">{ticket ? 'Detalle de Boleta' : 'Nueva Boleta'}</h2>
            <p className="text-on-surface-variant font-body-sm mt-2">
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
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-on-surface-variant">Nombre del sorteo</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange} required
              placeholder="Ej. Lotería de Medellín"
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-3 rounded-lg font-body-lg transition-all"
            />
          </div>

          {/* Número jugado */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-on-surface-variant">
              Número jugado <span className="opacity-50 text-[10px]">(Opcional)</span>
            </label>
            <input
              type="text" name="gameNumber" value={formData.gameNumber} onChange={handleChange}
              placeholder="0000"
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-3 rounded-lg font-data-mono transition-all"
            />
          </div>

          {/* Fecha del sorteo */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-on-surface-variant">Fecha del sorteo</label>
            <div className="relative">
              <input
                type="date" name="gameDate" value={formData.gameDate} onChange={handleChange} required
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-3 rounded-lg font-body-lg transition-all appearance-none"
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant pointer-events-none">calendar_today</span>
            </div>
          </div>

          {/* Valor apostado */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-on-surface-variant">
              Valor apostado <span className="opacity-50 text-[10px]">(Opcional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-secondary font-bold">$</span>
              <input
                type="number" name="amount" value={formData.amount} onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface pl-8 pr-4 py-3 rounded-lg font-data-mono transition-all"
              />
            </div>
          </div>

          {/* Lugar de compra */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-on-surface-variant">Lugar de compra</label>
            <input
              type="text" name="place" value={formData.place} onChange={handleChange}
              placeholder="Establecimiento o plataforma"
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-3 rounded-lg font-body-lg transition-all"
            />
          </div>

          {/* Tipo de juego */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-on-surface-variant">Tipo de juego</label>
            <div className="relative">
              <select
                name="gameType" value={formData.gameType} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-3 rounded-lg font-body-lg transition-all appearance-none"
              >
                {gameTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-on-surface-variant">Estado</label>
            <div className="relative">
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-3 rounded-lg font-body-lg transition-all appearance-none"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block"></div>

          {/* Notas */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-label-caps text-on-surface-variant">Notas adicionales</label>
            <textarea
              name="notes" value={formData.notes} onChange={handleChange}
              placeholder="Detalles adicionales sobre la apuesta..."
              rows={4}
              className="bg-surface-container-lowest border border-white/5 text-on-surface px-4 py-3 rounded-lg font-body-lg transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6">
            {ticket && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 border-2 border-primary-container text-primary font-label-caps py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/10 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">delete</span>
                Eliminar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-lg border-2 border-secondary text-secondary font-label-caps hover:bg-secondary/10 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3 rounded-lg bg-gradient-to-r from-[#dc2626] to-[#fbbf24] text-white font-label-caps shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  {ticket ? 'Guardar Cambios' : 'Guardar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
