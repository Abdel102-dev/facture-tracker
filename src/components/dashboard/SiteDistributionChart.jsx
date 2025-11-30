import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '../../utils/formatNumber';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function SiteDistributionChart({ projects }) {
  // Group by site and calculate totals
  const siteData = projects.reduce((acc, invoice) => {
    const existing = acc.find(item => item.site === invoice.site);
    if (existing) {
      existing.montantHT += invoice.montantHT;
      existing.count += 1;
    } else {
      acc.push({
        site: invoice.site,
        montantHT: invoice.montantHT,
        count: 1
      });
    }
    return acc;
  }, []);

  // Sort by montantHT descending
  const sortedData = siteData.sort((a, b) => b.montantHT - a.montantHT);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{data.site}</p>
          <p className="text-sm text-gray-600">
            Montant HT: {formatNumber(data.montantHT)} DH
          </p>
          <p className="text-sm text-gray-600">
            Nombre de factures: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry) => {
    const totalAmount = sortedData.reduce((sum, item) => sum + item.montantHT, 0);
    const percentage = ((entry.montantHT / totalAmount) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Distribution par Site</h3>

      {/* Custom Legend with site names */}
      <div className="flex gap-3 mb-3 flex-wrap">
        {sortedData.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-xs text-gray-700">{entry.site}</span>
            <span className="text-xs text-gray-500">
              ({formatNumber(entry.montantHT)} DH)
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={90}
            fill="#8884d8"
            dataKey="montantHT"
            style={{ fontSize: 10 }}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
