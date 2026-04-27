insert into public.timer_templates (name, duration_seconds, bereich, description, is_public)
values
  ('Gram: Lugol', 60, 'mibi', 'Standard-Einwirkzeit fuer Lugol bei der Gram-Faerbung.', true),
  ('Ziehl-Neelsen: Carbolfuchsin', 300, 'mibi', 'Erwaermen und feucht halten, nicht austrocknen lassen.', true),
  ('HE: Haematoxylin', 360, 'histo', 'Routinefaerbung, Laborstandard pruefen.', true);

insert into public.protokolle (name, bereich, description, source, is_public, steps)
values
  (
    'Gram-Faerbung',
    'mibi',
    'Differenzierende Routinefaerbung fuer grampositive und gramnegative Bakterien.',
    'Standard Gram',
    true,
    '[{"id":"gram_1","name":"Fixieren","duration_seconds":20,"instructions":"Ausstrich lufttrocknen lassen und hitzefixieren.","order":1},{"id":"gram_2","name":"Kristallviolett","duration_seconds":60,"instructions":"Praeparat vollstaendig bedecken.","order":2}]'::jsonb
  ),
  (
    'HE-Faerbung',
    'histo',
    'Uebersichtsfaerbung fuer Gewebeschnitte mit Haematoxylin und Eosin.',
    'Routine HE',
    true,
    '[{"id":"he_1","name":"Entparaffinieren","duration_seconds":600,"instructions":"Schnitt entparaffinieren.","order":1},{"id":"he_2","name":"Haematoxylin","duration_seconds":360,"instructions":"Kerne faerben.","order":2}]'::jsonb
  );
