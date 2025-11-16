import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Input,
  Select,
  Avatar,
  AvatarGroup,
  Table,
  Dialog,
  Dropdown,
  EmptyState,
  Badge,
  ProgressBar,
  ToastNotification,
  KanbanBoard
} from '../components';
import Card, { CardHeader, CardContent, CardFooter } from '../components/Card';
import Tabs from '../components/Tabs';
import {
  Users,
  Mail,
  Download,
  Settings,
  LogOut,
  Plus,
  Package,
  Home,
  BarChart,
  FileText
} from 'lucide-react';

const ComponentShowcasePage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [selectedDropdown, setSelectedDropdown] = useState('');

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const tableData = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', cargo: 'Servidor' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', cargo: 'Secretário' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', cargo: 'Servidor' }
  ];

  const tableColumns = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'cargo', label: 'Cargo', sortable: true }
  ];

  const kanbanColumns = [
    {
      id: 'todo',
      title: 'A Fazer',
      color: '#3B82F6',
      cards: [
        {
          id: '1',
          title: 'Implementar nova funcionalidade',
          description: 'Adicionar sistema de notificações em tempo real',
          assignee: { name: 'João Silva' },
          priority: 'high' as const,
          tags: ['frontend', 'urgente'],
          dueDate: '15/12'
        }
      ]
    },
    {
      id: 'doing',
      title: 'Em Progresso',
      color: '#F59E0B',
      cards: [
        {
          id: '2',
          title: 'Corrigir bug de autenticação',
          priority: 'medium' as const,
          tags: ['backend'],
          assignee: { name: 'Maria Santos' }
        }
      ]
    },
    {
      id: 'done',
      title: 'Concluído',
      color: '#10B981',
      cards: []
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Biblioteca de Componentes OryumAura
          </h1>
          <p className="text-lg text-gray-600">
            Componentes modernos com animações, acessibilidade e design profissional
          </p>
        </motion.div>

        {/* Tabs for organization */}
        <Tabs
          variant="pills"
          tabs={[
            {
              id: 'buttons',
              label: 'Botões & Forms',
              icon: <Settings size={18} />,
              content: (
                <div className="space-y-8">
                  {/* Buttons Section */}
                  <Card>
                    <CardHeader title="Botões" subtitle="Diferentes variantes e tamanhos" />
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          <Button variant="primary">Primary</Button>
                          <Button variant="secondary">Secondary</Button>
                          <Button variant="outline">Outline</Button>
                          <Button variant="ghost">Ghost</Button>
                          <Button variant="danger">Danger</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button size="sm">Small</Button>
                          <Button size="md">Medium</Button>
                          <Button size="lg">Large</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button loading>Loading</Button>
                          <Button leftIcon={<Download size={18} />}>Com Ícone</Button>
                          <Button rightIcon={<Plus size={18} />}>Adicionar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Form Components */}
                  <Card>
                    <CardHeader title="Formulários" subtitle="Inputs e selects modernos" />
                    <CardContent>
                      <div className="space-y-4 max-w-md">
                        <Input
                          label="Nome Completo"
                          placeholder="Digite seu nome"
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="seu@email.com"
                          leftIcon={<Mail size={18} />}
                          helperText="Usaremos para contato"
                        />
                        <Input
                          label="Com Erro"
                          error="Este campo é obrigatório"
                        />
                        <Select
                          label="Cargo"
                          options={[
                            { label: 'Selecione...', value: '' },
                            { label: 'Secretário', value: 'secretario' },
                            { label: 'Servidor', value: 'servidor' },
                            { label: 'Beneficiário', value: 'beneficiario' }
                          ]}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            },
            {
              id: 'data',
              label: 'Dados',
              icon: <BarChart size={18} />,
              content: (
                <div className="space-y-8">
                  {/* Table */}
                  <Card padding="none">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-bold">Tabela Avançada</h3>
                      <p className="text-sm text-gray-600">
                        Com ordenação, busca, filtros e exportação
                      </p>
                    </div>
                    <div className="p-6">
                      <Table
                        columns={tableColumns}
                        data={tableData}
                        searchable
                        exportable
                        pagination
                        pageSize={5}
                        onRowClick={(row) => addToast(`Clicou em ${row.nome}`, 'info')}
                      />
                    </div>
                  </Card>

                  {/* Avatars */}
                  <Card>
                    <CardHeader title="Avatares" subtitle="Com status e badges" />
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-4 items-end">
                          <Avatar name="João Silva" size="xs" />
                          <Avatar name="Maria Santos" size="sm" status="online" showStatus />
                          <Avatar name="Pedro Costa" size="md" status="away" showStatus />
                          <Avatar name="Ana Oliveira" size="lg" status="busy" showStatus badge={5} />
                          <Avatar name="Carlos Silva" size="xl" status="offline" showStatus />
                          <Avatar name="Lucia Fernandes" size="2xl" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-3">Grupo de Avatares</p>
                          <AvatarGroup
                            avatars={[
                              { name: 'User 1' },
                              { name: 'User 2' },
                              { name: 'User 3' },
                              { name: 'User 4' },
                              { name: 'User 5' }
                            ]}
                            max={3}
                            size="md"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Bars */}
                  <Card>
                    <CardHeader title="Barras de Progresso" subtitle="Animadas com cores" />
                    <CardContent>
                      <div className="space-y-4">
                        <ProgressBar value={75} showLabel color="green" />
                        <ProgressBar value={50} showLabel color="blue" />
                        <ProgressBar value={30} showLabel color="yellow" />
                        <ProgressBar value={90} showLabel color="red" />
                        <ProgressBar value={100} showLabel color="purple" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            },
            {
              id: 'feedback',
              label: 'Feedback',
              icon: <Package size={18} />,
              content: (
                <div className="space-y-8">
                  {/* Dialogs */}
                  <Card>
                    <CardHeader title="Diálogos" subtitle="Modais com animações" />
                    <CardContent>
                      <Button onClick={() => setDialogOpen(true)}>
                        Abrir Dialog
                      </Button>
                      <Dialog
                        isOpen={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        title="Confirmação"
                        size="md"
                        footer={
                          <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => {
                                addToast('Ação confirmada!', 'success');
                                setDialogOpen(false);
                              }}
                            >
                              Confirmar
                            </Button>
                          </div>
                        }
                      >
                        <p>Este é um exemplo de dialog modal com animações suaves.</p>
                        <p className="mt-2 text-gray-600">
                          Pressione ESC ou clique fora para fechar.
                        </p>
                      </Dialog>
                    </CardContent>
                  </Card>

                  {/* Toasts */}
                  <Card>
                    <CardHeader title="Notificações Toast" subtitle="4 tipos de notificação" />
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          onClick={() => addToast('Operação realizada com sucesso!', 'success')}
                        >
                          Success Toast
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => addToast('Ocorreu um erro!', 'error')}
                        >
                          Error Toast
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => addToast('Informação importante', 'info')}
                        >
                          Info Toast
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addToast('Atenção necessária!', 'warning')}
                        >
                          Warning Toast
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dropdowns */}
                  <Card>
                    <CardHeader title="Dropdowns" subtitle="Menus com ícones" />
                    <CardContent>
                      <div className="flex gap-4">
                        <Dropdown
                          trigger={<Button>Menu Usuário</Button>}
                          options={[
                            {
                              label: 'Configurações',
                              value: 'settings',
                              icon: <Settings size={18} />
                            },
                            { divider: true },
                            {
                              label: 'Sair',
                              value: 'logout',
                              icon: <LogOut size={18} />
                            }
                          ]}
                          onSelect={(value) => {
                            setSelectedDropdown(value);
                            addToast(`Selecionado: ${value}`, 'info');
                          }}
                          selectedValue={selectedDropdown}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Empty State */}
                  <Card>
                    <CardHeader title="Estado Vazio" subtitle="Para listas vazias" />
                    <CardContent>
                      <EmptyState
                        icon={Users}
                        title="Nenhum usuário encontrado"
                        description="Comece adicionando seu primeiro usuário ao sistema"
                        action={{
                          label: 'Adicionar Usuário',
                          onClick: () => addToast('Ação de adicionar usuário', 'info'),
                          icon: <Plus size={18} />
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Badges */}
                  <Card>
                    <CardHeader title="Badges de Gamificação" subtitle="Com progresso e animações" />
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        <Badge type="trophy" label="Campeão" earned size="md" />
                        <Badge type="star" label="Estrela" earned size="md" />
                        <Badge type="crown" label="Rei SUAS" earned size="md" />
                        <Badge type="award" label="Dedicado" progress={75} size="md" />
                        <Badge type="target" label="Precisão" progress={50} size="md" />
                        <Badge type="zap" label="Rápido" progress={25} size="md" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            },
            {
              id: 'advanced',
              label: 'Avançado',
              icon: <FileText size={18} />,
              content: (
                <div className="space-y-8">
                  {/* Kanban Board */}
                  <Card padding="lg">
                    <CardHeader
                      title="Quadro Kanban"
                      subtitle="Arraste os cards entre as colunas"
                    />
                    <div className="mt-6">
                      <KanbanBoard
                        columns={kanbanColumns}
                        onCardClick={(card) => addToast(`Card: ${card.title}`, 'info')}
                        onAddCard={(columnId) => addToast(`Adicionar card em ${columnId}`, 'info')}
                      />
                    </div>
                  </Card>
                </div>
              )
            }
          ]}
        />
      </div>

      {/* Toast Container */}
      <ToastNotification toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
};

export default ComponentShowcasePage;
