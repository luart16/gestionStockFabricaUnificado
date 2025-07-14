<template>
  <div class="requiere-rol-container">
    <div class="mensaje">
      <h1 class="titulo">Acceso restringido</h1>
      <p class="subtitulo">Sector exclusivo para administradores.</p>
      <router-link :to="{ name: 'home' }" class="btn-principal">
        Volver a inicio
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No es necesario script adicional por ahora
</script>

<style scoped>
* {
  font-family: Poppins;
}

.requiere-rol-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #ffffff;
  padding: 20px;
  text-align: center;
}

.mensaje {
  max-width: 600px;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.titulo {
  font-size: 36px;
  color: #ff6b8a;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.subtitulo {
  font-size: 20px;
  color: rgb(70, 40, 110);
  margin-bottom: 30px;
  font-weight: 400;
}

.btn-principal {
  background-color: rgba(70, 40, 110, 1);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 14px;
  font-weight: bolder;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
}

.btn-principal:hover {
  background-color: #5a2d7a;
}

/* Responsive */
@media (max-width: 768px) {
  .titulo {
    font-size: 28px;
  }

  .subtitulo {
    font-size: 18px;
  }

  .mensaje {
    padding: 30px 20px;
  }
}
</style>
