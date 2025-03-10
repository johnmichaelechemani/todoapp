<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Todos</h1>
    <form @submit.prevent="addTodo" class="mb-4 flex space-x-2">
      <input
        v-model="newTodo.title"
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
        :key="todo.Id"
        class="flex justify-between items-center p-2 border"
      >
        <span :class="{ 'line-through': todo.Completed }">
          {{ todo.Title }} - {{ todo.Description || "No description" }}
        </span>
        <div>
          <button
            @click="toggleTodo(todo)"
            class="bg-yellow-500 text-white p-1 mr-2"
          >
            {{ todo.Completed ? "Undo" : "Complete" }}
          </button>
          <button
            @click="deleteTodo(todo.Id)"
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
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const newTodo = ref({ title: "", description: "" });

    onMounted(() => store.dispatch("fetchTodos"));

    const todos = () => store.getters.todos;

    const addTodo = () => {
      store.dispatch("addTodo", { ...newTodo.value });
      newTodo.value = { title: "", description: "" };
    };

    const toggleTodo = (todo) => {
      store.dispatch("updateTodo", {
        id: todo.Id,
        updatedTodo: { completed: !todo.Completed },
      });
    };

    const deleteTodo = (id) => store.dispatch("deleteTodo", id);

    return { todos, newTodo, addTodo, toggleTodo, deleteTodo };
  },
};
</script>
