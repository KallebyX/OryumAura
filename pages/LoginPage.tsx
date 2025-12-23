import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CacapavaDoSulIcon } from '../components/CacapavaDoSulIcon';
import Input from '../components/Input';
import Button from '../components/Button';
import {
  User,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  Moon,
  Sun,
  AlertCircle,
  Info,
  ChevronDown,
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const { login } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(cpf, senha);
    } catch (err) {
      setError('Credenciais invalidas. Verifique o CPF e a senha.');
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  const demoCredentials = [
    { role: 'Secretaria (Admin)', cpf: '000.000.000-00', desc: 'Acesso total ao sistema' },
    { role: 'Servidor', cpf: '111.222.333-44', desc: 'Gestao de atendimentos' },
    { role: 'Beneficiario', cpf: '555.666.777-88', desc: 'Portal do cidadao' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-500/30 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Oryum Aura</h1>
                <p className="text-sm text-slate-400">Sistema SUAS</p>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl xl:text-5xl font-display font-bold text-white mb-6 leading-tight">
              Gestao de
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Assistencia Social
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
              Plataforma integrada para gestao de programas sociais, atendimentos e beneficios do municipio.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Seguranca de dados LGPD' },
                { icon: Sparkles, text: 'Inteligencia Artificial integrada' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <feature.icon size={20} className="text-primary-400" />
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="absolute bottom-8 left-12 xl:left-20">
            <p className="text-sm text-slate-500">
              2025 Prefeitura de Cacapava do Sul
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative">
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-6 left-6 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Voltar ao inicio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <CacapavaDoSulIcon className="w-12 h-12" />
              <div className="text-left">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Oryum Aura</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sistema SUAS</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-elevation-4 border border-slate-200/60 dark:border-slate-800 p-8">
            <div className="text-center mb-8">
              <div className="hidden lg:block mb-6">
                <CacapavaDoSulIcon className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Entre com suas credenciais para acessar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="CPF"
                type="text"
                value={formatCPF(cpf)}
                onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                placeholder="000.000.000-00"
                leftIcon={<User size={18} />}
                required
                autoComplete="username"
              />

              <Input
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                leftIcon={<Lock size={18} />}
                showPasswordToggle
                required
                autoComplete="current-password"
              />

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400"
                  >
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                variant="gradient"
                glow
                rightIcon={<ArrowRight size={18} />}
              >
                Entrar
              </Button>
            </form>

            {/* Demo Info Toggle */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowDemoInfo(!showDemoInfo)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <span className="text-sm font-medium">Credenciais de demonstracao</span>
                </div>
                <motion.div
                  animate={{ rotate: showDemoInfo ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              <AnimatePresence>
                {showDemoInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {demoCredentials.map((cred, index) => (
                        <motion.button
                          key={cred.role}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            setCpf(cred.cpf.replace(/\D/g, ''));
                            setSenha(cred.cpf === '000.000.000-00' ? 'Admin@123' : 'Senha@123');
                          }}
                          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {cred.role}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {cred.desc}
                              </p>
                            </div>
                            <code className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
                              {cred.cpf}
                            </code>
                          </div>
                        </motion.button>
                      ))}
                      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                        Admin: <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">Admin@123</code>
                        {' | '}
                        Outros: <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">Senha@123</code>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Prefeitura Municipal de Cacapava do Sul
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
