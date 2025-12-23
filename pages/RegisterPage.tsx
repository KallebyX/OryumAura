import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CacapavaDoSulIcon } from '../components/CacapavaDoSulIcon';
import Input from '../components/Input';
import Button from '../components/Button';
import { apiRegister } from '../services/api';
import {
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Shield,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'A senha deve ter no minimo 8 caracteres';
    }
    if (!/[a-z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra minuscula';
    }
    if (!/[A-Z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra maiuscula';
    }
    if (!/\d/.test(password)) {
      return 'A senha deve conter pelo menos um numero';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validacoes
    if (cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF deve ter 11 digitos');
      return;
    }

    if (name.length < 3) {
      setError('Nome deve ter no minimo 3 caracteres');
      return;
    }

    const passwordError = validatePassword(senha);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (senha !== confirmSenha) {
      setError('As senhas nao coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await apiRegister({
        cpf: cpf.replace(/\D/g, ''),
        name,
        senha,
        email: email || undefined,
        phone: phone.replace(/\D/g, '') || undefined,
      });

      // Salva o token
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      }

      setSuccess('Cadastro realizado com sucesso! Redirecionando...');

      // Redireciona para o dashboard apos 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload(); // Forca reload para atualizar o contexto de auth
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

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
              Crie sua
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                conta gratuita
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
              Acesse servicos sociais, acompanhe beneficios e participe de programas do municipio.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Seus dados protegidos (LGPD)' },
                { icon: Sparkles, text: 'Acesso a programas sociais' },
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

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-y-auto">
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        {/* Back to Login */}
        <Link
          to="/login"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md my-12"
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

          {/* Register Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-elevation-4 border border-slate-200/60 dark:border-slate-800 p-8">
            <div className="text-center mb-8">
              <div className="hidden lg:block mb-6">
                <CacapavaDoSulIcon className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Criar nova conta
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Preencha seus dados para se cadastrar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome Completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                leftIcon={<User size={18} />}
                required
                autoComplete="name"
              />

              <Input
                label="CPF"
                type="text"
                value={formatCPF(cpf)}
                onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                placeholder="000.000.000-00"
                leftIcon={<User size={18} />}
                required
                autoComplete="off"
              />

              <Input
                label="Email (opcional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                leftIcon={<Mail size={18} />}
                autoComplete="email"
              />

              <Input
                label="Telefone (opcional)"
                type="text"
                value={formatPhone(phone)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="(00) 00000-0000"
                leftIcon={<Phone size={18} />}
                autoComplete="tel"
              />

              <Input
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Minimo 8 caracteres"
                leftIcon={<Lock size={18} />}
                showPasswordToggle
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirmar Senha"
                type="password"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                placeholder="Digite a senha novamente"
                leftIcon={<Lock size={18} />}
                showPasswordToggle
                required
                autoComplete="new-password"
              />

              {/* Password Requirements */}
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-medium mb-1">A senha deve conter:</p>
                <p className={senha.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                  {senha.length >= 8 ? '✓' : '○'} Minimo 8 caracteres
                </p>
                <p className={/[a-z]/.test(senha) ? 'text-green-600 dark:text-green-400' : ''}>
                  {/[a-z]/.test(senha) ? '✓' : '○'} Uma letra minuscula
                </p>
                <p className={/[A-Z]/.test(senha) ? 'text-green-600 dark:text-green-400' : ''}>
                  {/[A-Z]/.test(senha) ? '✓' : '○'} Uma letra maiuscula
                </p>
                <p className={/\d/.test(senha) ? 'text-green-600 dark:text-green-400' : ''}>
                  {/\d/.test(senha) ? '✓' : '○'} Um numero
                </p>
              </div>

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

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  >
                    <CheckCircle size={18} />
                    <span className="text-sm">{success}</span>
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
                Criar Conta
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ja tem uma conta?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Faca login
                </Link>
              </p>
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

export default RegisterPage;
