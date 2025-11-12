import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CREASCase, ProtectiveMeasure, CaseDeadline, Beneficiary } from '../../types';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, Shield, Clock, Plus, X, FileText } from 'lucide-react';

const CREASManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cases' | 'measures' | 'deadlines'>('cases');

  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-slide-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão CREAS</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('cases')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'cases'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertTriangle size={20} />
          Casos de Violação
        </button>
        <button
          onClick={() => setActiveTab('measures')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'measures'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield size={20} />
          Medidas Protetivas
        </button>
        <button
          onClick={() => setActiveTab('deadlines')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'deadlines'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock size={20} />
          Prazos Judiciais
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'cases' && <CasesTab />}
      {activeTab === 'measures' && <ProtectiveMeasuresTab />}
      {activeTab === 'deadlines' && <DeadlinesTab />}
    </div>
  );
};

// Cases Tab Component
const CasesTab: React.FC = () => {
  const [cases, setCases] = useState<CREASCase[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CREASCase | null>(null);
  const [formData, setFormData] = useState({
    beneficiary_id: '',
    case_type: 'Violência Doméstica',
    severity: 'Média',
    description: '',
    location: '',
    reporter: '',
    confidential: true
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchCases();
    fetchBeneficiaries();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/creas-cases');
      setCases(response.data.data);
    } catch (error) {
      addToast('Erro ao carregar casos CREAS', 'error');
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
      await api.post('/creas-cases', {
        ...formData,
        beneficiary_id: parseInt(formData.beneficiary_id)
      });
      addToast('Caso CREAS registrado com sucesso!', 'success');
      setShowForm(false);
      fetchCases();
      setFormData({
        beneficiary_id: '',
        case_type: 'Violência Doméstica',
        severity: 'Média',
        description: '',
        location: '',
        reporter: '',
        confidential: true
      });
    } catch (error) {
      addToast('Erro ao registrar caso', 'error');
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      'Baixa': 'bg-yellow-100 text-yellow-800',
      'Média': 'bg-orange-100 text-orange-800',
      'Alta': 'bg-red-100 text-red-800',
      'Crítica': 'bg-red-600 text-white'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Aberto': 'bg-blue-100 text-blue-800',
      'Em Acompanhamento': 'bg-yellow-100 text-yellow-800',
      'Encaminhado': 'bg-purple-100 text-purple-800',
      'Concluído': 'bg-green-100 text-green-800',
      'Arquivado': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Casos de Violação de Direitos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Novo Caso'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-red-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiário/Vítima *
              </label>
              <select
                value={formData.beneficiary_id}
                onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Selecione um beneficiário</option>
                {beneficiaries.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Violação *
              </label>
              <select
                value={formData.case_type}
                onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="Violência Física">Violência Física</option>
                <option value="Violência Psicológica">Violência Psicológica</option>
                <option value="Violência Sexual">Violência Sexual</option>
                <option value="Negligência">Negligência</option>
                <option value="Abandono">Abandono</option>
                <option value="Trabalho Infantil">Trabalho Infantil</option>
                <option value="Exploração Sexual">Exploração Sexual</option>
                <option value="Situação de Rua">Situação de Rua</option>
                <option value="Violência Doméstica">Violência Doméstica</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gravidade *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local da Ocorrência
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Caso *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denunciante/Fonte
              </label>
              <input
                type="text"
                value={formData.reporter}
                onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                placeholder="Ex: Anônimo, Escola, Conselho Tutelar"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confidential"
                checked={formData.confidential}
                onChange={(e) => setFormData({ ...formData, confidential: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="confidential" className="text-sm font-medium text-gray-700">
                Caso Confidencial
              </label>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Registrar Caso
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Nº Caso</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Beneficiário</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Tipo</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Gravidade</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Status</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Data Abertura</th>
            </tr>
          </thead>
          <tbody>
            {cases.length > 0 ? (
              cases.map((caseItem) => (
                <tr
                  key={caseItem.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <td className="py-3 px-4 font-mono text-sm">{caseItem.case_number}</td>
                  <td className="py-3 px-4">
                    {caseItem.beneficiary_name || `ID: ${caseItem.beneficiary_id}`}
                  </td>
                  <td className="py-3 px-4">{caseItem.case_type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(caseItem.severity)}`}>
                      {caseItem.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(caseItem.opening_date).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Nenhum caso CREAS registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Caso {selectedCase.case_number}
              </h3>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-semibold">Beneficiário:</span>{' '}
                {selectedCase.beneficiary_name || `ID: ${selectedCase.beneficiary_id}`}
              </div>
              <div>
                <span className="font-semibold">Tipo:</span> {selectedCase.case_type}
              </div>
              <div>
                <span className="font-semibold">Gravidade:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(selectedCase.severity)}`}>
                  {selectedCase.severity}
                </span>
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedCase.status)}`}>
                  {selectedCase.status}
                </span>
              </div>
              {selectedCase.description && (
                <div>
                  <span className="font-semibold">Descrição:</span>
                  <p className="mt-1 text-gray-700">{selectedCase.description}</p>
                </div>
              )}
              {selectedCase.location && (
                <div>
                  <span className="font-semibold">Local:</span> {selectedCase.location}
                </div>
              )}
              {selectedCase.reporter && (
                <div>
                  <span className="font-semibold">Denunciante:</span> {selectedCase.reporter}
                </div>
              )}
              <div>
                <span className="font-semibold">Data de Abertura:</span>{' '}
                {new Date(selectedCase.opening_date).toLocaleDateString('pt-BR')}
              </div>
              {selectedCase.confidential && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <span className="text-red-600 font-semibold">⚠️ Caso Confidencial</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedCase(null)}
              className="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Protective Measures Tab Component
const ProtectiveMeasuresTab: React.FC = () => {
  const [measures, setMeasures] = useState<ProtectiveMeasure[]>([]);
  const [cases, setCases] = useState<CREASCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [formData, setFormData] = useState({
    measure_description: '',
    responsible_institution: '',
    start_date: '',
    expected_end_date: ''
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      fetchMeasures(selectedCaseId);
    }
  }, [selectedCaseId]);

  const fetchCases = async () => {
    try {
      const response = await api.get('/creas-cases');
      setCases(response.data.data);
      setLoading(false);
    } catch (error) {
      addToast('Erro ao carregar casos', 'error');
      setLoading(false);
    }
  };

  const fetchMeasures = async (caseId: string) => {
    try {
      const response = await api.get(`/creas-cases/${caseId}/protective-measures`);
      setMeasures(response.data.data);
    } catch (error) {
      addToast('Erro ao carregar medidas protetivas', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) {
      addToast('Selecione um caso primeiro', 'error');
      return;
    }
    try {
      await api.post(`/creas-cases/${selectedCaseId}/protective-measures`, formData);
      addToast('Medida protetiva registrada com sucesso!', 'success');
      setShowForm(false);
      fetchMeasures(selectedCaseId);
      setFormData({
        measure_description: '',
        responsible_institution: '',
        start_date: '',
        expected_end_date: ''
      });
    } catch (error) {
      addToast('Erro ao registrar medida protetiva', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Ativa': 'bg-green-100 text-green-800',
      'Concluída': 'bg-blue-100 text-blue-800',
      'Revogada': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Medidas Protetivas</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione um Caso
        </label>
        <select
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
        >
          <option value="">Selecione um caso CREAS</option>
          {cases.map(c => (
            <option key={c.id} value={c.id}>
              {c.case_number} - {c.beneficiary_name || `Beneficiário ${c.beneficiary_id}`}
            </option>
          ))}
        </select>
      </div>

      {selectedCaseId && (
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? 'Cancelar' : 'Nova Medida Protetiva'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Medida *
                  </label>
                  <textarea
                    value={formData.measure_description}
                    onChange={(e) => setFormData({ ...formData, measure_description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instituição Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.responsible_institution}
                    onChange={(e) => setFormData({ ...formData, responsible_institution: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                    placeholder="Ex: Conselho Tutelar, Ministério Público"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previsão de Término
                  </label>
                  <input
                    type="date"
                    value={formData.expected_end_date}
                    onChange={(e) => setFormData({ ...formData, expected_end_date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Registrar Medida
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

          <div className="space-y-4">
            {measures.length > 0 ? (
              measures.map((measure) => (
                <div key={measure.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {measure.measure_description}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(measure.status)}`}>
                      {measure.status}
                    </span>
                  </div>
                  {measure.responsible_institution && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Responsável:</strong> {measure.responsible_institution}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <strong>Início:</strong> {new Date(measure.start_date).toLocaleDateString('pt-BR')}
                    {measure.expected_end_date && (
                      <> • <strong>Previsão:</strong> {new Date(measure.expected_end_date).toLocaleDateString('pt-BR')}</>
                    )}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma medida protetiva registrada para este caso
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Deadlines Tab Component
const DeadlinesTab: React.FC = () => {
  const [deadlines, setDeadlines] = useState<CaseDeadline[]>([]);
  const [cases, setCases] = useState<CREASCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [formData, setFormData] = useState({
    deadline_description: '',
    due_date: '',
    priority: 'Média',
    related_institution: ''
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchCases();
    fetchUpcomingDeadlines();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/creas-cases');
      setCases(response.data.data);
      setLoading(false);
    } catch (error) {
      addToast('Erro ao carregar casos', 'error');
      setLoading(false);
    }
  };

  const fetchUpcomingDeadlines = async () => {
    try {
      const response = await api.get('/case-deadlines/upcoming');
      setDeadlines(response.data.data);
    } catch (error) {
      addToast('Erro ao carregar prazos', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) {
      addToast('Selecione um caso primeiro', 'error');
      return;
    }
    try {
      await api.post(`/creas-cases/${selectedCaseId}/deadlines`, formData);
      addToast('Prazo judicial registrado com sucesso!', 'success');
      setShowForm(false);
      fetchUpcomingDeadlines();
      setFormData({
        deadline_description: '',
        due_date: '',
        priority: 'Média',
        related_institution: ''
      });
    } catch (error) {
      addToast('Erro ao registrar prazo', 'error');
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      'Baixa': 'bg-gray-100 text-gray-800',
      'Média': 'bg-yellow-100 text-yellow-800',
      'Alta': 'bg-orange-100 text-orange-800',
      'Urgente': 'bg-red-600 text-white'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Cumprido': 'bg-green-100 text-green-800',
      'Atrasado': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Prazos Judiciais</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Novo Prazo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caso Relacionado *
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Selecione um caso CREAS</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.case_number} - {c.beneficiary_name || `Beneficiário ${c.beneficiary_id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Prazo *
              </label>
              <textarea
                value={formData.deadline_description}
                onChange={(e) => setFormData({ ...formData, deadline_description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Limite *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instituição Relacionada
              </label>
              <input
                type="text"
                value={formData.related_institution}
                onChange={(e) => setFormData({ ...formData, related_institution: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                placeholder="Ex: Vara da Infância, Ministério Público"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Registrar Prazo
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

      <div className="space-y-4">
        {deadlines.length > 0 ? (
          deadlines.map((deadline) => {
            const daysUntil = getDaysUntil(deadline.due_date);
            return (
              <div
                key={deadline.id}
                className={`bg-white border-l-4 rounded-lg p-4 ${
                  daysUntil < 0 ? 'border-red-600' : daysUntil <= 7 ? 'border-orange-500' : 'border-green-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {deadline.deadline_description}
                    </h3>
                    {deadline.case_number && (
                      <p className="text-sm text-gray-600">
                        Caso: {deadline.case_number}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(deadline.priority)}`}>
                      {deadline.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(deadline.status)}`}>
                      {deadline.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm">
                    <span className="font-medium">Data Limite:</span>{' '}
                    {new Date(deadline.due_date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-sm">
                    {daysUntil < 0 ? (
                      <span className="text-red-600 font-semibold">
                        Atrasado {Math.abs(daysUntil)} dias
                      </span>
                    ) : daysUntil === 0 ? (
                      <span className="text-orange-600 font-semibold">
                        Vence hoje!
                      </span>
                    ) : daysUntil <= 7 ? (
                      <span className="text-orange-600 font-semibold">
                        {daysUntil} dias restantes
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        {daysUntil} dias restantes
                      </span>
                    )}
                  </div>
                </div>

                {deadline.related_institution && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Instituição:</strong> {deadline.related_institution}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum prazo judicial registrado
          </div>
        )}
      </div>
    </div>
  );
};

export default CREASManagementPage;
