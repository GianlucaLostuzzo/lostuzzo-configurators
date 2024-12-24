import { menuEntries } from "@/data/menu";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Configuratori</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {menuEntries
          .filter((x) => x.href !== "/")
          .map((entry) => (
            <Link key={entry.href} href={entry.href} className="group">
              <div className="p-6 rounded-lg shadow-md bg-white hover:bg-gray-100 transition duration-200 ease-in-out flex flex-col items-center text-center">
                <div className="text-4xl mb-4 text-gray-700 group-hover:text-blue-500">
                  {entry.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                  {entry.label}
                </h2>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
