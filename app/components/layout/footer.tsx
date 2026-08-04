import Link from "next/link";
import { Container } from "./container";

function Footer() {
  return (
    <footer className="border-t border-border-default bg-surface-secondary">
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
                T
              </div>
              <span className="text-lg font-bold text-text-primary">
                Tip<span className="text-primary-500">Kite</span>
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Support your favorite Bangladeshi creators with one-time tips, memberships, and more.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  Explore Creators
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-default py-6 text-center text-sm text-text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} TipsKite. Made with 🪁 in Bangladesh.
          </div>
          <div>
            A product of{" "}
            <a
              href="https://prosolverhq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-text-primary hover:text-primary-500 transition-colors underline decoration-border underline-offset-2"
            >
              ProsolverHQ
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
