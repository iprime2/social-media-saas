// components/navbar.tsx
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      {/* Left: Brand */}
      <div className="text-2xl font-extrabold text-primary tracking-wide font-serif">
        krishil
      </div>

      {/* Right: Theme toggle and user avatar */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Avatar>
          <AvatarFallback>K</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
