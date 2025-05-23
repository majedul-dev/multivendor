import { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/app/trpc/routers/_app';

export type CategoriesGetManyOutput = inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type CategoriesGetSingleOutput = CategoriesGetManyOutput[0]