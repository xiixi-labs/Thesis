"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function joinNewsletter(formData: FormData) {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    if (!firstName || !lastName) {
        return { error: "First and last name are required" };
    }

    try {
        const { error } = await supabaseAdmin
            .from("newsletter")
            .insert({
                email,
                first_name: firstName,
                last_name: lastName,
            });

        if (error) {
            if (error.code === "23505") { // Unique violation
                return { error: "You're already subscribed!" };
            }
            throw error;
        }

        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        console.error("Newsletter Error:", e);
        return { error: "Failed to subscribe. Please try again." };
    }
}
