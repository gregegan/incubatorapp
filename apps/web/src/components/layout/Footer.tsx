import { Trophy, Twitter, Facebook, Instagram, Github } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Separator } from "@/ui/components/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        IncubatorApp
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-orange-500" />
                <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
                  IncubatorApp
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                The next best thing.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/help"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/rules"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Rules & Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} IncubatorApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
