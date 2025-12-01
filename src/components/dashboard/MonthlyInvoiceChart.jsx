import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/formatNumber';
import { PAYMENT_STATUS } from '../../types/project';

export function MonthlyInvoiceChart({ projects }) {
  // Group invoices by month from dateFacture
  const monthlyData = projects.reduce((acc, invoice) => {
    if (!invoice.dateFacture) return acc;

    const date = new Date(invoice.dateFacture);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const existing = acc.find(item => item.month === monthYear);
    if (existing) {
      existing.totalHT += invoice.montantHT;
      existing.totalAttachement += invoice.montantAttachement;
      existing.nombreFactures += 1;
      if (invoice.statue1Facture === PAYMENT_STATUS.PAID) {
        existing.paye += invoice.montantHT;
      }
    } else {
      acc.push({
        month: monthYear,
        totalHT: invoice.montantHT,
        totalAttachement: invoice.montantAttachement,
        nombreFactures: 1,
        paye: invoice.statue1Facture === PAYMENT_STATUS.PAID ? invoice.montantHT : 0
      });
    }
    return acc;
  }, []);

  // Sort by month
  const sortedData = monthlyData.sort((a, b) => a.month.localeCompare(b.month));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.month}</p>
          <p className="text-sm text-blue-600">
            Total HT: {formatNumber(payload[0].payload.totalHT)} DH
          </p>
          <p className="text-sm text-green-600">
            Payé: {formatNumber(payload[0].payload.paye)} DH
          </p>
          <p className="text-sm text-gray-600">
            Nombre: {payload[0].payload.nombreFactures}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution Mensuelle des Factures</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={10} />
          <YAxis tickFormatter={(value) => `${formatNumber(value)} DH`} fontSize={10} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="totalHT" stroke="#3b82f6" name="Total HT" strokeWidth={2} />
          <Line type="monotone" dataKey="paye" stroke="#10b981" name="Payé" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
