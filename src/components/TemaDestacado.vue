<template>
  <router-link :to="{ name: 'tema', params: { id: tema.id } }" class="app-card tema-destacado">
    <div class="tema-destacado__contenido">
      <div class="tema-destacado__topo">
        <ChipNuevo />
        <span class="text-eyebrow tema-destacado__epigrafe">Recientemente publicado</span>
      </div>

      <h2 class="tema-destacado__titulo">{{ tema.titulo }}</h2>

      <p v-if="tema.descripcion" class="tema-destacado__descripcion">
        {{ tema.descripcion }}
      </p>

      <ResumenTipos :resumen="resumenTipos" class="tema-destacado__resumen" />

      <div class="tema-destacado__pie">
        <span v-if="tema.fecha" class="tema-destacado__meta">
          <q-icon name="calendar_today" size="14px" />
          {{ formatFecha(tema.fecha) }}
        </span>

        <span class="tema-destacado__meta">
          <q-icon name="attach_file" size="14px" />
          {{ totalArchivos }}
          {{ totalArchivos === 1 ? 'archivo' : 'archivos' }}
        </span>

        <q-icon name="arrow_forward" size="18px" class="tema-destacado__flecha" />
      </div>
    </div>

    <div class="tema-destacado__acento" aria-hidden="true"></div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ChipNuevo from './ChipNuevo.vue';
import ResumenTipos from './ResumenTipos.vue';
import { formatFecha, type TipoArchivo } from '@/utils/formato';
import type { EstadoTema } from '@/types/database';

const props = withDefaults(
  defineProps<{
    tema: {
      id: string;
      titulo: string;
      descripcion?: string | null;
      fecha?: string | null;
      estado: EstadoTema;
    };
    totalArchivos?: number;
    resumenTipos?: Partial<Record<TipoArchivo, number>> | null | undefined;
  }>(),
  {
    totalArchivos: 0,
  },
);

const totalArchivos = computed(() => props.totalArchivos ?? 0);
</script>

<style scoped lang="scss">
.tema-destacado {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: $app-text;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
  margin-bottom: 26px;
  min-height: 200px;

  &:hover {
    border-color: rgba(91, 75, 196, 0.4);
    box-shadow:
      0 2px 6px rgba(36, 31, 53, 0.05),
      0 22px 40px -20px rgba(91, 75, 196, 0.36);
    transform: translateY(-2px);
  }
}

.tema-destacado__contenido {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 26px 28px;
}

.tema-destacado__topo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tema-destacado__epigrafe {
  color: $primary;
  font-size: 0.76rem;
}

.tema-destacado__titulo {
  font-family: var(--app-font-display);
  font-size: clamp(1.6rem, 4.4vw, 2.4rem);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.015em;
  margin: 0;
}

.tema-destacado__descripcion {
  margin: 4px 0 0;
  color: $app-text-muted;
  font-size: 1.02rem;
  line-height: 1.7;
  max-width: 62ch;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tema-destacado__pie {
  margin-top: auto;
  padding-top: 10px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  color: $app-text-muted;
  font-size: 0.88rem;
}

.tema-destacado__meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tema-destacado__flecha {
  margin-left: auto;
  color: $primary;
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.tema-destacado:hover .tema-destacado__flecha {
  opacity: 1;
  transform: translateX(0);
}

.tema-destacado__acento {
  width: 220px;
  background: radial-gradient(circle at top, rgba(232, 163, 61, 0.22), rgba(91, 75, 196, 0.16) 58%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at right, rgba(232, 163, 61, 0.18), transparent 70%);
  }
}

@media (max-width: 720px) {
  .tema-destacado {
    grid-template-columns: 1fr;
  }

  .tema-destacado__acento {
    display: none;
  }
}
</style>
