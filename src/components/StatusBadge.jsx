export function StatusBadge({ status, type = 'payment' }) {
  const getStatusConfig = () => {
    if (type === 'payment') {
      // statue1Facture: Payé / Transmis Tréso / En Ordonnancement / En Validation / Manque Réception / Rejeté / Non Payé
      switch (status) {
        case 'Payé':
          return {
            color: 'bg-green-500',
            textColor: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
          };
        case 'Non Payé':
          return {
            color: 'bg-red-500',
            textColor: 'text-red-700',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          };
        case 'Transmis Tréso':
          return {
            color: 'bg-blue-500',
            textColor: 'text-blue-700',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
          };
        case 'En Ordonnancement':
          return {
            color: 'bg-purple-500',
            textColor: 'text-purple-700',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
          };
        case 'En Validation':
          return {
            color: 'bg-yellow-500',
            textColor: 'text-yellow-700',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
          };
        case 'Manque Réception':
          return {
            color: 'bg-orange-500',
            textColor: 'text-orange-700',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
          };
        case 'Rejeté':
          return {
            color: 'bg-red-500',
            textColor: 'text-red-700',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          };
        default:
          return {
            color: 'bg-gray-500',
            textColor: 'text-gray-700',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200'
          };
      }
    } else if (type === 'due') {
      // status2: Echue / Non Echue
      if (status === 'Echue') {
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      } else {
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      }
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
      <span className={`w-2 h-2 rounded-full ${config.color}`}></span>
      {status}
    </span>
  );
}
