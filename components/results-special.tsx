import { enqueueSnackbar } from "notistack";
import { BiCopy } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { useState, useEffect } from "react";
import ImageWithFallback from "./image-with-fallback";
import { ApiProductResult } from "@/lib/types";
import { usePathname } from "next/navigation";

const PAGE_SIZE = 9;
const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;
const DEFAULT_FIXING_IMAGE =
  "https://s3.eu-central-1.amazonaws.com/static.configuratori.cdrtorino.com/ep_professional_bars/fixing.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Mappa produttore → tipo fissaggio → descrizione e immagine specifica.
// La chiave produttore va in MAIUSCOLO (il confronto viene normalizzato).
// imageUrl è opzionale: se assente si usa il fallback per tipo o quello globale.
// ─────────────────────────────────────────────────────────────────────────────
type FixingDescriptor = {
  description: string;
  imageUrl?: string;
};

const FIXING_DESCRIPTIONS: Record<string, Record<number, FixingDescriptor>> = {
  FABBRI: {
    1: { description: "Kit fissaggio per configurazione a 2 barre" },
    2: { description: "Kit fissaggio per configurazione a 3 barre" },
    3: {
      description: "Kit fissaggio per configurazione a 4 barre (prenderne 2)",
    },
    4: { description: "Kit fissaggio per 5 barre A" },
    5: { description: "Kit fissaggio per 5 barre B" },
  },
};

// Fallback per tipo (senza produttore specifico)
const FIXING_IMAGE_BY_TYPE: Record<number, string> = {
  // 1: "https://s3.eu-central-1.amazonaws.com/.../fixing_type1.jpg",
  // 2: "https://s3.eu-central-1.amazonaws.com/.../fixing_type2.jpg",
};

const DEFAULT_FIXING_DESCRIPTIONS: Record<number, string> = {
  1: "Posizione fissaggio: 1",
  2: "Posizione fissaggio: 2",
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const getFixingDescription = (type: number, manufacturer?: string): string => {
  if (manufacturer) {
    const desc =
      FIXING_DESCRIPTIONS[manufacturer.toUpperCase()]?.[type]?.description;
    if (desc) return desc;
  }
  return DEFAULT_FIXING_DESCRIPTIONS[type] ?? `Posizione fissaggio: ${type}`;
};

const getFixingImage = (type: number, manufacturer?: string): string => {
  if (manufacturer == "FABBRI") {
    const imageUrl =
      process.env.NEXT_PUBLIC_STATIC_URL +
      "/ep_professional_bars/fix_fabbri.jpg";
    if (imageUrl) return imageUrl;
  }
  return FIXING_IMAGE_BY_TYPE[type] ?? DEFAULT_FIXING_IMAGE;
};

const getDatasheetUrl = (productCode: string): string => {
  const baseUrl = "/api/roof-bars/get-datasheet";
  const params = new URLSearchParams({ product: productCode });
  return `${baseUrl}?${params.toString()}`;
};
// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export interface ResultsSectionProps {
  results?: ApiProductResult | null;
  loading?: boolean;
  manufacturer?: string;
}

export default function ResultsSpecial(props: ResultsSectionProps) {
  const { loading = false, results, manufacturer } = props;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const pathname = usePathname();
  const showDatasheet = pathname === "/professional-bars"; // o qualunque sia il path

  console.log("ResultsSpecial manufacturer prop:", manufacturer);
  console.log("ResultsSpecial results sample:", results?.data?.[0]);
  // Reset paginazione quando cambia il filtro manufacturer
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [manufacturer]);

  if (!results) return <></>;

  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => enqueueSnackbar("Codice copiato negli appunti"));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // Filtra i prodotti per produttore se selezionato
  const filteredProducts =
    manufacturer && manufacturer !== "all"
      ? results.data.filter((p) => p.manufacturer === manufacturer)
      : results.data;

  // Fix types estratti solo dai prodotti filtrati
  const sourceProducts =
    filteredProducts.length > 0 ? filteredProducts : results.data;
  const allFixTypes = sourceProducts.flatMap((p) => p.fixTypes || []);
  const uniqueFixTypes = Array.from(
    new Map(allFixTypes.map((fix) => [`${fix.code}_${fix.type}`, fix])).values()
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">
        Risultati
      </h2>
      {results.data.length > 0 ? (
        <>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Prodotti */}
            {visibleProducts.map((product, i) => (
              <div
                key={`product_${product.product_code}_${i}`}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform border hover:scale-105"
              >
                <div className="w-full h-48 relative flex">
                  <ImageWithFallback
                    brand={product.brand}
                    href={
                      product.image ? `${STATIC_URL}/${product.image}` : null
                    }
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="block text-lg font-medium text-gray-800 mb-2 text-blue-600">
                    {product.manufacturer}
                  </span>
                  <span className="block text-lg font-medium text-gray-800 mb-2">
                    {product.product_code}
                  </span>
                  <span className="block text-sm font-light text-gray-500 mb-2 min-h-10">
                    {product.description}
                  </span>
                  <button
                    onClick={() => handleCopy(product.product_code)}
                    className="text-gray-500 hover:text-primary focus:outline-none flex items-center justify-center gap-2 border px-4 py-2 rounded-md w-full"
                    aria-label={`Copy code ${product.product_code}`}
                  >
                    <BiCopy size={20} />
                    Copia codice
                  </button>
                  {showDatasheet && (
                    <a 
                      className = "mt-2 text-gray-500 hover:text-primary focus:outline-none flex items-center justify-center gap-2 border px-4 py-2 rounded-md w-full"
                      href={getDatasheetUrl(product.product_code)} target="_blank" rel="noopener noreferrer">
                      <CiSettings size={22} />
                      Scheda tecnica
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Kit fissaggio */}
            {uniqueFixTypes.map((fixing, idx) => (
              <div
                key={`fixing_${fixing.code}_${idx}`}
                className="bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg rounded-lg overflow-hidden transition-transform transform border-2 border-orange-300 hover:scale-105"
              >
                <div className="w-full h-48 relative flex bg-orange-100">
                  <ImageWithFallback
                    href={getFixingImage(fixing.type, manufacturer)}
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="block text-xs font-semibold text-orange-700 mb-1 uppercase">
                    Kit Fissaggio
                  </span>
                  <span className="block text-lg font-medium text-gray-800 mb-2">
                    {fixing.code}
                  </span>
                  <span className="block text-sm font-light text-gray-600 mb-2 min-h-10">
                    {getFixingDescription(fixing.type, manufacturer)}
                  </span>
                  <button
                    onClick={() => handleCopy(fixing.code)}
                    className="text-gray-500 hover:text-primary focus:outline-none flex items-center justify-center gap-2 border px-4 py-2 rounded-md w-full bg-white"
                    aria-label={`Copy code ${fixing.code}`}
                  >
                    <BiCopy size={20} />
                    Copia codice
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none"
              >
                Carica di più
              </button>
            </div>
          )}
        </>
      ) : !loading ? (
        <p className="mt-4 text-gray-500 text-center text-lg">
          Nessun risultato trovato
        </p>
      ) : (
        <div className="flex justify-center mt-4">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
