'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminService } from '@/src/application/services/AdminService';
import type { Ticket } from '@/src/domain/entities';

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await AdminService.getAllTickets({
        page,
        pageSize,
        q: searchQuery || undefined,
        gameType: gameTypeFilter || undefined,
        status: statusFilter || undefined,
      });
      setTickets(response.data);
      setTotalCount(response.meta.total);
    } catch (err) {
      console.error('Error loading admin tickets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, gameTypeFilter, statusFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Ganado': return { dot: 'bg-secondary', text: 'text-secondary' };
      case 'Pendiente': return { dot: 'bg-on-surface-variant', text: 'text-on-surface-variant opacity-50' };
      case 'Perdido': return { dot: 'bg-primary-container', text: 'text-primary-container' };
      default: return { dot: 'bg-outline', text: 'text-outline' };
    }
  };

  const getGameTypeBadge = (type: string) => {
    switch (type) {
      case 'Lotería': return 'border-primary-fixed-dim/30 text-primary-fixed-dim';
      case 'Rifa': return 'border-tertiary/30 text-tertiary';
      case 'Sorteo': return 'border-secondary/30 text-secondary';
      case 'Boleta': return 'border-on-secondary/30 text-on-surface-variant';
      default: return 'border-outline/30 text-outline';
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Summary stats
  const totalRevenue = tickets.reduce((sum, t) => sum + (t.amount || 0), 0);
  const wonCount = tickets.filter(t => t.status === 'Ganado').length;
  const pendingCount = tickets.filter(t => t.status === 'Pendiente').length;
  const lostCount = tickets.filter(t => t.status === 'Perdido').length;

  const handleApplyFilters = () => {
    setPage(1);
    loadTickets();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-title-lg text-primary">Panel de Administración</h1>
      </div>

      {/* Filter Bar */}
      <section className="glass-panel p-6 rounded-xl mb-6 flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-label-caps text-on-surface-variant opacity-60 mb-2">Search Records</label>
          <input
            type="text"
            placeholder="ID, User or Hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 font-body-sm focus:ring-2 focus:ring-primary-container transition-all"
          />
        </div>
        <div className="w-48">
          <label className="block font-label-caps text-on-surface-variant opacity-60 mb-2">Tipo de juego</label>
          <select
            value={gameTypeFilter}
            onChange={(e) => setGameTypeFilter(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 font-body-sm focus:ring-2 focus:ring-primary-container transition-all appearance-none"
          >
            <option value="">Todos</option>
            <option value="Lotería">Lotería</option>
            <option value="Rifa">Rifa</option>
            <option value="Sorteo">Sorteo</option>
            <option value="Boleta">Boleta</option>
            <option value="Juego ocasional">Juego Ocasional</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block font-label-caps text-on-surface-variant opacity-60 mb-2">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 font-body-sm focus:ring-2 focus:ring-primary-container transition-all appearance-none"
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Ganado">Ganado</option>
            <option value="Perdido">Perdido</option>
          </select>
        </div>
        <button
          onClick={handleApplyFilters}
          className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-caps hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Apply Filters
        </button>
      </section>

      {/* Data Table */}
      <section className="glass-panel rounded-xl overflow-hidden mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 font-label-caps text-secondary opacity-80">Usuario</th>
                  <th className="px-6 py-4 font-label-caps text-secondary opacity-80">Sorteo</th>
                  <th className="px-6 py-4 font-label-caps text-secondary opacity-80 text-center">Número</th>
                  <th className="px-6 py-4 font-label-caps text-secondary opacity-80">Fecha</th>
                  <th className="px-6 py-4 font-label-caps text-secondary opacity-80">Tipo</th>
                  <th className="px-6 py-4 font-label-caps text-secondary opacity-80">Estado</th>
                  <th className="px-6 py-4 font-label-caps text-secondary opacity-80 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tickets.map((ticket) => {
                  const statusStyle = getStatusDot(ticket.status);
                  const userName = (ticket as any).user?.name || 'Usuario';
                  return (
                    <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[12px] text-primary">
                            {getUserInitials(userName)}
                          </div>
                          <div>
                            <div className="font-title-lg text-[14px]">{userName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body-sm">{ticket.title}</td>
                      <td className="px-6 py-4 text-center">
                        {ticket.gameNumber ? (
                          <span className="bg-white/10 px-3 py-1 rounded text-primary font-data-mono">{ticket.gameNumber}</span>
                        ) : (
                          <span className="text-outline">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-body-sm opacity-70">
                        {new Date(ticket.gameDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-label-caps border px-2 py-0.5 rounded ${getGameTypeBadge(ticket.gameType)}`}>
                          {ticket.gameType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${statusStyle.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></div>
                          <span className="font-label-caps text-[11px]">{ticket.status}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-right font-data-mono ${ticket.status === 'Ganado' ? 'text-secondary' : 'text-on-surface-variant opacity-70'}`}>
                        {ticket.amount ? `$${ticket.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                    </tr>
                  );
                })}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-body-lg">
                      No se encontraron registros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between bg-white/5 border-t border-white/10">
            <div className="font-body-sm text-on-surface-variant opacity-50">
              Showing <span className="text-on-surface">{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalCount)}</span> of <span className="text-on-surface">{totalCount}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-on-surface-variant disabled:opacity-20"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-bold text-[12px] ${
                      page === pageNum
                        ? 'bg-primary-container text-on-primary-container'
                        : 'hover:bg-white/10 transition-colors text-on-surface-variant'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-on-surface-variant disabled:opacity-20"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[60px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
          </div>
          <p className="font-label-caps text-on-surface-variant opacity-60 mb-1">Total recaudado</p>
          <h3 className="font-display-md text-secondary">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[60px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <p className="font-label-caps text-on-surface-variant opacity-60 mb-1">Total Boletas</p>
          <h3 className="font-display-md text-primary">{totalCount}</h3>
        </div>
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group border-primary-container/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[60px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <p className="font-label-caps text-on-surface-variant opacity-60 mb-1">Perdidos</p>
          <h3 className="font-display-md text-primary-container">{lostCount}</h3>
        </div>
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[60px]" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
          </div>
          <p className="font-label-caps text-on-surface-variant opacity-60 mb-1">Ganados</p>
          <h3 className="font-display-md text-secondary">{wonCount}</h3>
          <div className="mt-2 flex items-center gap-1 text-secondary font-body-sm">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>{pendingCount} pendientes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
