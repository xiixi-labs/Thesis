"use client";

import React from 'react';
import Link from 'next/link';
import { ThesisBackground } from '@/components/ThesisBackground';

export default function CookiesPage() {
    return (
        <ThesisBackground className="min-h-screen">
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>
            </div>

            <div className="pt-24 pb-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-950 mb-4 tracking-tight">Cookie Policy</h1>
                    <p className="text-lg text-zinc-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="prose prose-zinc max-w-none bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-3xl p-8 md:p-12 ring-1 ring-white/50">
                    <p>
                        This Cookie Policy explains how Thesis ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                    </p>

                    <h3>1. What are cookies?</h3>
                    <p>
                        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                    </p>

                    <h3>2. Why do we use cookies?</h3>
                    <p>We use cookies for several reasons:</p>
                    <ul>
                        <li><strong>Essential Cookies:</strong> These are strictly necessary to provide you with services available through our website (e.g., to log you in and keep you authenticated via our provider, Clerk).</li>
                        <li><strong>Performance & Analytics Cookies:</strong> These cookies collect information about how you use our website, such as which pages you visit and if you experience any errors. These cookies help us improve how the website functions.</li>
                        <li><strong>Functionality Cookies:</strong> These allow our site to remember choices you make (such as your user name or language) and provide enhanced, more personal features.</li>
                    </ul>

                    <h3>3. How can I control cookies?</h3>
                    <p>
                        You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted (specifically, you may not be able to log in).
                    </p>

                    <h3>4. Third-Party Cookies</h3>
                    <p>
                        In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
                    </p>

                    <h3>5. Updates to this Policy</h3>
                    <p>
                        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>If you have any questions about our use of cookies or other technologies, please email us at hello@usethesis.studio.</p>
                </div>
            </div>
        </ThesisBackground>
    );
}
