"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function joinWaitlist(formData: FormData) {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    try {
        const { error } = await supabaseAdmin
            .from("waitlist")
            .insert({
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
            });

        if (error) {
            if (error.code === "23505") { // Unique violation
                return { error: "You are already on the waitlist!" };
            }
            throw error;
        }

        revalidatePath("/waitlist");
        return { success: true };
    } catch (e: any) {
        console.error("Waitlist Error:", e);
        return { error: "Failed to join waitlist. Please try again." };
    }
}
