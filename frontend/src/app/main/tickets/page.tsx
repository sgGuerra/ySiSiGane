'use client';

import { useEffect, useState, useCallback } from 'react';
import { TicketService } from '@/src/application/services/TicketService';
import type { Ticket } from '@/src/domain/entities';
import { TicketModal } from '@/src/presentation/components/TicketModal';

type FilterStatus = 'all' | 'Pendiente' | 'Ganado' | 'Perdido';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const query: any = { pageSize: 100 };
      if (filterStatus !== 'all') query.status = filterStatus;
      if (searchQuery) query.q = searchQuery;
      const response = await TicketService.getTickets(query);
      setTickets(response.data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, searchQuery]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      await TicketService.deleteTicket(ticketToDelete.id);
      loadTickets();
      setTicketToDelete(null);
    } catch (err) {
      console.error('Error deleting ticket:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ganado':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pendiente':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Perdido':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-white/10 text-on-surface border-white/20';
    }
  };

  const getGameTypeBadge = (type: string) => {
    switch (type) {
      case 'Lotería':
        return 'bg-tertiary-container/20 text-tertiary';
      case 'Sorteo':
        return 'bg-secondary-container/20 text-secondary';
      case 'Rifa':
        return 'bg-error-container/20 text-error';
      case 'Boleta':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-white/10 text-on-surface-variant';
    }
  };

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'TODOS', value: 'all' },
    { label: 'PENDIENTES', value: 'Pendiente' },
    { label: 'GANADOS', value: 'Ganado' },
    { label: 'PERDIDOS', value: 'Perdido' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-title-lg text-primary">Mis Boletas</h1>
          <p className="text-on-surface-variant font-body-sm text-[12px]">Historial de jugadas y tickets activos</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-label-caps flex items-center gap-2 glow-red hover:bg-red-700 active:scale-95 duration-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nueva Boleta
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Buscar boleta o sorteo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-full py-3 pl-12 pr-6 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-4 py-2 rounded-full font-label-caps text-[10px] whitespace-nowrap transition-colors ${
                filterStatus === f.value
                  ? 'bg-primary-container/20 border border-primary/30 text-primary'
                  : 'bg-white/5 border border-white/10 text-on-surface hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
        </div>
      ) : (
        /* Ticket Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="glass-panel p-6 rounded-xl transition-all duration-300 relative overflow-hidden group hover:glass-panel-hover">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-2 py-0.5 ${getGameTypeBadge(ticket.gameType)} rounded font-label-caps text-[10px] mb-2 inline-block`}>
                    {ticket.gameType}
                  </span>
                  <h3 className="font-title-lg text-on-surface">{ticket.title}</h3>
                </div>
                <span className={`px-3 py-1 ${getStatusBadge(ticket.status)} rounded-full font-label-caps text-[10px] border`}>
                  {ticket.status}
                </span>
              </div>

              {/* Number */}
              {ticket.gameNumber && (
                <div className="mb-6">
                  <p className="text-on-surface-variant font-label-caps text-[10px] mb-2">NÚMERO JUGADO</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-4 h-10 flex items-center justify-center rounded bg-white/5 border border-white/10 font-data-mono text-secondary">
                      {ticket.gameNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* Date & Value */}
              <div className="grid grid-cols-2 gap-4 mb-6 border-t border-white/5 pt-4">
                <div>
                  <p className="text-on-surface-variant font-label-caps text-[10px]">FECHA</p>
                  <p className="font-body-sm text-on-surface">
                    {new Date(ticket.gameDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-on-surface-variant font-label-caps text-[10px]">VALOR</p>
                  <p className={`font-data-mono ${ticket.status === 'Perdido' ? 'text-on-surface-variant' : 'text-secondary'} font-title-lg`}>
                    {ticket.amount ? `$${ticket.amount.toLocaleString()}` : '-'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                {ticket.place && (
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span className="font-body-sm text-[12px]">{ticket.place}</span>
                  </div>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => handleOpenEdit(ticket)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-on-surface hover:bg-white/10 active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => setTicketToDelete(ticket)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-error hover:bg-error/10 active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Add New Card */}
          <div
            onClick={handleOpenCreate}
            className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all duration-300 min-h-[280px]"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-[32px]">add_circle</span>
            </div>
            <p className="font-title-lg text-on-surface mb-2">Registrar Boleta</p>
            <p className="font-body-sm text-on-surface-variant px-8">Ingresa manualmente tu nuevo ticket de juego.</p>
          </div>
        </div>
      )}

      {/* No results */}
      {!isLoading && tickets.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">confirmation_number</span>
          <p className="font-title-lg text-on-surface mb-2">Sin boletas registradas</p>
          <p className="font-body-sm text-on-surface-variant">Crea tu primera boleta para comenzar el seguimiento.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-12 border-2 border-primary-container/20 animate-fade-in-up">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <h3 className="font-headline-mobile text-white">¿Confirmar Eliminación?</h3>
              <p className="font-body-lg text-on-surface-variant">
                Esta acción eliminará permanentemente el registro de la boleta <strong>{ticketToDelete.title}</strong>. No se puede deshacer.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={confirmDelete}
                  className="w-full bg-primary-container text-white font-title-lg py-4 rounded-xl hover:brightness-125 transition-all"
                >
                  Sí, Eliminar Registro
                </button>
                <button
                  onClick={() => setTicketToDelete(null)}
                  className="w-full bg-white/5 text-white font-title-lg py-4 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadTickets}
        ticket={editingTicket}
      />
    </div>
  );
}
