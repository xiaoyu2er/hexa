import Link from 'next/link';

export const TermsPrivacy = () => {
  return (
    <p className="px-8 text-center text-muted-foreground text-sm">
      By clicking continue, you agree to our
      <Link
        className="underline underline-offset-4 hover:text-primary"
        href="/terms"
      >
        Terms of Service
      </Link>
    </p>
  );
};
