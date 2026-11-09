<template>
  <div class="portada">
    <div v-if="preview" class="portada__previa">
      <img :src="preview" alt="Vista previa de la portada" />

      <div class="portada__acciones">
        <q-btn
          flat
          dense
          no-caps
          color="white"
          icon="photo_camera"
          label="Cambiar"
          @click="abrirSelector"
        />
        <q-btn
          flat
          dense
          no-caps
          color="white"
          icon="delete_outline"
          label="Quitar"
          @click="$emit('quitar')"
        />
      </div>
    </div>

    <div
      v-else
      class="portada__zona"
      :class="{ 'portada__zona--activa': arrastrando }"
      role="button"
      tabindex="0"
      @click="abrirSelector"
      @keydown.enter.prevent="abrirSelector"
      @keydown.space.prevent="abrirSelector"
      @dragenter.prevent="arrastrando = true"
      @dragover.prevent="arrastrando = true"
      @dragleave.prevent="arrastrando = false"
      @drop.prevent="soltar"
    >
      <q-icon name="add_photo_alternate" size="34px" color="primary" />
      <div class="portada__titulo">Sube una imagen de portada</div>
      <div class="portada__ayuda">
        Arrastra una imagen o haz clic · JPG, PNG, WEBP, AVIF o GIF · máx.
        {{ MAX_PORTADA_SIZE_MB }} MB
      </div>
    </div>

    <input
      ref="inputRef"
      class="portada__input"
      type="file"
      :accept="PORTADA_MIME"
      @click.stop
      @change="cambiar"
    />

    <q-banner v-if="aviso" rounded dense class="bg-orange-1 text-orange-9 portada__aviso">
      <template #avatar>
        <q-icon name="info_outline" />
      </template>
      {{ aviso }}
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MAX_PORTADA_SIZE_MB, PORTADA_EXTENSIONS, PORTADA_MIME } from '@/config/app';

defineProps<{ preview: string | null }>();

const emit = defineEmits<{
  seleccionar: [archivo: File];
  quitar: [];
}>();

const aviso = ref('');
const arrastrando = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const maxBytes = MAX_PORTADA_SIZE_MB * 1024 * 1024;

function abrirSelector() {
  inputRef.value?.click();
}

function cambiar(evento: Event) {
  const input = evento.target as HTMLInputElement;
  const archivo = input.files?.[0];
  if (archivo) procesar(archivo);
  input.value = '';
}

function soltar(evento: DragEvent) {
  arrastrando.value = false;
  const archivo = evento.dataTransfer?.files?.[0];
  if (archivo) procesar(archivo);
}

function procesar(archivo: File) {
  aviso.value = '';

  const extension = archivo.name.split('.').pop()?.toLowerCase() ?? '';
  if (!PORTADA_EXTENSIONS.includes(extension)) {
    aviso.value = 'La portada debe ser una imagen JPG, PNG, WEBP, AVIF o GIF.';
    return;
  }

  if (archivo.size > maxBytes) {
    aviso.value = `La imagen supera los ${MAX_PORTADA_SIZE_MB} MB.`;
    return;
  }

  emit('seleccionar', archivo);
}
</script>

<style scoped lang="scss">
.portada {
  margin-top: 14px;
}

.portada__previa {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  aspect-ratio: 16 / 9;
  background: rgba(36, 31, 53, 0.06);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.portada__acciones {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
}

.portada__zona {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 14px;
  padding: 26px 16px;
  cursor: pointer;
  background: rgba(91, 75, 196, 0.02);
  border: 1px dashed $app-border;
  transition:
    border-color 0.2s,
    background 0.2s;

  > * {
    pointer-events: none;
  }

  &:hover,
  &:focus-visible {
    border-color: $primary;
    background: rgba(91, 75, 196, 0.06);
    outline: none;
  }
}

.portada__zona--activa {
  border-color: $primary;
  border-style: solid;
  background: rgba(91, 75, 196, 0.1);
}

.portada__input {
  display: none;
}

.portada__titulo {
  font-weight: 500;
  margin-top: 8px;
}

.portada__ayuda {
  font-size: 0.82rem;
  color: $app-text-muted;
  margin-top: 3px;
}

.portada__aviso {
  margin-top: 12px;
  font-size: 0.85rem;
}
</style>
