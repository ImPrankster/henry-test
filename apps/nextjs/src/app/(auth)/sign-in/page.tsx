"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@henry/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@henry/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@henry/ui/form";
import { Input } from "@henry/ui/input";
import { SignInFormSchema } from "@henry/validators";

import { supabase } from "~/lib/supabaseBrowserClient";

async function signInWithOtp({ email }: { email: string }) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: "http://localhost:3000/",
    },
  });

  if (error) throw error;
  return data;
}

function LoginForm() {
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
  });

  const signInMutation = useMutation({
    mutationFn: signInWithOtp,
    onSuccess: () => {
      toast("Check your email for the OTP");
    },
    onError: (error) => {
      toast("Sign in failed", {
        description: error.message,
      });
    },
  });

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((value) => {
            signInMutation.mutate(value);
          })}
          className="space-y-8"
        >
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="henry@henry.social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {signInMutation.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <main className="flex flex-1 flex-col place-content-center place-items-center p-2">
      <LoginForm />
    </main>
  );
}
