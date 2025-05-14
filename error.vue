<template>
  <!-- TODO: Fix -->
  <div class="relative flex flex-col justify-center align-middle min-h-screen h-full">
    <div class="container relative max-w-lg py-16 sm:px-8 md:px-12 lg:px-16 card">
      <div>
        <!-- customize 404 message from template section -->
        <h4>{{ $t('error.404') }}</h4>

        <!-- Redirect to home page -->
        <button @click="handleError">
          {{ $t('general.goHome') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Clear error and redirect to home page.
const handleError = () => clearError({ redirect: '/' });
</script>
