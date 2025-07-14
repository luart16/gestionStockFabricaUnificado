import { defineStore } from "pinia"; //defineStore es la función principal que usa pinia para crear un store

export const userStore = defineStore("User", {
  state: () => {
    return {
      Logueado: false,
      Usuario: "",
      Rol: "",    };
  },
  actions: {
    Loguear(nombre: string, rol: string) {
      (this.Usuario = nombre), (this.Logueado = true), (this.Rol = rol);
    },
    Deslogueo() {
      (this.Usuario = ""), (this.Logueado = false), (this.Rol = "");
    },
  },
  persist: true // esto es para la persistencia (que no se desloguee al recargar)
});
