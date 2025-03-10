import { createStore } from "vuex";
import api from "../services/api";

export default createStore({
  state: {
    token: localStorage.getItem("token") || "",
    todos: [],
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setTodos(state, todos) {
      console.log("✅ Setting Todos in Vuex:", todos); // Debugging
      state.todos = todos;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const res = await api.post("/auth/login", credentials);
      const token = res.data.token;
      localStorage.setItem("token", token);
      commit("setToken", token);
    },

    async register({ commit }, userData) {
      const res = await api.post("/auth/register", userData);
      const token = res.data.token;
      localStorage.setItem("token", token);
      commit("setToken", token);
    },

    async fetchTodos({ commit }) {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit("setTodos", res.data);
      } catch (error) {
        console.error(
          "🚨 Error fetching todos:",
          error.response?.data || error
        );
      }
    },

    async addTodo({ dispatch }, todo) {
      try {
        const token = localStorage.getItem("token");
        await api.post("/todos", todo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await dispatch("fetchTodos"); // ✅ Re-fetch todos after adding
      } catch (error) {
        console.error("🚨 Error adding todo:", error.response?.data || error);
      }
    },

    async updateTodo({ commit, state }, { id, updatedTodo }) {
      try {
        const token = localStorage.getItem("token");
        const res = await api.put(`/todos/${id}`, updatedTodo, {
          headers: { Authorization: `Bearer ${token}` },
        });

        commit(
          "setTodos",
          state.todos.map((t) => (t.id === id ? res.data : t)) // ✅ Use `t.id`
        );
      } catch (error) {
        console.error("🚨 Error updating todo:", error.response?.data || error);
      }
    },

    async deleteTodo({ commit, state }, id) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/todos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        commit(
          "setTodos",
          state.todos.filter((t) => t.id !== id) // ✅ Use `t.id`
        );
      } catch (error) {
        console.error("🚨 Error deleting todo:", error.response?.data || error);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    todos: (state) => state.todos,
  },
});
