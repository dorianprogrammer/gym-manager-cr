"use client";

import React, { useState, useEffect, useContext } from "react";
import { Users, Activity, DollarSign, Calendar, Clock, UserCheck, AlertCircle } from "lucide-react";
import { formatTime } from "./GymDashboard.helper";
import StatCard from "../ui/StatCard";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import { getMembers } from "@/services/memberService";
import { getTotalStats } from "@/services/statsService";
import { AuthContext } from "@/contexts/AuthContext";

export default function GymDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    todayCheckIns: 0,
    monthlyRevenue: 0,
    loading: true,
  });
  const router = useRouter();
  const [recentActivity, setRecentActivity] = useState([]);
  const notification = useNotification();
  const { user } = useContext(AuthContext);
  const [totalStats, setTotalStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const result = await getTotalStats("", user);

      if (result?.success) {
        console.log("result :>> ", result);
      }

      // alert("Cargando datos del dashboard...");

      // const { getMewmbers } = await import("../../services/memberService");
      // const { members } = await getMembers();

      // const totalMembers = members?.length || 0;
      // const activeMembers = members?.filter((m) => m.isActive)?.length || 0;
      // const todayCheckIns = 0;

      // const monthlyRevenue = 0;

      // setStats({
      //   totalMembers,
      //   activeMembers,
      //   todayCheckIns,
      //   monthlyRevenue,
      //   loading: false,
      // });

      // setRecentActivity([]);
    } catch (error) {
      notification.error(`Error cargando miembros: ${result.error}`);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard stats={stats} title="Total Miembros" value={stats.totalMembers} icon={Users} color="text-blue-600" />
        <StatCard
          stats={stats}
          title="Miembros Activos"
          value={stats.activeMembers}
          icon={Activity}
          color="text-green-600"
        />
        <StatCard
          stats={stats}
          title="Check-ins Hoy"
          value={stats.todayCheckIns}
          icon={UserCheck}
          color="text-purple-600"
        />
        <StatCard
          stats={stats}
          title="Ingresos del Mes"
          value={`₡${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-yellow-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/members")}
                  className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Miembros
                </button>
                <button className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Check-in Manual
                </button>
                <button className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>

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
