/* ========== DATABASE (localStorage) ========== */

const DB_KEY = 'piscineintime_db';

const defaultData = {
  products: {
    // IDROMASSAGGI (3 esempi)
    idro: [
      { nome: 'Vasca Idromassaggio Relax 180', desc: 'Vasca per 2 persone con 12 idrogetti, cromoterapia e riscaldamento integrato. Dimensioni: 180x80x70 cm.', img: 'img/placeholder.jpg' },
      { nome: 'Spa Family 6 posti', desc: 'Vasca idromassaggio angolare per 6 persone, 24 getti massaggianti, LED RGB, sistema di filtrazione e ozono.', img: 'img/placeholder.jpg' },
      { nome: 'Spa Premium 4 posti con lettino', desc: 'Design ergonomico, 18 getti orientabili, aromaterapia, coperchio isotermico e scaletta in acciaio.', img: 'img/placeholder.jpg' }
    ],
    // PRODOTTI CHIMICI
    chimici: [
      { nome: 'Magiclor – Dicloro Rapido Granulare (1 kg)', desc: 'Cloro granulare a rapida dissoluzione a base di Sodio Dicloroisocianurato. Ideale per trattamenti shock e disinfezione rapida dell\'acqua della piscina. Dosaggio consigliato: 10–15 g per m³ ogni due ore. Regolare il pH prima del trattamento.', img: 'img/dicloro.jpeg', prezzo: 18.90 },
      { nome: 'Clorolong – Pastiglie di Tricloro 90% da 20 g (1 kg)', desc: 'Pastiglie di Tricloro stabilizzato al 90% da 20 g per il trattamento di mantenimento dell\'acqua della piscina. 1 pastiglia per ogni 10 m³ ogni 7 giorni. Da inserire nel cestello degli skimmer, lasciando filtrare l\'acqua attraverso l\'impianto. Non utilizzare in combinazione con altri prodotti contenenti cloro.', img: 'img/pastiglie_tricloro.jpeg', prezzo: 16.90 },
      { nome: 'Clorolong – Pastiglie di Tricloro 90% da 200 g (1 kg)', desc: 'Pastiglie di Tricloro stabilizzato al 90% da 200 g per piscine più grandi. Lenta dissoluzione per un trattamento continuo di lunga durata. Dosaggio indicativo per ogni m³ d\'acqua. Inserire nell\'apposito diffusore o nel cestello degli skimmer. Non combinare con altri prodotti al cloro.', img: 'img/clorolong.jpeg', prezzo: 19.90 },
      { nome: 'Redminus – Riduttore di pH Granulare (1 kg)', desc: 'Composto granulare a base di Idrogensolfato di sodio per abbassare il valore di pH quando superiore a 7.4. Il pH deve essere mantenuto tra 7.2 e 7.4. Per ridurre il pH di 0,1 unità è necessario circa 1 kg per 100 m³. Immettere direttamente in acqua, negli skimmer o vicino alle bocchette di mandata. Made in Italy.', img: 'img/riduttore_ph.jpeg', prezzo: 9.90 },
      { nome: 'Redplus – Incrementatore di pH Granulare (1 kg)', desc: 'Polvere bianca cristallina a base di Carbonato Sodico per aumentare il pH dell\'acqua della piscina. Non altera il contenuto in cloruri. Dosi consigliate: 50/60 g ogni 10 m³ per aumentare il pH di 0,1. Versare direttamente in vasca vicino alle bocchette di immissione o negli skimmer. Made in Italy.', img: 'img/incrementatore_ph.jpeg', prezzo: 9.90 },
      { nome: 'CrystalClear – Alghicida (1 l)', desc: 'Abbattitore di alghe ad azione chiarificante per acque di piscina. Previene la formazione di ogni tipo di alga. Compatibile con qualsiasi altro prodotto usato in piscina. Tollerato dalla pelle, non irrita gli occhi. Trattamento shock (inizio stagione): 2,5–5 l per 100 m³. Mantenimento: 0,5–1 l per 100 m³ a settimana.', img: 'img/alghicida.jpeg', prezzo: 21.00 },
      { nome: 'K-Klar – Flocculante in Cartucce (1 kg)', desc: 'Prodotto a grande azione flocculante e coagulante a base di Solfato di alluminio. Elimina le particelle in sospensione migliorando la trasparenza dell\'acqua. Le cartucce formano flocculi all\'entrata del filtro che trattengono tutte le particelle in sospensione. Dosaggio: 1 cartuccia ogni 10 giorni per piscine 10–50 m³; 2 cartucce per 50–100 m³; 3 cartucce per 100–150 m³. Made in Spain.', img: 'img/flocculante_in_cartucce.jpeg', prezzo: 14.90 },
    ],
    // ZANZARE
    zanzare: [
      {
        nome: 'iZanz Mini – Sistema Antizanzare Automatico Fai-Da-Te',
        desc: 'iZanz Mini è un sistema antizanzare automatico Fai-Da-Te. Potrai finalmente liberarti dalle zanzare e goderti pienamente il tuo giardino o terrazzo.\nCopertura fino a 25 mt. lineari, centralina ad alta pressione per prestazioni efficienti e durature.',
        img: 'img/izanz_kit.png',
        imgs: ['img/izanz_kit.png','img/izanz_garden.png','img/izanz_detail1.png','img/izanz_full.png'],
        prezzo: 777.00,
        note: 'IVA e installazione incluse'
      },
    ],
    // DISINFEZIONE CHIMICA (3 prodotti)
    disinfezione: [
      { nome: 'Sistema UV Pro', desc: 'Sistemi UV professionali per sterilizzazione senza sostanze chimiche aggiuntive. Portata fino a 30 m³/h.', img: '', prezzo: 480.00 },
      { nome: 'Ozono Generatore Industriale', desc: 'Generatore di ozono per piscine fino a 100 m³. Elimina batteri e virus senza residui chimici.', img: '', prezzo: 890.00 },
      { nome: 'Dosatore Automatico di Cloro', desc: 'Dosaggio continuo di cloro liquido o granulare. Serbatoio da 25 litri, pompa peristaltica.', img: '', prezzo: 320.00 }
    ],
    // CENTRALINE (3 prodotti)
    centraline: [
      { nome: 'Centralina pH/Cloro', desc: 'Controllo automatico di pH e cloro. Display digitale e allarmi programmabili. Sonda di flusso inclusa.', img: '', prezzo: 650.00 },
      { nome: 'Centralina Multifunzione PRO', desc: 'Gestisce pH, cloro, redox e temperatura. Connessione WiFi per monitoraggio remoto.', img: '', prezzo: 1100.00 },
      { nome: 'Centralina Touch Screen', desc: 'Pannello touch 7", controllo di tutti i parametri, gestione pompe e valvole, datalogger.', img: '', prezzo: 1450.00 }
    ],
    // ELETTROLISI SALINA (3 prodotti)
    elettrolisi: [
      { nome: 'Elettrolizzatore Salino Pro', desc: 'Produzione naturale di cloro tramite elettrolisi salina. Adatto a piscine fino a 80 m³.', img: '', prezzo: 780.00 },
      { nome: 'Elettrolizzatore Compact Salt', desc: 'Modello compatto per piscine fino a 40 m³. Cella in titanio, autopulente.', img: '', prezzo: 490.00 },
      { nome: 'Elettrolizzatore Inverter', desc: 'Regolazione automatica della produzione in base alla richiesta. Risparmio energetico del 30%.', img: '', prezzo: 1050.00 }
    ],
    // COLLETTORI (3 prodotti)
    collettori: [
      { nome: 'Collettore Multivie', desc: 'Collettori in ABS resistente agli UV, varie configurazioni. Diametro 63 mm.', img: '', prezzo: 145.00 },
      { nome: 'Collettore in Acciaio Inox', desc: 'Collettore professionale in AISI 316, predisposto per 4 vie, pressione max 10 bar.', img: '', prezzo: 290.00 },
      { nome: 'Collettore Idraulico 6 vie', desc: 'Collettore in PVC con valvole a sfera, completo di manometro e scarico.', img: '', prezzo: 210.00 }
    ],
    // FILTRI (3 prodotti)
    filtri: [
      { nome: 'Filtro a Sabbia Pro', desc: 'Filtri a sabbia di quarzo ad alta efficienza fino a 200 m³/h. Valvola selettrice 6 vie.', img: '', prezzo: 380.00 },
      { nome: 'Filtro a Cartuccia Eco', desc: 'Filtro a cartuccia lavabile per piscine fuori terra e piccole vasche. Portata 6 m³/h.', img: '', prezzo: 95.00 },
      { nome: 'Filtro a Diatomite', desc: 'Filtrazione spinta fino a 5 micron. Ideale per piscine con elevati standard di limpidezza.', img: '', prezzo: 520.00 }
    ],
    // PISCINE INTERRATE TIPO A (Classica) - 3 prodotti
    interrata1: [
      { nome: 'Piscina Classica 8x4 m', desc: 'Vasca interrata in calcestruzzo, rivestimento in PVC armato, skimmer, scaletta in acciaio inox.', img: 'img/piscina-interrata.jpg' },
      { nome: 'Piscina Classica 10x5 m', desc: 'Modello tradizionale a sfioro, completo di vasca di compenso, rivestimento in gres porcellanato.', img: 'img/piscina-interrata.jpg' },
      { nome: 'Piscina Classica 12x6 m', desc: 'Grande vasca con gradone romano, rivestimento in mosaico azzurro, pompa di calore e copertura automatica.', img: 'img/piscina-interrata.jpg' }
    ],
    // PISCINE INTERRATE TIPO B (Moderna) - 3 prodotti
    interrata2: [
      { nome: 'Piscina Moderna Linea 6x3 m', desc: 'Design minimalista, bordo vasca a filo terra, rivestimento in mosaico blu, illuminazione LED subacquea.', img: '' },
      { nome: 'Piscina Moderna Infinity 12x4 m', desc: 'Effetto infinity con sfioro su un lato, rivestimento in vetroresina bianca, pompa di calore inclusa.', img: 'img/piscine-infinity.jpg' },
      { nome: 'Piscina Moderna Rettangolare 9x4,5 m', desc: 'Linee pulite, rivestimento in gres effetto pietra, skimmer a parete, sistema di clorazione salina.', img: '' }
    ],
    // PISCINE INTERRATE TIPO C (Lusso) - 3 prodotti
    interrata3: [
      { nome: 'Piscina Luxury 15x6 m', desc: 'Vasca a sfioro perimetrale, rivestimento in mosaico di vetro, idromassaggio integrato, vasca idromassaggio adiacente.', img: 'img/piscine-infinity.jpg' },
      { nome: 'Piscina Design Spigolo Vivo', desc: 'Forma rettangolare con angoli vivi, rivestimento in pietra naturale, sistema di clorazione salina.', img: '' },
      { nome: 'Piscina Infinity Panorama 14x5 m', desc: 'Sfioro su tre lati, rivestimento in gres porcellanato effetto legno, pompa di calore inverter, LED RGB.', img: 'img/piscine-infinity.jpg' }
    ],
    // PISCINE SEMI-INTERRATE TIPO A - 3 prodotti
    semi1: [
      { nome: 'Semi-interrata Panorama 6x3 m', desc: 'Perfetta per terreni in pendenza, struttura in acciaio zincato, rivestimento in liner azzurro.', img: '' },
      { nome: 'Semi-interrata Garden 7x3,5 m', desc: 'Con gradone romano, ideale per sfruttare il dislivello del giardino, scaletta esterna in legno.', img: '' },
      { nome: 'Semi-interrata Terrazza 5x4 m', desc: 'Forma quadrata, rivestimento in liner antiscivolo, filtro a sabbia, scala in acciaio inox.', img: '' }
    ],
    // PISCINE SEMI-INTERRATE TIPO B - 3 prodotti
    semi2: [
      { nome: 'Semi-interrata Moderna 8x4 m', desc: 'Design contemporaneo, rivestimento in gres effetto legno, skimmer e bocchette orientabili.', img: '' },
      { nome: 'Semi-interrata Relax 9x4,5 m', desc: 'Zona idromassaggio integrata, rivestimento in mosaico, pompa di calore inclusa.', img: '' },
      { nome: 'Semi-interrata Oval 10x5 m', desc: 'Forma ovale, rivestimento in vetroresina, illuminazione a LED, copertura automatica.', img: '' }
    ],
    // PISCINE SEMI-INTERRATE TIPO C - 3 prodotti
    semi3: [
      { nome: 'Semi-interrata Lusso 10x5 m', desc: 'Sfioro su due lati, rivestimento in vetroresina, illuminazione a LED RGB, copertura automatica.', img: '' },
      { nome: 'Semi-interrata Oval 11x4 m', desc: 'Forma ovale, gradone perimetrale, rivestimento in liner antiscivolo, kit manutenzione completo.', img: '' },
      { nome: 'Semi-interrata Infinity 12x5 m', desc: 'Effetto sfioro su un lato, rivestimento in mosaico di vetro, pompa di calore e vasca di compenso.', img: '' }
    ],
    // PISCINE FUORI TERRA - 3 prodotti
    fuoroterra: [
      { nome: 'Piscina Fuori Terra Oval 6x3,6 m', desc: 'Struttura in acciaio zincato, liner azzurro 0,4 mm, filtro a sabbia, scala di sicurezza.', img: '' },
      { nome: 'Piscina Fuori Terra Rotonda 4,5 m', desc: 'Modello autoportante, struttura in legno, liner sabbiato, pompa di filtrazione inclusa.', img: '' },
      { nome: 'Piscina Fuori Terra Rettangolare 8x4 m', desc: 'Struttura in acciaio verniciato, liner 0,5 mm, skimmer, scala esterna con piattaforma.', img: '' }
    ],
  },
  ordini: [],
  lavori: [
    { titolo: 'Piscina a Sfioro – Villa Bresciana', desc: 'Piscina infinity con vista sul lago, rivestimento in mosaico blu.', img: 'img/lavoro1.jpg' },
    { titolo: 'Idromassaggio Privato',              desc: 'Installazione vasca idromassaggio da interno 4 posti.', img: 'img/lavoro2.jpg' },
    { titolo: 'Piscina Fuori Terra – Giardino Moderno', desc: 'Piscina fuori terra con struttura in acciaio e liner azzurro, completa di filtrazione e scala.', img: 'img/lavoro3.jpg' }
  ],
  // ========== 5 RECENSIONI DI ESEMPIO ==========
  recensioni: [
    { autore: 'Marco B.',       stelle: 5, testo: 'Professionalità e qualità eccellenti. La piscina è esattamente come la sognavamo. Consigliatissimi!' },
    { autore: 'Laura M.',       stelle: 5, testo: 'Servizio impeccabile dalla progettazione all\'installazione. Tempi rispettati e personale cortese.' },
    { autore: 'Famiglia Conti', stelle: 4, testo: 'Ottimo rapporto qualità-prezzo. Siamo molto soddisfatti del risultato finale.' },
    { autore: 'Alessandro R.',  stelle: 5, testo: 'Ho scelto PiscineIntime per la costruzione della mia piscina interrata. Risultato superiore alle aspettative, grazie al team competente e disponibile.' },
    { autore: 'Silvia e Paolo', stelle: 5, testo: 'Abbiamo acquistato un idromassaggio e seguito i consigli per la manutenzione. Tutto perfetto, assistenza rapida e gentile.' }
  ],
  settings: {
    nome:        'PiscineIntime',
    tel:         '+39 000 000 0000',
    email:       'info@piscineintime.it',
    indirizzo:   'Via Esempio 1, Città',
    iban:        'IT00 X000 0000 0000 0000 0000 000',
    adminUser:   'admin',
    adminPass:   'admin123',
    promoBanner: 'PROMOZIONI'
  }
};

const DB_VERSION = 3; // Incrementa per forzare l'aggiornamento dei prodotti chimici e zanzare

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Assicuriamoci che tutte le proprietà esistano
      for (let key in defaultData.products) {
        if (!parsed.products[key]) parsed.products[key] = [];
      }
      parsed.settings = Object.assign({}, defaultData.settings, parsed.settings || {});
      // Migrazione versione: aggiorna prodotti chimici se la versione è cambiata
      if (!parsed.dbVersion || parsed.dbVersion < DB_VERSION) {
        parsed.products.chimici = JSON.parse(JSON.stringify(defaultData.products.chimici));
        parsed.products.zanzare = JSON.parse(JSON.stringify(defaultData.products.zanzare));
        parsed.dbVersion = DB_VERSION;
        localStorage.setItem(DB_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch(e) {}
  const fresh = JSON.parse(JSON.stringify(defaultData));
  fresh.dbVersion = DB_VERSION;
  return fresh;
}

function saveDB() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(window.data));
  } catch(e) {
    console.warn('localStorage non disponibile');
  }
}

// Inizializza il database globale
window.data = loadDB();