<template>
  <q-layout view="hHh lpR fFf" class="app-bg">
    <q-header class="app-header">
      <q-toolbar class="app-container">
        <router-link :to="{ name: 'inicio' }" class="app-brand">
          <q-avatar size="34px" color="primary" text-color="white" class="app-brand__mark">
            <q-icon name="auto_stories" size="19px" />
          </q-avatar>
          <span class="app-brand__text">
            <span class="app-brand__title">Confirmación 2026</span>
            <span class="app-brand__sub">{{ APP_PARROQUIA }}</span>
          </span>
        </router-link>

        <q-space />

        <template v-if="auth.esCatequista">
          <q-btn flat no-caps dense icon="tune" label="Panel" class="app-auth gt-xs" to="/admin" />
          <q-btn
            flat
            round
            dense
            icon="tune"
            class="app-auth lt-sm"
            aria-label="Panel de administración"
            to="/admin"
          />
        </template>

        <template v-else>
          <q-btn
            flat
            no-caps
            dense
            icon="login"
            label="Catequistas"
            class="app-auth gt-xs"
            to="/entrar"
          />
          <q-btn
            flat
            round
            dense
            icon="login"
            class="app-auth lt-sm"
            aria-label="Entrar como catequista"
            to="/entrar"
          />
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="app-footer">
      <div class="app-container app-footer__inner">
        <span>{{ APP_TAGLINE }}</span>
        <router-link :to="{ name: 'entrar' }" class="app-footer__link">
          Acceso catequistas
        </router-link>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { APP_PARROQUIA, APP_TAGLINE } from '@/config/app';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
</script>

<style scoped lang="scss">
.app-header {
  background: rgba($dark, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  color: #fff;
}

.app-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #fff;
}

.app-brand__mark {
  box-shadow: 0 4px 12px -4px rgba(91, 75, 196, 0.55);
}

.app-brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.app-brand__title {
  font-family: var(--app-font-display);
  font-weight: 600;
  font-size: 1.02rem;
  letter-spacing: -0.01em;
}

.app-brand__sub {
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.72);
}

.app-auth {
  color: #fff;
  opacity: 0.92;
  border-radius: 10px;
  transition:
    opacity 0.2s ease,
    background 0.2s ease;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
}

.app-footer {
  background: transparent;
  border-top: 1px solid $app-border;
  color: $app-text-muted;
  font-size: 0.85rem;
}

.app-footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  justify-content: space-between;
  align-items: center;
  padding-top: 18px;
  padding-bottom: 18px;
}

.app-footer__link {
  color: $primary;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 599px) {
  .app-brand__sub {
    display: none;
  }
}
</style>
