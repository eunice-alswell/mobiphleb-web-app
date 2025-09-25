import {useState} from "react";
// import { Link, NavLink, useLocation } from "react-router-dom";
import { Link, NavLink} from "react-router-dom";
import { Menu } from "lucide-react";
import Button from "./Button";

// import shadcn/ui components
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "../components/ui/sheet";

interface NavLinksProps {
  mobile?: boolean;
  closeSheet?: () => void;
}

export default function Navbar() {
  // const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { title: "Home", url: "/" },
    { title: "About", url: "/about" },
    { title: "Individual Booking", url: "/individual-booking" },
    { title: "Corporate Services", url: "/corporate-services" },
    { title: "Contact", url: "/contact" },
  ];

  const NavLinks = ({ mobile = false, closeSheet }: NavLinksProps) => (
    <div
      className={`${
        mobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-2"
      }`}
    >
      {navigationItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          onClick={closeSheet}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md transition-colors duration-200 ${
              isActive
                ? "text-primaryColor font-semibold"
                : "text-gray-900 hover:bg-gray-100 hover:text-black"
            }`
          }
        >
          {item.title}
        </NavLink>
      ))}
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-white w-full shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/MOBIPHLEB_logo_purple_1.png"
                alt="MOBIPHLEB"
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <NavLinks />
            </nav>

            {/* CTA Button Desktop */}
            <div className="hidden md:block">
              <Link to="/individual-booking">
                <Button label="Book Now"/>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <div className="cursor-pointer bg-accent p-2 rounded-md">
                  <Menu className="w-6 h-6 md:hidden text-violet-900" />
                </div>
              </SheetTrigger>
              {/* Sidebar (from right, full height) */}
              <SheetContent
                side="right"
                className="w-3/4 sm:w-1/2 md:w-1/3 flex flex-col bg-white"
              >
                <div className="mt-6 flex flex-col space-y-6">
                  <NavLinks mobile closeSheet={() => setIsOpen(false)} />
                  <div className="px-4">
                    <SheetClose asChild>
                      <Link to="/individual-booking" >
                        <Button label="Book Now" customStyle="w-full" />
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
