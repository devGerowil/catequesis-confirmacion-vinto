<template>
  <q-page>
    <main class="app-container inicio">
      <header class="inicio__cabecera">
        <span class="text-eyebrow">{{ APP_PARROQUIA }}</span>
        <h1 class="text-display inicio__titulo">Temas de catequesis</h1>
        <p class="inicio__intro">
          Aquí tienes todo el material de tu Confirmación 2026. Abre un tema para ver o descargar lo
          que necesites.
        </p>
      </header>

      <ol class="inicio__guia" aria-label="Cómo usar la página">
        <li class="inicio__paso">
          <span class="inicio__paso-num">1</span>
          <span class="inicio__paso-texto">Elige un tema</span>
        </li>
        <li class="inicio__paso">
          <span class="inicio__paso-num">2</span>
          <span class="inicio__paso-texto">Mira el material</span>
        </li>
        <li class="inicio__paso">
          <span class="inicio__paso-num">3</span>
          <span class="inicio__paso-texto">Descarga lo que necesites</span>
        </li>
      </ol>

      <q-input
        v-if="hayTemas"
        v-model="busqueda"
        outlined
        dense
        clearable
        debounce="150"
        placeholder="Busca por nombre del tema…"
        aria-label="Buscar un tema"
        class="inicio__buscador"
      >
        <template #prepend>
          <q-icon name="search" size="20px" color="grey-6" />
        </template>
      </q-input>

      <q-banner v-if="store.error" rounded class="bg-red-1 text-negative app-banner">
        <template #avatar>
          <q-icon name="error_outline" />
        </template>
        {{ store.error }}
        <template #action>
          <q-btn flat dense label="Reintentar" @click="store.cargar" />
        </template>
      </q-banner>

      <div v-if="store.cargando" class="inicio__cargando">
        <q-spinner-dots size="34px" color="primary" />
        <span>Cargando temas…</span>
      </div>

      <template v-else>
        <TemaDestacado
          v-if="temaDestacado"
          :tema="temaDestacado"
          :total-archivos="temaDestacado.total_archivos ?? 0"
          :resumen-tipos="temaDestacado.resumen_tipos"
        />

        <p v-if="hayTemas" class="inicio__conteo">
          {{ totalVisible }}
          {{ totalVisible === 1 ? 'tema disponible' : 'temas disponibles' }}
        </p>

        <transition-group v-if="mostrarGrilla" name="app-fade" tag="div" class="inicio__grid">
          <TemaCard
            v-for="(tema, indice) in grilla"
            :key="tema.id"
            :tema="tema"
            :numero="indice + 1"
            :total-archivos="tema.total_archivos ?? 0"
            :resumen-tipos="tema.resumen_tipos"
            :mostrar-estado="false"
            :nuevo="tema.id === store.nuevoId"
            :destino="{ name: 'tema', params: { id: tema.id } }"
          />
        </transition-group>

        <VacioEstado
          v-else-if="mostrarResultadosVacios"
          icono="search_off"
          titulo="Ningún tema coincide"
          descripcion="Prueba con otra palabra o revisa la ortografía."
        >
          <q-btn flat color="primary" label="Limpiar búsqueda" @click="busqueda = ''" />
        </VacioEstado>

        <VacioEstado
          v-else-if="!hayTemas"
          icono="hourglass_empty"
          titulo="Todavía no hay temas publicados"
          descripcion="En cuanto el catequista publique el primer tema, aparecerá aquí."
        />
      </template>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import TemaCard from '@/components/TemaCard.vue';
import TemaDestacado from '@/components/TemaDestacado.vue';
import VacioEstado from '@/components/VacioEstado.vue';
import { APP_PARROQUIA } from '@/config/app';
import { useTemasStore } from '@/stores/temas';
import { normalizar } from '@/utils/formato';
import type { Tema } from '@/types/database';

const store = useTemasStore();
const busqueda = ref('');

const basePublicados = computed<Tema[]>(() => (store.cargando ? [] : store.publicados));

const filtrados = computed<Tema[]>(() => {
  const texto = normalizar(busqueda.value.trim());
  if (!texto) return basePublicados.value;
  return basePublicados.value.filter((tema) =>
    normalizar(`${tema.titulo} ${tema.descripcion ?? ''}`).includes(texto),
  );
});

const nuevoTema = computed<Tema | null>(() => {
  const id = store.nuevoId;
  if (!id) return null;
  return basePublicados.value.find((t) => t.id === id) ?? null;
});

const temaDestacado = computed<Tema | null>(() => {
  if (busqueda.value.trim()) return null;
  return nuevoTema.value;
});

const grilla = computed<Tema[]>(() => {
  if (busqueda.value.trim()) return filtrados.value;
  if (!temaDestacado.value) return filtrados.value;
  return filtrados.value.filter((t) => t.id !== temaDestacado.value?.id);
});

const totalVisible = computed(() =>
  busqueda.value.trim() ? filtrados.value.length : store.publicados.length,
);
const hayTemas = computed(() => store.publicados.length > 0);
const mostrarGrilla = computed(() => grilla.value.length > 0);
const mostrarResultadosVacios = computed(
  () => !!busqueda.value.trim() && filtrados.value.length === 0,
);

onMounted(() => {
  void store.cargar();
});
</script>

<style scoped lang="scss">
.inicio {
  padding-top: 48px;
  padding-bottom: 64px;
}

.inicio__cabecera {
  max-width: 46ch;
  margin-bottom: 22px;
}

.inicio__titulo {
  font-size: clamp(1.9rem, 5vw, 2.6rem);
  margin: 8px 0 10px;
}

.inicio__intro {
  margin: 0;
  color: $app-text-muted;
  font-size: 1rem;
  line-height: 1.65;
}

.inicio__guia {
  list-style: none;
  margin: 0 0 26px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.inicio__paso {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 15px;
  border-radius: 999px;
  background: $app-surface;
  border: 1px solid $app-border;
  box-shadow: $elevation-1;
  font-size: 0.9rem;
  font-weight: 500;
  color: $app-text;
}

.inicio__paso-num {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  background: rgba(91, 75, 196, 0.12);
  color: $primary;
  font-size: 0.78rem;
  font-weight: 700;
}

.inicio__buscador {
  max-width: 420px;
  margin-bottom: 26px;
}

.inicio__conteo {
  margin: 0 0 14px;
  font-size: 0.84rem;
  color: $app-text-muted;
}

.inicio__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  gap: 18px;
}

.inicio__cargando {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  color: $app-text-muted;
  padding: 64px 0;
}

.app-banner {
  margin-bottom: 20px;
}
</style>
