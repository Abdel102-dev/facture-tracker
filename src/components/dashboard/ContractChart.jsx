import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/formatNumber';
import { PAYMENT_STATUS } from '../../types/project';

export function ContractChart({ projects }) {
  // Group by contract and calculate totals
  const contractData = projects.reduce((acc, invoice) => {
    const existing = acc.find(item => item.contrat === invoice.contratNo);
    if (existing) {
      existing.totalHT += invoice.montantHT;
      existing.totalAttachement += invoice.montantAttachement;
      if (invoice.statue1Facture === PAYMENT_STATUS.PAID) {
        existing.paye += invoice.montantHT;
      } else {
        existing.nonPaye += invoice.montantHT;
      }
    } else {
      acc.push({
        contrat: invoice.contratNo,
        totalHT: invoice.montantHT,
        totalAttachement: invoice.montantAttachement,
        paye: invoice.statue1Facture === PAYMENT_STATUS.PAID ? invoice.montantHT : 0,
        nonPaye: invoice.statue1Facture !== PAYMENT_STATUS.PAID ? invoice.montantHT : 0
      });
    }
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.contrat}</p>
          <p className="text-sm text-green-600">
            Payé: {formatNumber(payload[0].value)} DH
          </p>
          <p className="text-sm text-red-600">
            Non Payé: {formatNumber(payload[1].value)} DH
          </p>
          <p className="text-sm text-gray-600">
            Total: {formatNumber(payload[0].payload.totalHT)} DH
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Paiements par Contrat</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={contractData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="contrat" fontSize={10} />
          <YAxis tickFormatter={(value) => `${formatNumber(value)} DH`} fontSize={10} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="paye" stackId="a" fill="#10b981" name="Payé" />
          <Bar dataKey="nonPaye" stackId="a" fill="#ef4444" name="Non Payé" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
