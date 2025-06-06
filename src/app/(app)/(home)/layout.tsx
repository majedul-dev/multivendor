import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Navbar } from '@/modules/home/ui/components/navbar';
import { Footer } from '@/modules/home/ui/components/footer';
import { SearchFilter, SearchFilterSkleton } from '@/modules/home/ui/components/search-filters';

interface props {
    children: React.ReactNode;
}

const layout = async ({ children }: props) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions()
  )
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFilterSkleton />}>
          <SearchFilter />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F0]">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default layout