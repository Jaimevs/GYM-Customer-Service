<template>
    <div class="home">
      <header class="header">
        <div class="logo">
          <h1>GymService</h1>
        </div>
        <nav class="navigation">
          <router-link to="/login" class="nav-button">Iniciar Sesión</router-link>
          <router-link to="/register" class="nav-button primary">Registrarse</router-link>
        </nav>
      </header>
  
      <main class="main-content">
        <div class="hero">
          <h2>Atención al cliente para tu gimnasio</h2>
          <p>Gestiona las consultas de tus clientes de forma eficiente y mejora su experiencia</p>
          <router-link to="/register" class="cta-button">Comenzar Ahora</router-link>
        </div>
        
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">📩</div>
            <h3>Mensajes Directos</h3>
            <p>Recibe y responde consultas de tus clientes desde una interfaz intuitiva</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Estadísticas Detalladas</h3>
            <p>Analiza el rendimiento de tu servicio con métricas en tiempo real</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>Comentarios y Sugerencias</h3>
            <p>Recopila feedback valioso para mejorar tu gimnasio constantemente</p>
          </div>
        </div>
      </main>
  
      <footer class="footer">
        <p>&copy; 2025 GymService - Plataforma de Atención al Cliente para Gimnasios</p>
      </footer>
    </div>
  </template>
  
  <script lang="ts" setup>
    // Importaciones de Vue si es necesario
    import { defineComponent } from 'vue';
    
    // Aquí puedes agregar cualquier lógica relacionada con el componente, si es necesario
  </script>
  
  <style scoped>
  .home {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .logo h1 {
    color: #3498db;
    margin: 0;
    font-size: 1.8rem;
  }
  
  .navigation {
    display: flex;
    gap: 1rem;
  }
  
  .nav-button {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #333;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .nav-button:hover {
    background-color: #f5f5f5;
  }
  
  .nav-button.primary {
    background-color: #3498db;
    color: white;
  }
  
  .nav-button.primary:hover {
    background-color: #2980b9;
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
  }
  
  .hero {
    text-align: center;
    margin-bottom: 4rem;
    padding: 3rem 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .hero h2 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .hero p {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto 2rem;
  }
  
  .cta-button {
    display: inline-block;
    padding: 0.8rem 2rem;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .cta-button:hover {
    background-color: #2980b9;
  }
  
  .features {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  
  .feature-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
    width: calc(33.333% - 2rem);
    min-width: 250px;
    text-align: center;
  }
  
  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .feature-card p {
    color: #666;
  }
  
  .footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 1.5rem;
    margin-top: 3rem;
  }
  
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
    
    .feature-card {
      width: 100%;
    }
    
    .hero h2 {
      font-size: 2rem;
    }
  }
  </style>
  