<template>
  <div class="container mx-auto p-4 max-w-md">
    <h1 class="text-2xl font-bold mb-4">Register</h1>
    <form @submit.prevent="register" class="space-y-4">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="border p-2 w-full"
        required
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border p-2 w-full"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 w-full"
        required
      />
      <button type="submit" class="bg-blue-500 text-white p-2 w-full">
        Register
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const store = useStore();
    const router = useRouter();

    const register = async () => {
      try {
        await store.dispatch("register", {
          username: username.value,
          email: email.value,
          password: password.value,
        });
        router.push("/todos");
      } catch (err) {
        alert("Registration failed");
      }
    };

    return { username, email, password, register };
  },
};
</script>
