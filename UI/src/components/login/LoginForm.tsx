"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "@/styles/globals.css";

// ──────────────────────────────────────────────────────────────────────────────
/** Schemas */
// ──────────────────────────────────────────────────────────────────────────────
const accountFormSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

type SupabaseAuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at?: number;
  user?: {
    id?: string;
    email?: string;
  };
  error?: string;
  error_description?: string;
};

async function signInWithPassword(email: string, password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase configuration.");
  }

  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const payload = (await response.json()) as SupabaseAuthResponse;

  if (!response.ok) {
    const message =
      payload?.error_description ||
      payload?.error ||
      "Invalid email or password.";
    throw new Error(message);
  }

  return payload;
}

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
export function LoginForm() {
  const router = useRouter();

  // Shared UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forms
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  // ────────────────────────────────────────────────────────────────────────────
  // LOGIN: credentials → /login
  // ────────────────────────────────────────────────────────────────────────────
  async function onSubmitLogin(data: AccountFormValues) {
    setLoading(true);
    setError(null);

    try {
      const email = data.email.trim();
      const password = data.password;
      const payload = await signInWithPassword(email, password);

      const expiresAtMs = payload?.expires_at ? payload.expires_at * 1000 : null;
      const expires = expiresAtMs ? new Date(expiresAtMs) : 1 / 24;

      Cookies.set("access_token", payload.access_token, { expires, secure: false });
      Cookies.set("refresh_token", payload.refresh_token, { expires, secure: false });
      Cookies.set("token_type", payload.token_type, { expires, secure: false });
      Cookies.set("expires_at", String(payload.expires_at ?? ""), { expires, secure: false });
      Cookies.set("user_id", payload?.user?.id ?? "", { expires, secure: false });
      Cookies.set("user_email", payload?.user?.email ?? email, { expires, secure: false });
      await new Promise((r) => setTimeout(r, 150));
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(
        err?.message || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ERROR BANNER */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <Form key="login-step" {...form}>
        <form onSubmit={form.handleSubmit(onSubmitLogin)} className="space-y-2" autoComplete="off">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email</FormLabel>
                <FormControl>
                  <Input
                    className="py-5 text-black border-gray-200 bg-white"
                    autoComplete="email"
                    disabled={loading}
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Password</FormLabel>
                <FormControl>
                  <Input
                    className="py-5 text-black border-gray-200"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={loading}
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                id="show-password"
                checked={showPassword}
                disabled={loading}
                onCheckedChange={(checked) => setShowPassword(checked === true)}
              />
              <label
                htmlFor="show-password"
                className="text-xs text-[#A1A1A1] font-normal hover:cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                onClick={() => setShowPassword(!showPassword)}
              >
                Show Password
              </label>
            </div>

            <div className="text-xs text-black font-medium hover:cursor-pointer">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="underline">
                      Forgot Password?
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Under Development</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Button
            className="w-full hover:bg-[#2F2F31] bg-black py-6 dark:text-[#FFFFFF] rounded-xl text-base font-semibold"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
