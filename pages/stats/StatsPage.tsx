import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  AlertTriangle,
  Gift,
  Calendar,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { addToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/stats', {
        params: { period }
      });
      setStats(response.data);
    } catch (error) {
      addToast('Erro ao carregar estatísticas', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const monthlyData = [
    { name: 'Jan', visitas: 45, beneficios: 23, casos: 8 },
    { name: 'Fev', visitas: 52, beneficios: 31, casos: 12 },
    { name: 'Mar', visitas: 48, beneficios: 28, casos: 10 },
    { name: 'Abr', visitas: 61, beneficios: 35, casos: 15 },
    { name: 'Mai', visitas: 55, beneficios: 42, casos: 11 },
    { name: 'Jun', visitas: 67, beneficios: 38, casos: 13 }
  ];

  const vulnerabilityData = [
    { name: 'Baixo', value: 120, color: '#22c55e' },
    { name: 'Médio', value: 85, color: '#eab308' },
    { name: 'Alto', value: 45, color: '#f97316' },
    { name: 'Crítico', value: 18, color: '#ef4444' }
  ];

  const benefitTypeData = [
    { name: 'Cesta Básica', quantidade: 145 },
    { name: 'Auxílio Funeral', quantidade: 23 },
    { name: 'Auxílio Natalidade', quantidade: 34 },
    { name: 'Material Construção', quantidade: 12 },
    { name: 'Passagem', quantidade: 56 },
    { name: 'Documentação', quantidade: 78 }
  ];

  const neighborhoodData = [
    { bairro: 'Centro', familias: 145 },
    { bairro: 'Vila Nova', familias: 98 },
    { bairro: 'São José', familias: 76 },
    { bairro: 'Industrial', familias: 65 },
    { bairro: 'Santa Terezinha', familias: 54 },
    { bairro: 'Outros', familias: 123 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="animate-pulse mx-auto mb-4 text-prefeitura-verde" size={48} />
          <p className="text-gray-600">Carregando estatísticas...</p>
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
              <BarChart3 size={32} className="text-prefeitura-verde" />
              Estatísticas Avançadas
            </h1>
            <p className="text-gray-600 mt-1">
              Análises detalhadas do sistema de assistência social
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="year">Último Ano</option>
            </select>

            <button
              className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              onClick={() => addToast('Exportando relatório...', 'info')}
            >
              <Download size={20} />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Users size={32} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+12%</span>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Total Beneficiários</h3>
          <p className="text-3xl font-bold">1.247</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <MapPin size={32} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+8%</span>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Visitas Realizadas</h3>
          <p className="text-3xl font-bold">328</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Gift size={32} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+15%</span>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Benefícios Entregues</h3>
          <p className="text-3xl font-bold">548</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle size={32} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">-5%</span>
          </div>
          <h3 className="text-sm font-semibold opacity-90">Casos CREAS Ativos</h3>
          <p className="text-3xl font-bold">67</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-prefeitura-verde" />
            Tendências Mensais
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitas" stroke="#16a34a" strokeWidth={2} name="Visitas" />
              <Line type="monotone" dataKey="beneficios" stroke="#8b5cf6" strokeWidth={2} name="Benefícios" />
              <Line type="monotone" dataKey="casos" stroke="#ef4444" strokeWidth={2} name="Casos CREAS" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vulnerability Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Distribuição de Vulnerabilidade
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vulnerabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vulnerabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Benefit Types */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Benefícios por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benefitTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#8b5cf6" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Families by Neighborhood */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Famílias por Bairro
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={neighborhoodData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="bairro" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="familias" fill="#16a34a" name="Famílias" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Resumo Detalhado por Período
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Indicador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mês
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendência
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Novos Cadastros
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">56</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">687</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp size={16} /> +12%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Visitas Domiciliares
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">98</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.145</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp size={16} /> +8%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Atividades PAIF
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">34</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">412</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp size={16} /> +5%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Benefícios Aprovados
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">34</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">156</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.823</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp size={16} /> +15%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Casos CREAS
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">203</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-red-600 flex items-center gap-1">
                    <TrendingUp size={16} className="rotate-180" /> -5%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
