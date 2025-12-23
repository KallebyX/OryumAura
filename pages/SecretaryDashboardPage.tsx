import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SecretaryStats } from '../types';
import { Link } from 'react-router-dom';
import NewsManager from '../components/NewsManager';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import {
  Users,
  Home,
  CheckSquare,
  BarChart2,
  Newspaper,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import Card, { StatCard } from '../components/Card';
import Button from '../components/Button';

const SecretaryDashboardPage: React.FC = () => {
  const stats: SecretaryStats = {
    totalBeneficiarios: 1247,
    totalFamilias: 892,
    tarefasConcluidasMes: 45,
    mediaEngajamentoCursos: 78,
    tasksByStatus: [
      { name: 'Pendente', value: 12 },
      { name: 'Em Andamento', value: 8 },
      { name: 'Concluido', value: 25 }
    ],
    coursesByCategory: [
      { name: 'Tecnologia', value: 35 },
      { name: 'Saude', value: 25 },
      { name: 'Artesanato', value: 20 },
      { name: 'Gastronomia', value: 20 }
    ],
    recentActivity: [
      { id: 1, text: 'Nova familia cadastrada no sistema', time: 'ha 2 horas', type: 'user' },
      { id: 2, text: 'Tarefa "Atualizacao CadUnico" finalizada', time: 'ha 3 horas', type: 'task' },
      { id: 3, text: '15 inscricoes no curso de Informatica', time: 'ha 5 horas', type: 'course' },
      { id: 4, text: 'Relatorio mensal gerado com sucesso', time: 'ha 1 dia', type: 'task' },
      { id: 5, text: 'Nova noticia publicada no portal', time: 'ha 1 dia', type: 'course' }
    ]
  };

  const trendData = [
    { month: 'Jan', atendimentos: 320, beneficios: 180 },
    { month: 'Fev', atendimentos: 380, beneficios: 220 },
    { month: 'Mar', atendimentos: 420, beneficios: 260 },
    { month: 'Abr', atendimentos: 460, beneficios: 300 },
    { month: 'Mai', atendimentos: 520, beneficios: 340 },
    { month: 'Jun', atendimentos: 580, beneficios: 380 },
  ];

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news'>('dashboard');

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

  const quickActions = [
    { label: 'Beneficiarios', path: '/admin/beneficiaries', icon: Users, color: 'primary' },
    { label: 'Programas', path: '/admin/programs', icon: Home, color: 'accent' },
    { label: 'Relatorios', path: '/admin/reports', icon: BarChart2, color: 'success' },
    { label: 'Agendamentos', path: '/schedule', icon: Calendar, color: 'warning' },
  ];

  const ActivityIcon = ({ type }: { type: string }) => {
    const icons = {
      user: <Users size={16} className="text-primary-500" />,
      task: <CheckSquare size={16} className="text-success-500" />,
      course: <Newspaper size={16} className="text-accent-500" />
    };
    return icons[type as keyof typeof icons] || null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2"
          >
            <Sparkles size={14} className="text-primary-500" />
            <span>Bem-vindo de volta, {user?.nome.split(' ')[0]}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-display font-bold text-slate-900 dark:text-white"
          >
            Painel da Secretaria
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {quickActions.map((action, index) => (
            <Link key={action.label} to={action.path}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<action.icon size={16} />}
                className="hover:border-primary-300 dark:hover:border-primary-700"
              >
                {action.label}
              </Button>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
          { id: 'news', label: 'Gerenciar Noticias', icon: Newspaper }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Beneficiarios"
                value={stats.totalBeneficiarios.toLocaleString()}
                icon={<Users size={20} />}
                color="primary"
                change={{ value: 12, type: 'increase' }}
              />
              <StatCard
                title="Familias Cadastradas"
                value={stats.totalFamilias.toLocaleString()}
                icon={<Home size={20} />}
                color="success"
                change={{ value: 8, type: 'increase' }}
              />
              <StatCard
                title="Tarefas Concluidas"
                value={stats.tarefasConcluidasMes}
                icon={<CheckSquare size={20} />}
                color="warning"
                change={{ value: 5, type: 'decrease' }}
              />
              <StatCard
                title="Engajamento Cursos"
                value={`${stats.mediaEngajamentoCursos}%`}
                icon={<TrendingUp size={20} />}
                color="accent"
                change={{ value: 15, type: 'increase' }}
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Area Chart - Trend */}
              <Card variant="default" padding="lg" className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Tendencia de Atendimentos
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ultimos 6 meses
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary-500" />
                      <span className="text-slate-600 dark:text-slate-400">Atendimentos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent-500" />
                      <span className="text-slate-600 dark:text-slate-400">Beneficios</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBeneficios" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="atendimentos"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAtendimentos)"
                    />
                    <Area
                      type="monotone"
                      dataKey="beneficios"
                      stroke="#d946ef"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBeneficios)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Cursos por Categoria
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Distribuicao atual
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.coursesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats.coursesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {stats.coursesByCategory.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Tasks Status */}
              <Card variant="default" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Status das Tarefas
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Visao geral do mes
                    </p>
                  </div>
                  <Link to="/admin/tasks">
                    <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
                      Ver todas
                    </Button>
                  </Link>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.tasksByStatus} layout="vertical">
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Recent Activity */}
              <Card variant="default" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Atividade Recente
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ultimas atualizacoes
                    </p>
                  </div>
                  <Activity size={20} className="text-slate-400" />
                </div>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">
                          {activity.text}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'news' && (
          <motion.div
            key="news"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NewsManager />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecretaryDashboardPage;
