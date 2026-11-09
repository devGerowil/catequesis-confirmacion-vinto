-- =============================================================================
--  Portada de cada tema
--  Guarda la ruta del archivo en Storage (bucket materiales, carpeta portadas/)
--  o una URL pública completa. La imagen se sube desde el panel de catequistas.
-- =============================================================================

alter table public.temas
  add column if not exists imagen text;

comment on column public.temas.imagen is
  'Ruta de la portada en Storage (bucket materiales, carpeta portadas/) o URL pública.';
