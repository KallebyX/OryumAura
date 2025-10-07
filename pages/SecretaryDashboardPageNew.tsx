import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SecretaryStats } from '../types';
import { Link } from 'react-router-dom';
import NewsManager from '../components/NewsManager';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Home, CheckSquare, BarChart2, Newspaper, FileText } from 'lucide-react';

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode, color: string, bgColor: string}> = ({ title, value, icon, color, bgColor }) => (
    <motion.div 
        className={`p-6 rounded-2xl shadow-lg flex items-center space-x-4 ${bgColor} border border-gray-200`}
        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </motion.div>
);

const ActivityItem: React.FC<{ activity: { id: number, text: string, time: string, type: 'user' | 'task' | 'course' } }> = ({ activity }) => {
    const icons = {
        user: <Users size={20} className="text-blue-500" />,
        task: <CheckSquare size={20} className="text-green-500" />,
        course: <Newspaper size={20} className="text-yellow-500" />
    }
    return (
        <motion.div 
            className="flex items-start space-x-4 py-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-gray-100 p-3 rounded-full">{icons[activity.type]}</div>
            <div>
                <p className="text-sm text-gray-800">{activity.text}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
        </motion.div>
    )
}

const SecretaryDashboardPage: React.FC = () => {
    // Dados de exemplo para demonstração
    const stats: SecretaryStats = {
        totalBeneficiarios: 1247,
        totalFamilias: 892,
        tarefasConcluidasMes: 45,
        mediaEngajamentoCursos: 78,
        tasksByStatus: [
            { name: 'Pendente', value: 12 },
            { name: 'Em Andamento', value: 8 },
            { name: 'Concluído', value: 25 }
        ],
        coursesByCategory: [
            { name: 'Tecnologia', value: 35 },
            { name: 'Saúde', value: 25 },
            { name: 'Artesanato', value: 20 },
            { name: 'Gastronomia', value: 20 }
        ],
        recentActivity: [
            { id: 1, text: 'Nova família cadastrada no sistema', time: 'há 2 horas', type: 'user' },
            { id: 2, text: 'Tarefa "Atualização CadÚnico" finalizada', time: 'há 3 horas', type: 'task' },
            { id: 3, text: '15 inscrições no curso de Informática', time: 'há 5 horas', type: 'course' },
            { id: 4, text: 'Relatório mensal gerado com sucesso', time: 'há 1 dia', type: 'task' },
            { id: 5, text: 'Nova notícia publicada no portal', time: 'há 1 dia', type: 'course' }
        ]
    };

    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'news'>('dashboard');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
        >
             <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
                 <h2 className="text-4xl font-bold text-gray-800">Painel da Secretaria</h2>
                 <nav className="flex flex-wrap gap-3">
                    <Link to="/admin/beneficiaries" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border transition-transform transform hover:scale-105">
                        <Users size={18} /> Gerenciar Beneficiários
                    </Link>
                    <Link to="/admin/programs" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border transition-transform transform hover:scale-105">
                        <Home size={18} /> Programas Sociais
                    </Link>
                    <Link to="/admin/reports" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border transition-transform transform hover:scale-105">
                        <BarChart2 size={18} /> Relatórios
                    </Link>
                 </nav>
             </header>

            {/* Tabs de navegação */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'dashboard'
                                ? 'border-prefeitura-azul text-prefeitura-azul'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <BarChart2 size={16} />
                            Dashboard
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'news'
                                ? 'border-prefeitura-azul text-prefeitura-azul'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Newspaper size={16} />
                            Gerenciar Notícias
                        </div>
                    </button>
                </nav>
            </div>

            {activeTab === 'dashboard' && (
                <>
                    {/* Cards de Estatísticas */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        <StatCard 
                            title="Total Beneficiários"
                            value={stats.totalBeneficiarios}
                            icon={<Users size={32} className="text-white" />}
                            color="bg-blue-500"
                            bgColor="bg-blue-50"
                        />
                        <StatCard 
                            title="Famílias Cadastradas"
                            value={stats.totalFamilias}
                            icon={<Home size={32} className="text-white" />}
                            color="bg-green-500"
                            bgColor="bg-green-50"
                        />
                        <StatCard 
                            title="Tarefas Concluídas"
                            value={stats.tarefasConcluidasMes}
                            icon={<CheckSquare size={32} className="text-white" />}
                            color="bg-yellow-500"
                            bgColor="bg-yellow-50"
                        />
                        <StatCard 
                            title="Engajamento Cursos"
                            value={`${stats.mediaEngajamentoCursos}%`}
                            icon={<BarChart2 size={32} className="text-white" />}
                            color="bg-purple-500"
                            bgColor="bg-purple-50"
                        />
                    </motion.div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div 
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Status das Tarefas</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.tasksByStatus}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        <motion.div 
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Cursos por Categoria</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.coursesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {stats.coursesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>

                    {/* Atividade Recente */}
                    <motion.div 
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Atividade Recente</h3>
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </motion.div>
                </>
            )}

            {activeTab === 'news' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <NewsManager />
                </motion.div>
            )}
        </motion.div>
    );
};

export default SecretaryDashboardPage;
