"use client";

import React from "react";
import { Search, Users, UserCheck } from "lucide-react";

export default function MemberFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  members,
  filteredMembers,
}) {
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.isActive).length;
  const resultsCount = filteredMembers.length;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los miembros</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">Total</p>
              <p className="text-lg font-bold text-blue-600">{totalMembers}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-900">Activos</p>
              <p className="text-lg font-bold text-green-600">{activeMembers}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">Resultados</p>
              <p className="text-lg font-bold text-gray-600">{resultsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
