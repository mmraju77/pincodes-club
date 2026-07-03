import { Metadata } from 'next';

export async function generateMetadata(props: any): Promise<Metadata> {
  const resolvedParams = await props.params;
  const stateName = resolvedParams?.state ? decodeURIComponent(resolvedParams.state).toUpperCase() : 'INDIA';

  return {
    title: `PIN Codes in ${stateName} - Districts & Post Offices Directory`,
    description: `Browse all districts, post offices, and PIN codes in ${stateName}. Find accurate postal information instantly.`,
    keywords: `${stateName} pin codes, ${stateName} post offices, districts in ${stateName} postal codes`,
  };
}

export default function StateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}