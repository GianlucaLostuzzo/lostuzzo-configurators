"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import iconCdr from "../app/icon.png";
import Image from "next/image";

interface MenuEntry {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MenuProps {
  entries: MenuEntry[];
  children: React.ReactNode;
}

export default function Menu({ entries, children }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-full bg-black text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="px-4 py-4 flex justify-between items-center">
          <span className="text-lg font-bold">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white-600 hover:text-red"
          >
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-4 space-y-4 mt-4">
          {entries.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 rounded-md flex flex-row gap-5 items-center text-base font-medium transition-all duration-200 ${
                pathname === entry.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-red-700 hover:text-white"
              }`}
            >
              <span className="text-xl">{entry.icon && entry.icon}</span>
              {entry.label}
            </Link>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex-1">
        <div className="bg-primary text-white h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-xl font-bold flex flex-row gap-5">
            <Image src={iconCdr} alt="Icon" width={40} height={40} />
          </span>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
