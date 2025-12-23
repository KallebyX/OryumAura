import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { News } from '../types';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Heart,
  Building2,
  Calendar,
  ChevronRight,
  Star,
  Zap,
  Globe,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news');
        setNews(response.data.data.slice(0, 3));
      } catch (err) {
        setError('Nao foi possivel carregar as noticias.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const stats = [
    { label: 'Familias Atendidas', value: '2.500+', icon: Users },
    { label: 'Programas Ativos', value: '15', icon: Heart },
    { label: 'Profissionais', value: '45', icon: Building2 },
    { label: 'Atendimentos/Mes', value: '800+', icon: Calendar },
  ];

  const features = [
    {
      icon: Users,
      title: 'Portal do Cidadao',
      description: 'Acesse seus beneficios, agendamentos e acompanhe sua situacao em tempo real.',
      link: '/portal',
      color: 'primary',
      badge: 'Popular',
    },
    {
      icon: ShieldCheck,
      title: 'Painel do Servidor',
      description: 'Gestao completa de atendimentos, beneficiarios e relatorios administrativos.',
      link: '/login',
      color: 'accent',
      badge: null,
    },
    {
      icon: Newspaper,
      title: 'Programas Sociais',
      description: 'Conheca todos os programas disponiveis, requisitos e como participar.',
      link: '/programs',
      color: 'success',
      badge: 'Novo',
    },
  ];

  return (
    <Layout>
      <div className="overflow-hidden -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/10 via-transparent to-transparent" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-5xl mx-auto text-center"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-white/90">Sistema SUAS - Cacapava do Sul</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6"
              >
                <span className="text-white">Portal de</span>
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Assistencia Social
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
              >
                Conectando cidadaos aos servicos e programas que promovem
                <span className="text-white font-medium"> bem-estar</span>,
                <span className="text-white font-medium"> dignidade</span> e
                <span className="text-white font-medium"> transformacao social</span>.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login">
                  <Button size="lg" variant="gradient" glow rightIcon={<ArrowRight size={20} />}>
                    Acessar Portal
                  </Button>
                </Link>
                <a href="#programas">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                    Conhecer Programas
                  </Button>
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300">
                      <stat.icon className="w-8 h-8 text-primary-400 mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-3 bg-white/40 rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="programas" className="relative py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium">
                <Zap size={14} />
                Acesso Rapido
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                Servicos Disponiveis
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Tudo o que voce precisa para acessar os servicos de assistencia social
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const colorClasses = {
                  primary: {
                    bg: 'bg-primary-50 dark:bg-primary-900/20',
                    icon: 'text-primary-600 dark:text-primary-400',
                    border: 'hover:border-primary-200 dark:hover:border-primary-800',
                  },
                  accent: {
                    bg: 'bg-accent-50 dark:bg-accent-900/20',
                    icon: 'text-accent-600 dark:text-accent-400',
                    border: 'hover:border-accent-200 dark:hover:border-accent-800',
                  },
                  success: {
                    bg: 'bg-success-50 dark:bg-success-900/20',
                    icon: 'text-success-600 dark:text-success-400',
                    border: 'hover:border-success-200 dark:hover:border-success-800',
                  },
                }[feature.color];

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Link to={feature.link}>
                      <div className={`
                        relative p-8 rounded-3xl
                        bg-white dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        shadow-elevation-2 hover:shadow-elevation-5
                        transition-all duration-300
                        ${colorClasses.border}
                      `}>
                        {feature.badge && (
                          <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-bold">
                            {feature.badge}
                          </span>
                        )}

                        <div className={`w-14 h-14 rounded-2xl ${colorClasses.bg} flex items-center justify-center mb-6`}>
                          <feature.icon size={28} className={colorClasses.icon} />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                          {feature.title}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                          {feature.description}
                        </p>

                        <div className={`flex items-center gap-2 font-semibold ${colorClasses.icon} group-hover:gap-3 transition-all duration-300`}>
                          <span>Acessar</span>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="noticias" className="relative py-24 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 text-sm font-medium">
                <Newspaper size={14} />
                Ultimas Novidades
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                Noticias e Informacoes
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Fique por dentro das ultimas novidades sobre assistencia social
              </p>
            </motion.div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              </div>
            )}

            {error && (
              <p className="text-center text-danger-500 py-12">{error}</p>
            )}

            {!loading && !error && news.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-12">
                Nenhuma noticia encontrada no momento.
              </p>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="
                    relative h-full p-6 rounded-2xl
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    shadow-elevation-2 hover:shadow-elevation-4
                    transition-all duration-300
                  ">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      <time className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(item.createdAt)}
                      </time>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                      {item.content.substring(0, 150)}...
                    </p>

                    <Link
                      to={`/news/${item.id}`}
                      className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 transition-all duration-300"
                    >
                      <span>Ler mais</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            {news.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Link to="/news">
                  <Button variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
                    Ver Todas as Noticias
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6">
                  Precisa de Ajuda?
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  Nossa equipe esta pronta para atender voce. Entre em contato e saiba como podemos ajudar.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <Link to="/login">
                    <Button
                      size="lg"
                      className="bg-white text-primary-700 hover:bg-slate-100 shadow-xl"
                      rightIcon={<ArrowRight size={20} />}
                    >
                      Acessar Sistema
                    </Button>
                  </Link>
                  <Link to="/schedule">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                      leftIcon={<Calendar size={20} />}
                    >
                      Agendar Atendimento
                    </Button>
                  </Link>
                </div>

                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    { icon: Phone, label: 'Telefone', value: '(55) 3281-1234' },
                    { icon: Mail, label: 'E-mail', value: 'social@cacapava.rs.gov.br' },
                    { icon: MapPin, label: 'Endereco', value: 'Rua Principal, 100 - Centro' },
                  ].map((contact, index) => (
                    <motion.div
                      key={contact.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
                    >
                      <contact.icon className="w-8 h-8 text-white/80 mx-auto mb-3" />
                      <div className="text-sm text-white/60 mb-1">{contact.label}</div>
                      <div className="text-white font-medium">{contact.value}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
