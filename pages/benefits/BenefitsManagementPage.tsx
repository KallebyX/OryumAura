import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EventualBenefit, Beneficiary } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Gift, Package, CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BenefitsManagementPage: React.FC = () => {
  const [benefits, setBenefits] = useState<EventualBenefit[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    beneficiary_id: '',
    benefit_type: 'Cesta Básica',
    request_date: new Date().toISOString().split('T')[0],
    justification: '',
    quantity: '1',
    observations: ''
  });
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchBenefits();
    fetchBeneficiaries();
  }, [filterStatus]);

  const fetchBenefits = async () => {
    try {
      const response = await api.get('/eventual-benefits', {
        params: filterStatus !== 'all' ? { status: filterStatus } : {}
      });
      setBenefits(response.data.data);
    } catch (error) {
      addToast('Erro ao carregar benefícios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      const response = await api.get('/beneficiaries');
      setBeneficiaries(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar beneficiários');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/eventual-benefits', {
        ...formData,
        beneficiary_id: parseInt(formData.beneficiary_id),
        quantity: parseInt(formData.quantity)
      });
      addToast('Solicitação de benefício registrada com sucesso!', 'success');
      setShowForm(false);
      fetchBenefits();
      setFormData({
        beneficiary_id: '',
        benefit_type: 'Cesta Básica',
        request_date: new Date().toISOString().split('T')[0],
        justification: '',
        quantity: '1',
        observations: ''
      });
    } catch (error) {
      addToast('Erro ao registrar solicitação', 'error');
    }
  };

  const handleApprove = async (benefitId: number) => {
    try {
      await api.put(`/eventual-benefits/${benefitId}`, {
        status: 'Aprovado',
        approved_by: user?.id,
        approval_date: new Date().toISOString()
      });
      addToast('Benefício aprovado!', 'success');
      fetchBenefits();
    } catch (error) {
      addToast('Erro ao aprovar benefício', 'error');
    }
  };

  const handleReject = async (benefitId: number) => {
    const reason = prompt('Digite o motivo da negação:');
    if (!reason) return;

    try {
      await api.put(`/eventual-benefits/${benefitId}`, {
        status: 'Negado',
        approved_by: user?.id,
        approval_date: new Date().toISOString(),
        justification: reason
      });
      addToast('Benefício negado', 'success');
      fetchBenefits();
    } catch (error) {
      addToast('Erro ao negar benefício', 'error');
    }
  };

  const handleDeliver = async (benefitId: number) => {
    try {
      await api.put(`/eventual-benefits/${benefitId}`, {
        status: 'Entregue',
        delivery_date: new Date().toISOString()
      });
      addToast('Benefício marcado como entregue!', 'success');
      fetchBenefits();
    } catch (error) {
      addToast('Erro ao marcar como entregue', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Solicitado': 'bg-blue-100 text-blue-800',
      'Em Análise': 'bg-yellow-100 text-yellow-800',
      'Aprovado': 'bg-green-100 text-green-800',
      'Negado': 'bg-red-100 text-red-800',
      'Entregue': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'Negado':
        return <XCircle size={16} className="text-red-600" />;
      case 'Entregue':
        return <Package size={16} className="text-purple-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Gift size={32} className="text-green-600" />
          Gestão de Benefícios Eventuais
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Nova Solicitação'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-600 mb-1">Solicitados</h3>
          <p className="text-2xl font-bold text-blue-800">
            {benefits.filter(b => b.status === 'Solicitado').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-600 mb-1">Em Análise</h3>
          <p className="text-2xl font-bold text-yellow-800">
            {benefits.filter(b => b.status === 'Em Análise').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-green-600 mb-1">Aprovados</h3>
          <p className="text-2xl font-bold text-green-800">
            {benefits.filter(b => b.status === 'Aprovado').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-600 mb-1">Entregues</h3>
          <p className="text-2xl font-bold text-purple-800">
            {benefits.filter(b => b.status === 'Entregue').length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        {['all', 'Solicitado', 'Em Análise', 'Aprovado', 'Negado', 'Entregue'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-t-lg whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Todos' : status}
          </button>
        ))}
      </div>

      {/* New Benefit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-green-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nova Solicitação de Benefício</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiário *
              </label>
              <select
                value={formData.beneficiary_id}
                onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                required
              >
                <option value="">Selecione um beneficiário</option>
                {beneficiaries.map(b => (
                  <option key={b.id} value={b.id}>{b.name} - {b.cpf}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Benefício *
              </label>
              <select
                value={formData.benefit_type}
                onChange={(e) => setFormData({ ...formData, benefit_type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                required
              >
                <option value="Cesta Básica">Cesta Básica</option>
                <option value="Auxílio Funeral">Auxílio Funeral</option>
                <option value="Auxílio Natalidade">Auxílio Natalidade</option>
                <option value="Material de Construção">Material de Construção</option>
                <option value="Documentação">Documentação</option>
                <option value="Passagem">Passagem</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Solicitação *
              </label>
              <input
                type="date"
                value={formData.request_date}
                onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Justificativa *
              </label>
              <textarea
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                rows={3}
                required
                placeholder="Descreva a situação e a necessidade do benefício..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                rows={2}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg"
            >
              Registrar Solicitação
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Benefits List */}
      <div className="space-y-4">
        {benefits.length > 0 ? (
          benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {benefit.benefit_type}
                    </h3>
                    {getStatusIcon(benefit.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Beneficiário: <span className="font-medium">{benefit.beneficiary_name || `ID: ${benefit.beneficiary_id}`}</span>
                  </p>
                  {benefit.quantity && benefit.quantity > 1 && (
                    <p className="text-sm text-gray-600">
                      Quantidade: <span className="font-medium">{benefit.quantity}</span>
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(benefit.status)}`}>
                  {benefit.status}
                </span>
              </div>

              {benefit.justification && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Justificativa:</strong> {benefit.justification}
                  </p>
                </div>
              )}

              {benefit.observations && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Observações:</strong> {benefit.observations}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                <span>Solicitado em: {new Date(benefit.request_date).toLocaleDateString('pt-BR')}</span>
                {benefit.approval_date && (
                  <span>• Aprovado em: {new Date(benefit.approval_date).toLocaleDateString('pt-BR')}</span>
                )}
                {benefit.delivery_date && (
                  <span>• Entregue em: {new Date(benefit.delivery_date).toLocaleDateString('pt-BR')}</span>
                )}
              </div>

              {/* Action Buttons */}
              {user?.cargo === 'secretario' && (
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  {(benefit.status === 'Solicitado' || benefit.status === 'Em Análise') && (
                    <>
                      <button
                        onClick={() => handleApprove(benefit.id)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <CheckCircle size={16} />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(benefit.id)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <XCircle size={16} />
                        Negar
                      </button>
                    </>
                  )}
                  {benefit.status === 'Aprovado' && (
                    <button
                      onClick={() => handleDeliver(benefit.id)}
                      className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      <Package size={16} />
                      Marcar como Entregue
                    </button>
                  )}
                </div>
              )}

              {user?.cargo === 'servidor' && benefit.status === 'Solicitado' && (
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={async () => {
                      try {
                        await api.put(`/eventual-benefits/${benefit.id}`, {
                          status: 'Em Análise'
                        });
                        addToast('Status atualizado para Em Análise', 'success');
                        fetchBenefits();
                      } catch (error) {
                        addToast('Erro ao atualizar status', 'error');
                      }
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Mover para Em Análise
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Gift size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Nenhum benefício encontrado</p>
            <p className="text-sm">
              {filterStatus === 'all'
                ? 'Clique em "Nova Solicitação" para registrar um benefício'
                : `Nenhum benefício com status "${filterStatus}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenefitsManagementPage;
