export const formatDate = (date: string | undefined) => {
  if (!date) return 'Data não informada';
  return new Date(date).toLocaleDateString('pt-BR');
};