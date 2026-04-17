import { supabase, supabaseConfigError } from './supabaseClient.js';

export async function updateImagesOrder(newImagesArray) {
  if (supabaseConfigError || !supabase) {
    const configError = new Error(supabaseConfigError || 'No se pudo inicializar Supabase.');

    console.error('Error al actualizar el orden de las imagenes:', configError);
    throw configError;
  }

  try {
    await Promise.all(
      newImagesArray.map(async (image, index) => {
        try {
          const { error } = await supabase
            .from('car_images')
            .update({ orden: index })
            .eq('id', image.id);

          if (error) {
            throw error;
          }
        } catch (error) {
          console.error(`Error actualizando la imagen ${image.id}:`, error);
          throw error;
        }
      }),
    );

    console.info('Orden de imagenes sincronizado correctamente con Supabase.');
  } catch (error) {
    console.error('Error al sincronizar el nuevo orden de las imagenes:', error);
    throw error;
  }
}
