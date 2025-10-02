-- Fix Hugo Personality Types to match the official Hugo System Guide
-- This script updates the personality types to the correct German/English names

-- Delete old incorrect types
DELETE FROM hugo_personality_types;

-- Insert correct Hugo personality types based on the official guide
INSERT INTO hugo_personality_types (code, name, dimension, description, strengths, development_areas, ideal_roles, communication_style, team_contribution, color_primary, color_secondary) VALUES

-- VISION Dimension
('V1','Der Wegweiser / The Pathfinder','Vision','Zeigt den Weg zu einer besseren Zukunft. Natürlicher Stratege, der komplexe Situationen durchdringt und klare Richtungen vorgibt.',
 ARRAY['Strategisches Denken','Entscheidungskraft','Führungsqualität','Visionäre Ausrichtung'],
 ARRAY['Geduld mit Details','Delegation','Mikromanagement vermeiden'],
 ARRAY['CEO','Strategie-Direktor','Innovations-Lead','Unternehmer'],
 'Direkt, inspirierend, zukunftsorientiert','Gibt Richtung vor und motiviert das Team zu langfristigen Zielen','#8B5CF6','#A78BFA'),

('V2','Der Entwickler / The Developer','Vision','Hilft Menschen und Teams zu wachsen. Menschen-Magnet, der das Beste in anderen erkennt und herausholt.',
 ARRAY['Menschen-Entwicklung','Empathische Führung','Team-Inspiration','Potenzial-Erkennung'],
 ARRAY['Schwierige Gespräche','Grenzen setzen','Distanz wahren'],
 ARRAY['People Manager','Talent-Entwickler','Coach','HR-Direktor'],
 'Unterstützend, entwicklungsorientiert, empathisch','Entwickelt Teammitglieder und fördert persönliches Wachstum','#7C3AED','#8B5CF6'),

('V3','Der Organisator / The Organizer','Vision','Schafft Ordnung und Struktur. Meister der Effizienz, der Chaos in funktionierende Systeme verwandelt.',
 ARRAY['Planung','Koordination','Effizienz','Ressourcen-Management'],
 ARRAY['Flexibilität','Spontanität','Ambiguität-Toleranz'],
 ARRAY['COO','Programm-Manager','Business Analyst','Team Lead'],
 'Strukturiert, methodisch, lösungsorientiert','Schafft Ordnung und sorgt für reibungslose Abläufe','#6D28D9','#7C3AED'),

-- INNOVATION Dimension  
('I1','Der Pionier / The Pioneer','Innovation','Erschließt neue Territorien. Mutiger Vorreiter, der unbekannte Wege geht und Neues entdeckt.',
 ARRAY['Innovation','Risikobereitschaft','Kreativität','Pioniergeist'],
 ARRAY['Ausdauer','Detailarbeit','Routine-Aufgaben'],
 ARRAY['Innovations-Manager','Startup-Gründer','R&D-Lead','Visionär'],
 'Mutig, experimentierfreudig, zukunftsorientiert','Bringt radikale neue Ideen und Ansätze ins Team','#F59E0B','#FBBF24'),

('I2','Der Architekt / The Architect','Innovation','Entwirft neue Lösungen. Kreativer Konstrukteur, der innovative Konzepte in funktionierende Designs verwandelt.',
 ARRAY['System-Design','Konzeptionelle Stärke','Problemlösung','Technische Innovation'],
 ARRAY['Schnelle Umsetzung','Pragmatismus','Kompromisse'],
 ARRAY['Solution Architect','Design Lead','CTO','Produkt-Architekt'],
 'Konzeptionell, durchdacht, designorientiert','Entwickelt innovative Lösungsarchitekturen für komplexe Probleme','#D97706','#F59E0B'),

('I3','Der Inspirator / The Inspirator','Innovation','Begeistert und motiviert. Charismatischer Katalysator, der andere für neue Ideen entflammt.',
 ARRAY['Begeisterungsfähigkeit','Kommunikation','Motivation','Energie'],
 ARRAY['Kontinuität','Detailarbeit','Nachbereitung'],
 ARRAY['Change Agent','Motivations-Speaker','Marketing-Lead','Kultur-Botschafter'],
 'Energiegeladen, begeisternd, mitreißend','Motiviert das Team und schafft Begeisterung für Neues','#B45309','#D97706'),

-- EXPERTISE Dimension
('E1','Der Forscher / The Researcher','Expertise','Erforscht die Tiefe. Neugieriger Analytiker, der komplexe Zusammenhänge durchdringt und neue Erkenntnisse gewinnt.',
 ARRAY['Analytisches Denken','Forschung','Tiefes Verständnis','Wissbegierde'],
 ARRAY['Praktische Umsetzung','Zeitmanagement','Kommunikation von Komplexität'],
 ARRAY['Researcher','Data Scientist','Analyst','Wissenschaftler'],
 'Analytisch, gründlich, wissensorientiert','Liefert fundierte Analysen und tiefes Fachwissen','#10B981','#34D399'),

('E2','Der Meister / The Master','Expertise','Beherrscht sein Handwerk. Exzellenter Könner, der durch jahrelange Praxis zur Perfektion gelangt ist.',
 ARRAY['Meisterschaft','Qualität','Präzision','Handwerkskunst'],
 ARRAY['Delegation','Wissenstransfer','Geduld mit Anfängern'],
 ARRAY['Senior Expert','Master Craftsman','Technical Lead','Qualitäts-Manager'],
 'Präzise, qualitätsorientiert, meisterhaft','Setzt höchste Qualitätsstandards und liefert exzellente Ergebnisse','#059669','#10B981'),

('E3','Der Berater / The Advisor','Expertise','Teilt sein Wissen. Weiser Ratgeber, der andere durch Expertise und Erfahrung zum Erfolg führt.',
 ARRAY['Beratung','Wissenstransfer','Mentoring','Problemlösung'],
 ARRAY['Selbstvermarktung','Abgrenzung','Zeitmanagement'],
 ARRAY['Senior Consultant','Mentor','Berater','Fachexperte'],
 'Unterstützend, lehrend, beratend','Entwickelt Team-Fähigkeiten durch Wissensaustausch','#047857','#059669'),

-- KOLLABORATION Dimension
('C1','Der Harmonizer / The Harmonizer','Kollaboration','Schafft Harmonie. Diplomatischer Vermittler, der Konflikte löst und ein positives Miteinander fördert.',
 ARRAY['Konfliktlösung','Diplomatie','Empathie','Harmonie-Schaffung'],
 ARRAY['Durchsetzungsvermögen','Schwierige Entscheidungen','Konfrontation'],
 ARRAY['Mediator','HR Business Partner','Team Coach','Konflikt-Manager'],
 'Diplomatisch, ausgleichend, harmonisierend','Schafft positive Atmosphäre und löst Konflikte','#EF4444','#F87171'),

('C2','Der Brückenbauer / The Bridge Builder','Kollaboration','Verbindet Menschen. Geschickter Netzwerker, der Silos überwindet und Zusammenarbeit ermöglicht.',
 ARRAY['Netzwerken','Verbindungen schaffen','Zusammenarbeit','Kommunikation'],
 ARRAY['Tiefgang','Fokus','Spezialisierung'],
 ARRAY['Partnership Manager','Community Manager','Scrum Master','Koordinator'],
 'Verbindend, netzwerkend, kollaborativ','Baut Brücken zwischen Teams und Abteilungen','#DC2626','#EF4444'),

('C3','Der Umsetzer / The Implementer','Kollaboration','Setzt gemeinsam um. Verlässlicher Teamplayer, der Pläne in die Tat umsetzt und Ergebnisse liefert.',
 ARRAY['Umsetzungsstärke','Zuverlässigkeit','Teamwork','Ergebnisorientierung'],
 ARRAY['Eigeninitiative','Innovation','Strategisches Denken'],
 ARRAY['Project Manager','Operations Lead','Team Lead','Delivery Manager'],
 'Zuverlässig, umsetzungsstark, teamorientiert','Sorgt für konsequente Umsetzung und Zielerreichung','#B91C1C','#DC2626')

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  dimension = EXCLUDED.dimension,
  description = EXCLUDED.description,
  strengths = EXCLUDED.strengths,
  development_areas = EXCLUDED.development_areas,
  ideal_roles = EXCLUDED.ideal_roles,
  communication_style = EXCLUDED.communication_style,
  team_contribution = EXCLUDED.team_contribution,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary;
