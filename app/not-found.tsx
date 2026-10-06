import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-32 text-center">
      <h1 className="font-display text-4xl font-bold">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-muted">The link may be old. Go back to the project list to find what you were looking for.</p>
      <Link href="/#work" className="btn-primary mt-8">See all projects</Link>
    </div>
  );
}
