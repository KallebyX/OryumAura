import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Shield, Search, Filter, Download, Eye, Calendar, User, Activity } from 'lucide-react';

interface AuditLog {
  id: number;
  user_id: number;
  user_name?: string;
  action: string;
  resource: string;
  resource_id: number;
  details: string | null;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResource, setFilterResource] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/audit-logs');
      setLogs(response.data.data || []);
    } catch (error) {
      addToast('Erro ao carregar logs de auditoria', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = async () => {
    try {
      addToast('Exportando logs...', 'info');
      // Simulated export - in production would download CSV/Excel
      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString()}.json`;
      link.click();
      addToast('Logs exportados com sucesso!', 'success');
    } catch (error) {
      addToast('Erro ao exportar logs', 'error');
    }
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      'CREATE': 'bg-green-100 text-green-800',
      'READ': 'bg-blue-100 text-blue-800',
      'UPDATE': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
      'LOGIN': 'bg-purple-100 text-purple-800',
      'LOGOUT': 'bg-gray-100 text-gray-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address.includes(searchTerm);

    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesResource = filterResource === 'all' || log.resource === filterResource;

    return matchesSearch && matchesAction && matchesResource;
  });

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const uniqueResources = Array.from(new Set(logs.map(log => log.resource)));

  const stats = {
    total: logs.length,
    today: logs.filter(log =>
      new Date(log.timestamp).toDateString() === new Date().toDateString()
    ).length,
    creates: logs.filter(log => log.action === 'CREATE').length,
    updates: logs.filter(log => log.action === 'UPDATE').length,
    deletes: logs.filter(log => log.action === 'DELETE').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="animate-pulse mx-auto mb-4 text-green-600" size={48} />
          <p className="text-gray-600">Carregando logs de auditoria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Shield size={32} className="text-green-600" />
              Auditoria LGPD
            </h1>
            <p className="text-gray-600 mt-1">
              Registro completo de todas as ações no sistema
            </p>
          </div>
          <button
            onClick={exportLogs}
            className="bg-green-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <Download size={20} />
            Exportar Logs
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Total de Logs</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Activity size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Hoje</p>
              <p className="text-2xl font-bold text-gray-800">{stats.today}</p>
            </div>
            <Calendar size={32} className="text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Criações</p>
              <p className="text-2xl font-bold text-gray-800">{stats.creates}</p>
            </div>
            <span className="text-3xl">➕</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Atualizações</p>
              <p className="text-2xl font-bold text-gray-800">{stats.updates}</p>
            </div>
            <span className="text-3xl">✏️</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Exclusões</p>
              <p className="text-2xl font-bold text-gray-800">{stats.deletes}</p>
            </div>
            <span className="text-3xl">🗑️</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search size={16} className="inline mr-1" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Usuário, ação, recurso, IP..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Filter by Action */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Filtrar por Ação
            </label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
            >
              <option value="all">Todas as ações</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Filter by Resource */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Filtrar por Recurso
            </label>
            <select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
            >
              <option value="all">Todos os recursos</option>
              {uniqueResources.map(resource => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {log.user_name || `ID: ${log.user_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.resource}
                      {log.resource_id && (
                        <span className="text-gray-500"> #{log.resource_id}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum log encontrado com os filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detalhes do Log #{selectedLog.id}
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Data/Hora</p>
                    <p className="text-gray-900">
                      {new Date(selectedLog.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Usuário</p>
                    <p className="text-gray-900">
                      {selectedLog.user_name || `ID: ${selectedLog.user_id}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Ação</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getActionBadge(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Recurso</p>
                    <p className="text-gray-900">
                      {selectedLog.resource}
                      {selectedLog.resource_id && ` #${selectedLog.resource_id}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Endereço IP</p>
                    <p className="text-gray-900 font-mono">{selectedLog.ip_address}</p>
                  </div>
                </div>

                {selectedLog.details && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Detalhes Adicionais</p>
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(JSON.parse(selectedLog.details), null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">User Agent</p>
                  <p className="text-xs text-gray-700 bg-gray-100 p-3 rounded">
                    {selectedLog.user_agent}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPage;
