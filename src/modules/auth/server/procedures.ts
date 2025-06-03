import z from "zod";
import { headers as getHeaders } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),

  register: baseProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(63, "Username must be less than 63 characters")
        .regex(
          /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
          "Username can only contain lowercase letters, numbers and hypens. It must start and end with a latter or number"
        )
        .refine((val) => !val.includes("--"), "Username cannot contain hypens"),
    }))
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      })


      const existingUser = existingData.docs[0];
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This username already exist"
        })
      }
      
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
        },
      });

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token
      })

      return data;
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token
      })

      return data;
    }),
});
