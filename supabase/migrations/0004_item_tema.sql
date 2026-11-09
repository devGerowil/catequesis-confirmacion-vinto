-- =============================================================================
--  Ítem visible de cada tema
--  Etiqueta breve (por ejemplo «Tema 1») que se destaca en las cards.
-- =============================================================================

alter table public.temas
  add column if not exists item text;

comment on column public.temas.item is
  'Etiqueta breve del tema que se muestra de forma destacada en las cards.';
