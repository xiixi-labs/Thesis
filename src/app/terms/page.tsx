"use client";

import React from 'react';
import Link from 'next/link';
import { ThesisBackground } from '@/components/ThesisBackground';

export default function TermsPage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-950 mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-lg text-zinc-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="prose prose-zinc max-w-none bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-3xl p-8 md:p-12 ring-1 ring-white/50">
                    <p>
                        Please read these Terms of Service ("Terms") carefully before using the Thesis website and services operated by XII.XI Labs ("us", "we", or "our").
                    </p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                    </p>

                    <h3>2. Description of Service</h3>
                    <p>
                        Thesis is an AI-powered research assistant that allows users to upload documents and receive cited answers generated via Retrieval-Augmented Generation (RAG). You acknowledge that AI-generated content may occasionally contain errors or inaccuracies, and should be verified by referencing the provided citations.
                    </p>

                    <h3>3. User Accounts</h3>
                    <p>
                        When you create an account with us, you must provide information that is accurate and complete. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                    </p>

                    <h3>4. Intellectual Property</h3>
                    <ul>
                        <li><strong>Your Content:</strong> You retain all rights to the documents and data you upload to Thesis. We claim no ownership over your data.</li>
                        <li><strong>Our Service:</strong> The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of XII.XI Labs and its licensors.</li>
                    </ul>

                    <h3>5. Acceptable Use</h3>
                    <p>You agree not to use the Service:</p>
                    <ul>
                        <li>To upload any illegal, harmful, or unauthorized content.</li>
                        <li>To attempt to reverse engineer or disrupt the Service's infrastructure.</li>
                        <li>To violate any applicable laws or regulations.</li>
                    </ul>

                    <h3>6. Limitation of Liability</h3>
                    <p>
                        In no event shall XII.XI Labs, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h3>7. Changes</h3>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                    </p>

                    <h3>8. Contact Us</h3>
                    <p>If you have any questions about these Terms, please contact us at hello@usethesis.studio.</p>
                </div>
            </div>
        </ThesisBackground>
    );
}
