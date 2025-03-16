<template>
  <div class="container mx-auto p-4 max-w-md">
    <h1 class="text-2xl font-bold mb-4">Login</h1>
    <form @submit.prevent="login" class="space-y-4">
      <input
        v-model="name"
        type="text"
        placeholder="name"
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
        Login
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
    const name = ref("");
    const password = ref("");
    const store = useStore();
    const router = useRouter();

    const login = async () => {
      try {
        await store.dispatch("login", {
          name: name.value,
          password: password.value,
        });
        router.push("/todos");
      } catch (err) {
        alert("Login failed");
      }
    };

    return { name, password, login };
  },
};
</script>
