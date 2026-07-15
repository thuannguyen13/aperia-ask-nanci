import Link from "next/link"
import { Button } from "aperia-ds5"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-4 py-12 text-center">
      <div className="flex max-w-[420px] flex-col gap-2">
        <p className="text-4xl font-semibold tracking-tight text-foreground">404</p>
        <p className="text-xl font-medium text-foreground">Page not found</p>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back to Ask Nanci</Link>
      </Button>
    </div>
  )
}
