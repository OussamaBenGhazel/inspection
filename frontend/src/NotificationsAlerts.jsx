import React, { useState, useEffect } from 'react';
import { ArrowRight, Bell, AlertTriangle, CheckCircle, Calendar, Sparkles, RefreshCw, CheckSquare } from 'lucide-react';
import { apiService } from './apiService';

export default function NotificationsAlerts({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications from API:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
      // In case of ID not existing in DB (e.g. fallback demo items), modify local state:
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readStatus: true } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
      // In case of fallback items:
      setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">مركز التنبيهات والإشعارات الفورية</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">تنبيهات ورسائل تذكير فورية بخصوص مجريات العمليات البيداغوجية، زيارات المتابعة، والالتزامات الزمنية.</p>
          </div>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition"
        >
          <CheckSquare size={14} />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100">
          <RefreshCw className="animate-spin text-blue-600 mr-2" />
          <span className="text-xs font-bold text-slate-500">جاري تحميل التنبيهات الفورية...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white p-5 rounded-2xl border flex flex-col sm:flex-row items-start justify-between gap-4 transition hover:shadow-sm ${
                notif.readStatus ? 'opacity-60' : ''
              } ${
                notif.urgency === 'critical' ? 'border-red-100 bg-red-50/10' :
                notif.urgency === 'high' ? 'border-yellow-100 bg-yellow-50/10' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  notif.urgency === 'critical' ? 'bg-red-50 text-red-600' :
                  notif.urgency === 'high' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {notif.urgency === 'critical' && <AlertTriangle size={18} />}
                  {notif.urgency === 'high' && <Calendar size={18} />}
                  {(notif.urgency === 'normal' || !notif.urgency) && <Bell size={18} />}
                </span>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{notif.category}</span>
                    {!notif.readStatus && <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />}
                  </div>
                  <h3 className="font-extrabold text-slate-800 leading-relaxed">{notif.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{notif.message}</p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded ${
                  notif.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                  notif.urgency === 'high' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {notif.urgency === 'critical' ? 'عاجل وحرج 🚨' :
                   notif.urgency === 'high' ? 'أولوية مرتفعة ⚠️' : 'عادي ℹ️'}
                </span>
                {!notif.readStatus && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="p-1 bg-slate-50 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
                    title="تحديد كمقروء"
                  >
                    <CheckSquare size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}