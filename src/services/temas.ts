import { supabase } from './supabase';
import { tipoDeArchivo, type TipoArchivo } from '@/utils/formato';
import type { Tema, TemaInput, TemaUpdate } from '@/types/database';

const CAMPOS =
  'id, titulo, descripcion, contenido, estado, orden, fecha, creado_por, creado_at, actualizado_at';

/** Lista los temas visibles para el usuario actual (la RLS ya filtra borradores). */
export async function listarTemas(): Promise<Tema[]> {
  const { data, error } = await supabase
    .from('temas')
    .select(`${CAMPOS}, archivos(mime, nombre)`)
    .order('orden', { ascending: true })
    .order('titulo', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(({ archivos, ...fila }) => {
    const lista = archivos ?? [];
    const resumen_tipos: Partial<Record<TipoArchivo, number>> = {};

    for (const archivo of lista) {
      const tipo = tipoDeArchivo(archivo);
      resumen_tipos[tipo] = (resumen_tipos[tipo] ?? 0) + 1;
    }

    return {
      ...fila,
      total_archivos: lista.length,
      resumen_tipos,
    };
  });
}

/** Obtiene un tema por id, o `null` si no existe o no es visible. */
export async function obtenerTema(id: string): Promise<Tema | null> {
  const { data, error } = await supabase.from('temas').select(CAMPOS).eq('id', id).maybeSingle();

  if (error) throw error;
  return data;
}

export async function crearTema(input: TemaInput, creadoPor: string | null): Promise<Tema> {
  const { data, error } = await supabase
    .from('temas')
    .insert({ ...input, creado_por: creadoPor })
    .select(CAMPOS)
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarTema(id: string, cambios: TemaUpdate): Promise<Tema> {
  const { data, error } = await supabase
    .from('temas')
    .update(cambios)
    .eq('id', id)
    .select(CAMPOS)
    .single();

  if (error) throw error;
  return data;
}

export async function eliminarTema(id: string): Promise<void> {
  const { error } = await supabase.from('temas').delete().eq('id', id);
  if (error) throw error;
}

export async function cambiarEstado(id: string, estado: Tema['estado']): Promise<Tema> {
  return actualizarTema(id, { estado });
}

/** Devuelve el id del tema publicado con mayor fecha de creación, o null si no hay publicados. */
export async function temaMasRecienteId(): Promise<string | null> {
  const { data, error } = await supabase
    .from('temas')
    .select('id, creado_at, estado')
    .eq('estado', 'publicado')
    .order('creado_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}
