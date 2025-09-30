import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// ============================================================================
// MOCK DATA - Simulación de datos del sistema
// ============================================================================

const MOCK_USERS = {
  admin: {
    email: "admin@acre.com",
    password: "admin",
    role: "admin",
    name: "Admin ACRE",
  },
  productor: {
    email: "productor@campo.com",
    password: "prod",
    role: "productor",
    name: "Juan Pérez",
  },
};

const INITIAL_CLIENTES = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    razonSocial: "Estancia El Progreso",
    cuit: "20-12345678-9",
    email: "juan@campo.com",
    telefono: "+54 9 11 1234-5678",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    razonSocial: "Agro Sur SA",
    cuit: "30-98765432-1",
    email: "maria@agrosur.com",
    telefono: "+54 9 11 8765-4321",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    razonSocial: "Campo Fértil",
    cuit: "20-55555555-5",
    email: "carlos@campofertil.com",
    telefono: "+54 9 11 5555-5555",
    estado: "Inactivo",
  },
];

const INITIAL_INSUMOS = [
  {
    id: 1,
    nombre: "Urea 46%",
    tipo: "Fertilizante",
    principioActivo: "Nitrógeno",
    composicion: "N: 46%",
    dosis: "100-200 kg/ha",
    precio: 450,
    stock: 5000,
    unidad: "kg",
  },
  {
    id: 2,
    nombre: "Fosfato Diamónico",
    tipo: "Fertilizante",
    principioActivo: "Fósforo",
    composicion: "N: 18%, P: 46%",
    dosis: "80-150 kg/ha",
    precio: 520,
    stock: 3500,
    unidad: "kg",
  },
  {
    id: 3,
    nombre: "Glifosato 48%",
    tipo: "Herbicida",
    principioActivo: "Glifosato",
    composicion: "48% p/v",
    dosis: "2-4 L/ha",
    precio: 180,
    stock: 2000,
    unidad: "L",
  },
  {
    id: 4,
    nombre: "2,4-D Éster",
    tipo: "Herbicida",
    principioActivo: "2,4-D",
    composicion: "50% p/v",
    dosis: "1-2 L/ha",
    precio: 145,
    stock: 1800,
    unidad: "L",
  },
];

const INITIAL_SEMILLAS = [
  {
    id: 1,
    cultivo: "Soja",
    nombre: "DM 4670",
    ciclo: "Corto",
    densidadBaja: 280000,
    densidadMedia: 320000,
    densidadAlta: 360000,
    precio: 85,
    stock: 500,
    unidad: "bolsa",
    kgPorBolsa: 40,
  },
  {
    id: 2,
    cultivo: "Maíz",
    nombre: "AX 7851",
    ciclo: "Largo",
    densidadBaja: 65000,
    densidadMedia: 75000,
    densidadAlta: 85000,
    precio: 420,
    stock: 300,
    unidad: "bolsa",
    kgPorBolsa: 20,
  },
  {
    id: 3,
    cultivo: "Trigo",
    nombre: "Baguette 31",
    ciclo: "Intermedio",
    densidadBaja: 120,
    densidadMedia: 140,
    densidadAlta: 160,
    precio: 38,
    stock: 800,
    unidad: "kg",
  },
];

const INITIAL_LOTES = [
  {
    id: 1,
    nombre: "Lote Norte",
    campana: "Soja 2025/26",
    superficie: 45.8,
    estado: "Planificación generada",
    color: "#10b981",
    analisisSuelo: { ph: 6.2, mo: 3.1, p: 18, n: 45 },
    napas: 2.5,
    malezas: [
      { nombre: "Yuyo Colorado", presente: true },
      { nombre: "Rama Negra", presente: false },
      { nombre: "Sorgo de Alepo", presente: true },
    ],
    enso: "Niña",
    planificacion: null,
  },
  {
    id: 2,
    nombre: "Lote Sur",
    campana: "Maíz 2025/26",
    superficie: 62.3,
    estado: "Datos incompletos",
    color: "#f59e0b",
    analisisSuelo: null,
    napas: null,
    malezas: [],
    enso: "Niña",
    planificacion: null,
  },
  {
    id: 3,
    nombre: "Potrero Este",
    campana: "Trigo 2025/26",
    superficie: 38.5,
    estado: "Listo para planificar",
    color: "#3b82f6",
    analisisSuelo: { ph: 6.5, mo: 2.8, p: 22, n: 38 },
    napas: 3.2,
    malezas: [
      { nombre: "Yuyo Colorado", presente: false },
      { nombre: "Rama Negra", presente: true },
      { nombre: "Sorgo de Alepo", presente: false },
    ],
    enso: "Niña",
    planificacion: null,
  },
];

// ============================================================================
// MOTOR DE RECOMENDACIONES - Lógica agronómica simplificada
// ============================================================================

const calcularRecomendacion = function (lote, cultivo, rendimientoObjetivo, insumos, semillas) {
  // Ajuste ENSO
  const ajusteENSO = lote.enso === "Niño" ? 1.05 : lote.enso === "Niña" ? 0.95 : 1.0;
  const rendimientoAjustado = rendimientoObjetivo * ajusteENSO;

  // Requerimientos nutricionales por cultivo (kg/ha por tonelada de rendimiento)
  const requerimientos = {
    soja: { n: 80, p: 20, k: 20 },
    maiz: { n: 25, p: 10, k: 25 },
    trigo: { n: 30, p: 12, k: 20 },
  };

  const req = requerimientos[cultivo] || requerimientos.soja;

  // Calcular necesidades totales (Requerimiento para rendimiento objetivo - Aporte del suelo)
  const rendimientoTonHa = rendimientoAjustado / 1000;
  const necesidadN = Math.max(0, req.n * rendimientoTonHa - (lote.analisisSuelo?.n || 0));
  const necesidadP = Math.max(0, req.p * rendimientoTonHa - (lote.analisisSuelo?.p || 0) * 0.5);

  // Seleccionar fertilizantes del catálogo
  const urea = insumos.find(function (i) {
    return i.nombre.includes("Urea");
  });
  const fosfato = insumos.find(function (i) {
    return i.nombre.includes("Fosfato");
  });

  const fertilizantesRec = [];

  if (urea && necesidadN > 0) {
    const cantidadHa = Math.ceil(necesidadN / 0.46);
    const cantidadTotal = Math.ceil(cantidadHa * lote.superficie);
    fertilizantesRec.push({
      nombre: urea.nombre,
      cantidadHa: cantidadHa,
      cantidadTotal: cantidadTotal,
      precio: cantidadTotal * urea.precio,
      stock: urea.stock,
      unidad: urea.unidad,
    });
  }

  if (fosfato && necesidadP > 0) {
    const cantidadHa = Math.ceil(necesidadP / 0.46);
    const cantidadTotal = Math.ceil(cantidadHa * lote.superficie);
    fertilizantesRec.push({
      nombre: fosfato.nombre,
      cantidadHa: cantidadHa,
      cantidadTotal: cantidadTotal,
      precio: cantidadTotal * fosfato.precio,
      stock: fosfato.stock,
      unidad: fosfato.unidad,
    });
  }

  // Seleccionar semillas
  const semillasRec = [];
  const semillaMatch = semillas.find(function (s) {
    return s.cultivo.toLowerCase() === cultivo;
  });

  if (semillaMatch) {
    let densidad = semillaMatch.densidadMedia * ajusteENSO;

    // Para soja/maíz: calcular bolsas. Para trigo: kg directo
    let cantidadTotal, unidadFinal;
    if (cultivo === "soja" || cultivo === "maiz") {
      const plantasTotales = densidad * lote.superficie;
      const bolsasNecesarias = Math.ceil(plantasTotales / (semillaMatch.kgPorBolsa * 1000));
      cantidadTotal = bolsasNecesarias;
      unidadFinal = "bolsas";
    } else {
      // Trigo: kg/ha
      cantidadTotal = Math.ceil(densidad * lote.superficie);
      unidadFinal = "kg";
    }

    semillasRec.push({
      nombre: semillaMatch.nombre,
      densidad: Math.round(densidad),
      cantidadTotal: cantidadTotal,
      precio: cantidadTotal * semillaMatch.precio,
      stock: semillaMatch.stock,
      unidad: unidadFinal,
    });
  }

  // Seleccionar herbicidas según malezas
  const herbicidasRec = [];
  const malezasPresentes = lote.malezas.filter(function (m) {
    return m.presente;
  });

  if (malezasPresentes.length > 0) {
    const glifosato = insumos.find(function (i) {
      return i.nombre.includes("Glifosato");
    });
    if (glifosato) {
      const cantidadHa = 3;
      const cantidadTotal = cantidadHa * lote.superficie;
      herbicidasRec.push({
        nombre: glifosato.nombre,
        cantidadHa: cantidadHa,
        cantidadTotal: Math.ceil(cantidadTotal),
        precio: Math.ceil(cantidadTotal * glifosato.precio),
        stock: glifosato.stock,
        unidad: glifosato.unidad,
      });
    }

    const ramaNegraPresente = malezasPresentes.find(function (m) {
      return m.nombre === "Rama Negra";
    });
    if (ramaNegraPresente) {
      const producto24D = insumos.find(function (i) {
        return i.nombre.includes("2,4-D");
      });
      if (producto24D) {
        const cantidadHa = 1.5;
        const cantidadTotal = cantidadHa * lote.superficie;
        herbicidasRec.push({
          nombre: producto24D.nombre,
          cantidadHa: cantidadHa,
          cantidadTotal: Math.ceil(cantidadTotal),
          precio: Math.ceil(cantidadTotal * producto24D.precio),
          stock: producto24D.stock,
          unidad: producto24D.unidad,
        });
      }
    }
  }

  const costoTotal =
    fertilizantesRec.reduce(function (sum, f) { return sum + f.precio; }, 0) +
    semillasRec.reduce(function (sum, s) { return sum + s.precio; }, 0) +
    herbicidasRec.reduce(function (sum, h) { return sum + h.precio; }, 0);

  return {
    fertilizantes: fertilizantesRec,
    semillas: semillasRec,
    herbicidas: herbicidasRec,
    costoTotal: costoTotal,
    rendimientoEsperado: Math.round(rendimientoAjustado),
    ajusteENSO: ajusteENSO,
  };
};

// ============================================================================
// UTILIDADES
// ============================================================================

const generateNDVIHistory = function () {
  const years = ["2020", "2021", "2022", "2023", "2024"];
  return years.map(function (year) {
    return {
      year: year,
      ndvi: 0.45 + Math.random() * 0.35,
      min: 0.3 + Math.random() * 0.2,
      max: 0.65 + Math.random() * 0.25,
    };
  });
};

const addLog = function (logs, tipo, usuario, detalle) {
  const newLog = {
    id: Date.now(),
    fecha: new Date().toLocaleString("es-AR"),
    tipo: tipo,
    usuario: usuario,
    detalle: detalle,
  };
  return [newLog].concat(logs);
};

// ============================================================================
// COMPONENTES UI
// ============================================================================

const SimpleMap = function ({ lotes, selectedLote, onSelectLote }) {
  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <img
        src="https://tile.openstreetmap.org/12/2048/2560.png"
        alt="Map background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl mx-auto p-8">
          {lotes.map(function (lote, idx) {
            return (
              <div
                key={lote.id}
                className="absolute w-32 h-32 rounded-lg border-4 transition-all hover:scale-110 cursor-pointer"
                style={{
                  borderColor: lote.color,
                  backgroundColor: lote.color + "30",
                  left: 20 + idx * 30 + "%",
                  top: 30 + idx * 15 + "%",
                  transform:
                    selectedLote && selectedLote.id === lote.id
                      ? "scale(1.1)"
                      : "scale(1)",
                  boxShadow:
                    selectedLote && selectedLote.id === lote.id
                      ? "0 0 20px " + lote.color
                      : "none",
                }}
                onClick={function () {
                  onSelectLote(lote);
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <div className="bg-white rounded px-2 py-1 shadow-lg">
                    <p className="font-bold text-sm">{lote.nombre}</p>
                    <p className="text-xs text-gray-600">
                      {lote.superficie} ha
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <p className="text-xs font-semibold mb-2">Leyenda:</p>
        {lotes.map(function (lote) {
          return (
            <div key={lote.id} className="flex items-center gap-2 text-xs mb-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: lote.color }}
              ></div>
              <span>{lote.nombre}</span>
            </div>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg text-xs">
        <p className="font-semibold">Vista de Campo</p>
        <p className="text-gray-600">Buenos Aires, AR</p>
      </div>
    </div>
  );
};

const CreateLoteModal = function ({ onClose, onCreate, existingLotes }) {
  const [nombre, setNombre] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [campana, setCampana] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCreate = function () {
    setIsDrawing(true);
    setTimeout(function () {
      const newLote = {
        id: Date.now(),
        nombre: nombre || "Lote " + (existingLotes.length + 1),
        campana: campana || "Campaña 2025/26",
        superficie:
          parseFloat(superficie) || Math.round(Math.random() * 50 + 30),
        estado: "Datos incompletos",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        analisisSuelo: null,
        napas: null,
        malezas: [
          { nombre: "Yuyo Colorado", presente: false },
          { nombre: "Rama Negra", presente: false },
          { nombre: "Sorgo de Alepo", presente: false },
        ],
        enso: "Niña",
        planificacion: null,
      };
      onCreate(newLote);
      setIsDrawing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Lote</h2>

        {isDrawing ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Dibujando polígono en el mapa...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Calculando área y generando geometría
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Lote
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={function (e) {
                    setNombre(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Lote Norte"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaña
                </label>
                <input
                  type="text"
                  value={campana}
                  onChange={function (e) {
                    setCampana(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Soja 2025/26"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Superficie Estimada (hectáreas)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={superficie}
                  onChange={function (e) {
                    setSuperficie(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: 45.8"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Simulación de Dibujo</p>
                  <p>
                    En la versión final, podrás dibujar el polígono directamente
                    sobre el mapa interactivo. El sistema calculará
                    automáticamente el área en hectáreas.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Crear Lote
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const GEELayersPanel = function ({ lote, onClose }) {
  const [showDEM, setShowDEM] = useState(true);
  const [showNDVI, setShowNDVI] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ndviHistory] = useState(generateNDVIHistory());

  React.useEffect(
    function () {
      const timer = setTimeout(function () {
        setLoading(false);
      }, 1200);
      return function () {
        clearTimeout(timer);
      };
    },
    [lote.id]
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Consultando Google Earth Engine...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Procesando capas DEM y NDVI histórico
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl z-40 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{lote.nombre}</h3>
            <p className="text-sm text-gray-600">{lote.superficie} hectáreas</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-sm font-semibold text-green-800">
            Capas GEE Activas
          </p>
          <p className="text-xs text-green-700 mt-1">
            DEM y NDVI cargados correctamente
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Modelo Digital de Elevación (DEM)
            </h4>
            <div className="bg-gradient-to-b from-amber-900 via-yellow-700 to-green-800 rounded-lg h-48 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
                  return (
                    <div
                      key={i}
                      className="h-6 border-t border-white"
                      style={{ marginTop: i * 24 + "px" }}
                    ></div>
                  );
                })}
              </div>
              <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 p-2 rounded text-xs">
                <p className="font-semibold">Elevación</p>
                <p>Min: 85m | Max: 142m</p>
              </div>
            </div>
            <label className="flex items-center mt-3">
              <input
                type="checkbox"
                checked={showDEM}
                onChange={function (e) {
                  setShowDEM(e.target.checked);
                }}
                className="w-4 h-4 text-green-600 rounded"
              />
              <span className="ml-2 text-sm">Mostrar capa DEM en mapa</span>
            </label>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              NDVI Histórico (5 años)
            </h4>
            <div className="bg-gradient-to-br from-yellow-600 via-green-500 to-green-700 rounded-lg h-48 relative overflow-hidden">
              <div className="absolute inset-0 opacity-40">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
                  return (
                    <div
                      key={i}
                      className="absolute rounded-full bg-green-900"
                      style={{
                        width: Math.random() * 40 + 20 + "px",
                        height: Math.random() * 40 + 20 + "px",
                        left: Math.random() * 80 + 10 + "%",
                        top: Math.random() * 80 + 10 + "%",
                      }}
                    ></div>
                  );
                })}
              </div>
              <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 p-2 rounded text-xs">
                <p className="font-semibold">Índice NDVI</p>
                <p>Promedio: 0.68 (Saludable)</p>
              </div>
            </div>
            <label className="flex items-center mt-3">
              <input
                type="checkbox"
                checked={showNDVI}
                onChange={function (e) {
                  setShowNDVI(e.target.checked);
                }}
                className="w-4 h-4 text-green-600 rounded"
              />
              <span className="ml-2 text-sm">Mostrar capa NDVI en mapa</span>
            </label>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Tendencia NDVI (2020-2024)</h4>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={ndviHistory}>
                <defs>
                  <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="ndvi"
                  stroke="#10b981"
                  fill="url(#ndviGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div>
                <p className="font-semibold">Mínimo</p>
                <p>
                  {Math.min
                    .apply(
                      null,
                      ndviHistory.map(function (d) {
                        return d.ndvi;
                      })
                    )
                    .toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Promedio</p>
                <p>
                  {(
                    ndviHistory.reduce(function (a, b) {
                      return a + b.ndvi;
                    }, 0) / ndviHistory.length
                  ).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Máximo</p>
                <p>
                  {Math.max
                    .apply(
                      null,
                      ndviHistory.map(function (d) {
                        return d.ndvi;
                      })
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">Fuente de Datos</p>
            <p className="text-xs">Google Earth Engine</p>
            <p className="text-xs text-gray-600 mt-1">
              DEM: SRTM 30m | NDVI: Sentinel-2 L2A
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Última actualización: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = function ({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = function () {
    const user = Object.values(MOCK_USERS).find(function (u) {
      return u.email === email && u.password === password;
    });
    if (user) {
      onLogin(user);
    } else {
      alert(
        "Credenciales inválidas. Usa: admin@acre.com / admin o productor@campo.com / prod"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-lime-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo con patrón agrícola */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
          backgroundSize: '70px 100%'
        }}></div>
      </div>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-5xl relative z-10 flex">
        {/* Panel izquierdo - Información */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-green-700 to-green-900 p-12 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold">ACRE</h1>
                <p className="text-green-200 text-sm">Agricultura de Precisión</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Tecnología Agronómica Inteligente</h2>
            <p className="text-green-100 mb-8 leading-relaxed">
              Plataforma profesional para planificación de cultivos, análisis de suelo y recomendaciones de insumos basadas en datos satelitales y modelos agronómicos.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-2 rounded mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Análisis Satelital GEE</p>
                  <p className="text-sm text-green-200">NDVI histórico y modelos de elevación</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-2 rounded mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Integración ENSO</p>
                  <p className="text-sm text-green-200">Ajustes climáticos del SMN en tiempo real</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-2 rounded mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Motor Agronómico</p>
                  <p className="text-sm text-green-200">Recomendaciones de fertilización y siembra</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patrón decorativo */}
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M45.3,-57.5C57.9,-49.1,66.6,-33.5,70.4,-16.4C74.2,0.7,73.1,19.3,64.8,33.8C56.5,48.3,40.9,58.7,24.3,63.7C7.7,68.7,-10,68.3,-25.4,62.4C-40.8,56.5,-53.9,45.1,-61.7,30.5C-69.5,15.9,-72,-1.9,-67.3,-17.5C-62.6,-33.1,-50.7,-46.5,-37.1,-54.7C-23.5,-62.9,-8.2,-65.9,5.3,-72.5C18.8,-79.1,32.7,-65.9,45.3,-57.5Z" transform="translate(100 100)"/>
            </svg>
          </div>
        </div>

        {/* Panel derecho - Login */}
        <div className="w-full lg:w-1/2 p-12">
          <div className="max-w-md mx-auto">
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">ACRE Platform</h1>
              <p className="text-gray-600 text-sm">Agricultura de Precisión</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600 mb-8">Acceda a su cuenta profesional</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={function (e) {
                    setEmail(e.target.value);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={function (e) {
                    setPassword(e.target.value);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
                  placeholder="••••••••"
                  onKeyPress={function (e) {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Ingresar al Sistema
              </button>
            </div>

            <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r">
              <p className="text-xs font-semibold text-amber-900 mb-2">CREDENCIALES DEMO</p>
              <div className="text-xs text-amber-800 space-y-1">
                <p><span className="font-semibold">Admin:</span> admin@acre.com / admin</p>
                <p><span className="font-semibold">Productor:</span> productor@campo.com / prod</p>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>© 2025 ACRE Platform • Versión MVP 1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function App() {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState(INITIAL_CLIENTES);
  const [insumos, setInsumos] = useState(INITIAL_INSUMOS);
  const [semillas, setSemillas] = useState(INITIAL_SEMILLAS);
  const [lotes, setLotes] = useState(INITIAL_LOTES);
  const [logs, setLogs] = useState([]);

  const handleLogin = function (userData) {
    setUser(userData);
    setLogs(addLog(logs, "Login", userData.name, "Inicio de sesión exitoso"));
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user.role === "admin") {
    return (
      <AdminPanel
        onLogout={function () {
          setUser(null);
        }}
        user={user}
        clientes={clientes}
        setClientes={setClientes}
        insumos={insumos}
        setInsumos={setInsumos}
        semillas={semillas}
        setSemillas={setSemillas}
        logs={logs}
        setLogs={setLogs}
      />
    );
  }

  return (
    <ProductorDashboard
      onLogout={function () {
        setUser(null);
      }}
      user={user}
      lotes={lotes}
      setLotes={setLotes}
      insumos={insumos}
      semillas={semillas}
      logs={logs}
      setLogs={setLogs}
    />
  );
}

// ============================================================================
// WIZARD DE PLANIFICACIÓN
// ============================================================================

const WizardPlanificacion = function ({
  lote,
  step,
  onStepChange,
  onComplete,
  onCancel,
}) {
  const [cultivo, setCultivo] = useState("");
  const [fechaSiembra, setFechaSiembra] = useState("");
  const [rendimientoObjetivo, setRendimientoObjetivo] = useState("");

  const handleComplete = function () {
    onComplete({
      cultivo: cultivo,
      fechaSiembra: fechaSiembra,
      rendimientoObjetivo: parseInt(rendimientoObjetivo),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onCancel}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              ← Cancelar
            </button>
            <span className="text-2xl font-bold text-green-600">
              Asistente de Planificación
            </span>
            <span className="ml-4 text-gray-600">- {lote.nombre}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(function (s) {
              return (
                <div key={s} className="flex items-center">
                  <div
                    className={
                      "w-12 h-12 rounded-full flex items-center justify-center font-bold " +
                      (step >= s
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600")
                    }
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={
                        "w-32 h-1 mx-2 " +
                        (step > s ? "bg-green-600" : "bg-gray-300")
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Datos del Lote</span>
            <span className="text-sm text-gray-600">Cultivo y Objetivo</span>
            <span className="text-sm text-gray-600">Confirmación</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Paso 1: Datos del Lote
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Lote</p>
                      <p className="font-semibold">{lote.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Campaña</p>
                      <p className="font-semibold">{lote.campana}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Superficie</p>
                      <p className="font-semibold">{lote.superficie} ha</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado ENSO</p>
                      <p className="font-semibold text-blue-600">{lote.enso}</p>
                    </div>
                  </div>
                </div>

                {lote.analisisSuelo && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Análisis de Suelo</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">pH</p>
                        <p className="font-semibold">{lote.analisisSuelo.ph}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">MO %</p>
                        <p className="font-semibold">{lote.analisisSuelo.mo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">P (ppm)</p>
                        <p className="font-semibold">{lote.analisisSuelo.p}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">N (kg/ha)</p>
                        <p className="font-semibold">{lote.analisisSuelo.n}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={function () {
                    onStepChange(2);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Paso 2: Selección de Cultivo y Objetivo
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultivo
                  </label>
                  <select
                    value={cultivo}
                    onChange={function (e) {
                      setCultivo(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seleccione un cultivo</option>
                    <option value="soja">Soja</option>
                    <option value="maiz">Maíz</option>
                    <option value="trigo">Trigo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Siembra Objetivo
                  </label>
                  <input
                    type="date"
                    value={fechaSiembra}
                    onChange={function (e) {
                      setFechaSiembra(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimiento Objetivo (kg/ha)
                  </label>
                  <input
                    type="number"
                    value={rendimientoObjetivo}
                    onChange={function (e) {
                      setRendimientoObjetivo(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="3800"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Sugerido: 3500-4500 kg/ha para soja (ajustado por ENSO:{" "}
                    {lote.enso})
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={function () {
                    onStepChange(1);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Anterior
                </button>
                <button
                  onClick={function () {
                    onStepChange(3);
                  }}
                  disabled={!cultivo || !fechaSiembra || !rendimientoObjetivo}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Paso 3: Confirmación</h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-3">
                    Resumen de Planificación
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lote:</span>
                      <span className="font-semibold">{lote.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Superficie:</span>
                      <span className="font-semibold">
                        {lote.superficie} ha
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cultivo:</span>
                      <span className="font-semibold capitalize">
                        {cultivo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha Siembra:</span>
                      <span className="font-semibold">{fechaSiembra}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Rendimiento Objetivo:
                      </span>
                      <span className="font-semibold">
                        {rendimientoObjetivo} kg/ha
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado ENSO:</span>
                      <span className="font-semibold text-blue-600">
                        {lote.enso} ({lote.enso === "Niña" ? "-5%" : lote.enso === "Niño" ? "+5%" : "0%"} ajuste)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Al confirmar, el sistema generará una recomendación
                    personalizada de insumos (fertilizantes, semillas y
                    herbicidas) basándose en:
                  </p>
                  <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>Análisis de suelo del lote</li>
                    <li>Requerimientos nutricionales del cultivo</li>
                    <li>Ajustes por condición ENSO ({lote.enso})</li>
                    <li>Catálogo de productos disponibles</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={function () {
                    onStepChange(2);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Anterior
                </button>
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Generar Recomendación
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CARGA DE DATOS
// ============================================================================

const CargaDatos = function ({ lote, onBack, onComplete }) {
  const [tab, setTab] = useState("suelo");
  const [suelo, setSuelo] = useState(
    lote.analisisSuelo || {
      ph: "",
      mo: "",
      p: "",
      n: "",
    }
  );
  const [napas, setNapas] = useState(lote.napas || "");
  const [malezas, setMalezas] = useState(
    lote.malezas.length > 0
      ? lote.malezas
      : [
          { nombre: "Yuyo Colorado", presente: false },
          { nombre: "Rama Negra", presente: false },
          { nombre: "Sorgo de Alepo", presente: false },
        ]
  );

  const handleSave = function () {
    onComplete({
      analisisSuelo: {
        ph: parseFloat(suelo.ph),
        mo: parseFloat(suelo.mo),
        p: parseFloat(suelo.p),
        n: parseFloat(suelo.n),
      },
      napas: parseFloat(napas),
      malezas: malezas,
    });
  };

  const isValid =
    suelo.ph && suelo.mo && suelo.p && suelo.n && napas;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
            <span className="text-2xl font-bold text-green-600">
              Centro de Carga de Datos
            </span>
            <span className="ml-4 text-gray-600">- {lote.nombre}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button
              onClick={function () {
                setTab("suelo");
              }}
              className={
                "px-6 py-4 font-semibold " +
                (tab === "suelo"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600")
              }
            >
              Análisis de Suelo
            </button>
            <button
              onClick={function () {
                setTab("malezas");
              }}
              className={
                "px-6 py-4 font-semibold " +
                (tab === "malezas"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600")
              }
            >
              Mapas de Malezas
            </button>
            <button
              onClick={function () {
                setTab("napas");
              }}
              className={
                "px-6 py-4 font-semibold " +
                (tab === "napas"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600")
              }
            >
              Napas Freáticas
            </button>
          </div>

          <div className="p-8">
            {tab === "suelo" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Análisis de Suelo</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      pH
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={suelo.ph}
                      onChange={function (e) {
                        setSuelo({
                          ph: e.target.value,
                          mo: suelo.mo,
                          p: suelo.p,
                          n: suelo.n,
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="6.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Materia Orgánica (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={suelo.mo}
                      onChange={function (e) {
                        setSuelo({
                          ph: suelo.ph,
                          mo: e.target.value,
                          p: suelo.p,
                          n: suelo.n,
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="3.2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fósforo (ppm)
                    </label>
                    <input
                      type="number"
                      value={suelo.p}
                      onChange={function (e) {
                        setSuelo({
                          ph: suelo.ph,
                          mo: suelo.mo,
                          p: e.target.value,
                          n: suelo.n,
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="18"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nitrógeno (kg/ha)
                    </label>
                    <input
                      type="number"
                      value={suelo.n}
                      onChange={function (e) {
                        setSuelo({
                          ph: suelo.ph,
                          mo: suelo.mo,
                          p: suelo.p,
                          n: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="45"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Nota:</strong> Los valores ingresados se utilizarán
                    para calcular las necesidades de fertilización del lote.
                  </p>
                </div>
              </div>
            )}

            {tab === "malezas" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mapa de Malezas</h2>
                <p className="text-gray-600 mb-6">
                  Seleccione las malezas presentes en el lote:
                </p>

                <div className="space-y-4">
                  {malezas.map(function (maleza, idx) {
                    return (
                      <label
                        key={idx}
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={maleza.presente}
                          onChange={function (e) {
                            const newMalezas = malezas.slice();
                            newMalezas[idx] = {
                              nombre: maleza.nombre,
                              presente: e.target.checked,
                            };
                            setMalezas(newMalezas);
                          }}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="ml-3 text-lg">{maleza.nombre}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Versión Post-MVP:</strong> Podrás subir archivos
                    Shapefile o dibujar zonas directamente en el mapa.
                  </p>
                </div>
              </div>
            )}

            {tab === "napas" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Profundidad de Napas Freáticas
                </h2>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profundidad estimada (metros)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={napas}
                    onChange={function (e) {
                      setNapas(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="2.5"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Este dato ayuda a evaluar riesgos de encharcamiento y
                    estrategias de drenaje.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Guardar Datos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// REPORTE DE RECOMENDACIÓN - NUEVO COMPONENTE
// ============================================================================

const ReporteRecomendacion = function ({ lote, onBack }) {
  if (!lote.planificacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-2xl p-12 max-w-md">
          <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-2">Sin Planificación</p>
          <p className="text-gray-600 mb-6">No se ha generado una planificación para este lote</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const rec = lote.planificacion.recomendacion;
  const costoHa = rec.costoTotal / lote.superficie;

  const handleExportPDF = function () {
    alert("Funcionalidad de exportación PDF en desarrollo. En versión completa se generará un PDF descargable con formato profesional.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50">
      {/* Header Navbar Profesional */}
      <nav className="bg-gradient-to-r from-green-800 to-green-700 shadow-2xl border-b-4 border-green-900 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border border-white border-opacity-30 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Volver
              </button>
              <div className="border-l border-white border-opacity-30 pl-4">
                <p className="text-green-200 text-xs font-semibold uppercase tracking-wide">Reporte Técnico</p>
                <p className="text-white text-xl font-bold">{lote.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-blue-900 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-400">
                <svg className="w-5 h-5 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>
                <div>
                  <p className="text-xs text-blue-200">ENSO</p>
                  <p className="text-sm font-bold text-white">{lote.enso} ({(rec.ajusteENSO - 1) * 100 > 0 ? "+" : ""}{((rec.ajusteENSO - 1) * 100).toFixed(0)}%)</p>
                </div>
              </div>
              <button
                onClick={handleExportPDF}
                className="bg-white text-green-800 px-6 py-3 rounded-lg hover:bg-green-50 font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Resumen Ejecutivo */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-8 mb-8 border-t-4 border-green-600">
          <div className="flex items-center mb-6">
            <div className="bg-green-600 p-3 rounded-lg mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Resumen Ejecutivo</h2>
              <p className="text-gray-600">Planificación Agronómica - Campaña {lote.campana}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-500 transition-all">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Lote</p>
              <p className="text-2xl font-bold text-gray-800">{lote.nombre}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-500 transition-all">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Superficie</p>
              <p className="text-2xl font-bold text-gray-800">{lote.superficie} <span className="text-sm">ha</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-500 transition-all">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Cultivo</p>
              <p className="text-2xl font-bold text-green-700 capitalize">{lote.planificacion.cultivo}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-500 transition-all">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Siembra</p>
              <p className="text-lg font-bold text-gray-800">{new Date(lote.planificacion.fechaSiembra).toLocaleDateString('es-AR', {day: 'numeric', month: 'short'})}</p>
            </div>
          </div>

          {/* KPIs Principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rendimiento */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-green-100 text-sm font-semibold uppercase tracking-wide">Rendimiento Objetivo</p>
                <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <p className="text-5xl font-bold mb-2">{rec.rendimientoEsperado}</p>
              <p className="text-green-100 text-lg">kg/ha</p>
              <div className="mt-3 pt-3 border-t border-green-500">
                <p className="text-xs text-green-200">Ajuste ENSO: {lote.enso} ({(rec.ajusteENSO - 1) * 100 > 0 ? "+" : ""}{((rec.ajusteENSO - 1) * 100).toFixed(0)}%)</p>
              </div>
            </div>

            {/* Inversión Total */}
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-amber-100 text-sm font-semibold uppercase tracking-wide">Inversión Total</p>
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-5xl font-bold mb-2">${(rec.costoTotal / 1000).toFixed(1)}K</p>
              <p className="text-amber-100 text-lg">Pesos</p>
              <div className="mt-3 pt-3 border-t border-amber-500">
                <p className="text-xs text-amber-200">Total: ${rec.costoTotal.toLocaleString()}</p>
              </div>
            </div>

            {/* Costo por Hectárea */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Costo por Hectárea</p>
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <p className="text-5xl font-bold mb-2">${Math.round(costoHa).toLocaleString()}</p>
              <p className="text-blue-100 text-lg">/ha</p>
              <div className="mt-3 pt-3 border-t border-blue-500">
                <p className="text-xs text-blue-200">Métrica clave de inversión</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fertilizantes */}
        {rec.fertilizantes.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl mb-8 border-l-4 border-amber-500 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-white p-6 border-b-2 border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-amber-500 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Plan de Fertilización</h3>
                    <p className="text-sm text-gray-600">Nutrientes basados en análisis de suelo</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Subtotal</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ${rec.fertilizantes.reduce(function (sum, f) { return sum + f.precio; }, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-left font-bold">Producto</th>
                    <th className="px-6 py-4 text-right font-bold">Dosis/ha</th>
                    <th className="px-6 py-4 text-right font-bold">Cantidad Total</th>
                    <th className="px-6 py-4 text-right font-bold">Disponibilidad</th>
                    <th className="px-6 py-4 text-right font-bold">Precio Unit.</th>
                    <th className="px-6 py-4 text-right font-bold">Precio Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rec.fertilizantes.map(function (f, idx) {
                    const haySuficienteStock = f.cantidadTotal <= f.stock;
                    return (
                      <tr key={idx} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{f.nombre}</p>
                          <p className="text-xs text-gray-500 mt-1">Fertilizante NPK</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-gray-800">{f.cantidadHa}</p>
                          <p className="text-xs text-gray-500">{f.unidad}/ha</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-lg font-bold text-gray-800">{f.cantidadTotal.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{f.unidad}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={haySuficienteStock ? "bg-green-100 rounded-lg px-3 py-2 inline-block" : "bg-red-100 rounded-lg px-3 py-2 inline-block"}>
                            <p className={haySuficienteStock ? "font-bold text-green-700" : "font-bold text-red-700"}>
                              {haySuficienteStock ? "✓ Stock OK" : "⚠ Insuficiente"}
                            </p>
                            <p className={haySuficienteStock ? "text-xs text-green-600" : "text-xs text-red-600"}>
                              {f.stock.toLocaleString()} {f.unidad}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-gray-700">${(f.precio / f.cantidadTotal).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">/{f.unidad}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xl font-bold text-gray-800">${f.precio.toLocaleString()}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Semillas */}
        {rec.semillas.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl mb-8 border-l-4 border-green-600 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-white p-6 border-b-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-600 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Plan de Siembra</h3>
                    <p className="text-sm text-gray-600">Densidad ajustada por condición ENSO</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Subtotal</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${rec.semillas.reduce(function (sum, s) { return sum + s.precio; }, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-left font-bold">Variedad</th>
                    <th className="px-6 py-4 text-right font-bold">Densidad</th>
                    <th className="px-6 py-4 text-right font-bold">Cantidad</th>
                    <th className="px-6 py-4 text-right font-bold">Disponibilidad</th>
                    <th className="px-6 py-4 text-right font-bold">Precio Unit.</th>
                    <th className="px-6 py-4 text-right font-bold">Precio Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rec.semillas.map(function (s, idx) {
                    const haySuficienteStock = s.cantidadTotal <= s.stock;
                    return (
                      <tr key={idx} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{s.nombre}</p>
                          <p className="text-xs text-gray-500 mt-1 capitalize">{lote.planificacion.cultivo}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-gray-800">{s.densidad.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">pl/ha</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-lg font-bold text-gray-800">{s.cantidadTotal.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{s.unidad}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={haySuficienteStock ? "bg-green-100 rounded-lg px-3 py-2 inline-block" : "bg-red-100 rounded-lg px-3 py-2 inline-block"}>
                            <p className={haySuficienteStock ? "font-bold text-green-700" : "font-bold text-red-700"}>
                              {haySuficienteStock ? "✓ Stock OK" : "⚠ Insuficiente"}
                            </p>
                            <p className={haySuficienteStock ? "text-xs text-green-600" : "text-xs text-red-600"}>
                              {s.stock.toLocaleString()} {s.unidad}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-gray-700">${(s.precio / s.cantidadTotal).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">/{s.unidad}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xl font-bold text-gray-800">${s.precio.toLocaleString()}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Herbicidas */}
        {rec.herbicidas.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl mb-8 border-l-4 border-red-500 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-white p-6 border-b-2 border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-500 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Control de Malezas</h3>
                    <p className="text-sm text-gray-600">Herbicidas según mapa de malezas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Subtotal</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${rec.herbicidas.reduce(function (sum, h) { return sum + h.precio; }, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-left font-bold">Producto</th>
                    <th className="px-6 py-4 text-right font-bold">Dosis/ha</th>
                    <th className="px-6 py-4 text-right font-bold">Cantidad Total</th>
                    <th className="px-6 py-4 text-right font-bold">Disponibilidad</th>
                    <th className="px-6 py-4 text-right font-bold">Precio Unit.</th>
                    <th className="px-6 py-4 text-right font-bold">Precio Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rec.herbicidas.map(function (h, idx) {
                    const haySuficienteStock = h.cantidadTotal <= h.stock;
                    return (
                      <tr key={idx} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{h.nombre}</p>
                          <p className="text-xs text-gray-500 mt-1">Herbicida</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-gray-800">{h.cantidadHa}</p>
                          <p className="text-xs text-gray-500">{h.unidad}/ha</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-lg font-bold text-gray-800">{h.cantidadTotal.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{h.unidad}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={haySuficienteStock ? "bg-green-100 rounded-lg px-3 py-2 inline-block" : "bg-red-100 rounded-lg px-3 py-2 inline-block"}>
                            <p className={haySuficienteStock ? "font-bold text-green-700" : "font-bold text-red-700"}>
                              {haySuficienteStock ? "✓ Stock OK" : "⚠ Insuficiente"}
                            </p>
                            <p className={haySuficienteStock ? "text-xs text-green-600" : "text-xs text-red-600"}>
                              {h.stock.toLocaleString()} {h.unidad}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-gray-700">${(h.precio / h.cantidadTotal).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">/{h.unidad}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xl font-bold text-gray-800">${h.precio.toLocaleString()}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resumen Financiero Final */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Inversión Total en Insumos</p>
              <p className="text-6xl font-bold mb-4">${rec.costoTotal.toLocaleString()}</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Fertilización</p>
                  <p className="text-lg font-bold">${rec.fertilizantes.reduce(function (s, f) { return s + f.precio; }, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Semillas</p>
                  <p className="text-lg font-bold">${rec.semillas.reduce(function (s, f) { return s + f.precio; }, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Herbicidas</p>
                  <p className="text-lg font-bold">${rec.herbicidas.reduce(function (s, h) { return s + h.precio; }, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-end border-l border-gray-700 pl-6">
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">Costo por Hectárea</p>
              <p className="text-5xl font-bold mb-2">${Math.round(costoHa).toLocaleString()}</p>
              <p className="text-gray-400 text-lg">/ha</p>
              <div className="mt-4 bg-amber-500 bg-opacity-20 border border-amber-500 rounded-lg px-4 py-2">
                <p className="text-xs text-amber-300 font-semibold">Superficie: {lote.superficie} ha</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notas Agronómicas */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-8 mb-8">
          <div className="flex items-start">
            <div className="bg-blue-600 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Consideraciones Técnicas</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <p><strong>Análisis de Suelo:</strong> Las recomendaciones están basadas en el análisis de suelo cargado (pH: {lote.analisisSuelo?.ph}, MO: {lote.analisisSuelo?.mo}%, P: {lote.analisisSuelo?.p} ppm, N: {lote.analisisSuelo?.n} kg/ha).</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <p><strong>Ajuste Climático:</strong> Se aplicó un ajuste del {((rec.ajusteENSO - 1) * 100).toFixed(0)}% por condición ENSO {lote.enso} en rendimiento objetivo y densidad de siembra.</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <p><strong>Disponibilidad de Stock:</strong> Verificar la disponibilidad real de productos marcados con "Insuficiente" antes de confirmar la compra.</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <p><strong>Precios:</strong> Los valores mostrados son estimativos y pueden variar según condiciones de mercado y disponibilidad al momento de la compra.</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <p><strong>Aplicación:</strong> Seguir las recomendaciones del fabricante y normativas vigentes para la aplicación segura de productos fitosanitarios.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer profesional */}
        <div className="text-center text-gray-500 text-xs border-t pt-6">
          <p className="mb-2">Reporte generado por <span className="font-bold text-green-600">ACRE Platform</span></p>
          <p>Este documento es una recomendación técnica y debe ser evaluada por un profesional agronómico</p>
          <p className="mt-2">Fecha de generación: {new Date().toLocaleDateString('es-AR', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DASHBOARD PRODUCTOR
// ============================================================================

const ProductorDashboard = function ({
  onLogout,
  user,
  lotes,
  setLotes,
  insumos,
  semillas,
  logs,
  setLogs,
}) {
  const [view, setView] = useState("dashboard");
  const [selectedLote, setSelectedLote] = useState(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGEEPanel, setShowGEEPanel] = useState(false);

  const handleCreateLote = function (newLote) {
    setLotes([].concat(lotes, [newLote]));
    setSelectedLote(newLote);
    setShowCreateModal(false);
    setShowGEEPanel(true);
    setLogs(
      addLog(
        logs,
        "Lote Creado",
        user.name,
        'Lote "' + newLote.nombre + '" - ' + newLote.superficie + " ha"
      )
    );
  };

  const handleSelectLote = function (lote) {
    setSelectedLote(lote);
    setShowGEEPanel(true);
  };

  const handleCompleteCargaDatos = function (datos) {
    const updatedLotes = lotes.map(function (l) {
      if (l.id === selectedLote.id) {
        return {
          id: l.id,
          nombre: l.nombre,
          campana: l.campana,
          superficie: l.superficie,
          estado: "Listo para planificar",
          color: l.color,
          analisisSuelo: datos.analisisSuelo,
          napas: datos.napas,
          malezas: datos.malezas,
          enso: l.enso,
          planificacion: l.planificacion,
        };
      }
      return l;
    });
    setLotes(updatedLotes);
    setLogs(
      addLog(
        logs,
        "Datos Cargados",
        user.name,
        'Datos completados para "' + selectedLote.nombre + '"'
      )
    );
    setView("dashboard");
  };

  const handleCompleteWizard = function (planData) {
    const lote = lotes.find(function (l) {
      return l.id === selectedLote.id;
    });
    const recomendacion = calcularRecomendacion(
      lote,
      planData.cultivo,
      planData.rendimientoObjetivo,
      insumos,
      semillas
    );

    const updatedLotes = lotes.map(function (l) {
      if (l.id === selectedLote.id) {
        return {
          id: l.id,
          nombre: l.nombre,
          campana: l.campana,
          superficie: l.superficie,
          estado: "Planificación generada",
          color: l.color,
          analisisSuelo: l.analisisSuelo,
          napas: l.napas,
          malezas: l.malezas,
          enso: l.enso,
          planificacion: {
            cultivo: planData.cultivo,
            fechaSiembra: planData.fechaSiembra,
            rendimientoObjetivo: planData.rendimientoObjetivo,
            recomendacion: recomendacion,
          },
        };
      }
      return l;
    });
    setLotes(updatedLotes);
    setLogs(
      addLog(
        logs,
        "Recomendación",
        user.name,
        'Planificación generada para "' + selectedLote.nombre + '"'
      )
    );
    setView("dashboard");
    setWizardStep(1);
  };

  // Routing
  if (view === "reporte" && selectedLote) {
    const loteActual = lotes.find(function (l) {
      return l.id === selectedLote.id;
    });
    return (
      <ReporteRecomendacion
        lote={loteActual}
        onBack={function () {
          setView("dashboard");
        }}
      />
    );
  }

  if (view === "wizard" && selectedLote) {
    return (
      <WizardPlanificacion
        lote={selectedLote}
        step={wizardStep}
        onStepChange={setWizardStep}
        onComplete={handleCompleteWizard}
        onCancel={function () {
          setView("dashboard");
          setWizardStep(1);
        }}
      />
    );
  }

  if (view === "carga-datos" && selectedLote) {
    return (
      <CargaDatos
        lote={selectedLote}
        onBack={function () {
          setView("dashboard");
        }}
        onComplete={handleCompleteCargaDatos}
      />
    );
  }

  const calcularEstadisticas = function () {
    const superficieTotal = lotes.reduce(function (sum, l) { return sum + l.superficie; }, 0);
    const lotesConPlan = lotes.filter(function (l) { return l.planificacion; });
    const costoTotal = lotesConPlan.reduce(function (sum, l) {
      return sum + (l.planificacion?.recomendacion?.costoTotal || 0);
    }, 0);
    const superficiePlanificada = lotesConPlan.reduce(function (sum, l) { return sum + l.superficie; }, 0);

    return {
      superficieTotal: superficieTotal,
      lotesConPlan: lotesConPlan.length,
      costoTotal: costoTotal,
      superficiePlanificada: superficiePlanificada,
      costoPorHa: superficiePlanificada > 0 ? costoTotal / superficiePlanificada : 0
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50">
      {/* Navbar mejorado */}
      <nav className="bg-gradient-to-r from-green-800 to-green-700 shadow-xl border-b-4 border-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <span className="text-2xl font-bold text-white">ACRE</span>
                  <p className="text-xs text-green-200">Agricultura de Precisión</p>
                </div>
              </div>
              <div className="ml-8 hidden lg:flex items-center space-x-1">
                <div className="px-3 py-2 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                  <p className="text-xs text-green-200">Campaña Activa</p>
                  <p className="text-sm font-semibold text-white">2025/26</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Alerta ENSO prominente */}
              <div className="hidden md:flex items-center bg-blue-900 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-400">
                <svg className="w-5 h-5 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>
                <div>
                  <p className="text-xs text-blue-200">Estado ENSO</p>
                  <p className="text-sm font-bold text-white">La Niña (-5%)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-green-200">Productor</p>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border border-white border-opacity-30"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header mejorado */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Control</h1>
              <p className="text-gray-600">Gestión integral de lotes y planificación agronómica</p>
            </div>
            <button
              onClick={function () {
                setShowCreateModal(true);
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              Nuevo Lote
            </button>
          </div>
        </div>

        {/* KPIs Agronómicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Superficie Total */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Superficie Total</p>
              <p className="text-4xl font-bold mb-1">{stats.superficieTotal.toFixed(1)}</p>
              <p className="text-green-200 text-sm">hectáreas</p>
            </div>
          </div>

          {/* Lotes Gestionados */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 0119.553-.724L15 7m0 13V7m0 0l6-3"/>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">Lotes Gestionados</p>
            <p className="text-4xl font-bold text-gray-800 mb-1">{lotes.length}</p>
            <p className="text-sm text-gray-500">{stats.lotesConPlan} con planificación</p>
          </div>

          {/* Inversión Planificada */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">Inversión Total</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">${(stats.costoTotal / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500">${Math.round(stats.costoPorHa)}/ha promedio</p>
          </div>

          {/* Estado de Avance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">Avance Campaña</p>
            <p className="text-4xl font-bold text-gray-800 mb-1">{lotes.length > 0 ? Math.round((stats.lotesConPlan / lotes.length) * 100) : 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full transition-all" style={{width: lotes.length > 0 ? ((stats.lotesConPlan / lotes.length) * 100) + '%' : '0%'}}></div>
            </div>
          </div>
        </div>

        {/* Listado de Lotes Mejorado */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border-t-4 border-green-600">
          <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
              <svg className="w-7 h-7 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 0119.553-.724L15 7m0 13V7m0 0l6-3"/>
              </svg>
              Lotes en Gestión
            </h2>
            <p className="text-gray-600 text-sm">Gestión y seguimiento de lotes productivos</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotes.map(function (lote) {
                const cultivo = lote.planificacion?.cultivo || '';
                const costoTotal = lote.planificacion?.recomendacion?.costoTotal || 0;
                const costoHa = lote.superficie > 0 ? costoTotal / lote.superficie : 0;

                return (
                  <div
                    key={lote.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-2xl hover:border-green-400 transition-all duration-300 bg-white relative overflow-hidden group"
                  >
                    {/* Indicador de color lateral */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2" style={{backgroundColor: lote.color}}></div>

                    <div className="flex justify-between items-start mb-4 pl-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-1">
                          {lote.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          {lote.campana}
                        </p>
                      </div>
                      <span
                        className={
                          "px-3 py-1.5 text-xs font-bold rounded-full border-2 " +
                          (lote.estado === "Planificación generada"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : lote.estado === "Listo para planificar"
                            ? "bg-blue-50 text-blue-700 border-blue-300"
                            : "bg-amber-50 text-amber-700 border-amber-300")
                        }
                      >
                        {lote.estado === "Planificación generada" ? "✓ Planificado" :
                         lote.estado === "Listo para planificar" ? "→ Listo" : "⚠ Incompleto"}
                      </span>
                    </div>

                    {/* Datos técnicos */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Superficie</p>
                          <p className="text-lg font-bold text-gray-800">{lote.superficie} <span className="text-sm text-gray-600">ha</span></p>
                        </div>
                        {cultivo && (
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Cultivo</p>
                            <p className="text-lg font-bold text-green-700 capitalize">{cultivo}</p>
                          </div>
                        )}
                      </div>

                      {costoTotal > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Inversión</p>
                          <div className="flex justify-between items-end">
                            <p className="text-lg font-bold text-amber-600">${(costoTotal/1000).toFixed(1)}K</p>
                            <p className="text-xs text-gray-600">${Math.round(costoHa)}/ha</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Indicadores de estado */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Análisis de Suelo
                        </span>
                        <span className={lote.analisisSuelo ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                          {lote.analisisSuelo ? "✓ Completo" : "✗ Pendiente"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                          </svg>
                          Condición ENSO
                        </span>
                        <span className="text-blue-700 font-bold">{lote.enso}</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <button
                        onClick={function () {
                          handleSelectLote(lote);
                        }}
                        className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center border border-gray-300"
                        title="Ver capas GEE"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 0119.553-.724L15 7m0 13V7m0 0l6-3"/>
                        </svg>
                      </button>

                      {lote.estado === "Datos incompletos" && (
                        <button
                          onClick={function () {
                            setSelectedLote(lote);
                            setView("carga-datos");
                          }}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                          Cargar Datos
                        </button>
                      )}
                      {lote.estado === "Listo para planificar" && (
                        <button
                          onClick={function () {
                            setSelectedLote(lote);
                            setView("wizard");
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                          Iniciar Planificación
                        </button>
                      )}
                      {lote.estado === "Planificación generada" && (
                        <button
                          onClick={function () {
                            setSelectedLote(lote);
                            setView("reporte");
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Ver Recomendación
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Mapa de Lotes</h2>
          <SimpleMap
            lotes={lotes}
            selectedLote={selectedLote}
            onSelectLote={handleSelectLote}
          />
        </div>
      </div>

      {showCreateModal && (
        <CreateLoteModal
          onClose={function () {
            setShowCreateModal(false);
          }}
          onCreate={handleCreateLote}
          existingLotes={lotes}
        />
      )}

      {showGEEPanel && selectedLote && (
        <GEELayersPanel
          lote={selectedLote}
          onClose={function () {
            setShowGEEPanel(false);
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// PANEL DE ADMINISTRACIÓN - NUEVO COMPONENTE
// ============================================================================

const AdminPanel = function ({
  onLogout,
  user,
  clientes,
  setClientes,
  insumos,
  setInsumos,
  semillas,
  setSemillas,
  logs,
}) {
  const [tab, setTab] = useState("clientes");
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // CRUD Clientes
  const handleAddCliente = function (cliente) {
    setClientes([].concat(clientes, [{ ...cliente, id: Date.now() }]));
    setShowAddModal(false);
  };

  const handleDeleteCliente = function (id) {
    if (window.confirm("¿Confirma eliminar este cliente?")) {
      setClientes(
        clientes.filter(function (c) {
          return c.id !== id;
        })
      );
    }
  };

  // CRUD Insumos
  const handleAddInsumo = function (insumo) {
    setInsumos([].concat(insumos, [{ ...insumo, id: Date.now() }]));
    setShowAddModal(false);
  };

  const handleDeleteInsumo = function (id) {
    if (window.confirm("¿Confirma eliminar este insumo?")) {
      setInsumos(
        insumos.filter(function (i) {
          return i.id !== id;
        })
      );
    }
  };

  // CRUD Semillas
  const handleAddSemilla = function (semilla) {
    setSemillas([].concat(semillas, [{ ...semilla, id: Date.now() }]));
    setShowAddModal(false);
  };

  const handleDeleteSemilla = function (id) {
    if (window.confirm("¿Confirma eliminar esta semilla?")) {
      setSemillas(
        semillas.filter(function (s) {
          return s.id !== id;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">
                ACRE Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button
              onClick={function () {
                setTab("clientes");
              }}
              className={
                "px-6 py-4 font-semibold " +
                (tab === "clientes"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600")
              }
            >
              Clientes
            </button>
            <button
              onClick={function () {
                setTab("insumos");
              }}
              className={
                "px-6 py-4 font-semibold " +
                (tab === "insumos"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600")
              }
            >
              Insumos
            </button>
            <button
              onClick={function () {
                setTab("semillas");
              }}
              className={
                "px-6 py-4 font-semibold " +
                (tab === "semillas"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600")
              }
            >
              Semillas
            </button>
            <button
              onClick={function () {
                setTab("logs");
              }}
              className={
                "px-6 py-4 font-semibold " +
                (tab === "logs"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600")
              }
            >
              Logs del Sistema
            </button>
          </div>

          <div className="p-6">
            {tab === "clientes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
                  <button
                    onClick={function () {
                      setShowAddModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    + Nuevo Cliente
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Razón Social
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          CUIT
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientes.map(function (c) {
                        return (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              {c.nombre} {c.apellido}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {c.razonSocial}
                            </td>
                            <td className="px-4 py-3 text-sm">{c.cuit}</td>
                            <td className="px-4 py-3 text-sm">{c.email}</td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={
                                  c.estado === "Activo"
                                    ? "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                                    : "px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                                }
                              >
                                {c.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={function () {
                                  handleDeleteCliente(c.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "insumos" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Catálogo de Insumos</h2>
                  <button
                    onClick={function () {
                      setShowAddModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    + Nuevo Insumo
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Composición
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {insumos.map(function (i) {
                        return (
                          <tr key={i.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">
                              {i.nombre}
                            </td>
                            <td className="px-4 py-3 text-sm">{i.tipo}</td>
                            <td className="px-4 py-3 text-sm">
                              {i.composicion}
                            </td>
                            <td className="px-4 py-3 text-sm">${i.precio}</td>
                            <td className="px-4 py-3 text-sm">
                              {i.stock} {i.unidad}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={function () {
                                  handleDeleteInsumo(i.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "semillas" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Catálogo de Semillas</h2>
                  <button
                    onClick={function () {
                      setShowAddModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    + Nueva Semilla
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Cultivo
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Variedad
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Ciclo
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Densidad Media
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {semillas.map(function (s) {
                        return (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">
                              {s.cultivo}
                            </td>
                            <td className="px-4 py-3 text-sm">{s.nombre}</td>
                            <td className="px-4 py-3 text-sm">{s.ciclo}</td>
                            <td className="px-4 py-3 text-sm">
                              {s.densidadMedia.toLocaleString()} pl/ha
                            </td>
                            <td className="px-4 py-3 text-sm">${s.precio}</td>
                            <td className="px-4 py-3 text-sm">
                              {s.stock} {s.unidad}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={function () {
                                  handleDeleteSemilla(s.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "logs" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Logs del Sistema
                </h2>
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay logs registrados aún
                    </p>
                  ) : (
                    logs.map(function (log) {
                      return (
                        <div
                          key={log.id}
                          className="p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={
                                    "px-2 py-1 text-xs rounded-full " +
                                    (log.tipo === "Error"
                                      ? "bg-red-100 text-red-800"
                                      : log.tipo === "Login"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800")
                                  }
                                >
                                  {log.tipo}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {log.usuario}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800">
                                {log.detalle}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {log.fecha}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              Funcionalidad en Desarrollo
            </h3>
            <p className="text-gray-600 mb-6">
              Los formularios de creación de {tab} estarán disponibles en la versión
              completa del MVP.
            </p>
            <button
              onClick={function () {
                setShowAddModal(false);
              }}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};