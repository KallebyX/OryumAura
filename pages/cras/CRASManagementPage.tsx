import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HomeVisit, PAIFActivity, SCFVEnrollment, Beneficiary } from '../../types';
import { useToast } from '../../context/ToastContext';
import { MapPin, Users, GraduationCap, Plus, Calendar, X } from 'lucide-react';

const CRASManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visits' | 'paif' | 'scfv'>('visits');
  const { addToast } = useToast();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-slide-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão CRAS</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('visits')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'visits'
              ? 'border-b-2 border-prefeitura-verde text-prefeitura-verde'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MapPin size={20} />
          Visitas Domiciliares
        </button>
        <button
          onClick={() => setActiveTab('paif')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'paif'
              ? 'border-b-2 border-prefeitura-verde text-prefeitura-verde'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={20} />
          Atividades PAIF
        </button>
        <button
          onClick={() => setActiveTab('scfv')}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'scfv'
              ? 'border-b-2 border-prefeitura-verde text-prefeitura-verde'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <GraduationCap size={20} />
          SCFV
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'visits' && <HomeVisitsTab />}
      {activeTab === 'paif' && <PAIFActivitiesTab />}
      {activeTab === 'scfv' && <SCFVTab />}
    </div>
  );
};

// Home Visits Tab Component
const HomeVisitsTab: React.FC = () => {
  const [visits, setVisits] = useState<HomeVisit[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    beneficiary_id: '',
    visit_date: '',
    address: '',
    latitude: '',
    longitude: '',
    observations: '',
    housing_conditions: '',
    sanitation: '',
    vulnerabilities: '',
    family_composition: ''
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchVisits();
    fetchBeneficiaries();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await api.get('/home-visits');
      setVisits(response.data.data);
    } catch (error) {
      addToast('Erro ao carregar visitas', 'error');
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
      await api.post('/home-visits', {
        ...formData,
        beneficiary_id: parseInt(formData.beneficiary_id),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      });
      addToast('Visita registrada com sucesso!', 'success');
      setShowForm(false);
      fetchVisits();
      setFormData({
        beneficiary_id: '',
        visit_date: '',
        address: '',
        latitude: '',
        longitude: '',
        observations: '',
        housing_conditions: '',
        sanitation: '',
        vulnerabilities: '',
        family_composition: ''
      });
    } catch (error) {
      addToast('Erro ao registrar visita', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Agendada': 'bg-yellow-100 text-yellow-800',
      'Realizada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Visitas Domiciliares</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Nova Visita'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiário *
              </label>
              <select
                value={formData.beneficiary_id}
                onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
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
                Data e Hora da Visita *
              </label>
              <input
                type="datetime-local"
                value={formData.visit_date}
                onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude (GPS)
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                placeholder="-30.5091"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude (GPS)
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                placeholder="-53.4912"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Composição Familiar
              </label>
              <textarea
                value={formData.family_composition}
                onChange={(e) => setFormData({ ...formData, family_composition: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condições Habitacionais
              </label>
              <textarea
                value={formData.housing_conditions}
                onChange={(e) => setFormData({ ...formData, housing_conditions: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condições de Saneamento
              </label>
              <textarea
                value={formData.sanitation}
                onChange={(e) => setFormData({ ...formData, sanitation: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vulnerabilidades Identificadas
              </label>
              <textarea
                value={formData.vulnerabilities}
                onChange={(e) => setFormData({ ...formData, vulnerabilities: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg"
            >
              Registrar Visita
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
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Beneficiário</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Data</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Endereço</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Status</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">GPS</th>
            </tr>
          </thead>
          <tbody>
            {visits.length > 0 ? (
              visits.map((visit) => (
                <tr key={visit.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{visit.beneficiary_name || `ID: ${visit.beneficiary_id}`}</td>
                  <td className="py-3 px-4">
                    {new Date(visit.visit_date).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">{visit.address}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(visit.status)}`}>
                      {visit.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {visit.latitude && visit.longitude ? (
                      <MapPin size={16} className="text-green-600" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhuma visita registrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PAIF Activities Tab Component
const PAIFActivitiesTab: React.FC = () => {
  const [activities, setActivities] = useState<PAIFActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    activity_name: '',
    activity_type: 'Oficina',
    description: '',
    start_date: '',
    end_date: '',
    target_audience: '',
    facilitator: '',
    location: ''
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/paif-activities');
      setActivities(response.data.data);
    } catch (error) {
      addToast('Erro ao carregar atividades', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/paif-activities', formData);
      addToast('Atividade PAIF criada com sucesso!', 'success');
      setShowForm(false);
      fetchActivities();
      setFormData({
        activity_name: '',
        activity_type: 'Oficina',
        description: '',
        start_date: '',
        end_date: '',
        target_audience: '',
        facilitator: '',
        location: ''
      });
    } catch (error) {
      addToast('Erro ao criar atividade', 'error');
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Atividades PAIF</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Nova Atividade'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Atividade *
              </label>
              <input
                type="text"
                value={formData.activity_name}
                onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Atividade *
              </label>
              <select
                value={formData.activity_type}
                onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                required
              >
                <option value="Oficina">Oficina</option>
                <option value="Palestra">Palestra</option>
                <option value="Grupo">Grupo</option>
                <option value="Atendimento Individual">Atendimento Individual</option>
                <option value="Visita">Visita</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                rows={3}
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Término
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Público-Alvo
              </label>
              <input
                type="text"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                placeholder="Ex: Famílias em vulnerabilidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facilitador/Responsável
              </label>
              <input
                type="text"
                value={formData.facilitator}
                onChange={(e) => setFormData({ ...formData, facilitator: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg"
            >
              Criar Atividade
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{activity.activity_name}</h3>
              <span className="inline-block bg-prefeitura-verde text-white text-xs px-2 py-1 rounded mb-2">
                {activity.activity_type}
              </span>
              {activity.description && (
                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar size={14} />
                <span>{new Date(activity.start_date).toLocaleDateString('pt-BR')}</span>
              </div>
              {activity.facilitator && (
                <p className="text-sm text-gray-500">Facilitador: {activity.facilitator}</p>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            Nenhuma atividade PAIF cadastrada
          </div>
        )}
      </div>
    </div>
  );
};

// SCFV Tab Component
const SCFVTab: React.FC = () => {
  const [enrollments, setEnrollments] = useState<SCFVEnrollment[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    beneficiary_id: '',
    age_group: '0-6 anos',
    enrollment_date: '',
    modality: '',
    observations: ''
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchEnrollments();
    fetchBeneficiaries();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/scfv-enrollments');
      setEnrollments(response.data.data);
    } catch (error) {
      addToast('Erro ao carregar inscrições SCFV', 'error');
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
      await api.post('/scfv-enrollments', {
        ...formData,
        beneficiary_id: parseInt(formData.beneficiary_id)
      });
      addToast('Inscrição SCFV realizada com sucesso!', 'success');
      setShowForm(false);
      fetchEnrollments();
      setFormData({
        beneficiary_id: '',
        age_group: '0-6 anos',
        enrollment_date: '',
        modality: '',
        observations: ''
      });
    } catch (error) {
      addToast('Erro ao realizar inscrição', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Ativo': 'bg-green-100 text-green-800',
      'Inativo': 'bg-gray-100 text-gray-800',
      'Concluído': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          SCFV - Serviço de Convivência e Fortalecimento de Vínculos
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Nova Inscrição'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiário *
              </label>
              <select
                value={formData.beneficiary_id}
                onChange={(e) => setFormData({ ...formData, beneficiary_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
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
                Faixa Etária *
              </label>
              <select
                value={formData.age_group}
                onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                required
              >
                <option value="0-6 anos">0-6 anos</option>
                <option value="6-15 anos">6-15 anos</option>
                <option value="15-17 anos">15-17 anos</option>
                <option value="18-59 anos">18-59 anos</option>
                <option value="60+ anos">60+ anos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Inscrição *
              </label>
              <input
                type="date"
                value={formData.enrollment_date}
                onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade
              </label>
              <input
                type="text"
                value={formData.modality}
                onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                placeholder="Ex: Grupos de Convivência"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg"
            >
              Realizar Inscrição
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
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Beneficiário</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Faixa Etária</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Data Inscrição</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Modalidade</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{enrollment.beneficiary_name || `ID: ${enrollment.beneficiary_id}`}</td>
                  <td className="py-3 px-4">{enrollment.age_group}</td>
                  <td className="py-3 px-4">
                    {new Date(enrollment.enrollment_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">{enrollment.modality || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(enrollment.status)}`}>
                      {enrollment.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhuma inscrição SCFV registrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRASManagementPage;
