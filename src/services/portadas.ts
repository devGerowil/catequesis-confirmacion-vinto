import { STORAGE_BUCKET } from '@/config/app';
import { urlPublica } from './archivos';
import { supabase } from './supabase';

/** URL pública de una portada (o la URL externa tal cual). `null` si no hay. */
export function urlPortada(ruta: string | null | undefined): string | null {
  if (!ruta) return null;
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return urlPublica(ruta);
}

/** Sube la portada de un tema y devuelve la ruta que se guarda en la base de datos. */
export async function subirPortada(temaId: string, archivo: File): Promise<string> {
  const nombreLimpio = archivo.name.replace(/[^\w.-]+/g, '_');
  const ruta = `portadas/${temaId}/${Date.now()}-${nombreLimpio}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(ruta, archivo, { cacheControl: '3600', upsert: false });

  if (error) throw error;
  return ruta;
}

/** Elimina una portada de Storage. Ignora las URLs externas. */
export async function eliminarPortada(ruta: string | null | undefined): Promise<void> {
  if (!ruta || /^https?:\/\//i.test(ruta)) return;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([ruta]);
  if (error) throw error;
}
