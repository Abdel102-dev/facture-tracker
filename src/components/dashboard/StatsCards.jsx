import { PAYMENT_STATUS } from '../../types/project';
import { Wallet, Target, AlertCircle, FileText, CheckCircle, XCircle, Briefcase, Percent, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';

export function StatsCards({ projects }) {
  // KPI 1: Montant total des attachements
  const totalAttachements = projects.reduce((sum, p) => sum + (p.montantAttachement || 0), 0);

  // KPI 2: Total des montants HT
  const totalMontantHT = projects.reduce((sum, p) => sum + (p.montantHT || 0), 0);

  // KPI 3: Total montant HT des factures payés
  const totalPayes = projects
    .filter(p => p.statue1Facture === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + (p.montantHT || 0), 0);

  // KPI 4: Total Montant HT des factures impayés
  const totalImpayes = projects
    .filter(p => p.statue1Facture === PAYMENT_STATUS.UNPAID)
    .reduce((sum, p) => sum + (p.montantHT || 0), 0);

  // KPI 5: Nombre total des contrats
  const nombreContrats = new Set(projects.map(p => p.contratNo)).size;

  // KPI 6: Nombre total factures
  const nombreFactures = projects.length;

  // KPI 7: Nombre total des factures payées
  const nombreFacturesPayees = projects.filter(p => p.statue1Facture === PAYMENT_STATUS.PAID).length;

  // KPI 8: Nombre total des factures impayées
  const nombreFacturesImpayees = projects.filter(p => p.statue1Facture === PAYMENT_STATUS.UNPAID).length;

  // KPI 9: Taux de paiement
  const tauxPaiement = nombreFactures > 0 ? (nombreFacturesPayees / nombreFactures) * 100 : 0;

  // KPI 10: Différence HT - Attachement
  const differenceHTAttachement = totalMontantHT - totalAttachements;

  // KPI 11: Taux de variation HT/Attachement
  const tauxVariation = totalAttachements > 0 ? ((totalMontantHT - totalAttachements) / totalAttachements) * 100 : 0;

  const stats = [
    {
      title: 'Total Attachements',
      value: `${formatNumber(totalAttachements)} DH`,
      icon: Wallet,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Montant HT',
      value: `${formatNumber(totalMontantHT)} DH`,
      icon: Briefcase,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Total HT Payé',
      value: `${formatNumber(totalPayes)} DH`,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total HT Impayé',
      value: `${formatNumber(totalImpayes)} DH`,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Nombre de Contrats',
      value: nombreContrats.toString(),
      icon: Target,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Factures',
      value: nombreFactures.toString(),
      icon: FileText,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Factures Payées',
      value: nombreFacturesPayees.toString(),
      icon: CheckCircle,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Factures Impayées',
      value: nombreFacturesImpayees.toString(),
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Taux de Paiement',
      value: `${tauxPaiement.toFixed(1)}%`,
      icon: Percent,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Différence HT - Attachement',
      value: `${formatNumber(Math.abs(differenceHTAttachement))} DH`,
      subtitle: differenceHTAttachement >= 0 ? 'HT Supérieur' : 'HT Inférieur',
      icon: ArrowRightLeft,
      color: differenceHTAttachement >= 0 ? 'bg-purple-500' : 'bg-amber-500',
      textColor: differenceHTAttachement >= 0 ? 'text-purple-600' : 'text-amber-600',
      bgColor: differenceHTAttachement >= 0 ? 'bg-purple-50' : 'bg-amber-50'
    },
    {
      title: 'Taux Variation HT/Attachement',
      value: `${tauxVariation >= 0 ? '+' : ''}${tauxVariation.toFixed(2)}%`,
      icon: TrendingUp,
      color: tauxVariation >= 0 ? 'bg-violet-500' : 'bg-rose-500',
      textColor: tauxVariation >= 0 ? 'text-violet-600' : 'text-rose-600',
      bgColor: tauxVariation >= 0 ? 'bg-violet-50' : 'bg-rose-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">{stat.title}</p>
            <p className={`text-lg font-semibold ${stat.textColor}`}>{stat.value}</p>
            {stat.subtitle && (
              <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
