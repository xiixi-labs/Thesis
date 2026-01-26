import { NextResponse } from "next/server";

type WaitlistBody = {
	name?: unknown;
	email?: unknown;
	persona?: unknown;
};

type Persona = "team" | "student" | "individual";

function normalizePersona(value: unknown): Persona | null {
	if (typeof value !== "string") return null;
	const v = value.trim().toLowerCase();
	if (v === "team" || v === "student" || v === "individual") return v;
	return null;
}

function isValidEmail(email: string) {
	// Minimal validation; final validation should happen via confirmation email later.
	return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export async function POST(req: Request) {
	let body: WaitlistBody = {};
	try {
		body = (await req.json()) as WaitlistBody;
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const rawName = typeof body.name === "string" ? body.name : "";
	const rawEmail = typeof body.email === "string" ? body.email : "";
	const persona = normalizePersona(body.persona);

	const name = rawName.trim();
	const email = rawEmail.trim().toLowerCase();

	if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
	if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
	if (!isValidEmail(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

	const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		return NextResponse.json(
			{
				error:
					"Server is missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (recommended).",
			},
			{ status: 500 },
		);
	}

	const insertUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist_signups`;
	const payload: Record<string, unknown> = { name, email };
	if (persona) payload.persona = persona;

	const doInsert = async (p: Record<string, unknown>) =>
		fetch(insertUrl, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				accept: "application/json",
				apikey: supabaseKey,
				authorization: `Bearer ${supabaseKey}`,
				prefer: "return=minimal",
			},
			body: JSON.stringify(p),
		});

	let resp = await doInsert(payload);

	// If email is unique, a second signup may 409; treat as success to keep UX clean.
	if (resp.status === 409) {
		return NextResponse.json({ ok: true, already: true });
	}

	// Backwards-compatible fallback if the DB schema doesn't yet have the `persona` column.
	if (!resp.ok && persona) {
		let message = "";
		try {
			const text = await resp.text();
			message = text;
			try {
				const parsed = JSON.parse(text) as { message?: string };
				message = parsed?.message || text;
			} catch {
				// ignore
			}
		} catch {
			// ignore
		}

		const msg = message.toLowerCase();
		if (msg.includes("persona") && (msg.includes("column") || msg.includes("schema cache"))) {
			resp = await doInsert({ name, email });
			if (resp.status === 409) {
				return NextResponse.json({ ok: true, already: true });
			}
		}
	}

	if (!resp.ok) {
		let details = "";
		try {
			const data = (await resp.json()) as { message?: string };
			details = data?.message ? ` (${data.message})` : "";
		} catch {
			// ignore
		}
		return NextResponse.json(
			{ error: `Failed to save signup.${details}` },
			{ status: 500 },
		);
	}

	return NextResponse.json({ ok: true });
}
