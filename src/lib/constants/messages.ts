export const ERROR_MESSAGES = {
  GENERIC: "Algo deu errado. Tente novamente em instantes.",
  UNAUTHENTICATED: "Sua sessão expirou. Faça login novamente.",
  INVALID_CREDENTIALS: "E-mail ou senha inválidos.",
  STARTUP_NOT_FOUND: "Startup não encontrada.",
  UPDATE_NOT_FOUND: "Update não encontrado.",
  PROFILE_NOT_FOUND: "Perfil não encontrado para o usuário atual.",
  PERMISSION_DENIED: "Você não tem permissão para realizar essa ação.",
  REQUIRED_FIELD: "Campo obrigatório.",
  EMAIL_RATE_LIMIT:
    "Muitas tentativas de cadastro em pouco tempo. Aguarde alguns minutos antes de tentar novamente.",
  SIGNUP_FAILED: "Não foi possível criar a conta. Tente novamente em instantes.",
} as const;

export const SUCCESS_MESSAGES = {
  STARTUP_CREATED: "Startup cadastrada com sucesso.",
  STARTUP_UPDATED: "Startup atualizada com sucesso.",
  STARTUP_DELETED: "Startup excluída com sucesso.",
  UPDATE_CREATED: "Update registrado com sucesso.",
} as const;
