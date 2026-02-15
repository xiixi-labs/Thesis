"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";

type UserDropdownProps = {
    userName: string;
    userRole: string;
    imageUrl?: string;
};

export function UserDropdown({ userName, userRole, imageUrl }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200 group"
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={userName}
                        className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-white"
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-zinc-900 truncate">{userName}</div>
                    <div className="text-xs text-zinc-500 truncate">{userRole}</div>
                </div>
                <ChevronIcon className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2">
                        <SignOutButton>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <LogOutIcon className="h-4 w-4" />
                                <span>Sign Out</span>
                            </button>
                        </SignOutButton>
                    </div>
                </div>
            )}
        </div>
    );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
    );
}
