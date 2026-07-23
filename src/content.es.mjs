/**
 * src/content.es.mjs
 * ---------------------------------------------------------------------------
 * Spanish content.
 *
 * IMPORTANT — this is NOT a machine translation of the English build.
 *
 * The firm already runs a professionally translated Spanish site at
 * dcmdlaw.com/es/. Everything below was imported from it verbatim: the
 * testimonials, case results, FAQs, TCPA consent text, the legal disclaimer,
 * the practice-area names, and the attorney titles are all the firm's own
 * published Spanish copy. Where a string had no published Spanish equivalent
 * (a few UI labels), it follows the register and vocabulary of the existing
 * pages — informal "tú", which is what the firm's Spanish site uses throughout.
 *
 * That distinction matters. A machine translation of a personal injury site is
 * a liability: "contributory negligence" and "statute of limitations" are terms
 * of art, and getting them wrong in a jurisdiction where 1% fault bars recovery
 * entirely is not a cosmetic error. This content was written by their
 * translator; we are importing it, not inventing it.
 */

export const es = {
  lang: 'es',
  langLabel: 'English',
  langHref: '/',
  tagline: 'Más de 125 Años de Experiencia Combinada Buscando Justicia',
  ui: {
    freeConsult: 'Consulta Gratuita',
    freeReview: 'Revisión gratuita de tu caso',
    call: 'Llámanos',
    contact: 'Contacto',
    reviews: 'Opiniones',
    text: 'Texto',
    open247: 'Estamos aquí 24/7',
    open247sub: '— consulta gratuita, 24/7',
    readMore: 'Leer más',
    showLess: 'Mostrar menos',
    viewAll: 'Ver Todos',
    directions: 'Direcciones',
    loadMap: 'Cargar mapa',
    ourOffices: 'Nuestras Oficinas',
    required: '* Obligatorio',
    home: 'Inicio',
  },
  nav: [
    { label: 'Nosotros', items: [
      { t: 'Acerca de Nosotros', h: '/es/sobre-nosotros/' },
      { t: 'Resultados de Casos', h: '/es/resultados-de-casos/' },
      { t: 'Nuestros Abogados', h: '/es/nuestros-abogados/' },
      { t: 'Testimonios', h: '/es/testimonios/' },
    ]},
    { label: 'Lesiones Personales', items: [
      { t: 'Accidentes de Auto', h: '/es/areas-de-practica/accidentes-de-auto/' },
      { t: 'Accidentes de Camión', h: '/es/areas-de-practica/accidentes-de-camion/' },
      { t: 'Accidentes de Moto', h: '/es/areas-de-practica/accidentes-de-moto/' },
      { t: 'Compensación Laboral', h: '/es/areas-de-practica/compensacion-laboral/' },
      { t: 'Resbalones y Caídas', h: '/es/areas-de-practica/resbalones-y-caidas/' },
      { t: 'Mordeduras de Perro', h: '/es/areas-de-practica/mordeduras-de-perro/' },
      { t: 'Ver + ', h: '/es/areas-de-practica/', all: true },
    ]},
    { label: 'Áreas de Servicio', items: [
      { t: 'Lanham', h: '/es/areas-de-servicio/lanham/' },
      { t: 'Waldorf', h: '/es/areas-de-servicio/waldorf/' },
      { t: 'Condado de Charles', h: '/es/areas-de-servicio/condado-de-charles/' },
      { t: 'Condado de Prince George', h: '/es/areas-de-servicio/condado-de-prince-george/' },
    ]},
  ],
  home: {
    title: 'Abogados de Lesiones Personales en Maryland | Alpert Schreyer',
    desc: '¿Fuiste lesionado por la negligencia de otra persona en Maryland? Llama a Alpert Schreyer Personal Injury Lawyers al (301) 932-9997. Consulta gratuita.',
    eyebrow: 'Experiencia y Dedicación',
    h1: 'Abogados de Lesiones Personales en <em>Maryland</em>',
    sub: 'Centrados en tu Recuperación Total',
    ledger: [
      { n: '$100M+', l: 'Recuperados para clientes' },
      { n: '125+', l: 'Años de experiencia' },
      { n: '4', l: 'Oficinas en Maryland' },
    ],
    introEyebrow: 'Los Mejores Abogados de Lesiones Personales de Maryland',
    introH: 'Necesitas un abogado de lesiones personales que te ayude a GANAR tu caso.',
    intro: [
      `En Maryland ocurren accidentes, pero no deberías tener que pagar el precio de la negligencia de otra persona. En Alpert Schreyer Personal Injury Lawyers, nuestros abogados de lesiones personales comprenden lo abrumadora que puede ser una lesión. Ahí es donde intervenimos.`,
      `Nuestro experimentado equipo jurídico se dedica a luchar por tus derechos y a conseguir la indemnización que necesitas para seguir adelante. Tanto si te lesionaste en un accidente de auto, un resbalón o caída, un incidente laboral u otro tipo de accidente, tenemos los conocimientos necesarios para ocuparnos de todo.`,
      `Permítenos quitarte la carga legal de encima para que puedas concentrarte en curarte. Ponte en contacto con nosotros hoy mismo para una consulta gratuita y descubre cómo podemos ayudarte a que obtengas la justicia y la indemnización que te corresponden.`,
    ],
    helpH: '¿Cómo Pueden Ayudar Alpert Schreyer Personal Injury Lawyers tras un Accidente?',
    helpLede: 'En Alpert Schreyer Personal Injury Lawyers, nos encargamos de todo el trabajo legal para que puedas concentrarte en lo que de verdad importa: tu recuperación.',
    help: [
      { b: 'Investigando tu caso:', t: 'Reuniremos pruebas, entrevistaremos a testigos y trabajaremos con expertos para construir un caso sólido en tu nombre.' },
      { b: 'Tratando con las compañías de seguros:', t: 'Las aseguradoras suelen intentar minimizar los pagos, pero conocemos sus tácticas. Negociaremos agresivamente para asegurarnos de que obtienes una indemnización justa.' },
      { b: 'Calculando tus daños:', t: 'No se trata solo de las facturas médicas. Tendremos en cuenta el lucro cesante, el dolor y el sufrimiento, los gastos futuros y mucho más para maximizar tu reclamo.' },
      { b: 'Llevando tu caso a los tribunales (si es necesario):', t: 'Aunque muchos casos llegan a un acuerdo, siempre estamos dispuestos a luchar por ti en los tribunales si eso es lo que hace falta para ganar.' },
      { b: 'Te damos tranquilidad:', t: 'Las batallas legales pueden ser estresantes, pero con nosotros a tu lado, nunca tendrás que afrontarlas solo.' },
    ],
    whyH: '¿Por qué Debería Contratar a un Abogado de Lesiones Personales?',
    why: [
      { h: 'Te Mereces un Abogado con Experiencia', p: 'Los casos complejos de lesiones exigen conocer las leyes sobre seguros y lesiones. Los errores en el proceso de reclamo pueden reducir drásticamente tu indemnización. Las aseguradoras intentarán aprovecharse de tus errores y presionarte para que aceptes ofertas inadecuadas.' },
      { h: 'Determinar el Valor Real de tu Reclamo', p: 'No aceptes la evaluación de la aseguradora al pie de la letra. Pueden culparte o restar importancia a tus daños para limitar su responsabilidad. Nunca debes aceptar una oferta inicial sin consultar a un abogado.' },
      { h: 'Priorizar tu Recuperación', p: 'La recuperación tras un accidente requiere mucho descanso. No deberías tener que administrar reclamos al seguro cuando estás concentrado en tu salud. Tu abogado de accidentes se encargará de todos los aspectos de tu caso.' },
      { h: 'Protección Contra el Injusto Desplazamiento de Culpas', p: 'Las aseguradoras suelen culpar a las víctimas. Las estrictas leyes de negligencia contribuyente de Maryland te impiden recuperar una indemnización si compartes incluso una culpa menor. Un abogado con experiencia puede defenderte contra una falsa culpabilidad.' },
    ],
    caseH: '¿Tengo un Caso de Lesiones Personales?',
    case: [
      `Los casos de lesiones personales surgen tras accidentes o lesiones concretos, principalmente los derivados de la conducta negligente o ilícita de otra persona. Si has sufrido lesiones en un accidente debido al descuido de otra persona, es probable que tengas motivos para presentar una demanda. También puedes reclamar si otra persona te perjudicó a propósito o incumplió una norma de seguridad, lo que provocó tus lesiones.`,
    ],
    caseList: [
      'Estuviste involucrado en un accidente de vehículo causado por la conducción distraída de otro conductor.',
      'Un conductor negligente chocó con tu motocicleta por no respetar las normas de tránsito.',
      'Has sufrido daños a manos de un médico que te ha administrado un tratamiento deficiente.',
      'Sufriste una caída en un negocio debido a la negligencia del propietario a la hora de identificar los peligros.',
      'Has sufrido lesiones por el uso de un producto defectuoso.',
    ],
    experienceH: 'La Experiencia que Quieres a tu Lado',
    experience: [
      `Para nosotros, tu caso no es un expediente más: es tu futuro, y nos lo tomamos muy en serio. En Alpert Schreyer Injury Lawyers, nuestra prioridad es comprender de verdad tu historia, tus necesidades y tus objetivos.`,
      `Cada estrategia jurídica que elaboramos está diseñada específicamente para ti. Tanto si se trata de negociar un acuerdo justo como de defenderte en los tribunales, tenemos la experiencia y la determinación necesarias para enfrentarnos incluso a los adversarios más duros.`,
    ],
    costH: '¿Cuánto Cuesta Contratar a un Abogado de Lesiones Personales?',
    cost: [
      `¿Te preocupa el costo de contratar a un abogado de lesiones personales? No te preocupes. En Alpert Schreyer Personal Injury Lawyers, creemos que todo el mundo se merece una representación legal de calidad, independientemente de su situación económica. Por eso trabajamos con honorarios condicionales.`,
      `Con esta estructura de honorarios, no pagas honorarios legales por adelantado ni por horas: nuestro pago es un porcentaje de la indemnización que recuperemos para ti. En tu consulta gratuita te explicamos exactamente cómo funcionan los honorarios y los costos del caso, antes de que firmes nada.`,
      `Cuando trabajas con nosotros, estás obteniendo un equipo de abogados especializados en lesiones personales que se comprometen plenamente con tu caso. Sin barreras económicas, sin honorarios ocultos: solo resultados.`,
    ],
    resultsH: 'Nuestros Resultados Hablan por sí Solos',
    ctaH: '¿Listo para Comenzar?',
    ctaSub: 'Consulta gratuita.',
    attorneysH: 'Nuestros Abogados',
    attorneysSub: 'Nuestros clientes eligen a nuestros abogados antes que a otros despachos porque demostramos una excelente relación con el cliente y resultados satisfactorios.',
    reviewsH: 'Opiniones de Clientes',
    contactH: 'Ponte en Contacto con Nuestros Abogados para una Consulta Inicial Gratuita',
    contact: [
      `Una lesión personal puede poner tu vida de cabeza, pero no tienes por qué afrontarlo solo. En Alpert Schreyer Personal Injury Lawyers, estamos aquí para luchar por tus derechos, manejar las complejidades legales y asegurarnos de que obtienes la indemnización que necesitas para seguir adelante.`,
      `Ya has padecido bastante. Déjanos quitarte ese peso de encima para que puedas concentrarte en recuperarte. Con nuestra experiencia, dedicación y promesa de no cobrar nada si no ganas, no tienes nada que perder, solo ganar justicia.`,
    ],
  },
  caseResults: [
    { amt: '$5,500,000', desc: 'Veredicto por Complicaciones Postoperatorias', feature: true },
    { amt: '$3,750,000', desc: 'Acuerdo por Lesiones de Nacimiento' },
    { amt: '$2,900,000', desc: 'Indemnización por Retraso Quirúrgico' },
    { amt: '$2,600,000', label: 'Sentencia del Jurado — Ciudad de Baltimore', desc: 'Una empresa constructora y la ciudad de Baltimore crearon un peligro vial al instalar una valla de 4.5 metros de largo que podía abrirse hacia el tránsito en sentido contrario. La valla de tubo de acero golpeó a un automóvil que pasaba y causó lesiones cerebrales permanentes al conductor.' },
    { amt: '$2,000,000', desc: 'Retraso en el Desarrollo de un Bebé Consecuencia de Lesión de Nacimiento' },
    { amt: '$2,000,000', label: 'Accidente con Vehículo Industrial', desc: 'Junio de 2014 – Accidente con un vehículo comercial en los suburbios de Washington, DC. Falleció un pasajero, el conductor sufrió lesiones pulmonares potencialmente mortales y fracturas bilaterales de muñeca.' },
    { amt: '$543,000', desc: 'Un jurado otorgó <b>$543,000</b> en el Condado de Prince George después de que la defensa solo ofreciera <b>$5,000</b> por las lesiones de nuestro cliente.' },
  ],
  gap: {
    eyebrow: 'Experiencia comprobada',
    h: 'Lo que ofreció la aseguradora.<br>Lo que <em>otorgó el jurado.</em>',
    note: 'Un jurado otorgó <strong style="color:#fff">$543,000</strong> en el Condado de Prince George después de que la defensa solo ofreciera <strong style="color:#fff">$5,000</strong> por las lesiones de nuestro cliente. Las barras están dibujadas a escala.',
    them: 'Oferta de la defensa',
    us: 'Veredicto del jurado',
    x: 'veces la oferta',
  },
  testimonials: [
    { author: 'Eli Natoli', text: `¡No puedo dejar de recomendar a Alpert Schreyer Injury Lawyers! Elegimos el despacho para un caso muy difícil de accidente de auto. Todos han sido de gran ayuda. Nos mantuvieron informados durante todo el proceso y llegaron hasta el final con un resultado excepcional. ¡Llámalos! ¡Son fantásticos!` },
    { author: 'Wendy Watson', text: `Mi experiencia con el Sr. Berman fue mejor de lo que esperaba. Me hizo sentir muy segura. Fue extremadamente minucioso en la representación de mi caso. El Sr. Berman nunca cedió y fue muy agresivo al defenderme. Lo recomendaría encarecidamente para defender a cualquiera que necesite ayuda. Le estoy eternamente agradecida por todo lo que ha hecho.` },
    { author: 'Tina Wagner', text: `Estoy muy contenta con el resultado de mi caso. El Sr. Schreyer es un árbitro brillante y se ocupó de todo de principio a fin. Mi indemnización final superó mis expectativas. Recomiendo encarecidamente este grupo si necesitas un abogado.` },
    { author: 'Richard Ednie', text: `Mi abogado, Chris, ¡fue excelente! Me guió durante todo el proceso de mi caso de lesiones personales y quedé muy satisfecho con el resultado. Donna, la asistente jurídica asignada a mi caso no podría haber sido mejor. Donna me mantuvo informado y respondió a todas mis preguntas. Muy receptiva. Sin duda recomendaría este despacho.` },
    { author: 'Cliente Satisfecho', text: `El cheque del acuerdo se cobró la semana pasada. Gracias de nuevo por todo tu duro trabajo en mi caso. Estoy muy satisfecho con el resultado. Ha sido un placer trabajar contigo (¡aunque espero no tener que hacerlo nunca más!).` },
  ],
  faqs: [
    { q: '¿Qué Tipo de Indemnizaciones Pueden Solicitar las Víctimas de Accidentes?',
      aText: 'En los casos de lesiones personales, los daños se dividen en dos categorías principales: daños económicos y no económicos. En los casos en que la conducta de la parte culpable haya sido maliciosa, pueden concederse daños punitivos.',
      a: `<p>Si has sufrido lesiones por la negligencia de otra persona en Maryland, puedes tener derecho a una indemnización, pero ¿qué puedes recuperar exactamente? En los casos de lesiones personales, los daños se dividen en dos categorías principales: daños económicos y no económicos.</p>
      <p>Los daños económicos son pérdidas financieras tangibles relacionadas con tu lesión, entre ellas:</p>
      <ul><li>Facturas médicas</li><li>Fisioterapia</li><li>Salarios perdidos</li><li>Pérdida de capacidad laboral</li><li>Daños materiales</li><li>Gastos de bolsillo</li></ul>
      <p>Los daños no económicos compensan los daños físicos y emocionales que te ha causado la lesión, incluidos:</p>
      <ul><li>Dolor y sufrimiento</li><li>Angustia emocional</li><li>Pérdida del disfrute de la vida</li><li>Desfiguración o cicatrización</li><li>Pérdida de compañía</li></ul>
      <p>En los casos en que la conducta de la parte culpable haya sido maliciosa o especialmente atroz, pueden concederse daños punitivos. Con ellos se pretende castigar al infractor y disuadir de comportamientos similares en el futuro.</p>` },
    { q: '¿Cuánto Tiempo tengo para Presentar una Demanda por Lesiones Personales en Maryland?',
      aText: 'La ley de Maryland establece un estricto plazo de prescripción. En la mayoría de los casos de lesiones personales, tienes tres años desde la fecha del accidente para presentarla.',
      a: `<p>Como tal vez ya sepas, tras una lesión no tienes toda la vida para iniciar acciones legales. La ley de Maryland establece un estricto plazo de prescripción para presentar una demanda. En la mayoría de los casos de lesiones personales, tienes tres años desde la fecha del accidente para presentarla (con algunas excepciones limitadas). Si no cumples el plazo aplicable, podrías perder tu derecho a la indemnización.</p>
      <p>Además, esperar demasiado para iniciar el reclamo puede perjudicar tus posibilidades de éxito. Las pruebas se desvanecen, los testigos olvidan detalles, y las compañías de seguros intentarán retrasarlo. Cuanto antes actúes, más sólido será tu caso.</p>` },
    { q: '¿Puedo Recuperar una Indemnización si me Culpan de un Accidente en Maryland?',
      aText: 'Maryland sigue una norma de negligencia contributiva pura. Si se determina que tuviste aunque solo fuera un 1% de culpa, es posible que se te prohíba recuperar indemnización alguna.',
      a: `<p>Si te has lesionado en un accidente, puedes suponer que tienes derecho a una indemnización, pero Maryland tiene una de las leyes de culpa compartida más duras del país. Con arreglo a la teoría de la negligencia puramente contributiva, si se determina que tuviste aunque solo fuera un 1% de culpa en el accidente, es posible que se te prohíba por completo recuperar indemnización alguna.</p>
      <p>Maryland es uno de los pocos estados que sigue una norma de negligencia contributiva pura. Esto significa que si la otra parte puede demostrar que tuviste alguna responsabilidad —por pequeña que sea—, es posible que no puedas recuperar los daños.</p>
      <p>Las leyes de Maryland son duras, pero sabemos cómo ganar casos difíciles. Si te has lesionado, no dejes que la compañía de seguros utilice la negligencia contribuyente contra ti.</p>` },
    { q: '¿Irá a Juicio mi Caso de Lesiones Personales?',
      aText: 'Más del 90% de los casos de lesiones personales llegan a un acuerdo. Sin embargo, algunos casos tienen más probabilidades de llegar a juicio que otros.',
      a: `<p>Más del 90% de los casos de lesiones personales llegan a un acuerdo. Las compañías de seguros suelen preferir llegar a un acuerdo antes que arriesgarse a un litigio costoso e imprevisible. Sin embargo, algunos casos tienen más probabilidades de llegar a juicio que otros.</p>
      <p>Tu caso puede requerir juicio si:</p>
      <ul><li>La compañía de seguros infravalora tus daños y se niega a negociar un acuerdo justo.</li><li>La aseguradora te culpa del accidente o te acusa de no haber mitigado los daños.</li><li>Hay varias partes culpables en tu caso.</li></ul>` },
    { q: '¿Cuánto Vale mi Caso de Lesiones Personales?',
      aText: 'Cada reclamo es único. Los factores clave son los gastos médicos, los salarios perdidos, el dolor y sufrimiento, los daños materiales y la cobertura del seguro.',
      a: `<p>Una de las preguntas más habituales que nos hacen es: "¿Cuánto vale mi caso de lesiones personales?". La respuesta depende de varios factores, pero en Alpert Schreyer Personal Injury Lawyers trabajaremos sin descanso para maximizar tu indemnización.</p>
      <ul>
        <li><strong>Gastos Médicos</strong>: Las facturas médicas actuales y futuras, la rehabilitación y el tratamiento necesario se tendrán en cuenta en tu reclamo.</li>
        <li><strong>Salarios Perdidos y Potencial de Ingresos</strong>: Si tu lesión te hizo faltar al trabajo o afectó a tu capacidad de obtener ingresos en el futuro, lucharemos por recuperar esas pérdidas.</li>
        <li><strong>Dolor y Sufrimiento</strong>: La indemnización no se limita a las pérdidas económicas.</li>
        <li><strong>Daños Materiales</strong>: Si tu vehículo o tus efectos personales resultaron dañados, sus costos de reparación o sustitución se incluyen en tu reclamo.</li>
        <li><strong>Responsabilidad y Cobertura del Seguro</strong>: La póliza de seguro de la parte culpable y su nivel de responsabilidad influyen en la cantidad final del acuerdo.</li>
      </ul>` },
  ],
  practiceAreas: [
    { slug: 'accidentes-de-auto', name: 'Accidentes de Auto', enSlug: 'car-accidents', icon: '/assets/media/202501-group-2.svg',
      blurb: 'En Maryland se producen accidentes de auto todos los días. Tanto si te atropelló un conductor ebrio, distraído o negligente, te mereces una indemnización justa por tus lesiones.' },
    { slug: 'accidentes-de-camion', name: 'Accidentes de Camión', enSlug: 'truck-accidents', icon: '/assets/media/202601-car-icon-waldorf.svg',
      blurb: 'Los accidentes con camiones comerciales suelen causar lesiones graves. Podemos ayudarte a responsabilizar al conductor y a la empresa de transporte.' },
    { slug: 'accidentes-de-moto', name: 'Accidentes de Moto', enSlug: 'motorcycle-accidents', icon: '/assets/media/202501-group-4.svg',
      blurb: 'Los datos del Departamento de Transporte de Maryland informan de que el estado tiene un promedio de 73 víctimas mortales al año por accidentes de moto. La mayoría pueden evitarse.' },
    { slug: 'compensacion-laboral', name: 'Compensación Laboral', enSlug: 'workers-compensation', icon: '/assets/media/202411-ico-workers-comp.svg',
      blurb: 'Si te lesionaste en el trabajo, puedes tener derecho a prestaciones por compensación laboral. Nuestros abogados pueden ayudarte a conseguir lo que te corresponde.' },
    { slug: 'resbalones-y-caidas', name: 'Resbalones y Caídas', enSlug: 'slip-and-fall', icon: '/assets/media/202411-ico-slip-and-fall.svg',
      blurb: 'Los propietarios tienen el deber de mantener sus instalaciones seguras. Si te lesionaste en un resbalón o caída, podemos ayudarte a solicitar una indemnización.' },
    { slug: 'mordeduras-de-perro', name: 'Mordeduras de Perro', enSlug: 'dog-bites', icon: '/assets/media/202411-ico-dog-bites.svg',
      blurb: 'Si tú o un ser querido fueron mordidos por el perro de otra persona, el propietario puede ser responsable de los daños resultantes.' },
  ],
  areaPages: [
    { slug: 'lanham', name: 'Lanham', office: 'lanham', enSlug: 'lanham' },
    { slug: 'waldorf', name: 'Waldorf', office: 'waldorf', enSlug: 'waldorf' },
    { slug: 'condado-de-charles', name: 'Condado de Charles', office: 'waldorf', enSlug: 'charles-county' },
    { slug: 'condado-de-prince-george', name: 'Condado de Prince George', office: 'lanham', enSlug: 'prince-georges-county' },
  ],
  attorneyRoles: {
    'andrew-d-alpert': 'Socio Fundador',
    'christopher-murphy': 'Socio',
    'ryan-zabel': 'Abogado',
    'john-g-costello': 'Abogado',
  },
  consentText: `Al marcar esta casilla, aceptas recibir mensajes de texto de Alpert Schreyer Injury Accident Lawyers. Puedes responder STOP para darte de baja en cualquier momento. Responde HELP para recibir ayuda. Se pueden aplicar tarifas de mensajes y datos. La frecuencia de los mensajes puede variar.`,
  disclaimer: `La información obtenida en este sitio no constituye, ni pretende constituir, asesoramiento jurídico. Debe consultar a un abogado para que le asesore sobre su situación particular. Le invitamos a ponerse en contacto con nosotros y agradecemos sus llamadas, cartas y correo electrónico. El hecho de ponerse en contacto con nosotros no crea una relación abogado-cliente. Por favor, no nos envíe ninguna información confidencial hasta que se haya establecido una relación abogado-cliente. Este sitio web no está destinado a solicitar clientes para asuntos fuera del estado de Maryland. Servimos a todo Maryland.`,
  aboutBlurb: `Los abogados de Alpert Schreyer Injury Lawyers tienen más de 125 años de experiencia luchando por las víctimas lesionadas en todo Maryland. Nuestro dedicado equipo aprovecha sus puntos fuertes para ofrecer resultados excepcionales, incluso en los casos más difíciles. Ponte en contacto con nosotros hoy mismo para hablar con un abogado de confianza y programa tu consulta gratuita para explorar tus opciones legales.`,
  areasBlurb: `Alpert Schreyer Injury Lawyers atiende a clientes lesionados en todo Maryland. Nuestras oficinas están convenientemente ubicadas en Lanham, Waldorf, Frederick y Rockville, MD. Nuestros abogados también prestan servicio en Accokeek, Annapolis, Baltimore, Bowie, College Park, California, Columbia, Frederick, Hughesville, Huntingtown, Landover, LaPlata, Laurel, Lexington Park, Mechanicsville, Upper Marlboro y Prince Frederick, MD, pero no exclusivamente a ellos.`,
  form: {
    heading: 'Obtén una consulta gratuita',
    sub: 'Consulta gratuita. Respondemos el mismo día hábil.',
    name: 'Nombre', phone: 'Teléfono', email: 'Correo electrónico', zip: 'Código Postal',
    case: 'Describe tu caso', casePh: '¿Qué pasó y cuándo?',
    hear: '¿Cómo te enteraste de nosotros?', select: 'Selecciona una opción',
    consent: 'Consentimiento', readTerms: 'Leer términos completos', hideTerms: 'Ocultar términos',
    submit: 'Solicitar mi revisión gratuita',
    noRel: 'Ponerse en contacto con nosotros no crea una relación abogado-cliente.',
    okB: 'Solicitud recibida',
    okP: 'Un miembro de nuestro equipo te llamará al número que proporcionaste. Si es urgente, llama al',
    errName: 'Por favor, introduce tu nombre.',
    errPhone: 'Introduce un número de teléfono de 10 dígitos.',
    errEmail: 'Introduce una dirección de correo electrónico válida.',
    errZip: 'Introduce un código postal de 5 dígitos.',
    errCase: 'Cuéntanos brevemente qué pasó.',
    errConsent: 'Marca la casilla de consentimiento para que podamos contactarte.',
    fix: 'Por favor, corrige los campos marcados.',
    sending: 'Enviando…',
    sent: 'Solicitud enviada.',
    failed: 'Algo salió mal. Por favor, llama al (301) 932-9997.',
  },
  reviewSheet: {
    title: 'Deja una opinión en Google',
    sub: 'Unos 30 segundos. Necesitarás una cuenta de Google.',
    officeQ: '¿Qué oficina te atendió?',
    officeSub: 'Cada oficina tiene su propia ficha de Google.',
    promptQ: '¿No sabes qué decir?',
    promptSub: 'Son solo recordatorios — escríbelo con tus propias palabras.',
    chips: ['¿Con quién trabajaste?', '¿Qué problema tenías?', '¿Cómo te mantuvieron informado?', '¿Qué le dirías a un amigo?'],
    hint: 'Las opiniones deben ser tu experiencia honesta. No podemos escribirla por ti, y no querríamos hacerlo — los detalles concretos son lo que realmente ayuda a alguien a decidir.',
    stepsQ: 'Qué pasa después',
    steps: ['Google se abre con nuestra ficha y la casilla de estrellas lista.', 'Elige tus estrellas, escribe una o dos frases y pulsa <b>Publicar</b>.', 'Ya está. Aparece en nuestra ficha — y aquí — en un día aproximadamente.'],
    qr: 'Escanea con tu teléfono para terminar allí',
    altB: '¿Prefieres decírnoslo en privado?',
    altP: 'Envíalo directamente al socio director. Esto es independiente de Google — puedes hacer una cosa, ambas o ninguna.',
    altBtn: 'Compartir en privado',
    go: 'Abrir la casilla de opiniones de Google',
    legal: 'Se abre Google en una pestaña nueva. No podemos ver, editar ni eliminar lo que escribas — es tuyo.',
    ask: 'Escribe una opinión en Google',
    askH: '¿Estuvimos ahí cuando importaba? Cuéntaselo a la gente.',
    askP: 'Una opinión en Google tarda unos 30 segundos y ayuda al siguiente residente de Maryland lesionado a decidir en quién confiar. Elige tu oficina y te llevaremos directo a la casilla de opiniones.',
    askEyebrow: 'Clientes anteriores',
    thanks: 'Gracias — tu opinión significa mucho.',
  },
  reviews: {
    eyebrow: 'Opiniones de Google',
    h: 'Lo que dicen los clientes',
    basedOn: 'Basado en', gReviews: 'opiniones de Google', seeAll: 'Ver todas en Google',
    top: 'Mejor valoradas', recent: 'Más recientes',
    fromGoogle: 'Opiniones de Google · actualizado', leave: 'Deja una opinión',
    postedOn: 'Publicado en Google', sample: 'Muestra — no de Google',
    loading: 'Las opiniones se están cargando desde Google.',
    demoB: 'Vista previa: estos son datos de muestra, no opiniones reales de Google.',
    demoP: 'Así se ve la sección una vez conectada la API de Places. Las palabras y los nombres son los testimonios publicados del despacho en lugar de datos de Google; las fechas son marcadores de posición.',
  },
  footer: {
    about: 'Acerca de Nosotros', areas: 'Áreas a las que Atendemos', quick: 'Enlaces Rápidos',
    call: 'Llámanos', viewAllAreas: 'Ver todas las áreas',
    rights: 'Todos los Derechos Reservados',
    privacy: 'Política de Privacidad', disclaimer: 'Aviso Legal', sitemap: 'Mapa del Sitio',
  },
};
