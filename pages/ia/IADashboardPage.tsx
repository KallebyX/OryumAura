import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { VulnerabilityPrediction, AIInsight, Beneficiary } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Users, RefreshCw } from 'lucide-react';

const IADashboardPage: React.FC = () => {
  const [predictions, setPredictions] = useState<VulnerabilityPrediction[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [predictionsRes, insightsRes, beneficiariesRes] = await Promise.all([
        api.get('/vulnerability-predictions'),
        api.get('/ai-insights'),
        api.get('/beneficiaries')
      ]);
      setPredictions(predictionsRes.data.data);
      setInsights(insightsRes.data.data);
      setBeneficiaries(beneficiariesRes.data.data);
    } catch (error) {
      addToast('Erro ao carregar dados da IA', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrediction = async () => {
    if (!selectedBeneficiary) {
      addToast('Selecione um beneficiário', 'error');
      return;
    }

    setGenerating(true);
    try {
      const response = await api.post(`/ai/predict-vulnerability/${selectedBeneficiary}`);
      addToast('Predição gerada com sucesso!', 'success');
      setPredictions([response.data.prediction, ...predictions]);
      setSelectedBeneficiary('');
    } catch (error) {
      addToast('Erro ao gerar predição', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateInsights = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/ai/generate-insights');
      addToast(`${response.data.insights.length} insights gerados!`, 'success');
      setInsights([...response.data.insights, ...insights]);
    } catch (error) {
      addToast('Erro ao gerar insights', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    const colors = {
      'Baixo': 'bg-green-100 text-green-800 border-green-300',
      'Médio': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Alto': 'bg-orange-100 text-orange-800 border-orange-300',
      'Crítico': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'vulnerability_pattern':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'benefit_trend':
        return <TrendingUp className="text-blue-600" size={20} />;
      case 'alert':
        return <AlertTriangle className="text-red-600" size={20} />;
      default:
        return <Lightbulb className="text-yellow-600" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="animate-pulse mx-auto mb-4 text-prefeitura-verde" size={48} />
          <p className="text-gray-600">Carregando inteligência artificial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Brain size={36} className="text-prefeitura-verde" />
          Inteligência Artificial
        </h1>
        <button
          onClick={handleGenerateInsights}
          disabled={generating}
          className="bg-prefeitura-verde hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={20} className={generating ? 'animate-spin' : ''} />
          Gerar Insights
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-green-700">Baixo Risco</h3>
            <Users size={20} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-800">
            {predictions.filter(p => p.risk_level === 'Baixo').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-yellow-700">Médio Risco</h3>
            <Users size={20} className="text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-800">
            {predictions.filter(p => p.risk_level === 'Médio').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-orange-700">Alto Risco</h3>
            <AlertTriangle size={20} className="text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-800">
            {predictions.filter(p => p.risk_level === 'Alto').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-red-700">Risco Crítico</h3>
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-800">
            {predictions.filter(p => p.risk_level === 'Crítico').length}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Predictions */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={24} className="text-orange-600" />
            Predições de Vulnerabilidade
          </h2>

          {/* Generate Prediction Form */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gerar Nova Predição
            </label>
            <div className="flex gap-2">
              <select
                value={selectedBeneficiary}
                onChange={(e) => setSelectedBeneficiary(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prefeitura-verde text-sm"
              >
                <option value="">Selecione um beneficiário</option>
                {beneficiaries.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <button
                onClick={handleGeneratePrediction}
                disabled={generating || !selectedBeneficiary}
                className="bg-prefeitura-verde hover:opacity-90 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50 text-sm"
              >
                {generating ? 'Gerando...' : 'Analisar'}
              </button>
            </div>
          </div>

          {/* Predictions List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {predictions.length > 0 ? (
              predictions.slice(0, 10).map((prediction) => (
                <div
                  key={prediction.id}
                  className={`bg-white p-4 rounded-lg border-2 ${getRiskLevelColor(prediction.risk_level)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Beneficiário ID: {prediction.beneficiary_id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Score: {(prediction.prediction_score * 100).toFixed(0)}%
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskLevelColor(prediction.risk_level)}`}>
                      {prediction.risk_level}
                    </span>
                  </div>

                  {prediction.factors && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Fatores:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {(typeof prediction.factors === 'string'
                          ? JSON.parse(prediction.factors)
                          : prediction.factors
                        ).map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prediction.recommendations && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Recomendações:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {(typeof prediction.recommendations === 'string'
                          ? JSON.parse(prediction.recommendations)
                          : prediction.recommendations
                        ).map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prediction.predicted_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(prediction.predicted_at).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma predição gerada ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb size={24} className="text-yellow-600" />
            Insights Gerados pela IA
          </h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {getInsightTypeIcon(insight.insight_type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {insight.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-2">
                        {insight.description}
                      </p>

                      {insight.actionable_recommendation && (
                        <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-500">
                          <p className="text-xs text-blue-800">
                            <strong>Ação Recomendada:</strong> {insight.actionable_recommendation}
                          </p>
                        </div>
                      )}

                      {insight.related_data && (
                        <div className="mt-2 text-xs text-gray-600">
                          <strong>Dados:</strong> {insight.related_data}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(insight.generated_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum insight gerado ainda</p>
                <button
                  onClick={handleGenerateInsights}
                  className="mt-4 text-sm text-prefeitura-verde hover:underline"
                >
                  Clique em "Gerar Insights" para começar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IADashboardPage;
