import configPromise from "@payload-config"
import { Category } from "@/payload-types";
import { getPayload } from "payload"
import { Navbar } from './navbar';
import { Footer } from './footer';
import { SearchFilter } from './search-filters';
import { CustomCategory } from "./types";

interface props {
    children: React.ReactNode;
}

const layout = async ({ children }: props) => {
  const payload = await getPayload({
    config: configPromise
  })

  const data = await payload.find({
    collection: "categories",
    pagination: false,
    depth: 1,
    where: {
      parent: {
        exists: false
      }
    },
    sort: "name"
  })

  const formatedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map(doc => ({
      ...(doc as Category),
      subcategories: undefined
    }))
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilter data={formatedData} />
      <div className="flex-1 bg-[#F4F4F0]">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default layout