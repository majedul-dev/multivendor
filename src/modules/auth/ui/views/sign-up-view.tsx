"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const schema = z.object({
      email: z.string().email(),
      password: z.string(),
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(63, "Username must be less than 63 characters")
        .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Username can only contain lowercase letters, numbers and hypens. It must start and end with a latter or number")
        .refine((val) => !val.includes("--"), "Username cannot contain hypens")
  })

  type FormSchema = z.infer<typeof schema>

export function SignUpView() {
  const router = useRouter()
  const trpc = useTRPC();
  const register = useMutation(trpc.auth.register.mutationOptions({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      router.push("/")
    }
  }))

  const form = useForm<FormSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    register.mutate({
      ...values,
      username: values.username.toLowerCase()
    })
    
  };

  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;

  const showPreview = username && !usernameErrors;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span
                  className={cn("text-2xl font-semibold", poppins.className)}
                >
                  proSHOP
                </span>
              </Link>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-base border-none underline"
              >
                <Link prefetch href="/sign-in">
                  Login
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">
              Join over 1,500 creators earning money on proSHOP
            </h1>
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your store will be available at &nbsp;
                    <strong>{username}</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={register.isPending}
              type="submit"
              size="lg"
              variant="elevated"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              Create account
            </Button>
          </form>
        </Form>
      </div>
      <div className="h-screen w-full lg:col-span-2 hidden lg:block">
        Background column
      </div>
    </div>
  );
}
