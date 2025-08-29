export interface ActionDefaultsProps {
  loading?: boolean;
  disabled?: boolean;
  onReset?: () => void;
}

export default function ActionsButtons(props: ActionDefaultsProps) {
  const { loading = false, onReset, disabled = false } = props;

  return (
    <div className="flex justify-center space-x-6">
      <button
        type="submit"
        disabled={disabled}
        className={`px-8 py-3  text-white font-medium rounded-lg shadow-md ${
          !disabled
            ? "bg-blue-600 hover:bg-blue-700 focus:bg-blue-800"
            : "bg-blue-600"
        } focus:outline-none focus:ring-2`}
      >
        {loading ? "Ricerca..." : "Cerca"}
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-3 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Reset
        </button>
      )}
    </div>
  );
}
