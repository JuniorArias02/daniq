export interface MensajeNotificacion {
  id: string;
  titulo: string;
  body: string;
}

export const MENSAJES_DANIQ: MensajeNotificacion[] = [
  {
    id: 'billetera_llora',
    titulo: '💸 ¡Emergencia, {{nombre}}!',
    body: 'Tu billetera dice que la tienes abandonada. ¡Ven a registrar lo que gastaste hoy!',
  },
  {
    id: 'sushi_alert',
    titulo: '🍣 ¿Gusto culposo?',
    body: 'Ese antojito que te diste no se va a anotar solo, {{nombre}}. ¡Rápido, antes que se borre la memoria!',
  },
  {
    id: 'ahorro_fantasma',
    titulo: '👻 ¿A dónde se fue?',
    body: 'El dinero vuela, {{nombre}}. Si no lo anotas en Daniq, mañana será un misterio sin resolver.',
  },
  {
    id: 'motivacion_pro',
    titulo: '🚀 Daniq Pro Tip',
    body: '{{nombre}}, el secreto no es ganar más, es no gastar en cosas que no necesitas (como ese café de $20k).',
  },
  {
    id: 'bolsillo_chismoso',
    titulo: '👀 El bolsillo chismoso',
    body: 'Uno de tus bolsillos me contó que ya casi no tiene saldo. ¡Ten cuidado hoy, {{nombre}}!',
  },
  {
    id: 'sabiduria_daniq',
    titulo: '💡 Sabiduría {{nombre}}',
    body: '"El que no lleva la cuenta, termina debiendo la renta". ¡Anota ese gasto ahora!',
  },
  {
    id: 'paz_financial',
    titulo: '🧘 Relax, {{nombre}}',
    body: 'Abrir Daniq es como meditar, pero para tu bolsillo. Revisa tus cuentas y duerme tranquilo.',
  },
  {
    id: 'detective_gastos',
    titulo: '🕵️ Detective Daniq',
    body: '{{nombre}}, estoy buscando un gasto desaparecido. ¿Me ayudas a encontrarlo en tu historial?',
  },
  {
    id: 'privacidad_vip',
    titulo: '🔒 Tu Diario Secreto',
    body: '{{nombre}}, aquí tus gastos están más seguros que en una caja fuerte. ¡Nadie más que tú los ve!',
  },
  {
    id: 'meta_cerca_humor',
    titulo: '✈️ ¡Maletas listas!',
    body: 'Si sigues registrando así de bien, {{nombre}}, ese viaje va a ser una realidad muy pronto.',
  },
  {
    id: 'cafe_recordatorio',
    titulo: '☕ Cafeína y Cuentas',
    body: '¿Ya tomaste café, {{nombre}}? Espero que también hayas anotado el precio. ¡No te hagas el loco!',
  },
  {
    id: 'vibras_gastador',
    titulo: '🤑 ¡Vibras de Millonario!',
    body: 'Te veo con ganas de gastar hoy, {{nombre}}. Solo recuerda: ¡Regístralo todo en Daniq!',
  },
  {
    id: 'bolsillos_felices',
    titulo: '📂 Bolsillos Felices',
    body: 'Tus bolsillos están saltando de alegría porque los mantienes bajo control. ¡Sigue así, {{nombre}}!',
  }
];
