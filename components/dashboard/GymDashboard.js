// Update your GymDashboard.js to integrate member management
import React, { useState, useEffect } from "react";
import {
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import MemberManagement from "../members/MemberManagement";

export default function GymDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard"); // dashboard, members, checkins, payments
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    todayCheckIns: 0,
    monthlyRevenue: 0,
    loading: true,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Import Firebase functions dynamically to avoid SSR issues
      const { getMembers } = await import("../../services/memberService");

      // Load members
      const { members } = await getMembers();

      // Calculate stats
      const totalMembers = members?.length || 0;
      const activeMembers = members?.filter((m) => m.isActive)?.length || 0;

      // Today's check-ins (placeholder - you'll implement this later)
      const todayCheckIns = 0;

      // This month's revenue (placeholder - you'll implement this later)
      const monthlyRevenue = 0;

      setStats({
        totalMembers,
        activeMembers,
        todayCheckIns,
        monthlyRevenue,
        loading: false,
      });

      // Recent activity (placeholder for now)
      setRecentActivity([]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  // If members section is selected, show member management
  if (activeSection === "members") {
    return <MemberManagement />;
  }

  const formatTime = (date) => {
    if (!date) return "Hace un momento";

    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Hace un momento";
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString();
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendText }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.loading ? <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : value}
                </div>
                {trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trend > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {trendText}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard del Gimnasio
          </h2>
          <p className="mt-1 text-sm text-gray-500">Resumen de actividad y estadísticas de tu gimnasio</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Activity className="h-4 w-4 mr-2" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Miembros" value={stats.totalMembers} icon={Users} color="text-blue-600" />
        <StatCard title="Miembros Activos" value={stats.activeMembers} icon={Activity} color="text-green-600" />
        <StatCard title="Check-ins Hoy" value={stats.todayCheckIns} icon={UserCheck} color="text-purple-600" />
        <StatCard
          title="Ingresos del Mes"
          value={`₡${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-yellow-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>

              {stats.loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
                      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, index) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {index !== recentActivity.length - 1 && (
                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900">{activity.message}</span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">{formatTime(activity.time)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividad reciente</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Cuando los miembros hagan check-in o pagos, aparecerán aquí.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Today's Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveSection("members")}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Miembros
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Check-in Manual
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Hoy</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Apertura</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">6:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Check-ins</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.todayCheckIns}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Fecha</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString("es-CR")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
