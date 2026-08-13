// RETRO Qatar — Root Page
// Redirects to the default locale

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}
