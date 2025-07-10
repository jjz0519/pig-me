// This page now automatically redirects to the login page.
import {redirect} from 'next/navigation'

export default function HomePage() {
  redirect('/login')
}