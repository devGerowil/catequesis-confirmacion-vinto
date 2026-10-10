<template>
  <q-chip
    dense
    square
    class="chip-nuevo"
    color="secondary"
    text-color="dark"
    icon="stars"
    size="sm"
  >
    {{ texto }}
  </q-chip>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ texto?: string }>(), {
  texto: 'Nuevo',
});
</script>

<style scoped lang="scss">
.chip-nuevo {
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px -10px rgba(232, 163, 61, 0.9);
}
</style>
