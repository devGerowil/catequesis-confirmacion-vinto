<template>
  <div v-if="items.length" class="resumen-tipos" aria-label="Tipos de material del tema">
    <span
      v-for="item in items"
      :key="item.tipo"
      class="resumen-tipos__item"
      :class="`resumen-tipos__item--${item.tipo}`"
      :title="`${item.cantidad} ${item.etiqueta.toLowerCase()}`"
    >
      <q-icon :name="item.icono" size="15px" />
      <span class="resumen-tipos__cantidad">{{ item.cantidad }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { INFO_TIPOS, type TipoArchivo } from '@/utils/formato';

const props = defineProps<{
  resumen?: Partial<Record<TipoArchivo, number>> | null | undefined;
}>();

const ORDEN: TipoArchivo[] = ['pdf', 'imagen', 'documento', 'otro'];

const items = computed(() =>
  ORDEN.map((tipo) => ({
    tipo,
    icono: INFO_TIPOS[tipo].icono,
    etiqueta: INFO_TIPOS[tipo].etiqueta,
    cantidad: props.resumen?.[tipo] ?? 0,
  })).filter((item) => item.cantidad > 0),
);
</script>

<style scoped lang="scss">
.resumen-tipos {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.resumen-tipos__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1;

  &--pdf {
    background: rgba(220, 90, 82, 0.1);
    color: $negative;
  }

  &--imagen {
    background: rgba(78, 143, 213, 0.12);
    color: $info;
  }

  &--documento {
    background: rgba(91, 75, 196, 0.1);
    color: $primary;
  }

  &--otro {
    background: rgba(122, 115, 137, 0.12);
    color: $app-text-muted;
  }
}

.resumen-tipos__cantidad {
  font-variant-numeric: tabular-nums;
}
</style>
