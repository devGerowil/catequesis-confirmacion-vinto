<template>
  <component
    :is="esEnlace ? 'router-link' : 'div'"
    :to="esEnlace ? destino : undefined"
    :class="['app-card', 'tema-card', { 'tema-card--nuevo': nuevo }]"
  >
    <div class="tema-card__topo">
      <div class="tema-card__topo-izq">
        <span class="tema-card__numero">{{ numero }}</span>
        <ChipNuevo v-if="nuevo" />
      </div>
      <EstadoChip v-if="mostrarEstado" :estado="tema.estado" />
    </div>

    <h3 class="tema-card__titulo">{{ tema.titulo }}</h3>

    <p v-if="tema.descripcion" class="tema-card__descripcion">
      {{ tema.descripcion }}
    </p>

    <div class="tema-card__abajo">
      <ResumenTipos :resumen="resumenTipos" />

      <div class="tema-card__pie">
        <span v-if="tema.fecha" class="tema-card__meta">
          <q-icon name="calendar_today" size="14px" />
          {{ formatFecha(tema.fecha) }}
        </span>

        <span class="tema-card__meta">
          <q-icon name="attach_file" size="14px" />
          {{ totalArchivos }}
          {{ totalArchivos === 1 ? 'archivo' : 'archivos' }}
        </span>
      </div>

      <span class="tema-card__cta">
        <span>Ver material</span>
        <q-icon name="arrow_forward" size="18px" />
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EstadoChip from './EstadoChip.vue';
import ChipNuevo from './ChipNuevo.vue';
import ResumenTipos from './ResumenTipos.vue';
import { formatFecha, type TipoArchivo } from '@/utils/formato';
import type { EstadoTema } from '@/types/database';

const props = withDefaults(
  defineProps<{
    tema: {
      titulo: string;
      descripcion?: string | null;
      estado: EstadoTema;
      fecha?: string | null;
    };
    numero?: number;
    totalArchivos?: number;
    resumenTipos?: Partial<Record<TipoArchivo, number>> | null | undefined;
    mostrarEstado?: boolean;
    destino?: unknown;
    esEnlace?: boolean;
    nuevo?: boolean;
  }>(),
  {
    numero: 1,
    totalArchivos: 0,
    mostrarEstado: true,
    esEnlace: true,
    nuevo: false,
  },
);

const totalArchivos = computed(() => props.totalArchivos ?? 0);
</script>

<style scoped lang="scss">
.tema-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px;
  text-decoration: none;
  color: $app-text;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: rgba(91, 75, 196, 0.32);
    box-shadow:
      0 2px 4px rgba(36, 31, 53, 0.05),
      0 16px 32px -16px rgba(91, 75, 196, 0.3);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid rgba(91, 75, 196, 0.45);
    outline-offset: 2px;
  }
}

.tema-card--nuevo {
  border-color: rgba(232, 163, 61, 0.5);
  box-shadow:
    0 2px 6px rgba(36, 31, 53, 0.05),
    0 18px 36px -18px rgba(232, 163, 61, 0.4);

  &:hover {
    border-color: rgba(232, 163, 61, 0.6);
    box-shadow:
      0 2px 6px rgba(36, 31, 53, 0.05),
      0 20px 40px -18px rgba(232, 163, 61, 0.5);
  }
}

.tema-card__topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tema-card__topo-izq {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tema-card__numero {
  font-family: var(--app-font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: $primary;
}

.tema-card__titulo {
  font-family: var(--app-font-display);
  font-size: 1.16rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  margin: 0;
}

.tema-card__descripcion {
  margin: 0;
  color: $app-text-muted;
  font-size: 0.92rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tema-card__abajo {
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tema-card__pie {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  color: $app-text-muted;
  font-size: 0.82rem;
}

.tema-card__meta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.tema-card__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(91, 75, 196, 0.08);
  color: $primary;
  font-size: 0.88rem;
  font-weight: 600;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.tema-card:hover .tema-card__cta {
  background: $primary;
  color: #fff;
}
</style>
