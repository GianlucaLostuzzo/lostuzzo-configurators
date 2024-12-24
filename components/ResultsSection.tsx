import { enqueueSnackbar } from "notistack";
import { AiFillProduct } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";

export interface ResultsSectionProps {
  results?: string[] | null;
  loading?: boolean;
}

export default function ResultsSection(props: ResultsSectionProps) {
  const { loading = false, results } = props;

  if (!results) {
    return <></>;
  }

  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => enqueueSnackbar("Codice copiato negli appunti"));
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">
        Risultati
      </h2>
      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((code, i) => (
            <div
              key={`result_${code}_${i}`}
              className="bg-white shadow-lg rounded-lg p-4 flex items-center transition-transform transform border"
            >
              <span className="text-3xl font-bold flex-grow-0">
                <AiFillProduct />
              </span>
              <span className="text-lg font-medium text-gray-800 flex-grow text-center">
                {code}
              </span>
              <button
                onClick={() => handleCopy(code)}
                className="ml-4 text-gray-500 hover:text-primary focus:outline-none"
                aria-label={`Copy code ${code}`}
              >
                <BiCopy size={24} />
              </button>
            </div>
          ))}
        </div>
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
