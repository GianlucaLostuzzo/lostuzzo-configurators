import { enqueueSnackbar } from "notistack";
import { BiCopy } from "react-icons/bi";
import { useState } from "react";
import ImageWithFallback from "./image-with-fallback";
import { ApiProductResult } from "@/lib/types";

const PAGE_SIZE = 9;
const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;
const DEFAULT_FIXING_IMAGE = "https://s3.eu-central-1.amazonaws.com/static.configuratori.cdrtorino.com/ep_professional_bars/fixing.jpg";

export interface ResultsSectionProps {
  results?: ApiProductResult | null;
  loading?: boolean;
}

export default function ResultsSpecial(props: ResultsSectionProps) {
  const { loading = false, results } = props;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (!results) {
    return <></>;
  }

  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => enqueueSnackbar("Codice copiato negli appunti"));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const getFixingTypeName = (type: number): string => {
    return `Posizione fissaggio: ${type}`;
  };

  // 1. Products for current page
  const visibleProducts = results.data.slice(0, visibleCount);

  // 2. Unique fixing types (once, not per product)
  const allFixTypes = results.data[0]?.fixTypes || [];
  const uniqueFixTypes = Array.from(
    new Map(
        allFixTypes.map(fix => [`${fix.code}_${fix.type}`, fix])
    ).values()
    );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">
        Risultati
      </h2>
      {results.data.length > 0 ? (
        <>
          {/* Product Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((product, i) => (
              <div
                key={`product_${product.product_code}_${i}`}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform border hover:scale-105"
              >
                <div className="w-full h-48 relative flex">
                  <ImageWithFallback
                    brand={product.brand}
                    href={product.image ? `${STATIC_URL}/${product.image}` : null}
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
                </div>
              </div>
            ))}
            {uniqueFixTypes.map((fixing, idx) => (
                  <div
                    key={`fixing_${fixing.code}_${idx}`}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg rounded-lg overflow-hidden transition-transform transform border-2 border-orange-300 hover:scale-105"
                  >
                    <div className="w-full h-48 relative flex bg-orange-100">
                      <ImageWithFallback
                        href={DEFAULT_FIXING_IMAGE}
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
                        {getFixingTypeName(fixing.type)}
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
          {/* Load More Button */}
          {visibleCount < results.data.length && (
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