import { redirect } from 'next/navigation';

export default function CodeFolderRedirect() {
  // Prevents Next.js from treating "code" as a state name
  // Redirects directly to the main RTO directory
  redirect('/rto-codes');
}