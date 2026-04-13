export interface MetricasCoach {
  totalIngresosMesp: number;
  totalGastosMesp: number;
  conteoGastosPequenos: number;
  diasSinGastar: number;
  bloquePresupuesto?: number;
  bloqueGastado?: number;
}

export type TipoFeedbackCoach = 'regaño' | 'alerta' | 'felicitacion' | 'info';

export interface MensajeCoach {
  mensaje: string;
  tipo: TipoFeedbackCoach;
}

// Función helper para que el coach no diga siempre lo mismo (le da mucha más personalidad)
const fraseAleatoria = (frases: string[]): string => {
  return frases[Math.floor(Math.random() * frases.length)];
};

/**
 * Lógica nivel Dios pasivo-agresiva.
 * Evalúa un nuevo gasto frente a las métricas actuales del usuario.
 */
export const evaluarNuevoGasto = (montoGasto: number, metricas: MetricasCoach): MensajeCoach | null => {

  // 1. EL LLORÓN FINANCIERO (Bancarrota / Déficit)
  // Total gastos supera ingresos tras este gasto
  if (metricas.totalIngresosMesp > 0 && (metricas.totalGastosMesp + montoGasto) > metricas.totalIngresosMesp) {
    return {
      tipo: 'regaño',
      mensaje: fraseAleatoria([
        "¡ALERTA ROJA! Ya gastaste más de lo que ganaste. A comer arroz con huevo hermanito 📉.",
        "Mi pez, quedaste frito. Entraste en saldo en rojo. A ver si dejas de creerte estrato 6 💀.",
        "Paila asar. Estás oficialmente sobregirado. Que Dios te ampare porque yo no tengo pa' prestarte.",
        "¡Se te fue la mano! Ya estás debiendo hasta la risa este mes. Te toca empeñar algo 🤡.",
        "Oiga, ¿usted cree que es Luis Carlos Sarmiento o qué? Se pasó de sus ingresos, a llorar al campito."
      ])
    };
  }

  // 2. EL PREMIO MAYOR (Gasto MUY ALTO repentino, ej. >= 1 millón)
  if (montoGasto >= 1000000) {
    return {
       tipo: 'regaño',
       mensaje: fraseAleatoria([
         "¡Uf! Un palo en un solo tajazo. ¿Te ganaste el baloto o fue un papayazo absurdo? 💳.",
         "Ese movimiento me dolió hasta a mí y soy código. Más te vale que no sea otra bobada tuya.",
         "Un millón de pesos... parce, espero que al menos la inversión valga la pena y no sea pa' chicanear 💸.",
         "¡Qué totazo a la cuenta! Ese quemón de plata solo se justifica si te compraste un lote, ¿o no?",
         "¡Eavemaría! Ni Pablo Escobar soltaba la plata así de rápido. Ojo con el bolsillo manito."
       ])
    };
  }

  // 3. EL REGAÑO IMPULSIVO (Gasto único supera el 20% de sus ingresos)
  if (metricas.totalIngresosMesp > 0 && montoGasto > (metricas.totalIngresosMesp * 0.20)) {
    return {
      tipo: 'regaño',
      mensaje: fraseAleatoria([
        "Acabas de reventar el 20% de tus ingresos en UNA SOLA COMPRA. Mucho visaje, ¿no cree?",
        "Uy quieto, ¿así de rápido vas a quemar el sueldo? Ahorita a fin de mes no me pidas cacao.",
        "Se fue 1/5 del salario como si nada. Deje la calentura financiera y sea serio.",
        "Le abrieron un hueco a la billetera. Luego no estés diciendo 'marica, la plata no rinde nada' 🤡.",
        "Tanto trabajar pa' que te tires el veinte por ciento del sueldo en esto. Muy buena campeón..."
      ])
    };
  }

  // 4. EL SALVAVIDAS DE BOLSILLO (Reventando una meta / Presupuesto de bloque)
  if (metricas.bloquePresupuesto && metricas.bloquePresupuesto > 0) {
    const porcentaje = ((metricas.bloqueGastado || 0) + montoGasto) / metricas.bloquePresupuesto;
    
    if (porcentaje >= 1.0) {
      return {
        tipo: 'regaño',
        mensaje: fraseAleatoria([
          "Paila. Ese bolsillo quedó más seco que desierto. Se acabó la guachafita aquí 💥.",
          "Y listón, vaciaste el presupuesto de este bolsillo. ¿A punta de milagritos vas a llegar a fin de mes o qué?",
          "RIP bolsillo. Le diste chumbimba hasta que lo dejaste en cero. Ahora asume las consecuencias.",
          "Game Over para ese presupuesto. No intentes meterle más plata, ríndete no más.",
          "Uy no, lo exprimiste todo. Oficialmente toca chupar dedo de este bolsillo, manín."
        ])
      };
    } else if (porcentaje >= 0.8) {
      return {
        tipo: 'alerta',
        mensaje: fraseAleatoria([
          "Pilas, mi pez. Este bolsillo está al 80%. Vas a quedar pidiendo pista la otra semana.",
          "Te queda re poquito presupuesto acá. Mejor amárrate las manos antes de que la cagues.",
          "Alerta: El bolsillo ya huele a gladiolo. Frena el carro un momentico o mueres de inanición.",
          "Paciencia... te queda menos del 20% pa' gastar en esto. Deja el chucu-chucu y ahorra.",
          "Ojito que el saldo de este bolsillo está agonizando. Mejor relájate un rato, ¿no?"
        ])
      };
    }
  }

  // 5. GASTOS HORMIGA (El enemigo silencioso)
  if (montoGasto < 15000 && metricas.conteoGastosPequenos > 4) {
     return {
       tipo: 'alerta',
       mensaje: fraseAleatoria([
         `Uy, otro gastito, esa maricadita suma, parcero. De a 10 lucas en 10 lucas te quiebras 🐜.`,
         `¿Vas a seguir goteando la plata en bobaditas? ¡Cierra el grifo! Que esos gastitos te van a matar.`,
         `Otro antojito... Claro, total, 'pa eso trabajo' ¿cierto? Sigue así y vas a andar a pata todo el mes.`,
         `Ve este. Ya llevas como 5 compritas chiquitas en la semana. Pare la mano que también nos embargan.`,
         `Ojo con esos gastos hormiga. Uno menos y es el pan de bono, cinco más y pierdes el arriendo.`
       ])
     };
  }

  return null;
};

/**
 * Se llama al entrar a la app para felicitar (o presionar) si hay racha.
 */
export const evaluarRachaAbstinencia = (diasSinGastar: number): MensajeCoach | null => {
  // Racha God-Tier
  if (diasSinGastar >= 7) {
    return {
      tipo: 'felicitacion',
      mensaje: fraseAleatoria([
        `¡QUÉ BERRERA! Una semana entera sin gastar plata. ¿Andas enfermo o qué milagro pasó? 🧘‍♂️💰.`,
        `7 días sin tocar la cartera. Oficialmente eres el ídolo del ahorro. Mis respetos parcero.`,
        `Toda una semana invicto. La Dian debería darte un premio, la verdad. Qué temple.`,
        `Siete. Días. ¿Acaso te amarraron las manos? Excelente trabajo, ni yo lo veía venir.`,
        `Más de una semana sin mover un solo peso. Ya casi que hueles a plata vieja. Mantenlo así 🥇.`
      ])
    };
  }
  
  // Racha Normal
  if (diasSinGastar >= 3) {
    return {
      tipo: 'felicitacion',
      mensaje: fraseAleatoria([
        `¡Uy! Llevas 3 días sin botar plata. Seguí así que pronto salimos de esta pobreza 💪.`,
        `Tres días modo ahorro intenso. A este paso hasta puedes permitirte un tintico con buñuelo el domingo.`,
        `Increíble, ni un gasto en 3 días. Estás más juicioso que quinceañera castigada.`,
        `Epa, 3 días limpiecito de gastos. Aguántate las ganas otro poquito y nos hacemos ricos.`,
        `No has gastado nada ultimamente. Muy bien calidoso, ese es el camino del éxito 🔥.`
      ])
    };
  }
  
  return null;
};

/**
 * Evaluador General para el Widget Inteligente en el Dashboard.
 * Genera mensajes situacionales dependiendo del saldo y la inactividad, con +30 mensajes únicos.
 */
export const obtenerMensajeWidget = (metricas: MetricasCoach): MensajeCoach => {
  const { totalGastosMesp, totalIngresosMesp, diasSinGastar } = metricas;
  
  // 1. INACTIVIDAD ABSOLUTA (¿Se le olvidó usar la app?)
  if (diasSinGastar >= 14) {
    return {
       tipo: 'alerta',
       mensaje: fraseAleatoria([
         "Me parece raro tanta inactividad, apoco si no lo estas anotando?",
         "¿Llevas semanas sin gastar ni un peso o se te olvidó que yo existo y anotas en cuaderno?",
         "Ey, 14 días en ceros... si estás ahorrando de verdad así, pásame la receta para no comer.",
         "Mucho silencio financiero por aquí. Anota tus gastitos, no te me hagas el loco.",
         "Esta bien ahorrar pero al menos debes hacer mercado. No me mientas que ya estás flaco.",
         "O te secuestraron, o se te olvidó registrar tus gastos. Confírmame si sigues vivo anotando algo."
       ])
    };
  }

  // 2. AHORRO GOD-TIER PERO SOSPECHOSO (7 a 13 días sin gastar)
  if (diasSinGastar >= 7) {
    return {
       tipo: 'felicitacion',
       mensaje: fraseAleatoria([
         "¡Uf! Ya va una semana sin tocar la cuenta. Eres de hierro. Mantenlo así.",
         "Qué nivel de disciplina. Siete días invicto, espero no sea porque andas cobrando favores por ahí.",
         "Excelente racha ahorrativa. Si sigues así te va a alcanzar pa' la cuota inicial de la moto.",
         "Mucho cuidado con recompensarte y romper la racha comprando bobadas mañana.",
         "Impresionante. Más de una semana de resistencia pura. Tu billetera te manda un beso.",
         "Muy bien el ahorro, pero date un gusto pequeño hoy (algo de mil pesitos, ojo)."
       ])
    };
  }

  // 3. DEFICIT (Llorón Financiero en el Widget)
  if (totalIngresosMesp > 0 && totalGastosMesp >= totalIngresosMesp) {
    return {
       tipo: 'regaño',
       mensaje: fraseAleatoria([
         "Ahorita mismo tu saldo asusta más que el recibo de la luz. Estás en ROJO profundo.",
         "Bro, ya quemaste todo tu ingreso. Espero que el resto del mes sobrevivas a base de fotos de la nevera.",
         "Matemáticamente hablando, estás quebrado este mes. Deja de salir y métete debajo de las cobijas.",
         "Peligro, peligro. Gastaste más del 100% de lo que tienes. Si alguien te invita, di que andas indispuesto.",
         "Ni se te ocurra ir al centro comercial hoy. Es más, ni abras Mercadolibre. Quedaste pato.",
         "Si tus finanzas fueran un carro, irías rodando sin llantas y el motor fundido. Recapacita."
       ])
    };
  }

  // 4. PELIGRO DE SOBREGIRO (Gastó > 85% y sigue vivo)
  if (totalIngresosMesp > 0 && totalGastosMesp > (totalIngresosMesp * 0.85)) {
    return {
       tipo: 'alerta',
       mensaje: fraseAleatoria([
         "Pilas, ya vas por más del 85% quemado. Un tinto más y te toca vender el televisor.",
         "Estás que raspes la olla financiera. Bájale dos rayitas a la gastadera porque no aguantas.",
         "La billetera ya está en UCI. Evita todo tipo de antójitos innecesarios por favor.",
         "Solo te queda un poquito de presupuesto. Ni respires muy fuerte para que no te cobren el aire.",
         "A poco de quedarte limpio. Cuida esa platica como si fuera el último vaso de agua en el desierto.",
         "Alerta amarillísima, casi roja. Vas muy forzado con esos gastos."
       ])
    };
  }

  // 5. CAUTELOSO (Gastó > 50% y < 85%)
  if (totalIngresosMesp > 0 && totalGastosMesp > (totalIngresosMesp * 0.50)) {
     return {
       tipo: 'info',
       mensaje: fraseAleatoria([
         "Ya cruzaste el meridiano. La mitad del sueldo se fue a otra mejor vida. Ojo donde pones la otra mitad.",
         "Vas a mitad de camino, controla tus emociones financieras y no dejes que el consumismo te atrape.",
         "Ya quemamos más del 50%. A partir de hoy, piensa dos veces antes de pasar esa tarjeta.",
         "La meta es no llegar al 80%. Vas bien, pero mantente enfocado. Nada de salidas exóticas.",
         "Equilibrio, mi rey. Piensa en el 'yo del futuro' a fin de mes.",
         "Andamos cojeando a medio sueldo, no te confies que el mes sigue siendo muy largo."
       ])
     };
  }

  // 6. TIENE PLATA FRESCA (Gastó muy poco < 10% y tiene ingresos)
  if (totalIngresosMesp > 0 && totalGastosMesp < (totalIngresosMesp * 0.10)) {
    return {
       tipo: 'felicitacion',
       mensaje: fraseAleatoria([
         "Tienes platica fresca en la cuenta. Hazme un favor y haz de cuenta que eres pobre para no gastarla de un solo tacazo.",
         "Veo los ingresos fresquitos. ¡Ahorra por el amor de Dios y no te alborotes!",
         "Tienes la billetera gordita. Ese es tu superpoder ahorita mismo. Escóndela o te la auto-robas con empanadas.",
         "Mucho billete pero poca cabeza a veces. Mantengamos esos gastos casi en cero lo que más puedas.",
         "Recién pagado. Apenas para distribuir eso en cosas útiles y apartar el porcentaje pa' los gansos (el ahorro)."
       ])
    };
  }

  // 7. POR DEFECTO (Inicios, inactividad media 3-6 dias, nada de datos, etc)
  if (diasSinGastar >= 3) {
      return {
          tipo: 'info',
          mensaje: fraseAleatoria([
             "Llevas un par de días sin reportar gastos... ¿Estás ahorrando o se te olvidó cómo se maneja esto?",
             "Ojo que el Coach te observa. Llevas varios días quieto. Sigue así.",
             "Tres días sin movimientos. Me gusta la tranquilidad pero me asusta que de repente te compres un jet.",
             "Muy quieta la cuenta... O estás secuestrado o alcanzaste la paz interior consumista."
          ])
      };
  }

  return {
    tipo: 'info',
    mensaje: fraseAleatoria([
      "Analizando tu situación... todo tranquilo por ahora. Ve y trae más plata.",
      "Aquí ando vigilando tu billetera. No te atrevas a tocar ahorros hoy.",
      "Soy tu Pepe Grillo Financiero. Escribe tu próximo gasto y te diré si te odio por ello.",
      "Día normal, sin novedades. Aprovecha para leer algo de educación financiera.",
      "Hoy es un excelente día para seguir demostrando que tienes control de tus impulsos.",
      "Recuerda que cada peso cuenta. Sí, hasta la monedita con la que pagaste ese dulce."
    ])
  };
};
