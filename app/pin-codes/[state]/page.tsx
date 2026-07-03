import { Metadata } from 'next';
import StateClient from './StateClient';

export async function generateMetadata(props: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const resolvedParams = await props.params;
  const stateName = resolvedParams?.state ? decodeURIComponent(resolvedParams.state).toUpperCase() : 'INDIA';

  return {
    title: `PIN Codes in ${stateName} - Districts & Post Offices Directory`,
    description: `Browse all districts, post offices, and PIN codes in ${stateName}. Find accurate postal information instantly.`,
    keywords: `${stateName} pin codes, ${stateName} post offices, districts in ${stateName} postal codes`,
  };
}

export default function StatePage() {
  return <StateClient />;
}