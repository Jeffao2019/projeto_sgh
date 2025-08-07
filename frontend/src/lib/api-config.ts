// Configuração base da API
export const API_CONFIG = {
  BASE_URL: "http://localhost:3000",
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      CHANGE_PASSWORD: "/auth/change-password",
      PROFILE: "/auth/profile",
    },
    PACIENTES: {
      CREATE: "/pacientes",
      LIST: "/pacientes",
      BY_ID: (id: string) => `/pacientes/${id}`,
      UPDATE: (id: string) => `/pacientes/${id}`,
      DELETE: (id: string) => `/pacientes/${id}`
    },
    AGENDAMENTOS: {
      BASE: "/agendamentos",
      BY_PACIENTE: (pacienteId: string) =>
        `/agendamentos/paciente/${pacienteId}`,
      BY_MEDICO: (medicoId: string) => `/agendamentos/medico/${medicoId}`,
      BY_ID: (id: string) => `/agendamentos/${id}`,
      CONFIRMAR: (id: string) => `/agendamentos/${id}/confirmar`,
      CANCELAR: (id: string) => `/agendamentos/${id}/cancelar`,
      FINALIZAR: (id: string) => `/agendamentos/${id}/finalizar`,
    },
    PRONTUARIOS: {
      BASE: "/prontuarios",
      BY_PACIENTE: (pacienteId: string) =>
        `/prontuarios/paciente/${pacienteId}`,
      BY_MEDICO: (medicoId: string) => `/prontuarios/medico/${medicoId}`,
      BY_AGENDAMENTO: (agendamentoId: string) =>
        `/prontuarios/agendamento/${agendamentoId}`,
      BY_ID: (id: string) => `/prontuarios/${id}`,
    },
  },
};
