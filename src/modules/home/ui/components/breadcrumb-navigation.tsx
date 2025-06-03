import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
  activeCategory?: string | null;
  activeCategoryName?: string | null;
  activeSubcategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
  activeCategory,
  activeCategoryName,
  activeSubcategoryName,
}: Props) => {
  if (!activeCategoryName || activeCategory === "all") return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeSubcategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-sm font-medium underline text-primary"
              >
                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary font-medium text-sm">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-sm font-medium">
                {activeSubcategoryName}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink className="text-sm font-medium">
              {activeCategoryName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
