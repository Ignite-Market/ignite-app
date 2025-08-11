<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
    <!-- Navigation -->
    <nav class="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <a class="flex items-center space-x-2" href="https://deck.ignitemarket.xyz/" target="_blank">
        <NuxtIcon name="logo/IgniteMarket" class="icon-auto" filled />
      </a>
      <div class="hidden md:flex space-x-8 text-gray-300">
        <a
          href="https://docs.ignitemarket.xyz/"
          class="hover:text-white transition-colors flex items-center gap-1"
          target="_blank"
          >Docs
          <NuxtIcon name="icon/external-link" class="" filled />
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          Join the
          <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Airdrop</span>
        </h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Be among the first to experience the future of prediction markets. Register for our exclusive airdrop and stay
          updated on new features, markets, and opportunities.
        </p>
      </div>

      <!-- Form Section -->
      <div class="max-w-2xl mx-auto">
        <div class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Wallet Address -->
            <div>
              <label for="walletAddress" class="block text-sm font-medium text-gray-300 mb-2">
                Wallet Address <span class="text-red-400">*</span>
              </label>
              <input
                id="walletAddress"
                v-model="form.walletAddress"
                type="text"
                required
                placeholder="0x..."
                class="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p v-if="errors.walletAddress" class="text-red-400 text-sm mt-1">{{ errors.walletAddress }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Email Address <span class="text-red-400">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="your@email.com"
                class="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p v-if="errors.email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <!-- Twitter Handle -->
            <div>
              <label for="twitter" class="block text-sm font-medium text-gray-300 mb-2">
                Twitter Handle <span class="text-gray-500">(Optional)</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                <input
                  id="twitter"
                  v-model="form.twitter"
                  type="text"
                  placeholder="username"
                  class="w-full pl-[34px] pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Discord Handle -->
            <div>
              <label for="discord" class="block text-sm font-medium text-gray-300 mb-2">
                Discord Handle <span class="text-gray-500">(Optional)</span>
              </label>
              <input
                id="discord"
                v-model="form.discord"
                type="text"
                placeholder="username"
                class="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Newsletter Consent -->
            <!-- <div class="bg-gray-700 bg-opacity-30 rounded-lg p-4 border border-gray-600">
              <div class="flex items-start space-x-3">
                <input
                  id="newsletter"
                  v-model="form.newsletter"
                  type="checkbox"
                  class="mt-1 w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label for="newsletter" class="text-sm text-gray-300 leading-relaxed">
                  I agree to receive updates about new features, markets, and opportunities from Ignite Market. You can
                  unsubscribe at any time.
                </label>
              </div>
            </div> -->

            <div class="flex justify-center">
              <ProcaptchaComponent :site-key="siteKey" :callback="callbacks" theme="dark" />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting || !isEnabled"
              class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="!isSubmitting">Register for Airdrop</span>
              <span v-else class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            </button>
          </form>

          <!-- Success Message -->
          <div v-if="showSuccess" class="mt-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
            <div class="flex items-center">
              <div class="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mr-2">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p class="text-green-400 font-medium">Successfully registered for the airdrop!</p>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="mt-8 text-center">
          <p class="text-gray-400 text-sm">
            By registering, you'll be among the first to know about our token launch, exclusive features, and market
            opportunities.
          </p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
        <div>
          <div class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            $100K+
          </div>
          <div class="text-gray-400 text-sm mt-1">Initial Target Volume</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-400">75%</div>
          <div class="text-gray-400 text-sm mt-1">Projected Growth Rate</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ProcaptchaComponent } from '@prosopo/vue-procaptcha-wrapper';
import Endpoints from '../lib/values/endpoints';

definePageMeta({
  layout: 'airdrop',
});

const message = useMessage();

const siteKey = useRuntimeConfig().public.PROSOPO_CAPTCHA_SITEKEY;

const isEnabled = ref(false);

const form = reactive({
  walletAddress: '',
  email: '',
  twitter: '',
  discord: '',
  // newsletter: true,
});

const errors = reactive({
  walletAddress: '',
  email: '',
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

const callbacks = token => {
  isEnabled.value = !!token;
};

const validateForm = () => {
  errors.walletAddress = '';
  errors.email = '';

  let isValid = true;

  // Validate wallet address (basic Ethereum address format)
  if (!form.walletAddress) {
    errors.walletAddress = 'Wallet address is required';
    isValid = false;
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(form.walletAddress)) {
    errors.walletAddress = 'Please enter a valid Ethereum wallet address';
    isValid = false;
  }

  // Validate email
  if (!form.email) {
    errors.email = 'Email address is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $api.post(Endpoints.airdropJoin, {
      walletAddress: form.walletAddress,
      email: form.email,
      twitter: form.twitter || null,
      discord: form.discord || null,
    });

    console.log('Form submitted:', form);

    // Show success message
    showSuccess.value = true;

    // Reset form
    form.walletAddress = '';
    form.email = '';
    form.twitter = '';
    form.discord = '';
    // form.newsletter = true;

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);

    message.success('Successfully registered for the airdrop!');
  } catch (error) {
    console.error('Submission error:', error);
    message.error(apiError(error));
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Custom styles for better browser compatibility */
input[type='checkbox'] {
  accent-color: #a855f7;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Ensure gradients work across browsers */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Animation for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
