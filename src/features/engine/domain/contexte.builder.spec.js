import { ContexteBuilder } from './contexte.builder.js';

describe('Generateur du contexte du calcul', () => {
  test('Contexte avec effet joule', () => {
    const dpe = {
      logement: {
        meteo: { enum_zone_climatique_id: 1 },
        caracteristique_generale: { enum_periode_construction_id: 1 },
        installation_chauffage_collection: {
          installation_chauffage: [
            {
              generateur_chauffage_collection: {
                generateur_chauffage: [{ donnee_entree: { enum_type_energie_id: '1' } }]
              }
            }
          ]
        }
      }
    };

    expect(ContexteBuilder.fromDpe(dpe)).toStrictEqual({
      effetJoule: true,
      enumPeriodeConstructionId: '1',
      zoneClimatiqueId: '1'
    });
  });

  test('Contexte sans effet joule', () => {
    const dpe = {
      logement: {
        meteo: { enum_zone_climatique_id: 1 },
        caracteristique_generale: { enum_periode_construction_id: 1 },
        installation_chauffage_collection: {
          installation_chauffage: [
            {
              generateur_chauffage_collection: {
                generateur_chauffage: [{ donnee_entree: { enum_type_energie_id: '2' } }]
              }
            }
          ]
        }
      }
    };

    expect(ContexteBuilder.fromDpe(dpe)).toStrictEqual({
      effetJoule: false,
      enumPeriodeConstructionId: '1',
      zoneClimatiqueId: '1'
    });
  });

  test('Contexte sans chauffage', () => {
    const dpe = {
      logement: {
        meteo: { enum_zone_climatique_id: 1 },
        caracteristique_generale: { enum_periode_construction_id: 1 }
      }
    };

    expect(ContexteBuilder.fromDpe(dpe)).toStrictEqual({
      effetJoule: false,
      enumPeriodeConstructionId: '1',
      zoneClimatiqueId: '1'
    });
  });

  test('Contexte sans generateur de chauffage', () => {
    const dpe = {
      logement: {
        meteo: { enum_zone_climatique_id: 1 },
        caracteristique_generale: { enum_periode_construction_id: 1 },
        installation_chauffage_collection: {}
      }
    };

    expect(ContexteBuilder.fromDpe(dpe)).toStrictEqual({
      effetJoule: false,
      enumPeriodeConstructionId: '1',
      zoneClimatiqueId: '1'
    });
  });
});
