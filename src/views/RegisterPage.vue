<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12">
    <div class="w-full max-w-md animate-fade-in">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Icon icon="heroicons:user-plus" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Start managing your tasks today</p>
      </div>

      <!-- Register Card -->
      <div class="card p-8 animate-slide-up">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name Input -->
          <div>
            <label for="name" class="label">
              Full Name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="heroicons:user" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="input pl-10"
                placeholder="John Doe"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="label">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="heroicons:at-symbol" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="input pl-10"
                placeholder="john@example.com"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="label">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="heroicons:lock-closed" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="input pl-10 pr-10"
                placeholder="••••••••"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon v-if="!showPassword" icon="heroicons:eye" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <Icon v-else icon="heroicons:eye-slash" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Create Account</span>
            <span v-else class="flex items-center justify-center">
              <Icon icon="heroicons:arrow-path" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Creating account...
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-purple-600 hover:text-purple-500 transition-colors">
              Sign in
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { Icon } from '@iconify/vue';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  password: ''
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  // Validation
  if (!form.value.name.trim()) {
    error.value = 'Please enter your full name';
    return;
  }

  if (!form.value.email.trim()) {
    error.value = 'Please enter your email address';
    return;
  }

  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await authStore.register(form.value.email, form.value.password, form.value.name);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>