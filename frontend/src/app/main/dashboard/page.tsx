'use client';

import { useEffect, useState } from 'react';
import { TicketService } from '@/src/application/services/TicketService';
import type { Ticket } from '@/src/domain/entities';
import Link from 'next/link';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await TicketService.getTickets({ pageSize: 100 });
      setTickets(response.data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalGames = tickets.length;
  const pendingCount = tickets.filter(t => t.status === 'Pendiente').length;
  const wonCount = tickets.filter(t => t.status === 'Ganado').length;
  const lostCount = tickets.filter(t => t.status === 'Perdido').length;
  const pendingTickets = tickets.filter(t => t.status === 'Pendiente').slice(0, 2);
  const recentTickets = tickets.slice(0, 4);

  const statCards = [
    { label: 'Total Juegos', value: totalGames, icon: 'sports_esports', color: 'text-secondary', bgColor: 'bg-secondary/10', badge: `${totalGames > 0 ? '+' + Math.round(totalGames * 0.12) + '% vs mes' : ''}` },
    { label: 'Pendientes', value: pendingCount, icon: 'pending_actions', color: 'text-on-surface', bgColor: 'bg-on-surface/10', pulse: true },
    { label: 'Ganados', value: wonCount, icon: 'military_tech', color: 'text-primary', bgColor: 'bg-primary/10', badge: 'Premium Win' },
    { label: 'Perdidos', value: lostCount, icon: 'cancel', color: 'text-outline', bgColor: 'bg-outline/10' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ganado': return 'text-primary';
      case 'Pendiente': return 'text-secondary';
      default: return 'text-outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ganado': return 'trending_up';
      case 'Pendiente': return 'receipt_long';
      default: return 'trending_down';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display-md text-primary tracking-tighter">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card) => (
          <div key={card.label} className="glass-panel p-6 rounded-xl group transition-all duration-300 hover:glass-panel-hover">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
              </div>
              {card.badge && <span className={`text-[10px] ${card.color} font-bold uppercase tracking-widest`}>{card.badge}</span>}
              {card.pulse && <div className="w-2 h-2 rounded-full bg-on-surface animate-pulse"></div>}
            </div>
            <div className="font-label-caps text-outline mb-1">{card.label}</div>
            <div className={`font-display-lg ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Próximos Sorteos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-headline-lg text-on-surface">Próximos Sorteos</h2>
            <Link href="/main/tickets" className="text-secondary font-bold font-body-sm hover:underline">Ver todos</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingTickets.length > 0 ? pendingTickets.map((ticket) => (
              <div key={ticket.id} className="glass-panel rounded-xl overflow-hidden group">
                <div className="h-32 relative bg-gradient-to-br from-primary-container/20 to-secondary/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent"></div>
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-secondary text-on-secondary px-2 py-1 rounded text-[10px] font-bold uppercase">{ticket.gameType}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-outline text-[12px] uppercase font-bold">Fecha del Sorteo</div>
                      <div className="text-on-surface font-title-lg">{new Date(ticket.gameDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                    {ticket.amount && (
                      <div className="text-right">
                        <div className="text-outline text-[12px] uppercase font-bold">Valor</div>
                        <div className="text-secondary font-data-mono">${ticket.amount.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  <Link href="/main/tickets" className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all active:scale-[0.98] block text-center">
                    Ver boleta
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-2 glass-panel p-8 rounded-xl text-center">
                <span className="material-symbols-outlined text-4xl text-outline mb-4 block">event_busy</span>
                <p className="text-on-surface-variant font-body-lg">No hay sorteos pendientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="space-y-6">
          <h2 className="font-headline-lg text-on-surface mb-4">Actividad Reciente</h2>
          <div className="glass-panel rounded-xl p-2">
            <div className="space-y-1">
              {recentTickets.length > 0 ? recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${getStatusColor(ticket.status) === 'text-primary' ? 'bg-primary/20' : getStatusColor(ticket.status) === 'text-secondary' ? 'bg-secondary/20' : 'bg-outline/20'} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${getStatusColor(ticket.status)}`}>{getStatusIcon(ticket.status)}</span>
                    </div>
                    <div>
                      <div className="text-on-surface font-bold font-body-lg">{ticket.title}</div>
                      <div className="text-outline font-body-sm">{ticket.gameType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${getStatusColor(ticket.status)} font-data-mono font-bold`}>
                      {ticket.amount ? `$${ticket.amount.toLocaleString()}` : '-'}
                    </div>
                    <div className="text-[10px] text-outline font-bold uppercase tracking-widest">{ticket.status}</div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-on-surface-variant font-body-sm">Sin actividad reciente</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAB - Desktop */}
      <Link href="/main/tickets" className="hidden md:flex fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-[32px]">add</span>
        <span className="absolute right-full mr-4 px-3 py-1 rounded bg-surface text-on-surface font-body-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Nuevo Juego</span>
      </Link>
    </div>
  );
}
