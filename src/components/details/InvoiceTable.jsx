import { useState } from 'react';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { PAYMENT_STATUS } from '../../types/project';
import { formatNumber } from '../../utils/formatNumber';
import { formatDate } from '../../utils/formatDate';

export function InvoiceTable({ invoices }) {
  const { updateProject, deleteProject } = useProjects();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (invoice) => {
    setEditingId(invoice.id);
    setEditData({ ...invoice });
  };

  const handleSave = () => {
    updateProject(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteProject(id);
    }
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contrat N°
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Site
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facture N°
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fournisseur
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant Attachement
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant HT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Facture
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Paiement
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commentaire
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => {
              const isEditing = editingId === invoice.id;
              const currentData = isEditing ? editData : invoice;

              return (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.contratNo}
                        onChange={(e) => handleChange('contratNo', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-medium">{invoice.contratNo}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.project}
                        onChange={(e) => handleChange('project', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      invoice.project
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.site}
                        onChange={(e) => handleChange('site', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      invoice.site
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.factureNo}
                        onChange={(e) => handleChange('factureNo', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-medium text-blue-600">{invoice.factureNo}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.fournisseur}
                        onChange={(e) => handleChange('fournisseur', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      invoice.fournisseur
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={currentData.montantAttachement}
                        onChange={(e) => handleChange('montantAttachement', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                      />
                    ) : (
                      <span className="text-gray-700">{formatNumber(invoice.montantAttachement)} DH</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={currentData.montantHT}
                        onChange={(e) => handleChange('montantHT', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{formatNumber(invoice.montantHT)} DH</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <select
                        value={currentData.statue1Facture || PAYMENT_STATUS.PAID}
                        onChange={(e) => handleChange('statue1Facture', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="">{currentData.statue1Facture || 'Sélectionner un statut'}</option>
                        <option value={PAYMENT_STATUS.PAID}>{PAYMENT_STATUS.PAID}</option>
                        <option value={PAYMENT_STATUS.TRANSMIS_TRESO}>{PAYMENT_STATUS.TRANSMIS_TRESO}</option>
                        <option value={PAYMENT_STATUS.EN_ORDONNANCEMENT}>{PAYMENT_STATUS.EN_ORDONNANCEMENT}</option>
                        <option value={PAYMENT_STATUS.EN_VALIDATION}>{PAYMENT_STATUS.EN_VALIDATION}</option>
                        <option value={PAYMENT_STATUS.MANQUE_RECEPTION}>{PAYMENT_STATUS.MANQUE_RECEPTION}</option>
                        <option value={PAYMENT_STATUS.REJECTED}>{PAYMENT_STATUS.REJECTED}</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.statue1Facture === PAYMENT_STATUS.PAID
                          ? 'bg-green-100 text-green-800'
                          : invoice.statue1Facture === PAYMENT_STATUS.TRANSMIS_TRESO
                          ? 'bg-blue-100 text-blue-800'
                          : invoice.statue1Facture === PAYMENT_STATUS.EN_ORDONNANCEMENT
                          ? 'bg-purple-100 text-purple-800'
                          : invoice.statue1Facture === PAYMENT_STATUS.EN_VALIDATION
                          ? 'bg-yellow-100 text-yellow-800'
                          : invoice.statue1Facture === PAYMENT_STATUS.MANQUE_RECEPTION
                          ? 'bg-orange-100 text-orange-800'
                          : invoice.statue1Facture === PAYMENT_STATUS.REJECTED
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.statue1Facture}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="date"
                        value={currentData.dateFacture}
                        onChange={(e) => handleChange('dateFacture', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      formatDate(invoice.dateFacture)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="date"
                        value={currentData.datePaiement}
                        onChange={(e) => handleChange('datePaiement', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      formatDate(invoice.datePaiement)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentData.commentaire}
                        onChange={(e) => handleChange('commentaire', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="text-gray-600">{invoice.commentaire || '-'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {isEditing ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleSave}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Sauvegarder"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="Annuler"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
