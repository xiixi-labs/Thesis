"use client";

import React from 'react';
import Link from 'next/link';
import { ThesisBackground } from '@/components/ThesisBackground';

export default function PrivacyPage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-950 mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-lg text-zinc-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="prose prose-zinc max-w-none bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-3xl p-8 md:p-12 ring-1 ring-white/50">
                    <p>
                        At Thesis ("we", "us", or "our"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website and use our AI research assistant services (the "Service").
                    </p>

                    <h3>1. Information We Collect</h3>
                    <p>We collect information that you provide directly to us, including:</p>
                    <ul>
                        <li><strong>Account Information:</strong> When you register (via our authentication provider, Clerk), we collect your email address and name.</li>
                        <li><strong>User Content:</strong> The documents you upload and the queries you submit to our RAG (Retrieval-Augmented Generation) system.</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our Service, including access times and pages viewed.</li>
                    </ul>

                    <h3>2. How We Use Your Information</h3>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our Service.</li>
                        <li>Process your queries and generate cited answers using your uploaded documents.</li>
                        <li>Communicate with you about updates, security alerts, and support messages.</li>
                        <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
                    </ul>

                    <h3>3. Data Security & Storage</h3>
                    <p>
                        We implement industry-standard security measures to protect your data.
                    </p>
                    <ul>
                        <li><strong>Infrastructure:</strong> Our services are hosted on Vercel and Supabase, which maintain high security standards (including SOC2 compliance).</li>
                        <li><strong>Encryption:</strong> Data is encrypted in transit (TLS/SSL) and at rest in our databases.</li>
                        <li><strong>AI Processing:</strong> Your data is processed securely by our LLM partners solely for the purpose of generating answers to your specific queries. We do not use your private data to train public models.</li>
                    </ul>

                    <h3>4. Sharing of Information</h3>
                    <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                    <ul>
                        <li><strong>Service Providers:</strong> With third-party vendors (like Clerk for auth, Supabase for database, Vercel for hosting) who need access to such information to carry out work on our behalf.</li>
                        <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
                    </ul>

                    <h3>5. Your Rights</h3>
                    <p>Depending on your location, you may have rights to access, correct, or delete your personal data. You can manage your account settings directly within the application or contact us to exercise these rights.</p>

                    <h3>6. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us at hello@usethesis.studio.</p>
                </div>
            </div>
        </ThesisBackground>
    );
}
