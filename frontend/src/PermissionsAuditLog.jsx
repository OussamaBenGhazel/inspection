import React, { useState, useEffect } from 'react';
import { ArrowRight, Key, Shield, User, History, RefreshCw } from 'lucide-react';
import { apiService } from './apiService';

export default function PermissionsAuditLog({ onNavigate }) {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsData, usersData, rolesData] = await Promise.all([
        apiService.getAuditLogs().catch(() => []),
        apiService.getSystemUsers().catch(() => []),
        apiService.getRolesSummary().catch(() => [])
      ]);
      setLogs(logsData || []);
      setUsers(usersData || []);
      setRoles(rolesData || []);
    } catch (err) {
      console.error('Error loading audit and permissions data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
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
            <h1 className="text-2xl font-extrabold text-slate-800">إدارة الصلاحيات وسجل التدقيق الحي</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">تتبع وحماية عمليات النظام ورصد الأنشطة في الوقت الفعلي (بيانات مسجلة وموثقة في السيرفر).</p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>تحديث السجل والمستخدمين</span>
        </button>
      </div>

      {/* USER ROLES PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
        {roles.map((role, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Shield size={18} />
              </span>
              <span className="text-[10px] text-blue-600 font-extrabold px-2 py-0.5 bg-blue-50 rounded-full">
                {role.count}
              </span>
            </div>
            <h3 className="text-xs font-extrabold text-slate-800">{role.title}</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">{role.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-bold leading-relaxed">
        {/* Active Users Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs text-slate-800 flex items-center gap-1.5 font-extrabold">
              <User size={15} />
              <span>جدول المستخدمين النشطين في قاعدة البيانات</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">{users.length} مستخدم مسجل</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                  <th className="pb-3">المستخدم</th>
                  <th className="pb-3">البريد الإلكتروني</th>
                  <th className="pb-3">الرتبة / الدور</th>
                  <th className="pb-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 text-xs">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-400 font-semibold">
                      لا يوجد مستخدمون مسجلون.
                    </td>
                  </tr>
                ) : (
                  users.map((usr, idx) => (
                    <tr key={usr.id || idx} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 font-extrabold text-slate-800">{usr.name}</td>
                      <td className="py-3 text-slate-500 font-medium text-[11px]">{usr.email}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-extrabold">
                          {usr.role === 'administrateur' ? 'مدير النظام' :
                           usr.role === 'inspecteur' ? 'متفقد تربوي' : 'أستاذ'}
                        </span>
                      </td>
                      <td className="py-3 font-extrabold">{usr.status || 'نشط 🟢'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM AUDIT LOG */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs text-slate-800 flex items-center gap-1.5 font-extrabold">
              <History size={15} />
              <span>سجل التدقيق والعمليات الحي</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">{logs.length} عملية</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400 font-bold flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-blue-500" size={14} />
              <span>جاري تحميل سجل التدقيق...</span>
            </div>
          ) : (
            <div className="relative border-r border-slate-100 pr-4 space-y-4 text-[11px] max-h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold">
                  لا توجد عمليات مسجلة في سجل التدقيق حالياً.
                </div>
              ) : (
                logs.map((item) => (
                  <div key={item.id} className="relative">
                    <span className="absolute -right-[20px] top-1 h-2 w-2 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-extrabold text-slate-800 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px]">
                          {item.actionName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">
                          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString('ar-TN') : 'الآن'}
                        </span>
                      </div>
                      <p className="text-slate-700 font-semibold mt-1 leading-relaxed">{item.message}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">المستخدم: {item.username}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
