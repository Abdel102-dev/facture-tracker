import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { PAYMENT_STATUS } from '../../types/project';
import { formatNumber } from '../../utils/formatNumber';
import { formatDate } from '../../utils/formatDate';
import { StatusBadge } from '../StatusBadge';

export function InvoiceTableEditable({ invoices }) {
  const { updateProject, deleteProject } = useProjects();
  const [editingCell, setEditingCell] = useState(null);

  const handleCellClick = (invoiceId, field) => {
    setEditingCell({ invoiceId, field });
  };

  const addAutomatedComment = (field, oldValue, newValue) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const fieldLabels = {
      contratNo: 'Contrat N°',
      project: 'Project',
      site: 'Site',
      description: 'Description',
      montantAttachement: 'Montant Attachement',
      dateValidationAtt: 'Date Validation ATT',
      factureNo: 'Facture N°',
      dateFacture: 'Date Facture',
      dateEcheance: 'Date Échéance',
      delaiPaiement: 'Délai Paiement',
      status2: 'Status2',
      montantHT: 'Montant HT',
      statue1Facture: 'Statue1 Facture',
      datePaiement: 'Date Paiement',
      moisPaiement: 'Mois Paiement',
      fournisseur: 'Fournisseur'
    };

    const label = fieldLabels[field] || field;
    return `[${timestamp}] ${label}: ${oldValue || '-'} → ${newValue || '-'}`;
  };

  const calculateDateEcheance = (dateFacture, delaiPaiement) => {
    if (!dateFacture || !delaiPaiement) return '';

    const date = new Date(dateFacture);
    const delai = parseInt(delaiPaiement);

    if (isNaN(delai)) return '';

    date.setDate(date.getDate() + delai);
    return date.toISOString().split('T')[0];
  };

  const calculateDelaiPaiement = (dateFacture, dateEcheance) => {
    if (!dateFacture || !dateEcheance) return '';

    const factureDate = new Date(dateFacture);
    const echeanceDate = new Date(dateEcheance);

    const diffTime = echeanceDate - factureDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays.toString();
  };

  const handleCellBlur = (invoice, field, newValue) => {
    const oldValue = invoice[field];

    // Remove 'j' suffix from delaiPaiement if present
    if (field === 'delaiPaiement' && typeof newValue === 'string') {
      newValue = newValue.replace(/j$/i, '');
    }

    if (oldValue !== newValue) {
      const updates = { [field]: newValue };
      const comments = [];

      // Auto-calculate Date Échéance when Date Facture or Délai Paiement changes
      if (field === 'dateFacture' || field === 'delaiPaiement') {
        const dateFacture = field === 'dateFacture' ? newValue : invoice.dateFacture;
        const delaiPaiement = field === 'delaiPaiement' ? newValue : invoice.delaiPaiement;

        const newDateEcheance = calculateDateEcheance(dateFacture, delaiPaiement);
        if (newDateEcheance && newDateEcheance !== invoice.dateEcheance) {
          updates.dateEcheance = newDateEcheance;
          comments.push(`${addAutomatedComment('dateEcheance', invoice.dateEcheance, newDateEcheance)} (calculé automatiquement)`);
        }
      }

      // Auto-calculate Délai Paiement when Date Échéance changes
      if (field === 'dateEcheance') {
        const dateFacture = invoice.dateFacture;
        const dateEcheance = newValue;

        const newDelaiPaiement = calculateDelaiPaiement(dateFacture, dateEcheance);
        if (newDelaiPaiement && newDelaiPaiement !== invoice.delaiPaiement) {
          updates.delaiPaiement = newDelaiPaiement;
          comments.push(`${addAutomatedComment('delaiPaiement', invoice.delaiPaiement, newDelaiPaiement)} jours (calculé automatiquement)`);
        }
      }

      // Add automated comment for the field that was edited
      comments.push(addAutomatedComment(field, oldValue, newValue));

      // Build final comment
      const existingComment = invoice.commentaire || '';
      const newComments = comments.join('\n');
      updates.commentaire = existingComment ? `${existingComment}\n${newComments}` : newComments;

      updateProject(invoice.id, updates);
    }

    setEditingCell(null);
  };

  const handleKeyDown = (e, invoice, field) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteProject(id);
    }
  };

  const EditableCell = ({ invoice, field, type = 'text', options = null }) => {
    const isEditing = editingCell?.invoiceId === invoice.id && editingCell?.field === field;
    let value = invoice[field];

    // Remove 'j' suffix from delaiPaiement for display
    if (field === 'delaiPaiement' && typeof value === 'string') {
      value = value.replace(/j$/i, '');
    }

    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            autoFocus
            defaultValue={value}
            onBlur={(e) => handleCellBlur(invoice, field, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, invoice, field)}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none"
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      } else if (type === 'number') {
        return (
          <input
            type="number"
            autoFocus
            defaultValue={value}
            onBlur={(e) => handleCellBlur(invoice, field, parseFloat(e.target.value) || 0)}
            onKeyDown={(e) => handleKeyDown(e, invoice, field)}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none text-right"
          />
        );
      } else if (type === 'date') {
        return (
          <input
            type="date"
            autoFocus
            defaultValue={value || ''}
            onBlur={(e) => handleCellBlur(invoice, field, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, invoice, field)}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none"
          />
        );
      } else {
        return (
          <input
            type="text"
            autoFocus
            defaultValue={value}
            onBlur={(e) => handleCellBlur(invoice, field, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, invoice, field)}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none"
          />
        );
      }
    }

    // Display mode with status badge for status fields
    if (field === 'statue1Facture') {
      return (
        <div
          onClick={() => handleCellClick(invoice.id, field)}
          className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded min-h-[2rem]"
        >
          {value ? <StatusBadge status={value} type="payment" /> : '-'}
        </div>
      );
    }

    if (field === 'status2') {
      return (
        <div
          onClick={() => handleCellClick(invoice.id, field)}
          className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded min-h-[2rem]"
        >
          {value ? <StatusBadge status={value} type="due" /> : '-'}
        </div>
      );
    }

    return (
      <div
        onClick={() => handleCellClick(invoice.id, field)}
        className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded min-h-[2rem]"
      >
        {type === 'number'
          ? (value ? formatNumber(value) + ' DH' : '0 DH')
          : type === 'date'
            ? formatDate(value)
            : (value || '-')}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)]" style={{ scrollbarGutter: 'stable' }}>
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="bg-gray-50 sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r-2 border-gray-300 w-[140px] min-w-[140px] max-w-[140px]">Contrat N°</th>
              <th className="sticky left-[140px] z-30 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r-2 border-gray-300 w-[160px] min-w-[160px] max-w-[160px]">Project</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Site</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Description</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Montant ATT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date Valid. ATT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Facture N°</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date Facture</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date Échéance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Délai</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status2</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Montant HT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date Paiement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Mois</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Fournisseur</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
              <th className="sticky right-0 z-30 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-gray-50 border-l border-gray-200 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 group">
                <td className="sticky left-0 z-10 px-4 py-2 text-sm bg-white group-hover:bg-gray-50 border-r-2 border-gray-300 whitespace-nowrap w-[140px] min-w-[140px] max-w-[140px] overflow-hidden">
                  <EditableCell invoice={invoice} field="contratNo" />
                </td>
                <td className="sticky left-[140px] z-10 px-4 py-2 text-sm bg-white group-hover:bg-gray-50 border-r-2 border-gray-300 whitespace-nowrap w-[160px] min-w-[160px] max-w-[160px] overflow-hidden">
                  <EditableCell invoice={invoice} field="project" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="site" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="description" />
                </td>
                <td className="px-4 py-2 text-sm text-right whitespace-nowrap">
                  <EditableCell invoice={invoice} field="montantAttachement" type="number" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="dateValidationAtt" type="date" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="factureNo" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="dateFacture" type="date" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="dateEcheance" type="date" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="delaiPaiement" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell
                    invoice={invoice}
                    field="status2"
                    type="select"
                    options={['Echue', 'Non Echue']}
                  />
                </td>
                <td className="px-4 py-2 text-sm text-right font-semibold whitespace-nowrap">
                  <EditableCell invoice={invoice} field="montantHT" type="number" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell
                    invoice={invoice}
                    field="statue1Facture"
                    type="select"
                    options={[
                      PAYMENT_STATUS.PAID,
                      PAYMENT_STATUS.TRANSMIS_TRESO,
                      PAYMENT_STATUS.EN_ORDONNANCEMENT,
                      PAYMENT_STATUS.EN_VALIDATION,
                      PAYMENT_STATUS.MANQUE_RECEPTION,
                      PAYMENT_STATUS.REJECTED
                    ]}
                  />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="datePaiement" type="date" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="moisPaiement" />
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <EditableCell invoice={invoice} field="fournisseur" />
                </td>
                <td className="px-4 py-2 text-sm min-w-[400px] max-w-[600px]">
                  <div className="text-gray-600 text-xs whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                    {invoice.commentaire || '-'}
                  </div>
                </td>
                <td className="sticky right-0 z-10 px-4 py-2 text-sm text-right bg-white group-hover:bg-gray-50 border-l border-gray-200 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
