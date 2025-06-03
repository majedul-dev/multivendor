interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

async function page({ params }: Props) {
  const { category, subcategory } = await params;
  return (
    <div>
      <div>Category page: {category}</div>
      <div>Subcategory page: {subcategory}</div>
    </div>
  );
}

export default page;
