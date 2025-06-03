interface Props {
  params: Promise<{
    category: string;
  }>;
}

async function page({ params }: Props) {
  const { category } = await params;

  return <div>Category page: {category}</div>;
}

export default page;
