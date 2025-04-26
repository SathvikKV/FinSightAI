import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-4 md:py-6 backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-0 text-center sm:text-left">
          © {new Date().getFullYear()} FinSight AI. All rights reserved.
        </div>
        <div className="flex gap-4 sm:gap-6 text-center">
          <Link href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
            Terms
          </Link>
          <Link href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
