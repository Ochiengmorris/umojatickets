import Link from "next/link";

const Footer = () => {
  return (
    <div className="border-t bg-background">
      <div className="flex max-w-7xl m-auto flex-row items-center gap-4 mt-2 px-2">
        <div className="flex items-center justify-between w-auto lg:w-auto ">
          <Link href="/" className="shrink-0">
            <h1 className="text-xl " style={{ fontWeight: 1000 }}>
              <span className=" text-jmprimary">Umoja</span>
              <span>Tickets</span>
            </h1>
          </Link>
        </div>

        <div className="hidden xl:flex items-center justify-center grow">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Umoja Tickets. All rights reserved.
          </p>
        </div>

        <div className="grow xl:grow-0 flex justify-end">
          <div className="bg-card text-card-foreground flex items-center border w-fit p-2 rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-jmprimary mr-2" />
            <p className="text-sm text-muted-foreground">
              All Systems Operational
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-end  flex-col md:flex-row md:justify-end gap-2">
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:underline transition-colors"
          >
            Customer Support
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-sm hover:underline text-muted-foreground transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm hover:underline text-muted-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="flex max-w-7xl m-auto flex-col md:flex-row items-center justify-center gap-4 p-2 xl:hidden">
        <div className="flex md:hidden items-center justify-center gap-2.5">
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-muted-foreground/70 transition-colors"
          >
            Customer Support
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-sm text-muted-foreground hover:text-muted-foreground/70 transition-colors"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-muted-foreground/70 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex  items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Umoja Tickets. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
