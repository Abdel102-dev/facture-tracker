// Payment status constants
export const PAYMENT_STATUS = {
  PAID: 'Payé',
  TRANSMIS_TRESO: 'Transmis Tréso',
  EN_ORDONNANCEMENT: 'En Ordonnancement',
  EN_VALIDATION: 'En Validation',
  MANQUE_RECEPTION: 'Manque Réception',
  REJECTED: 'Rejeté'
};

// Invoice data structure with all fields from Excel
export const INVOICE_FIELDS = {
  CONTRAT_NO: 'contratNo',
  PROJECT: 'project',
  SITE: 'site',
  DESCRIPTION: 'description',
  MONTANT_ATTACHEMENT: 'montantAttachement',
  DATE_VALIDATION_ATT: 'dateValidationAtt',
  FACTURE_NO: 'factureNo',
  DATE_FACTURE: 'dateFacture',
  DATE_ECHEANCE: 'dateEcheance',
  DELAI_PAIEMENT: 'delaiPaiement',
  STATUS2: 'status2',
  MONTANT_HT: 'montantHT',
  STATUE1_FACTURE: 'statue1Facture',
  DATE_PAIEMENT: 'datePaiement',
  MOIS_PAIEMENT: 'moisPaiement',
  FOURNISSEUR: 'fournisseur',
  COMMENTAIRE: 'commentaire'
};
