import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PAYMENT_STATUS } from '../../types/project';
import { StatusBadge } from '../StatusBadge';
import { formatNumber } from '../../utils/formatNumber';

export function PaymentStatusChart({ projects }) {
  const payeAmount = projects
    .filter(p => p.statue1Facture === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + (p.montantHT || 0), 0);

  const nonPayeAmount = projects
    .filter(p => p.statue1Facture !== PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + (p.montantHT || 0), 0);

  const paymentData = [
    {
      name: 'Payé',
      value: projects.filter(p => p.statue1Facture === PAYMENT_STATUS.PAID).length,
      color: '#10b981',
      status: 'Payé',
      amount: payeAmount
    },
    {
      name: 'Non Payé',
      value: projects.filter(p => p.statue1Facture !== PAYMENT_STATUS.PAID).length,
      color: '#ef4444',
      status: 'Non Payé',
      amount: nonPayeAmount
    }
  ];

  const renderLabel = (entry) => {
    const percentage = ((entry.value / projects.length) * 100).toFixed(1);
    return `${entry.value} (${percentage}%)`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">
            Nombre: {data.value} factures
          </p>
          <p className="text-sm text-gray-600">
            Montant HT: {formatNumber(data.amount)} DH
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Statut de Paiement</h3>

      <div className="flex gap-4 mb-4 flex-wrap">
        {paymentData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <StatusBadge status={entry.status} type="payment" />
            <span className="text-sm text-gray-600">
              {entry.value} factures • {formatNumber(entry.amount)} DH
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={paymentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={85}
            fill="#8884d8"
            dataKey="value"
          >
            {paymentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
