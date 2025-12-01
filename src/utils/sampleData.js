import { PAYMENT_STATUS } from '../types/project';

// Generate sample invoice data based on the column descriptions
export function generateSampleInvoices() {
  const contracts = [
    'Cde1000-2024', 'Cde1001-2024', 'Cde1002-2024', 'Cde1003-2024', 'Cde1004-2024',
    'Cde1005-2025', 'Cde1006-2025', 'Cde1007-2024', 'Cde1008-2025', 'Cde1009-2024',
    'Cde1010-2025', 'Cde1011-2024', 'Cde1012-2025', 'Cde1013-2024', 'Cde1014-2025'
  ];

  const projects = [
    'Projet Alpha - Modernisation Réseau',
    'Projet Beta - Infrastructure IT',
    'Projet Gamma - Extension Bâtiment',
    'Projet Delta - Maintenance Préventive',
    'Projet Epsilon - Sécurité Périmétrique',
    'Projet Zeta - Rénovation Bureaux',
    'Projet Eta - Installation Climatisation',
    'Projet Theta - Système Électrique',
    'Projet Iota - Aménagement Parking',
    'Projet Kappa - Fibre Optique'
  ];

  const sites = [
    'Jorf Lasfar', 'Safi', 'Laayoune', 'Casablanca', 'Rabat',
    'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès',
    'Oujda', 'Tétouan', 'Kenitra', 'El Jadida', 'Mohammedia'
  ];

  const descriptions = [
    'Fourniture matériel électrique basse tension',
    'Prestation de service maintenance préventive',
    'Travaux de construction et génie civil',
    'Installation équipements de sécurité',
    'Fourniture et pose câblage réseau',
    'Étude et conception architecture',
    'Rénovation et mise aux normes',
    'Installation systèmes HVAC',
    'Travaux de peinture et finition',
    'Fourniture mobilier de bureau',
    'Installation caméras surveillance',
    'Mise en place système anti-incendie',
    'Travaux d\'éclairage LED',
    'Installation panneaux solaires',
    'Aménagement espaces verts',
    'Fourniture et installation ascenseurs',
    'Réfection toiture et étanchéité',
    'Installation système de contrôle d\'accès',
    'Travaux de plomberie et sanitaire',
    'Fourniture onduleurs et batteries'
  ];

  const suppliers = [
    'SARL TechnoElec', 'Entreprise BatiPro', 'STE Maintenance Plus',
    'SARL Équipements Modernes', 'Groupe Construction Delta',
    'STE Services Intégrés', 'SARL Innovation Tech',
    'Entreprise Travaux Sud', 'STE Électricité Générale',
    'SARL Aménagement Expert', 'Groupe Ingénierie Pro',
    'STE Fournitures Industrielles', 'SARL Sécurité Systems',
    'Entreprise Rénovation Plus', 'STE EnergiTech'
  ];

  const paymentTerms = ['15', '30', '45', '60', '90', '120'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const sampleData = [];
  let factureCounter = 1;

  // Generate 500 sample invoices for more data variety
  for (let i = 0; i < 500; i++) {
    const dateValidation = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const dateFacture = new Date(dateValidation);
    dateFacture.setDate(dateFacture.getDate() + Math.floor(Math.random() * 5) + 1);

    const paymentTerm = paymentTerms[Math.floor(Math.random() * paymentTerms.length)];
    const delayDays = parseInt(paymentTerm);

    const dateEcheance = new Date(dateFacture);
    dateEcheance.setDate(dateEcheance.getDate() + delayDays);

    // Distribute status across all 6 values
    const statusRandom = Math.random();
    let statue1Facture;
    let datePaiement = '';
    let moisPaiement = '';

    if (statusRandom < 0.35) {
      // 35% Payé
      statue1Facture = PAYMENT_STATUS.PAID;
      const paymentDate = new Date(dateFacture);
      const paymentDelay = Math.random() > 0.7 ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * delayDays);
      paymentDate.setDate(paymentDate.getDate() + paymentDelay);
      datePaiement = formatDate(paymentDate);
      moisPaiement = months[paymentDate.getMonth()];
    } else if (statusRandom < 0.53) {
      // 18% Transmis Tréso
      statue1Facture = PAYMENT_STATUS.TRANSMIS_TRESO;
    } else if (statusRandom < 0.69) {
      // 16% En Ordonnancement
      statue1Facture = PAYMENT_STATUS.EN_ORDONNANCEMENT;
    } else if (statusRandom < 0.82) {
      // 13% En Validation
      statue1Facture = PAYMENT_STATUS.EN_VALIDATION;
    } else if (statusRandom < 0.93) {
      // 11% Manque Réception
      statue1Facture = PAYMENT_STATUS.MANQUE_RECEPTION;
    } else {
      // 7% Rejeté
      statue1Facture = PAYMENT_STATUS.REJECTED;
    }

    const now = new Date();
    const isPaid = statue1Facture === PAYMENT_STATUS.PAID;
    const isOverdue = !isPaid && dateEcheance < now;
    const status2 = isOverdue ? 'Echue' : 'Non Echue';

    const montantAttachement = Math.floor(Math.random() * 500000) + 50000;
    const montantHT = montantAttachement * (0.9 + Math.random() * 0.2); // HT amount varies slightly from attachment

    const invoice = {
      id: `inv-${i + 1}`,
      contratNo: contracts[Math.floor(Math.random() * contracts.length)],
      project: projects[Math.floor(Math.random() * projects.length)],
      site: sites[Math.floor(Math.random() * sites.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      montantAttachement: Math.round(montantAttachement),
      dateValidationAtt: formatDate(dateValidation),
      factureNo: `Fact${String(factureCounter++).padStart(3, '0')}`,
      dateFacture: formatDate(dateFacture),
      dateEcheance: formatDate(dateEcheance),
      delaiPaiement: paymentTerm,
      status2: status2,
      montantHT: Math.round(montantHT),
      statue1Facture: statue1Facture,
      datePaiement: datePaiement,
      moisPaiement: moisPaiement,
      fournisseur: suppliers[Math.floor(Math.random() * suppliers.length)],
      commentaire: generateComment(statue1Facture)
    };

    sampleData.push(invoice);
  }

  return sampleData;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateComment(status) {
  if (Math.random() > 0.6) return ''; // 40% have comments

  const comments = {
    [PAYMENT_STATUS.PAID]: [
      'Paiement effectué dans les délais',
      'Payé par virement bancaire',
      'Règlement conforme',
      'Paiement validé'
    ],
    [PAYMENT_STATUS.TRANSMIS_TRESO]: [
      'Envoyé à la trésorerie le ' + new Date().toLocaleDateString('fr-FR'),
      'En cours de traitement par la trésorerie',
      'Transmis pour paiement',
      'Dossier complet transmis'
    ],
    [PAYMENT_STATUS.EN_ORDONNANCEMENT]: [
      'En cours d\'ordonnancement',
      'Validation comptable en attente',
      'Ordre de paiement en préparation',
      'En cours de traitement'
    ],
    [PAYMENT_STATUS.EN_VALIDATION]: [
      'En attente de validation hiérarchique',
      'Documents en cours de vérification',
      'Validation niveau 1 effectuée',
      'En attente signature'
    ],
    [PAYMENT_STATUS.MANQUE_RECEPTION]: [
      'Bon de réception manquant',
      'Documents incomplets',
      'En attente PV de réception',
      'Pièces justificatives à compléter'
    ],
    [PAYMENT_STATUS.REJECTED]: [
      'Facture rejetée - non conforme',
      'Documents incomplets - à refaire',
      'Montant non justifié',
      'Rejet pour anomalie comptable'
    ]
  };

  const statusComments = comments[status] || [''];
  return statusComments[Math.floor(Math.random() * statusComments.length)];
}

// Export sample data for immediate use
export const SAMPLE_INVOICES = generateSampleInvoices();
