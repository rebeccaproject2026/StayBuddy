"use client";

import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AdminProperty, AdminUser, AdminStats } from "./types";

interface AdminAnalyticsChartsProps {
  isDark: boolean;
  currentCountry: string;
  requests: AdminProperty[];
  allUsers: AdminUser[];
  allReports: any[];
  stats: AdminStats;
}

export default function AdminAnalyticsCharts({
  isDark,
  currentCountry,
  requests,
  allUsers,
  allReports,
  stats,
}: AdminAnalyticsChartsProps) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    };
  });

  const monthlyData = months.map(({ label, year, month }) => {
    const propCount = requests.filter(p => {
      const d = new Date(p.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
    const userCount = allUsers.filter(u => {
      const d = new Date(u.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
    const reportCount = allReports.filter(r => {
      const d = new Date(r.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
    return { month: label, Properties: propCount, Users: userCount, Reports: reportCount };
  });

  const approvalData = [
    { name: "Approved", value: requests.filter(r => r.approvalStatus === "approved").length, color: "#22c55e" },
    { name: "Pending", value: requests.filter(r => r.approvalStatus === "pending").length, color: "#eab308" },
    { name: "Rejected", value: requests.filter(r => r.approvalStatus === "rejected").length, color: "#ef4444" },
  ];

  const reportStatusData = [
    { name: "Pending", value: allReports.filter(r => r.status === "pending").length, color: "#eab308" },
    { name: "Reviewed", value: allReports.filter(r => r.status === "reviewed").length, color: "#22c55e" },
    { name: "Dismissed", value: allReports.filter(r => r.status === "dismissed").length, color: "#6b7280" },
  ];

  const tooltipStyle = {
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
    borderRadius: "12px",
    color: isDark ? "#f9fafb" : "#111827",
  };

  const axisColor = isDark ? "#6b7280" : "#9ca3af";
  const gridColor = isDark ? "#1f2937" : "#f3f4f6";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={tooltipStyle} className="px-4 py-3 shadow-xl text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={tooltipStyle} className="px-4 py-3 shadow-xl text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: payload[0].payload.color }} />
          <span className="font-semibold">{payload[0].name}:</span>
          <span className="font-bold">{payload[0].value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Analytics</h2>
        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
          {currentCountry === "in" ? "🇮🇳 India" : "🇫🇷 France"} · Last 6 months
        </div>
      </div>

      {/* Monthly trend — Area chart */}
      <div className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
        <h3 className={`text-base font-semibold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>Monthly Activity Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradProps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradReports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Area type="monotone" dataKey="Properties" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradProps)" dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="Users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradUsers)" dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="Reports" stroke="#ef4444" strokeWidth={2.5} fill="url(#gradReports)" dot={{ r: 4, fill: "#ef4444" }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Approval status */}
        <div className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <h3 className={`text-base font-semibold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>Approval Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={approvalData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={800}>
                {approvalData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Report status */}
        <div className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
          <h3 className={`text-base font-semibold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>Report Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={reportStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={800}>
                {reportStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
