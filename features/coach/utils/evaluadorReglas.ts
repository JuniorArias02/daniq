export interface MetricasCoach {
  totalIngresosMesp: number;
  totalGastosMesp: number;
  conteoGastosPequenos: number;
  diasSinGastar: number;
  bloquePresupuesto?: number;
  bloqueGastado?: number;
}

export type TipoFeedbackCoach = 'regaño' | 'alerta' | 'felicitacion';

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
