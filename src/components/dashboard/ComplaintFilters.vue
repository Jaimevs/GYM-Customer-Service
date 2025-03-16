<template>
    <div>
      <div class="tabs w-full">
        <div class="tabs-list w-full md:w-auto">
          <button 
            @click="activeTab = 'all'" 
            :class="['tab flex-1 md:flex-none', activeTab === 'all' ? 'active' : '']">
            Todas
          </button>
          <button 
            @click="activeTab = 'pending'" 
            :class="['tab flex-1 md:flex-none', activeTab === 'pending' ? 'active' : '']">
            Pendientes
          </button>
          <button 
            @click="activeTab = 'in-progress'" 
            :class="['tab flex-1 md:flex-none', activeTab === 'in-progress' ? 'active' : '']">
            En Proceso
          </button>
          <button 
            @click="activeTab = 'resolved'" 
            :class="['tab flex-1 md:flex-none', activeTab === 'resolved' ? 'active' : '']">
            Resueltas
          </button>
        </div>
        
        <div v-if="activeTab === 'all'" class="tab-content mt-4">
          <div class="card">
            <div class="card-header pb-0">
              <div class="flex items-center justify-between">
                <h2 class="card-title">Todas las Quejas y Sugerencias</h2>
                <div class="filters">
                  <select v-model="filterType" class="filter-select">
                    <option value="all">Todos los tipos</option>
                    <option value="complaint">Quejas</option>
                    <option value="suggestion">Sugerencias</option>
                  </select>
                  <input v-model="searchQuery" type="text" placeholder="Buscar..." class="search-input">
                </div>
              </div>
              <p class="card-description">Listado completo de quejas y sugerencias de los clientes.</p>
            </div>
            <div class="card-content pt-6">
              <table class="complaints-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Asunto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="complaint in filteredComplaints" :key="complaint.id">
                    <td>{{ complaint.id }}</td>
                    <td>{{ complaint.clientName }}</td>
                    <td>
                      <span :class="['type-badge', complaint.type === 'complaint' ? 'complaint' : 'suggestion']">
                        {{ complaint.type === 'complaint' ? 'Queja' : 'Sugerencia' }}
                      </span>
                    </td>
                    <td>{{ complaint.subject }}</td>
                    <td>{{ formatDate(complaint.date) }}</td>
                    <td>
                      <span :class="['status-badge', complaint.status]">
                        {{ getStatusText(complaint.status) }}
                      </span>
                    </td>
                    <td>
                      <button class="action-btn view">Ver</button>
                      <button class="action-btn edit">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="filteredComplaints.length === 0" class="no-results">
                No se encontraron resultados
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'pending'" class="tab-content mt-4">
          <div class="card">
            <div class="card-header pb-0">
              <div class="flex items-center justify-between">
                <h2 class="card-title">Quejas Pendientes</h2>
                <div class="filters">
                  <select v-model="filterType" class="filter-select">
                    <option value="all">Todos los tipos</option>
                    <option value="complaint">Quejas</option>
                    <option value="suggestion">Sugerencias</option>
                  </select>
                  <input v-model="searchQuery" type="text" placeholder="Buscar..." class="search-input">
                </div>
              </div>
              <p class="card-description">Quejas que aún no han sido atendidas.</p>
            </div>
            <div class="card-content pt-6">
              <table class="complaints-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Asunto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="complaint in getFilteredByStatus('pending')" :key="complaint.id">
                    <td>{{ complaint.id }}</td>
                    <td>{{ complaint.clientName }}</td>
                    <td>
                      <span :class="['type-badge', complaint.type === 'complaint' ? 'complaint' : 'suggestion']">
                        {{ complaint.type === 'complaint' ? 'Queja' : 'Sugerencia' }}
                      </span>
                    </td>
                    <td>{{ complaint.subject }}</td>
                    <td>{{ formatDate(complaint.date) }}</td>
                    <td>
                      <span class="status-badge pending">
                        Pendiente
                      </span>
                    </td>
                    <td>
                      <button class="action-btn view">Ver</button>
                      <button class="action-btn edit">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="getFilteredByStatus('pending').length === 0" class="no-results">
                No hay quejas pendientes
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'in-progress'" class="tab-content mt-4">
          <div class="card">
            <div class="card-header pb-0">
              <div class="flex items-center justify-between">
                <h2 class="card-title">Quejas En Proceso</h2>
                <div class="filters">
                  <select v-model="filterType" class="filter-select">
                    <option value="all">Todos los tipos</option>
                    <option value="complaint">Quejas</option>
                    <option value="suggestion">Sugerencias</option>
                  </select>
                  <input v-model="searchQuery" type="text" placeholder="Buscar..." class="search-input">
                </div>
              </div>
              <p class="card-description">Quejas que están siendo atendidas actualmente.</p>
            </div>
            <div class="card-content pt-6">
              <table class="complaints-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Asunto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="complaint in getFilteredByStatus('in-progress')" :key="complaint.id">
                    <td>{{ complaint.id }}</td>
                    <td>{{ complaint.clientName }}</td>
                    <td>
                      <span :class="['type-badge', complaint.type === 'complaint' ? 'complaint' : 'suggestion']">
                        {{ complaint.type === 'complaint' ? 'Queja' : 'Sugerencia' }}
                      </span>
                    </td>
                    <td>{{ complaint.subject }}</td>
                    <td>{{ formatDate(complaint.date) }}</td>
                    <td>
                      <span class="status-badge in-progress">
                        En Proceso
                      </span>
                    </td>
                    <td>
                      <button class="action-btn view">Ver</button>
                      <button class="action-btn edit">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="getFilteredByStatus('in-progress').length === 0" class="no-results">
                No hay quejas en proceso
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'resolved'" class="tab-content mt-4">
          <div class="card">
            <div class="card-header pb-0">
              <div class="flex items-center justify-between">
                <h2 class="card-title">Quejas Resueltas</h2>
                <div class="filters">
                  <select v-model="filterType" class="filter-select">
                    <option value="all">Todos los tipos</option>
                    <option value="complaint">Quejas</option>
                    <option value="suggestion">Sugerencias</option>
                  </select>
                  <input v-model="searchQuery" type="text" placeholder="Buscar..." class="search-input">
                </div>
              </div>
              <p class="card-description">Quejas que ya han sido resueltas satisfactoriamente.</p>
            </div>
            <div class="card-content pt-6">
              <table class="complaints-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Asunto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="complaint in getFilteredByStatus('resolved')" :key="complaint.id">
                    <td>{{ complaint.id }}</td>
                    <td>{{ complaint.clientName }}</td>
                    <td>
                      <span :class="['type-badge', complaint.type === 'complaint' ? 'complaint' : 'suggestion']">
                        {{ complaint.type === 'complaint' ? 'Queja' : 'Sugerencia' }}
                      </span>
                    </td>
                    <td>{{ complaint.subject }}</td>
                    <td>{{ formatDate(complaint.date) }}</td>
                    <td>
                      <span class="status-badge resolved">
                        Resuelta
                      </span>
                    </td>
                    <td>
                      <button class="action-btn view">Ver</button>
                      <button class="action-btn edit">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="getFilteredByStatus('resolved').length === 0" class="no-results">
                No hay quejas resueltas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  
  interface Complaint {
    id: string;
    clientName: string;
    type: 'complaint' | 'suggestion';
    subject: string;
    date: Date;
    status: 'pending' | 'in-progress' | 'resolved';
    description: string;
  }
  
  export default defineComponent({
    name: 'ComplaintsView',
    setup() {
      const activeTab = ref('all');
      const filterType = ref('all');
      const searchQuery = ref('');
      
      // Datos ficticios
      const complaints = ref<Complaint[]>([
        {
          id: 'QJ-2025-001',
          clientName: 'María González',
          type: 'complaint',
          subject: 'Retraso en la entrega',
          date: new Date('2025-02-15'),
          status: 'pending',
          description: 'Mi pedido tenía fecha de entrega para el 10 de febrero y aún no lo he recibido.'
        },
        {
          id: 'QJ-2025-002',
          clientName: 'Carlos Rodríguez',
          type: 'complaint',
          subject: 'Producto defectuoso',
          date: new Date('2025-02-20'),
          status: 'in-progress',
          description: 'El producto llegó con daños visibles en el empaque y no funciona correctamente.'
        },
        {
          id: 'QJ-2025-003',
          clientName: 'Ana Martínez',
          type: 'suggestion',
          subject: 'Mejora en la app móvil',
          date: new Date('2025-02-22'),
          status: 'pending',
          description: 'Sería útil tener la opción de guardar direcciones de envío favoritas.'
        },
        {
          id: 'QJ-2025-004',
          clientName: 'Juan Pérez',
          type: 'complaint',
          subject: 'Cobro incorrecto',
          date: new Date('2025-02-18'),
          status: 'resolved',
          description: 'Me cobraron dos veces por el mismo pedido.'
        },
        {
          id: 'QJ-2025-005',
          clientName: 'Sofía López',
          type: 'suggestion',
          subject: 'Nuevas opciones de pago',
          date: new Date('2025-02-25'),
          status: 'in-progress',
          description: 'Sería conveniente agregar la opción de pago con criptomonedas.'
        },
        {
          id: 'QJ-2025-006',
          clientName: 'Roberto Sánchez',
          type: 'complaint',
          subject: 'Atención al cliente deficiente',
          date: new Date('2025-02-10'),
          status: 'resolved',
          description: 'Estuve esperando más de 30 minutos en línea y la llamada se cortó.'
        },
        {
          id: 'QJ-2025-007',
          clientName: 'Elena Díaz',
          type: 'suggestion',
          subject: 'Programa de fidelidad',
          date: new Date('2025-02-27'),
          status: 'pending',
          description: 'Sería interesante tener un programa de puntos para clientes frecuentes.'
        },
        {
          id: 'QJ-2025-008',
          clientName: 'José Fernández',
          type: 'complaint',
          subject: 'Error en facturación',
          date: new Date('2025-03-01'),
          status: 'in-progress',
          description: 'La factura tiene datos incorrectos que necesito corregir para mi contabilidad.'
        }
      ]);
      
      // Filtrado de quejas
      const filteredComplaints = computed(() => {
        return complaints.value.filter(complaint => {
          const matchesType = filterType.value === 'all' || complaint.type === filterType.value;
          const matchesSearch = searchQuery.value === '' || 
            complaint.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            complaint.clientName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            complaint.id.toLowerCase().includes(searchQuery.value.toLowerCase());
          
          return matchesType && matchesSearch;
        });
      });
      
      // Filtrar por estado
      const getFilteredByStatus = (status: string) => {
        return filteredComplaints.value.filter(complaint => complaint.status === status);
      };
      
      // Formatear fecha
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);
      };
      
      // Texto de estado
      const getStatusText = (status: string) => {
        switch (status) {
          case 'pending': return 'Pendiente';
          case 'in-progress': return 'En Proceso';
          case 'resolved': return 'Resuelta';
          default: return status;
        }
      };
      
      return {
        activeTab,
        filterType,
        searchQuery,
        complaints,
        filteredComplaints,
        getFilteredByStatus,
        formatDate,
        getStatusText
      };
    }
  });
  </script>
  
  <style scoped>
  .tabs {
    display: flex;
    flex-direction: column;
  }
  
  .tabs-list {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .tab {
    padding: 0.75rem 1rem;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
  }
  
  .tab.active {
    border-bottom-color: #3b82f6;
    color: #3b82f6;
  }
  
  .card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  
  .card-header {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .card-description {
    color: #64748b;
    margin-top: 0.5rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .filters {
    display: flex;
    gap: 1rem;
  }
  
  .filter-select, .search-input {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  
  .complaints-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .complaints-table th, .complaints-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .complaints-table th {
    font-weight: 600;
    background-color: #f8fafc;
  }
  
  .type-badge, .status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .type-badge.complaint {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .type-badge.suggestion {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .status-badge.pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .status-badge.in-progress {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .status-badge.resolved {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .action-btn {
    padding: 0.25rem 0.5rem;
    margin-right: 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
  }
  
  .action-btn.view {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .action-btn.edit {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .no-results {
    padding: 2rem;
    text-align: center;
    color: #64748b;
    font-style: italic;
  }
  
  .flex {
    display: flex;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .pb-0 {
    padding-bottom: 0;
  }
  
  .pt-6 {
    padding-top: 1.5rem;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  @media (min-width: 768px) {
    .md\:w-auto {
      width: auto;
    }
    
    .md\:flex-none {
      flex: none;
    }
  }
  </style>