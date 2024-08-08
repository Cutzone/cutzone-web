export function timestampToTime(timeObject: {
  nanoseconds: number;
  seconds: number;
}): string {
  // Cria um novo objeto de data a partir dos segundos fornecidos.
  const date = new Date(timeObject.seconds * 1000);

  // Função para adicionar um zero à esquerda se o número for menor que 10.
  const pad = (num: number) => num.toString().padStart(2, "0");

  // Formata a hora e o minuto.
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  // Retorna a hora formatada como "hh:mm".
  return `${hours}:${minutes}`;
}
