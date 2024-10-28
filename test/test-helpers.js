import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';
import enums from '../src/enums.js';

const xmlParser = new XMLParser({
  // We want to make sure collections of length 1 are still parsed as arrays
  isArray: (name, jpath, isLeafNode, isAttribute) => {
    const collectionNames = [
      'mur',
      'plancher_bas',
      'plancher_haut',
      'baie_vitree',
      'porte',
      'pont_thermique',
      'ventilation',
      'installation_ecs',
      'generateur_ecs',
      'climatisation',
      'installation_chauffage',
      'generateur_chauffage',
      'emetteur_chauffage',
      'sortie_par_energie'
    ];
    if (collectionNames.includes(name)) return true;
  },
  tagValueProcessor: (tagName, val) => {
    if (tagName.startsWith('enum_')) {
      // Preserve value as string for tags starting with "enum_"
      return null;
    }
    if (Number.isNaN(Number(val))) return val;
    return Number(val);
  }
});

export function getAdemeFileJson(ademeId) {
  const dpeRequestFile = `test/fixtures/${ademeId}.json`;
  const dpeFile = `test/fixtures/${ademeId}.xml`;
  let dpeRequest;

  if (fs.existsSync(dpeRequestFile)) {
    dpeRequest = JSON.parse(fs.readFileSync(dpeRequestFile, { encoding: 'utf8', flag: 'r' }));
  } else {
    const data = fs.readFileSync(dpeFile, { encoding: 'utf8', flag: 'r' });

    dpeRequest = xmlParser.parse(data).dpe;
    expect(dpeRequest).not.toBeUndefined();

    const dpeModele = enums.modele_dpe[dpeRequest.administratif.enum_modele_dpe_id];
    expect(dpeModele).toBe('dpe 3cl 2021 méthode logement');

    fs.writeFileSync(dpeRequestFile, JSON.stringify(dpeRequest));
  }

  return dpeRequest;
}

export function saveResultFile(ademeId, result) {
  const dpeResultFile = `test/fixtures/${ademeId}-result.json`;
  fs.writeFileSync(dpeResultFile, JSON.stringify(result));
}

export function getResultFile(ademeId) {
  const dpeResultFile = `test/fixtures/${ademeId}-result.json`;
  const data = fs.readFileSync(dpeResultFile, { encoding: 'utf8', flag: 'r' });
  return JSON.parse(data);
}

export function removeDIAndResult(dpe) {
  delete dpe.logement.sortie;
  delete dpe.logement.enveloppe.inertie;

  dpe.logement.enveloppe.mur_collection.mur?.map((m) => delete m.donnee_intermediaire);
  dpe.logement.enveloppe.baie_vitree_collection.baie_vitree?.map((m) => {
    delete m.baie_vitree_double_fenetre?.donnee_intermediaire;
    delete m.donnee_intermediaire;
  });
  dpe.logement.enveloppe.ets_collection.ets?.map((m) => {
    delete m.donnee_intermediaire;
  });
  dpe.logement.enveloppe.plancher_bas_collection.plancher_bas?.map(
    (m) => delete m.donnee_intermediaire
  );
  dpe.logement.enveloppe.plancher_haut_collection.plancher_haut?.map(
    (m) => delete m.donnee_intermediaire
  );
  dpe.logement.enveloppe.pont_thermique_collection.pont_thermique?.map(
    (m) => delete m.donnee_intermediaire
  );
  dpe.logement.enveloppe.porte_collection.porte?.map((m) => delete m.donnee_intermediaire);
  dpe.logement.climatisation_collection.climatisation?.map((m) => delete m.donnee_intermediaire);
  dpe.logement.ventilation_collection.ventilation?.map((m) => delete m.donnee_intermediaire);
  dpe.logement.ventilation_collection.ventilation?.map((m) => delete m.donnee_intermediaire);
  dpe.logement.installation_ecs_collection.installation_ecs?.map((m) => {
    m.generateur_ecs_collection.generateur_ecs?.map((n) => {
      delete n.donnee_intermediaire;
    });
    delete m.donnee_intermediaire;
  });
  dpe.logement.installation_chauffage_collection.installation_chauffage?.map((m) => {
    m.emetteur_chauffage_collection.emetteur_chauffage?.map((n) => {
      delete n.donnee_intermediaire;
    });
    m.generateur_chauffage_collection.generateur_chauffage?.map((n) => {
      delete n.donnee_intermediaire;
    });
    delete m.donnee_intermediaire;
  });
  delete dpe.logement.production_elec_enr?.donnee_intermediaire;
}
