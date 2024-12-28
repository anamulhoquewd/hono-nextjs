import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Link from "next/link";
import { FC, Fragment, useEffect, useRef } from "react";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  menu: {
    name: string;
    href: string;
  }[];
}

const MobileMenu: FC<MobileMenuProps> = ({ isMenuOpen, toggleMenu, menu }) => {
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        toggleMenu(); // Close menu if clicked outside
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick); // Cleanup listener
    };
  }, [isMenuOpen, toggleMenu]);

  return (
    <div
      ref={mobileMenuRef}
      className={`fixed top-0 left-0 w-56 h-screen bg-white z-10 transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <nav className="flex flex-col items-center mt-6">
        <div className="flex items-center justify-between w-full px-4 mb-4">
          <h1 className="text-xl font-bold">Menu</h1>
          <X
            onClick={toggleMenu}
            className="text-2xl font-bold rounded cursor-pointer"
          />
        </div>
        {menu.map((item, index) => (
          <Fragment key={item.name}>
            {index > 0 && <Separator className="bg-gray-100" />}
            <Link
              href={item.href}
              className="text-sm w-full px-4 py-2 font-medium text-primary transition-colors duration-300"
            >
              {item.name}
            </Link>
          </Fragment>
        ))}
      </nav>
    </div>
  );
};

export default MobileMenu;
