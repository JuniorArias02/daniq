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
    body: '{{nombre}}, el secreto no es ganar más, es no gastar en cosas que no necesitas (como ese café carísimo).',
  },
  {
    id: 'bolsillo_chismoso',
    titulo: '👀 El bolsillo chismoso',
    body: 'Uno de tus bolsillos me contó que ya casi no tiene saldo. ¡Ten cuidado hoy, {{nombre}}!',
  },
  {
    id: 'sabiduria_daniq',
    titulo: '💡 Sabiduría de {{nombre}}',
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
    id: 'oferta_trampa',
    titulo: '🛍️ "Estaba en oferta"',
    body: 'Esa excusa ya nos la sabemos, {{nombre}}. Ve a registrar esa "excelente inversión" ahora mismo antes de que duela más.',
  },
  {
    id: 'suscripciones_zombie',
    titulo: '🧟‍♂️ Exterminio Zombie',
    body: '¿Sigues pagando esa suscripción que no usas, {{nombre}}? Revisa tus movimientos y elimina a los vampiros financieros.',
  },
  {
    id: 'gasto_hormiga',
    titulo: '🐜 ¡Ataque de hormigas!',
    body: 'Esa empanada diaria suma, {{nombre}}. No dejes que los gastos hormiga se lleven el mercado de la semana.',
  },
  {
    id: 'matematicas_daniq',
    titulo: '🧮 Matemáticas Dolorosas',
    body: '{{nombre}}, 2 + 2 son 4, y yo presiento que tu saldo está bajando. Entra a revisar los bolsillos antes del caos.',
  },
  {
    id: 'finde_peligro',
    titulo: '🚨 ¡Peligro de Fin de Semana!',
    body: 'Hola, {{nombre}}. Hoy es viernes con V de "Vaciar la cuenta". Mantén tus tarjetas amarradas y reporta todo.',
  },
  {
    id: 'domingo_arrepentimiento',
    titulo: '🫣 El Guayabo Financiero',
    body: 'Hoy es domingo de mirar cuánto te costó la rumba. Sé valiente, {{nombre}}, entra a Daniq y anótalo todo.',
  },
  {
    id: 'amnesia_financiera',
    titulo: '🧠 ¿Amnesia Temporal?',
    body: 'Yo sé que dolió pagar esa cuenta, {{nombre}}, pero el sistema no cuadra solo. ¡A registrar se dijo!',
  },
  {
    id: 'tarjeta_cansada',
    titulo: '💳 Tarjeta pidiendo auxilio',
    body: '{{nombre}}, tu tarjeta de crédito me llamó llorando pidiendo vacaciones. ¡Dale un respiro hoy!',
  },
  {
    id: 'shakira_mode',
    titulo: '🐺 Modo Facturador',
    body: 'La gente ya no llora, la gente factura... y tú, {{nombre}}, anotas todo en Daniq para no quedar en ceros.',
  },
  {
    id: 'bolsillos_felices',
    titulo: '📂 Bolsillos Felices',
    body: 'Tus bolsillos están saltando de alegría porque los mantienes bajo control. ¡Sigue así de juicioso, {{nombre}}!',
  }
];
