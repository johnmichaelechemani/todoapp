<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Todos</h1>
    <form @submit.prevent="addTodo" class="mb-4 flex space-x-2">
      <input
        v-model="newTodo.task"
        placeholder="Title"
        class="border p-2 flex-grow"
        required
      />
      <input
        v-model="newTodo.description"
        placeholder="Description"
        class="border p-2 flex-grow"
      />
      <button type="submit" class="bg-green-500 text-white p-2">Add</button>
    </form>

    <ul class="space-y-2">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex justify-between items-center p-2 border"
        :class="todo.completed ? 'border-green-500' : 'border-orange-500'"
      >
        <span :class="todo.completed ? 'text-green-500' : 'text-orange-500'">
          {{ todo.task }} - {{ todo.description || "No description" }}
        </span>
        <div>
          <button
            @click="toggleTodo(todo)"
            class="text-white p-1 mr-2"
            :class="todo.completed ? 'bg-green-500' : 'bg-orange-500'"
          >
            Toggle
          </button>
          <button
            @click="deleteTodo(todo.id)"
            class="bg-red-500 text-white p-1"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const newTodo = ref({ task: "", description: "" });

    onMounted(() => store.dispatch("fetchTodos"));

    const todos = computed(() => store.getters.todos);

    const addTodo = async () => {
      await store.dispatch("addTodo", { ...newTodo.value });
      newTodo.value = { task: "", description: "" };
    };

    const toggleTodo = async (todo) => {
      await store.dispatch("updateTodo", {
        id: todo.id,
        updatedTodo: { completed: !todo.completed },
      });
      await store.dispatch("fetchTodos");
    };

    const deleteTodo = async (id) => {
      await store.dispatch("deleteTodo", id);
    };

    return { todos, newTodo, addTodo, toggleTodo, deleteTodo };
  },
};
</script>
