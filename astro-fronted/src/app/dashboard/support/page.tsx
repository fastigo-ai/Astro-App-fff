'use client';

import React, { useEffect, useState } from 'react';
import { LifeBuoy, Send, CheckCircle, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await api.listTickets();
      if (res.success && res.data) {
        setTickets(res.data);
        if (selectedTicket) {
          const updated = res.data.find((t: any) => t.id === selectedTicket.id);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await api.replyTicket(selectedTicket.id, replyMessage.trim());
      setReplyMessage('');
      loadTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.updateTicketStatus(id, 'resolved');
      loadTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to update ticket status');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Role-Based Customer Support & Live Tickets"
        subtitle="Manage inquiries from pregnant mothers, kit dispatch queries, and clinical questions."
      />

      <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket List Column */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[700px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-600">
            Support Inquiries ({tickets.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No support tickets found.</div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 cursor-pointer transition ${
                      isSelected ? 'bg-amber-50/70 border-l-4 border-saffron-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                        {t.subject || 'Support Ticket'}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'in_progress'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">{t.phone}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                      {t.messages?.[t.messages.length - 1]?.text || 'No message content'}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread Column */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[700px] overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedTicket.subject}</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    User: {selectedTicket.phone} • Category: {selectedTicket.category || 'General'}
                  </p>
                </div>

                {selectedTicket.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(selectedTicket.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {selectedTicket.messages?.map((msg: any, i: number) => {
                  const isAdmin = msg.senderRole === 'admin' || msg.senderRole === 'super_admin';
                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-saffron-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {isAdmin ? 'Admin Support' : selectedTicket.phone} •{' '}
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-white flex items-center space-x-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type an official admin response to mother..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-saffron-600 hover:bg-saffron-700 text-white flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
              <p className="text-sm font-semibold">Select a ticket from the left column to view message thread</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
