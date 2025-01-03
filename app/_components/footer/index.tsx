import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 CaterEase. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact Us
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            <GitHubLogoIcon />
          </Link>
          <div></div>
        </nav>
      </footer>
  )
}

export default Footer
