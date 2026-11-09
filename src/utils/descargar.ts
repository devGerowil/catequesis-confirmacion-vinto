/**
 * Descarga un archivo remoto sin abrir una pestaña nueva.
 *
 * El atributo `download` de un enlace solo funciona con archivos del mismo
 * origen; como los materiales viven en Supabase Storage, se obtiene el binario
 * con `fetch` y se guarda mediante un object URL temporal.
 */
export async function descargarArchivo(url: string, nombre: string): Promise<void> {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`No se pudo descargar el archivo (${respuesta.status})`);
  }

  const blob = await respuesta.blob();
  const objectUrl = URL.createObjectURL(blob);
  const enlace = document.createElement('a');

  enlace.href = objectUrl;
  enlace.download = nombre;
  enlace.rel = 'noopener';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  // Damos tiempo al navegador a iniciar la descarga antes de liberar la URL.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
