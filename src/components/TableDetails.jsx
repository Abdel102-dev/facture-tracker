import { useMemo } from 'react';
import { Header } from './Header';
import { useProjects } from '../context/ProjectContext';
import { InvoiceTableEditable } from './details/InvoiceTableEditable';
import { Filters } from './dashboard/Filters';
import { Upload, Download, Plus } from 'lucide-react';
import { excelDateToJSDate } from '../utils/formatDate';
import { PAYMENT_STATUS } from '../types/project';
import * as XLSX from 'xlsx-js-style';

export function TableDetails() {
  const { projects, setProjects, addProject, filters, setFilters } = useProjects();

  const filteredProjects = useMemo(() => {
    return projects.filter(invoice => {
      // Multi-select filters
      if (filters.contrats.length > 0 && !filters.contrats.includes(invoice.contratNo)) return false;
      if (filters.projects.length > 0 && !filters.projects.includes(invoice.project)) return false;
      if (filters.sites.length > 0 && !filters.sites.includes(invoice.site)) return false;
      if (filters.factures.length > 0 && !filters.factures.includes(invoice.factureNo)) return false;
      if (filters.fournisseurs.length > 0 && !filters.fournisseurs.includes(invoice.fournisseur)) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          invoice.contratNo.toLowerCase().includes(searchLower) ||
          invoice.project.toLowerCase().includes(searchLower) ||
          invoice.site.toLowerCase().includes(searchLower) ||
          invoice.factureNo.toLowerCase().includes(searchLower) ||
          invoice.fournisseur.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [projects, filters]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames.find(name => name === 'T_Facturation') || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const parsedInvoices = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row[0]) continue;

        const invoice = {
          id: `imported-${Date.now()}-${i}`,
          contratNo: row[0]?.toString() || '',
          project: row[1]?.toString() || '',
          site: row[2]?.toString() || '',
          description: row[3]?.toString() || '',
          montantAttachement: parseFloat(row[4]) || 0,
          dateValidationAtt: excelDateToJSDate(row[5]) || '',
          factureNo: row[6]?.toString() || '',
          dateFacture: excelDateToJSDate(row[7]) || '',
          dateEcheance: excelDateToJSDate(row[8]) || '',
          delaiPaiement: row[9]?.toString() || '',
          status2: row[10]?.toString() || '',
          montantHT: parseFloat(row[11]) || 0,
          statue1Facture: row[12]?.toString() || '',
          datePaiement: excelDateToJSDate(row[13]) || '',
          moisPaiement: row[14]?.toString() || '',
          fournisseur: row[15]?.toString() || '',
          commentaire: row[16]?.toString() || ''
        };

        parsedInvoices.push(invoice);
      }

      setProjects(parsedInvoices);
    };

    reader.readAsBinaryString(file);
    event.target.value = '';
  };

  const handleDownload = () => {
    const headers = [
      'Contrat N°', 'Project', 'Site', 'Description', 'Montant Attachement',
      'Date Validation ATT', 'Facture N°', 'Date Facture', 'Date Échéance',
      'Délai Paiement', 'Status2', 'Montant HT', 'Statue1 Facture',
      'Date Paiement', 'Mois Paiement', 'Fournisseur', 'Commentaire'
    ];

    const data = filteredProjects.map(invoice => [
      invoice.contratNo,
      invoice.project,
      invoice.site,
      invoice.description,
      invoice.montantAttachement,
      invoice.dateValidationAtt,
      invoice.factureNo,
      invoice.dateFacture,
      invoice.dateEcheance,
      invoice.delaiPaiement,
      invoice.status2,
      invoice.montantHT,
      invoice.statue1Facture,
      invoice.datePaiement,
      invoice.moisPaiement,
      invoice.fournisseur,
      invoice.commentaire
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'T_Facturation');
    XLSX.writeFile(wb, `factures_details_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleAddProject = () => {
    const newInvoice = {
      id: `new-${Date.now()}`,
      contratNo: '',
      project: 'Nouvelle Facture',
      site: '',
      description: '',
      montantAttachement: 0,
      dateValidationAtt: '',
      factureNo: '',
      dateFacture: '',
      dateEcheance: '',
      delaiPaiement: '30',
      status2: '',
      montantHT: 0,
      statue1Facture: PAYMENT_STATUS.EN_VALIDATION,
      datePaiement: '',
      moisPaiement: '',
      fournisseur: '',
      commentaire: ''
    };
    addProject(newInvoice);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-900">Détails des Factures</h2>
              <p className="text-gray-600 mt-1">Visualisez et modifiez les données des factures</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une facture
              </button>

              <label className="px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importer Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger Excel
              </button>
            </div>
          </div>

          <Filters filters={filters} setFilters={setFilters} projects={projects} />
        </div>

        <InvoiceTableEditable invoices={filteredProjects} />
      </main>
    </div>
  );
}
