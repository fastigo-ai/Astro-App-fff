'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleModalUser, setRoleModalUser] = useState<any | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin' | 'super_admin'>('admin');
  const [grantModalUser, setGrantModalUser] = useState<any | null>(null);
  const [grantMonths, setGrantMonths] = useState(6);

  const currentUser = api.getStoredUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;

    try {
      await api.assignRole(roleModalUser.phone, newRole);
      setRoleModalUser(null);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleGrantSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantModalUser) return;

    try {
      await api.grantUser({
        phone: grantModalUser.phone,
        programId: 'sampurna_vedic_garbhsanskar',
        durationMonths: grantMonths,
        tierName: 'Admin Grant (Full Access)',
      });
      setGrantModalUser(null);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to grant subscription');
    }
  };

  const handleRevoke = async (phone: string) => {
    if (!confirm(`Are you sure you want to revoke active subscription for ${phone}?`)) return;
    try {
      await api.revokeUser(phone);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke subscription');
    }
  };

  const filtered = users.filter((u) => {
    const s = searchTerm.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(s) ||
      (u.phone || '').includes(s) ||
      (u.city || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Users & Subscription Management"
        subtitle="View registered mothers, grant subscriptions, and manage 3-tier administrator roles."
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, phone or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filtered.length} of {users.length} registered accounts
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">User / Phone</th>
                <th className="px-6 py-3.5">Stage & Month</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Subscription</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Loading users list...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No users matching search query.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const role = user.role || 'user';
                  const hasActive = user.hasActiveSubscription;

                  return (
                    <tr key={user.phone} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div>{user.name || 'Astro Parent'}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{user.phone}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="capitalize font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {user.stage || 'pregnant'}
                        </span>
                        {user.confirmed_month && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Month {user.confirmed_month}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {user.city ? `${user.city}, ${user.state || 'India'}` : 'Not set'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            role === 'super_admin'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {hasActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3 mr-1" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600">
                            <XCircle className="w-3 h-3 mr-1" /> None / Trial
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {isSuperAdmin && (
                          <button
                            onClick={() => {
                              setRoleModalUser(user);
                              setNewRole(user.role || 'admin');
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                          >
                            Assign Role
                          </button>
                        )}

                        {!hasActive ? (
                          <button
                            onClick={() => setGrantModalUser(user)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          >
                            Grant Sub
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevoke(user.phone)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Role Assignment Modal */}
        {roleModalUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Assign Account Role</h3>
              <p className="text-xs text-slate-500">
                Change access privileges for account <span className="font-mono text-slate-700">{roleModalUser.phone}</span>.
              </p>

              <form onSubmit={handleAssignRole} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="user">User (Normal Mother / Customer)</option>
                    <option value="admin">Admin (LMS & Operations Staff)</option>
                    <option value="super_admin">Super Admin (Master Authority)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setRoleModalUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Confirm Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grant Subscription Modal */}
        {grantModalUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Grant Subscription Override</h3>
              <p className="text-xs text-slate-500">
                Grant full premium Garbh Sanskar access to <span className="font-mono text-slate-700">{grantModalUser.phone}</span>.
              </p>

              <form onSubmit={handleGrantSubscription} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={grantMonths}
                    onChange={(e) => setGrantMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setGrantModalUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Grant Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
