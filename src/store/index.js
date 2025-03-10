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
      state.todos = todos;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const res = await api.post("/api/auth/login", credentials);
      const token = res.data.token;
      localStorage.setItem("token", token);
      commit("setToken", token);
    },
    async register({ commit }, userData) {
      const res = await api.post("/api/auth/register", userData);
      const token = res.data.token;
      localStorage.setItem("token", token);
      commit("setToken", token);
    },
    async fetchTodos({ commit }) {
      const res = await api.get("/api/todos");
      commit("setTodos", res.data);
    },
    async addTodo({ commit, state }, todo) {
      const res = await api.post("/api/todos", todo);
      commit("setTodos", [...state.todos, res.data]);
    },
    async updateTodo({ commit, state }, { id, updatedTodo }) {
      const res = await api.put(`/api/todos/${id}`, updatedTodo);
      commit(
        "setTodos",
        state.todos.map((t) => (t.Id === id ? res.data : t))
      );
    },
    async deleteTodo({ commit, state }, id) {
      await api.delete(`/api/todos/${id}`);
      commit(
        "setTodos",
        state.todos.filter((t) => t.Id !== id)
      );
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    todos: (state) => state.todos,
  },
});
