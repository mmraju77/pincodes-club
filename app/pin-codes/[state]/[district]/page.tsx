import { Metadata } from 'next';
import DistrictClient from './DistrictClient';

export async function generateMetadata(props: { params: Promise<{ state: string; district: string }> }): Promise<Metadata> {
  const resolvedParams = await props.params;
  const stateName = resolvedParams?.state ? decodeURIComponent(resolvedParams.state).toUpperCase() : '';
  const districtName = resolvedParams?.district ? decodeURIComponent(resolvedParams.district).toUpperCase() : 'DISTRICT';

  return {
    title: `${districtName} PIN Codes - Post Offices in ${stateName}`,
    description: `List of all PIN codes and post offices in ${districtName} district, ${stateName}. Search and find accurate postal data.`,
    keywords: `${districtName} pin codes, ${districtName} post office list, ${stateName} pincode directory`,
  };
}

export default function DistrictPage() {
  return <DistrictClient />;
}