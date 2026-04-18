export const ptBR = {
  common: {
    loading: 'Carregando...',
    error: 'Erro',
    retry: 'Tentar novamente',
    save: 'Salvar',
    cancel: 'Cancelar',
    back: 'Voltar',
    configuring: 'Configurando Cawme...',
  },
  navigation: {
    home: 'Início',
    search: 'Buscar',
    dashboard: 'Dashboard',
    chat: 'Chat',
    notifications: 'Avisos',
  },
  auth: {
    loginTitle: 'Cawme',
    loginSubtitle: 'Sua solução para serviços domésticos',
    loginButton: 'Entrar com Keycloak',
    loginError: 'Erro ao realizar login',
  },
  home: {
    title: 'Início',
    loadError: 'Falha ao carregar a home',
  },
  chat: {
    title: 'Chat',
    roomsTitle: 'Conversas',
    emptyRooms: 'Inicie uma conversa',
    inputPlaceholder: 'Mensagem...',
    send: 'Enviar',
  },
  dashboard: {
    title: 'Dashboard',
    contractorTitle: 'Solicitações Recentes',
    providerActiveTitle: 'Agenda Ativa',
    providerPendingTitle: 'Novas Solicitações',
    loginRequired: 'Você precisa estar logado para ver o dashboard.',
    loadError: 'Erro ao carregar dashboard.',
  },
  notifications: {
    title: 'Avisos',
    empty: 'Você não tem notificações no momento.',
  },
  profile: {
    title: 'Perfil',
    about: 'Sobre',
    services: 'Serviços',
    loadError: 'Erro ao carregar o perfil do prestador.',
    reviews: 'avaliações',
  },
  search: {
    title: 'Buscar',
    placeholder: 'O que você precisa?',
    loadError: 'Erro ao buscar resultados.',
    empty: 'Nenhum resultado encontrado.',
  },
  errors: {
    networkTitle: 'Sem conexão',
    networkMessage: 'Verifique sua internet e tente novamente.',
    notFoundTitle: 'Não encontrado',
    notFoundMessage: 'O conteúdo que você procura não existe ou foi removido.',
    conflictTitle: 'Operação em conflito',
    conflictMessage: 'Esta ação não pode ser concluída pois há um conflito com o estado atual.',
    serverTitle: 'Erro no servidor',
    serverMessage: 'Algo deu errado no nosso lado. Aguarde um instante e tente novamente.',
    genericTitle: 'Algo deu errado',
    genericMessage: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  },
  root: {
    updateRequiredTitle: 'Atualização Obrigatória',
    updateRequiredBody: 'Uma nova versão do Cawme está disponível. Por favor, atualize o app para continuar.',
    updateButton: 'Atualizar Agora',
    configLoading: 'Configurando Cawme...',
    configErrorTitle: 'Sem conexão',
    configErrorBody: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    configRetry: 'Tentar novamente',
  }
};

export type LocaleKeys = typeof ptBR;
