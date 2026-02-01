import { joinNewsletter } from "@/app/actions/newsletter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const result = await joinNewsletter(formData);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
