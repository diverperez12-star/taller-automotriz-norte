/* ==========================================================================
   TALLER AUTOMOTRIZ DEL NORTE - CATÁLOGO EXPANDIDO DE VEHÍCULOS Y CITAS
   ========================================================================== */

let currentStep = 1;
let currentCategory = 'preventivo';
let selectedServices = new Set(['p1']);

// Generador oficial de Folios: TAN-YYYYMMDD-XXXX
function generarFolio(fechaCita = null) {
  let datePart = "";
  if (fechaCita && fechaCita.includes('-')) {
    datePart = fechaCita.replace(/-/g, "");
  } else {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    datePart = `${yyyy}${mm}${dd}`;
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TAN-${datePart}-${rand}`;
}

let currentFolio = generarFolio();

// Base de datos ampliada y completa de vehículos
const dbVehiculos = {
  Mazda: {
    "Mazda 2": { min: 2012, max: 2026, motores: ["1.5L SKYACTIV-G (109 HP)"], factor: 0.90 },
    "Mazda 3": { min: 2005, max: 2026, motores: ["2.0L SKYACTIV-G", "2.5L SKYACTIV-G", "2.5L Turbo AWD (227 HP)"], factor: 1.10 },
    "Mazda 6": { min: 2006, max: 2023, motores: ["2.3L MZR", "2.5L SKYACTIV-G", "2.5L Turbo (250 HP)"], factor: 1.25 },
    "MX-5 Miata": { min: 2006, max: 2026, motores: ["2.0L SKYACTIV-G (181 HP)"], factor: 1.35 },
    "CX-3": { min: 2016, max: 2026, motores: ["2.0L SKYACTIV-G (148 HP)"], factor: 1.15 },
    "CX-30": { min: 2020, max: 2026, motores: ["2.5L SKYACTIV-G", "2.5L Turbo AWD"], factor: 1.20 },
    "CX-5": { min: 2013, max: 2026, motores: ["2.0L", "2.5L SKYACTIV-G", "2.5L Turbo (228 HP)"], factor: 1.30 },
    "CX-50": { min: 2023, max: 2026, motores: ["2.5L SKYACTIV-G", "2.5L Turbo AWD"], factor: 1.35 },
    "CX-7": { min: 2007, max: 2012, motores: ["2.3L DISI Turbo", "2.5L MZR"], factor: 1.30 },
    "CX-9": { min: 2008, max: 2023, motores: ["3.7L V6", "2.5L Turbo"], factor: 1.45 },
    "CX-70": { min: 2025, max: 2026, motores: ["3.3L e-SKYACTIV Turbo"], factor: 1.50 },
    "CX-90": { min: 2024, max: 2026, motores: ["3.3L e-SKYACTIV Turbo (340 HP)"], factor: 1.55 }
  },
  Nissan: {
    "March": { min: 2011, max: 2026, motores: ["1.6L HR16DE (106-118 HP)"], factor: 0.85 },
    "Versa": { min: 2012, max: 2026, motores: ["1.6L HR16DE (106-118 HP)"], factor: 0.85 },
    "V-Drive": { min: 2020, max: 2026, motores: ["1.6L HR16DE (106 HP)"], factor: 0.85 },
    "Sentra": { min: 1996, max: 2026, motores: ["1.6L GA16DE", "1.8L QG18DE", "2.0L MR20DD"], factor: 1.00 },
    "Tsuru (I, II, III)": { min: 1984, max: 2017, motores: ["1.6L GA16DE"], factor: 0.75 },
    "Tiida": { min: 2006, max: 2018, motores: ["1.8L MR18DE (125 HP)"], factor: 0.85 },
    "Altima": { min: 1993, max: 2026, motores: ["2.5L QR25DE", "3.5L V6", "2.0L VC-Turbo"], factor: 1.25 },
    "Maxima": { min: 1992, max: 2023, motores: ["3.0L V6", "3.5L VQ35DE V6"], factor: 1.30 },
    "Kicks": { min: 2016, max: 2026, motores: ["1.6L HR16DE / e-POWER"], factor: 1.10 },
    "X-Trail": { min: 2001, max: 2026, motores: ["2.5L QR25DE / e-POWER"], factor: 1.25 },
    "Pathfinder": { min: 1987, max: 2026, motores: ["3.5L VQ35DD V6"], factor: 1.35 },
    "Murano": { min: 2003, max: 2024, motores: ["3.5L VQ35DE V6"], factor: 1.35 },
    "Armada": { min: 2004, max: 2026, motores: ["5.6L VK56DE V8"], factor: 1.50 },
    "NP300 / Frontier": { min: 2010, max: 2026, motores: ["2.5L Gasolina", "2.5L Turbo Diésel"], factor: 1.35 },
    "Urvan": { min: 1999, max: 2026, motores: ["2.5L QR25DE"], factor: 1.20 },
    "350Z / 370Z / Z": { min: 2003, max: 2026, motores: ["3.5L V6", "3.7L V6", "3.0L Twin-Turbo"], factor: 1.60 },
    "GT-R": { min: 2008, max: 2024, motores: ["3.8L VR38DETT V6 Twin-Turbo"], factor: 2.00 }
  },
  Chevrolet: {
    "Aveo": { min: 2008, max: 2026, motores: ["1.5L / 1.6L Ecotec"], factor: 0.85 },
    "Spark / Beat": { min: 2011, max: 2022, motores: ["1.2L S-TEC II"], factor: 0.75 },
    "Onix": { min: 2020, max: 2026, motores: ["1.0L Turbo", "1.2L Turbo"], factor: 0.95 },
    "Corsa / Chevy": { min: 1994, max: 2012, motores: ["1.4L / 1.6L MPFI"], factor: 0.75 },
    "Cavalier": { min: 1990, max: 2026, motores: ["1.5L", "1.3L Turbo"], factor: 0.90 },
    "Cruze": { min: 2010, max: 2019, motores: ["1.8L", "1.4L Turbo Ecotec"], factor: 1.05 },
    "Malibu": { min: 1997, max: 2024, motores: ["2.4L", "2.0L Turbo"], factor: 1.15 },
    "Tracker": { min: 1998, max: 2026, motores: ["1.8L", "1.2L Turbo 3-Cil"], factor: 1.10 },
    "Groove": { min: 2022, max: 2026, motores: ["1.5L I4 (110 HP)"], factor: 1.00 },
    "Captiva": { min: 2008, max: 2026, motores: ["2.4L", "1.5L Turbo"], factor: 1.20 },
    "Equinox": { min: 2005, max: 2026, motores: ["2.4L", "1.5L Turbo", "2.0L Turbo"], factor: 1.25 },
    "Blazer": { min: 2019, max: 2026, motores: ["2.5L", "2.0L Turbo", "3.6L V6"], factor: 1.35 },
    "Tahoe / Suburban": { min: 1995, max: 2026, motores: ["5.3L V8", "6.2L V8", "3.0L Duramax"], factor: 1.50 },
    "Silverado / Cheyenne": { min: 1992, max: 2026, motores: ["4.3L V6", "5.3L V8", "6.2L V8"], factor: 1.45 },
    "Colorado / S10": { min: 1985, max: 2026, motores: ["2.5L", "2.8L Diésel", "2.7L Turbo"], factor: 1.25 },
    "Camaro": { min: 1970, max: 2024, motores: ["3.6L V6", "6.2L V8"], factor: 1.60 },
    "Corvette": { min: 1980, max: 2026, motores: ["5.7L V8", "6.2L LT1/LT2"], factor: 1.80 }
  },
  Volkswagen: {
    "Jetta": { min: 1988, max: 2026, motores: ["2.0L", "2.5L 5-Cil", "1.4L TSI", "2.0L TSI GLI"], factor: 1.05 },
    "Golf / GTI": { min: 1987, max: 2021, motores: ["1.8L", "2.0L", "1.4L TSI", "2.0L TSI GTI"], factor: 1.10 },
    "Vento": { min: 2014, max: 2022, motores: ["1.6L Gasolina", "1.5L TDI Diésel"], factor: 0.85 },
    "Virtus": { min: 2020, max: 2026, motores: ["1.6L MSI", "1.0L TSI Turbo"], factor: 0.90 },
    "Polo": { min: 2003, max: 2026, motores: ["1.6L", "1.2L TSI", "1.0L TSI"], factor: 0.85 },
    "Gol": { min: 2009, max: 2021, motores: ["1.6L EA111"], factor: 0.80 },
    "Bora": { min: 2005, max: 2010, motores: ["2.5L 5-Cilindros", "2.0T FSI"], factor: 1.05 },
    "Sedán (Vocho)": { min: 1970, max: 2003, motores: ["1.6L Enfriado por Aire"], factor: 0.75 },
    "T-Cross": { min: 2020, max: 2026, motores: ["1.6L MSI", "1.0L TSI Turbo"], factor: 1.10 },
    "Taos": { min: 2021, max: 2026, motores: ["1.4L TSI Turbo (150 HP)"], factor: 1.20 },
    "Tiguan": { min: 2008, max: 2026, motores: ["1.4L TSI", "2.0L TSI Turbo"], factor: 1.30 },
    "Teramont": { min: 2019, max: 2026, motores: ["2.0L TSI", "3.6L VR6"], factor: 1.45 },
    "Amarok": { min: 2010, max: 2026, motores: ["2.0L TDI", "3.0L V6 TDI"], factor: 1.35 },
    "Saveiro": { min: 2010, max: 2026, motores: ["1.6L MSI"], factor: 0.90 }
  },
  Toyota: {
    "Corolla": { min: 1980, max: 2026, motores: ["1.8L", "2.0L Dynamic Force", "1.8L Hybrid"], factor: 1.00 },
    "Camry": { min: 1983, max: 2026, motores: ["2.5L", "3.5L V6", "Hybrid"], factor: 1.25 },
    "Yaris": { min: 2006, max: 2026, motores: ["1.5L (106 HP)"], factor: 0.85 },
    "Prius": { min: 2010, max: 2026, motores: ["1.8L Híbrido VVT-i"], factor: 1.05 },
    "Avanza": { min: 2007, max: 2026, motores: ["1.5L"], factor: 0.90 },
    "Raize": { min: 2022, max: 2026, motores: ["1.0L Turbo 3-Cil"], factor: 0.90 },
    "Hilux": { min: 1979, max: 2026, motores: ["2.7L Gasolina", "2.8L Turbo Diésel"], factor: 1.35 },
    "Tacoma": { min: 2003, max: 2026, motores: ["2.7L", "3.5L V6", "2.4L Turbo"], factor: 1.35 },
    "Tundra": { min: 2003, max: 2026, motores: ["5.7L V8", "3.4L V6 Twin-Turbo"], factor: 1.50 },
    "RAV4": { min: 1996, max: 2026, motores: ["2.5L", "2.5L HEV Híbrido"], factor: 1.25 },
    "Corolla Cross": { min: 2022, max: 2026, motores: ["2.0L Dynamic Force"], factor: 1.20 },
    "Highlander": { min: 2002, max: 2026, motores: ["3.5L V6", "2.4L Turbo", "Hybrid"], factor: 1.40 },
    "Sienna": { min: 2002, max: 2026, motores: ["3.5L V6", "2.5L Hybrid"], factor: 1.40 },
    "Supra": { min: 2020, max: 2026, motores: ["2.0L Turbo", "3.0L Turbo I6"], factor: 1.80 }
  },
  Ford: {
    "Mustang": { min: 1970, max: 2026, motores: ["2.3L EcoBoost", "5.0L Coyote V8", "GT500"], factor: 1.50 },
    "Ranger": { min: 1990, max: 2026, motores: ["2.3L EcoBoost", "3.2L Diésel", "V6 Turbo"], factor: 1.35 },
    "F-150 / Lobo": { min: 1980, max: 2026, motores: ["5.0L V8", "3.5L EcoBoost", "PowerBoost Hybrid"], factor: 1.40 },
    "Fiesta / Figo": { min: 2000, max: 2021, motores: ["1.6L", "1.5L Dragon"], factor: 0.85 },
    "Focus": { min: 2000, max: 2018, motores: ["2.0L", "2.3L RS"], factor: 1.05 },
    "Fusion": { min: 2006, max: 2020, motores: ["2.5L", "2.0L EcoBoost", "Hybrid"], factor: 1.15 },
    "EcoSport": { min: 2004, max: 2022, motores: ["2.0L", "1.5L Dragon"], factor: 1.10 },
    "Escape": { min: 2001, max: 2026, motores: ["1.5L EcoBoost", "2.0L EcoBoost", "Hybrid"], factor: 1.25 },
    "Territory": { min: 2022, max: 2026, motores: ["1.5L Turbo (143 HP)"], factor: 1.20 },
    "Bronco / Bronco Sport": { min: 2021, max: 2026, motores: ["1.5L EcoBoost", "2.3L", "2.7L V6"], factor: 1.35 },
    "Explorer": { min: 1991, max: 2026, motores: ["3.5L V6", "2.3L EcoBoost", "3.0L ST"], factor: 1.40 }
  },
  Honda: {
    "Civic": { min: 1995, max: 2026, motores: ["1.8L", "1.5L Turbo", "2.0L Type R"], factor: 1.10 },
    "CR-V": { min: 1998, max: 2026, motores: ["2.4L", "1.5L Turbo (190 HP)", "Hybrid"], factor: 1.25 },
    "HR-V": { min: 2016, max: 2026, motores: ["1.8L", "2.0L (158 HP)"], factor: 1.15 },
    "Accord": { min: 1995, max: 2026, motores: ["2.0L", "1.5L Turbo", "3.5L V6"], factor: 1.25 },
    "Fit": { min: 2006, max: 2020, motores: ["1.5L i-VTEC"], factor: 0.85 },
    "City": { min: 2010, max: 2026, motores: ["1.5L DOHC i-VTEC"], factor: 0.90 },
    "Pilot": { min: 2003, max: 2026, motores: ["3.5L J35 V6 (285 HP)"], factor: 1.40 },
    "Odyssey": { min: 1999, max: 2026, motores: ["3.5L V6 (280 HP)"], factor: 1.40 }
  },
  Hyundai: {
    "Grand i10": { min: 2014, max: 2026, motores: ["1.2L Kappa MPi"], factor: 0.80 },
    "Accent": { min: 2017, max: 2023, motores: ["1.6L Gamma MPi"], factor: 0.90 },
    "Elantra": { min: 2015, max: 2026, motores: ["2.0L Nu MPi", "2.0L Turbo N"], factor: 1.05 },
    "Creta": { min: 2015, max: 2026, motores: ["1.5L", "1.6L", "1.4L Turbo"], factor: 1.15 },
    "Tucson": { min: 2015, max: 2026, motores: ["2.0L", "2.5L Smartstream", "Hybrid"], factor: 1.30 },
    "Santa Fe": { min: 2017, max: 2026, motores: ["2.5L Turbo", "Hybrid"], factor: 1.40 },
    "Palisade": { min: 2020, max: 2026, motores: ["3.8L Lambda V6 (291 HP)"], factor: 1.50 }
  },
  Kia: {
    "Rio / K3": { min: 2016, max: 2026, motores: ["1.6L MPi", "2.0L Smartstream"], factor: 0.85 },
    "Forte / K4": { min: 2015, max: 2026, motores: ["2.0L Nu", "1.6L Turbo GDI"], factor: 1.00 },
    "Soul": { min: 2016, max: 2024, motores: ["1.6L", "2.0L"], factor: 1.05 },
    "Seltos": { min: 2020, max: 2026, motores: ["1.6L", "1.4L Turbo", "2.0L"], factor: 1.15 },
    "Sportage": { min: 2015, max: 2026, motores: ["2.0L", "2.5L Smartstream"], factor: 1.30 },
    "Sorento": { min: 2015, max: 2026, motores: ["2.4L", "2.5L Turbo", "3.3L V6"], factor: 1.40 },
    "Telluride": { min: 2020, max: 2026, motores: ["3.8L V6 GDI (291 HP)"], factor: 1.50 }
  },
  Renault: {
    "Kwid": { min: 2019, max: 2026, motores: ["1.0L 3-Cilindros (66 HP)"], factor: 0.75 },
    "Sandero / Logan": { min: 2010, max: 2024, motores: ["1.6L 16V"], factor: 0.80 },
    "Stepway": { min: 2010, max: 2026, motores: ["1.6L 16V"], factor: 0.85 },
    "Duster": { min: 2012, max: 2026, motores: ["2.0L", "1.3L Turbo (154 HP)"], factor: 1.10 },
    "Captur": { min: 2017, max: 2024, motores: ["2.0L", "1.3L Turbo"], factor: 1.15 },
    "Oroch": { min: 2018, max: 2026, motores: ["2.0L", "1.3L Turbo"], factor: 1.20 },
    "Koleos": { min: 2008, max: 2026, motores: ["2.5L I4"], factor: 1.30 }
  },
  Suzuki: {
    "Ignis": { min: 2017, max: 2026, motores: ["1.2L DualJet (82 HP)"], factor: 0.75 },
    "Swift": { min: 2011, max: 2026, motores: ["1.2L", "1.4L BoosterJet Turbo", "Swift Sport"], factor: 0.90 },
    "Baleno": { min: 2021, max: 2026, motores: ["1.5L (103 HP)"], factor: 0.85 },
    "Vitara": { min: 2016, max: 2026, motores: ["1.6L", "1.4L BoosterJet Turbo"], factor: 1.15 },
    "S-Cross": { min: 2014, max: 2026, motores: ["1.4L BoosterJet Turbo"], factor: 1.20 },
    "Ertiga": { min: 2019, max: 2026, motores: ["1.5L Mild Hybrid"], factor: 1.00 },
    "Jimny": { min: 2019, max: 2026, motores: ["1.5L 4x4 (102 HP)"], factor: 1.10 }
  },
  SEAT: {
    "Ibiza": { min: 2002, max: 2026, motores: ["1.6L MSI", "1.0L TSI Turbo"], factor: 0.90 },
    "León": { min: 2001, max: 2026, motores: ["1.4L TSI", "2.0L TSI (Cupra)"], factor: 1.15 },
    "Arona": { min: 2018, max: 2026, motores: ["1.6L MSI", "1.0L TSI Turbo"], factor: 1.05 },
    "Ateca": { min: 2017, max: 2026, motores: ["1.4L TSI", "2.0L TSI"], factor: 1.30 }
  },
  Peugeot: {
    "208": { min: 2013, max: 2026, motores: ["1.2L PureTech (130 HP)"], factor: 0.95 },
    "2008": { min: 2015, max: 2026, motores: ["1.2L PureTech Turbo"], factor: 1.15 },
    "3008": { min: 2011, max: 2026, motores: ["1.6L THP Turbo", "2.0L HDi Diésel"], factor: 1.35 },
    "Partner": { min: 2010, max: 2026, motores: ["1.6L HDi Diésel"], factor: 1.20 }
  },
  Jeep: {
    "Renegade": { min: 2016, max: 2026, motores: ["1.8L E.TorQ", "1.3L Turbo T270"], factor: 1.20 },
    "Compass": { min: 2007, max: 2026, motores: ["2.4L Tigershark", "1.3L Turbo"], factor: 1.30 },
    "Wrangler": { min: 1995, max: 2026, motores: ["3.6L V6 Pentastar", "2.0L Turbo", "4Ruote V8"], factor: 1.60 },
    "Grand Cherokee": { min: 1995, max: 2026, motores: ["3.6L V6", "5.7L V8 HEMI"], factor: 1.55 }
  },
  RAM: {
    "RAM 700": { min: 2021, max: 2026, motores: ["1.4L Fire", "1.3L Firefly (98 HP)"], factor: 0.95 },
    "RAM 1200": { min: 2019, max: 2026, motores: ["2.4L Gasolina", "2.5L Turbo Diésel"], factor: 1.30 },
    "RAM 1500 / 2500": { min: 1994, max: 2026, motores: ["3.6L V6 Pentastar", "5.7L V8 HEMI", "3.0L EcoDiesel"], factor: 1.55 }
  }
};

const serviciosBase = {
  preventivo: [
    { id: "p1", nombre: "Afinación Mayor", horas: "2.5 horas", base: 2730 },
    { id: "p2", nombre: "Cambio de Aceite Sintético y Filtro", horas: "1.0 hora", base: 1260 },
    { id: "p3", nombre: "Servicio Mantenimiento Frenos (4 ruedas)", horas: "1.5 horas", base: 840 },
    { id: "p4", nombre: "Alineación, Balanceo y Rotación", horas: "1.5 horas", base: 735 },
    { id: "p5", nombre: "Servicio de Aire Acondicionado / Carga de Gas", horas: "1.0 hora", base: 1050 }
  ],
  correctivo: [
    { id: "c1", nombre: "Cambio de Balatas y Rectificación", horas: "2.5 horas", base: 2520 },
    { id: "c2", nombre: "Reemplazo Kit Clutch / Embrague", horas: "5.0 horas", base: 6300 },
    { id: "c3", nombre: "Servicio de Suspensión y Dirección", horas: "3.0 horas", base: 3150 },
    { id: "c4", nombre: "Diagnóstico Sistema Eléctrico", horas: "2.0 horas", base: 1260 }
  ],
  diagnostico: [
    { id: "d1", nombre: "Inspección General 25 Puntos + Escaneo", horas: "1.0 hora", base: 200 }
  ]
};

function goToStep(step) {
  if (step > currentStep && !validarPasoActual()) return;

  for (let i = 1; i <= 5; i++) {
    const pane = document.getElementById(`step-${i}`);
    if (pane) {
      if (i === step) {
        pane.classList.remove('hidden');
        pane.classList.add('active');
      } else {
        pane.classList.add('hidden');
        pane.classList.remove('active');
      }
    }
  }

  currentStep = step;
  actualizarBarraPasos();

  if (step === 2) {
    onMarcaChange();
  }
  if (step === 4) {
    prepararResumen();
  }
}

function validarPasoActual() {
  if (currentStep === 1) {
    const nom = (document.getElementById('input-nombre')?.value || '').trim();
    const tel = (document.getElementById('input-telefono')?.value || '').trim();
    if (!nom || !tel) {
      alert("Por favor ingresa tu Nombre Completo y Teléfono de contacto.");
      return false;
    }
    if (tel.length < 10) {
      alert("El teléfono debe contener exactamente 10 dígitos numéricos.");
      return false;
    }
  }
  if (currentStep === 2) {
    const vin = (document.getElementById('input-vin')?.value || '').trim();
    if (!vin) {
      alert("Ingresa el Número de Serie (VIN) de tu vehículo.");
      return false;
    }
    if (selectedServices.size === 0) {
      alert("Selecciona al menos un servicio o paquete para continuar.");
      return false;
    }
  }
  if (currentStep === 3) {
    const fecha = document.getElementById('fecha-cita')?.value;
    const hora = document.getElementById('hora-seleccionada')?.value;
    if (!fecha || !hora) {
      alert("Selecciona la fecha y el horario de recepción.");
      return false;
    }
  }
  return true;
}

function actualizarBarraPasos() {
  for (let i = 1; i <= 5; i++) {
    const nav = document.getElementById(`nav-step-${i}`);
    if (!nav) continue;
    const dot = nav.querySelector('span');

    if (i <= currentStep) {
      nav.className = "flex items-center gap-2 text-red-500 font-bold";
      dot.className = "step-dot bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black";
    } else {
      nav.className = "flex items-center gap-2 text-slate-400 font-bold";
      dot.className = "step-dot bg-slate-800 text-slate-400 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black";
    }
  }
  const progress = document.getElementById('progress-bar');
  if (progress) progress.style.width = `${(currentStep / 5) * 100}%`;
}

function onMarcaChange() {
  const marcaElem = document.getElementById('select-marca');
  if (!marcaElem) return;
  const marca = marcaElem.value;
  const modeloSelect = document.getElementById('select-modelo');
  if (!modeloSelect) return;

  modeloSelect.innerHTML = '';

  if (dbVehiculos[marca]) {
    Object.keys(dbVehiculos[marca]).forEach(mod => {
      const opt = document.createElement('option');
      opt.value = mod;
      opt.textContent = mod;
      modeloSelect.appendChild(opt);
    });
  }
  onModeloChange();
}

function onModeloChange() {
  const marca = document.getElementById('select-marca')?.value;
  const modelo = document.getElementById('select-modelo')?.value;
  const motorSelect = document.getElementById('select-motor');
  const anioSelect = document.getElementById('select-anio');
  if (!motorSelect || !anioSelect) return;
  
  motorSelect.innerHTML = '';
  anioSelect.innerHTML = '';

  if (dbVehiculos[marca] && dbVehiculos[marca][modelo]) {
    const item = dbVehiculos[marca][modelo];
    for (let a = item.max; a >= item.min; a--) {
      const opt = document.createElement('option');
      opt.value = a;
      opt.textContent = a;
      anioSelect.appendChild(opt);
    }

    item.motores.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      motorSelect.appendChild(opt);
    });
  }
  onAnioChange();
}

function onAnioChange() {
  const anio = parseInt(document.getElementById('select-anio')?.value) || 2020;
  const warningBanner = document.getElementById('vintage-warning');

  if (warningBanner) {
    warningBanner.classList.toggle('hidden', !(anio >= 1970 && anio <= 1990));
  }
  renderServices();
}

function selectCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('[id^="cat-"]').forEach(c => {
    c.className = "p-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs font-bold text-slate-400 hover:text-white transition";
  });
  
  const selectedBtn = document.getElementById(`cat-${cat}`);
  if (selectedBtn) {
    selectedBtn.className = "p-3 bg-red-950/20 border border-red-500 rounded-xl text-center text-xs font-bold text-white transition";
  }

  selectedServices.clear();
  renderServices();
}

function renderServices() {
  const container = document.getElementById('services-container');
  if (!container) return;

  container.innerHTML = '';
  const list = serviciosBase[currentCategory] || [];
  
  const marca = document.getElementById('select-marca')?.value;
  const modelo = document.getElementById('select-modelo')?.value;
  const anio = parseInt(document.getElementById('select-anio')?.value) || 2020;
  
  let factor = (dbVehiculos[marca] && dbVehiculos[marca][modelo]) ? dbVehiculos[marca][modelo].factor : 1.0;
  if (anio >= 1970 && anio <= 1990) factor += 0.25;

  list.forEach(s => {
    const precio = Math.round(s.base * factor);
    const checked = selectedServices.has(s.id) ? 'checked' : '';

    const div = document.createElement('label');
    div.className = "p-3.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-red-500/50 cursor-pointer transition flex justify-between items-start";
    div.innerHTML = `
      <div class="flex items-start gap-2.5">
        <input type="checkbox" ${checked} onchange="toggleService('${s.id}')" class="mt-1 accent-red-600">
        <div>
          <p class="text-xs font-bold text-white">${s.nombre}</p>
          <p class="text-[10px] text-slate-400 mt-0.5">${s.horas}</p>
        </div>
      </div>
      <span class="text-xs font-mono font-bold text-red-400 ml-2">${'$' + precio.toLocaleString()}</span>
    `;
    container.appendChild(div);
  });
}

function toggleService(id) {
  if (selectedServices.has(id)) selectedServices.delete(id);
  else selectedServices.add(id);
}

function calcularTotal() {
  let total = 0;
  const marca = document.getElementById('select-marca')?.value;
  const modelo = document.getElementById('select-modelo')?.value;
  const anio = parseInt(document.getElementById('select-anio')?.value) || 2020;

  let factor = (dbVehiculos[marca] && dbVehiculos[marca][modelo]) ? dbVehiculos[marca][modelo].factor : 1.0;
  if (anio >= 1970 && anio <= 1990) factor += 0.25;

  const list = serviciosBase[currentCategory] || [];
  list.forEach(s => {
    if (selectedServices.has(s.id)) total += Math.round(s.base * factor);
  });
  return total;
}

function cargarHorariosDisponibles(fecha) {
  const contenedor = document.getElementById('contenedor-horarios');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // Horarios reducidos y establecidos a las 9, 11, 13, 15 y 17 horas
  const bloques = [
    "09:00", "11:00", "13:00", "15:00", "17:00"
  ];

  const citas = JSON.parse(localStorage.getItem('citas_registradas') || '[]');
  const bloqueos = JSON.parse(localStorage.getItem('bloqueos_admin') || '{}')[fecha] || [];

  const ocupados = citas
    .filter(c => c.fecha === fecha && c.estatus !== 'Cancelada')
    .map(c => c.hora);

  const horaSeleccionadaActual = document.getElementById('hora-seleccionada')?.value;

  bloques.forEach(hora => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = hora;

    const estaOcupado = ocupados.includes(hora) || bloqueos.includes(hora);

    if (estaOcupado) {
      btn.className = "p-2 bg-slate-900/90 text-slate-600 rounded-lg text-xs cursor-not-allowed line-through border border-slate-900 font-bold opacity-60";
      btn.disabled = true;
      btn.title = "Horario no disponible o ya reservado";
    } else {
      if (hora === horaSeleccionadaActual) {
        btn.className = "p-2 bg-red-600 text-white rounded-lg text-xs transition border border-red-500 btn-slot font-bold shadow-lg shadow-red-600/30 scale-105";
      } else {
        btn.className = "p-2 bg-slate-900 hover:bg-red-600/80 text-slate-300 hover:text-white rounded-lg text-xs transition border border-slate-800 btn-slot font-semibold";
      }

      btn.onclick = () => {
        document.querySelectorAll('.btn-slot').forEach(b => {
          b.className = "p-2 bg-slate-900 hover:bg-red-600/80 text-slate-300 hover:text-white rounded-lg text-xs transition border border-slate-800 btn-slot font-semibold";
        });
        
        btn.className = "p-2 bg-red-600 text-white rounded-lg text-xs transition border border-red-500 btn-slot font-bold shadow-lg shadow-red-600/30 scale-105";
        document.getElementById('hora-seleccionada').value = hora;
      };
    }
    contenedor.appendChild(btn);
  });
}

function prepararResumen() {
  const fechaElegida = document.getElementById('fecha-cita')?.value;
  currentFolio = generarFolio(fechaElegida);

  const nombreCliente = document.getElementById('input-nombre').value.trim();
  const telefonoCliente = document.getElementById('input-telefono').value.trim();

  document.getElementById('res-folio').innerText = currentFolio;
  document.getElementById('res-cliente').innerText = nombreCliente;
  document.getElementById('res-telefono').innerText = telefonoCliente;
  
  const m = document.getElementById('select-marca').value;
  const mod = document.getElementById('select-modelo').value;
  const a = document.getElementById('select-anio').value;
  const mot = document.getElementById('select-motor').value;

  document.getElementById('res-vehiculo').innerText = `${m} ${mod} (${a}) - ${mot}`;
  document.getElementById('res-vin').innerText = document.getElementById('input-vin').value;
  document.getElementById('res-tipo').innerText = currentCategory.toUpperCase();
  document.getElementById('res-agenda').innerText = `${fechaElegida} a las ${document.getElementById('hora-seleccionada').value}`;
  document.getElementById('res-costo').innerText = `$${calcularTotal().toLocaleString('es-MX')}`;
}

function obtenerNombresServiciosSeleccionados() {
  const lista = serviciosBase[currentCategory] || [];
  const nombres = [];
  lista.forEach(s => {
    if (selectedServices.has(s.id)) {
      nombres.push(s.nombre);
    }
  });
  return nombres.length > 0 ? nombres.join(', ') : currentCategory.toUpperCase();
}

async function confirmarYGuardarCita() {
  const fechaVal = document.getElementById('fecha-cita').value;
  const horaVal = document.getElementById('hora-seleccionada').value;

  const nombreVal = document.getElementById('input-nombre').value.trim();
  const telefonoVal = document.getElementById('input-telefono').value.trim();
  const vehiculoVal = document.getElementById('res-vehiculo').innerText;
  const servicioVal = obtenerNombresServiciosSeleccionados();
  const costoVal = document.getElementById('res-costo').innerText;

  const nuevaCita = {
    folio: currentFolio,
    cliente: nombreVal,
    nombre: nombreVal,
    telefono: telefonoVal,
    vehiculo: vehiculoVal,
    vin: document.getElementById('input-vin').value.toUpperCase(),
    servicio: servicioVal,
    fecha: fechaVal,
    hora: horaVal,
    costo: costoVal,
    estatus: "En espera"
  };

  const botonConfirmar = document.querySelector('button[onclick*="confirmarYGuardarCita"]');
  if (botonConfirmar) {
    botonConfirmar.disabled = true;
    botonConfirmar.innerText = "GUARDANDO CITA...";
  }

  try {
    const response = await fetch('/api/guardar-cita', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaCita)
    });

    const data = await response.json();
    
    if (botonConfirmar) {
      botonConfirmar.disabled = false;
      botonConfirmar.innerText = "CONFIRMAR Y AGENDAR CITA ✓";
    }

    if (response.ok && data.success) {
      console.log("Cita guardada en SQLite con éxito:", data);
      
      const citas = JSON.parse(localStorage.getItem('citas_registradas') || '[]');
      citas.push(nuevaCita);
      localStorage.setItem('citas_registradas', JSON.stringify(citas));

      document.getElementById('final-folio').innerText = currentFolio;
      goToStep(5);
    } else {
      console.error("Error devuelto por el servidor:", data);
      alert("El servidor no pudo guardar la cita: " + (data.error || "Error desconocido"));
    }

  } catch (err) {
    if (botonConfirmar) {
      botonConfirmar.disabled = false;
      botonConfirmar.innerText = "CONFIRMAR Y AGENDAR CITA ✓";
    }
    console.error("Error al conectar con la API:", err);
    alert("Error de conexión con el servidor.");
  }
}

function obtenerEnlaceSeguimiento() {
  return `${window.location.origin}/seguimiento?folio=${currentFolio}`;
}

function copiarEnlaceSeguimiento() {
  const enlace = obtenerEnlaceSeguimiento();
  navigator.clipboard.writeText(enlace).then(() => {
    alert("¡Enlace copiado al portapapeles!");
  }).catch(err => {
    console.error("Error al copiar:", err);
  });
}

function enviarPorWhatsApp() {
  const telefonoCliente = document.getElementById('input-telefono').value.trim();
  const enlace = obtenerEnlaceSeguimiento();
  const mensaje = `Hola ${document.getElementById('input-nombre').value.trim()}, tu cita en Taller Automotriz del Norte ha sido registrada con el folio *${currentFolio}*. Puedes dar seguimiento en tiempo real aquí: ${enlace}`;
  
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=52${telefonoCliente}&text=${encodeURIComponent(mensaje)}`;
  window.open(urlWhatsApp, '_blank');
}

function irARastrear() {
  window.location.href = `seguimiento.html?folio=${currentFolio}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Bloqueo estricto del VIN a 17 caracteres y mayúsculas automáticas (PC y Móvil)
  const inputVin = document.getElementById('input-vin');
  if (inputVin) {
    inputVin.setAttribute('maxlength', '17');
    inputVin.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().slice(0, 17);
    });
  }

  if (document.getElementById('select-marca')) {
    onMarcaChange();
    actualizarBarraPasos();

    // 2. Calendario optimizado para móviles (touchUi) y bloqueo de domingos
    if (typeof flatpickr !== "undefined") {
      flatpickr("#fecha-cita", {
        locale: "es",
        minDate: "today",
        dateFormat: "Y-m-d",
        touchUi: true, // Soluciona la apertura táctil en dispositivos móviles
        disable: [
          function(date) {
            // Deshabilita los domingos (0 = Domingo)
            return (date.getDay() === 0);
          }
        ],
        onChange: function(selectedDates, dateStr) {
          cargarHorariosDisponibles(dateStr);
        }
      });
    }
  }
});
