"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify, LogOut, User, X } from "lucide-react";
import { useState, useEffect, useRef, Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteAlert from "@/app/_components/sheared/deleteAlert";
import { usePathname } from "next/navigation";
import useUsers from "@/app/_hooks/useUsers";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  role: "admin" | "manager" | "delivery_man" | "";
}

const MobileMenu = ({ isMenuOpen, toggleMenu, role }: MobileMenuProps) => {
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  let navigation: { name: string; href: string }[] = [];

  switch (role) {
    case "admin":
      navigation = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Managers", href: "/dashboard/managers" },
        { name: "Delivery Man", href: "/dashboard/delivery-mans" },
        { name: "Customers", href: "/dashboard/customers" },
        { name: "Orders", href: "/dashboard/orders" },
      ];
      break;

    case "manager":
      navigation = [
        { name: "Customers", href: "/dashboard/customers" },
        { name: "Orders", href: "/dashboard/orders" },
      ];
      break;

    case "delivery_man":
      navigation = [{ name: "Orders", href: "/dashboard/orders" }];
      break;

    default:
      navigation = []; // Unauthorized role
  }

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
        {navigation.map((item, index) => (
          <Fragment key={item.name}>
            {index > 0 && <Separator className="bg-gray-100" />}
            <Link
              onClick={toggleMenu}
              href={item.href}
              className="text-sm w-full px-4 py-2 font-medium transition-colors duration-300"
            >
              {item.name}
            </Link>
          </Fragment>
        ))}
      </nav>
    </div>
  );
};

const HeaderComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { profile, logoutHandler } = useUsers();
  const role = profile?.role;

  let navigation: { name: string; href: string }[] = [];

  switch ("admin") {
    case "admin":
      navigation = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Managers", href: "/dashboard/managers" },
        { name: "Delivery Man", href: "/dashboard/delivery-mans" },
        { name: "Customers", href: "/dashboard/customers" },
        { name: "Orders", href: "/dashboard/orders" },
      ];
      break;

    case "manager":
      navigation = [
        { name: "Customers", href: "/dashboard/customers" },
        { name: "Orders", href: "/dashboard/orders" },
      ];
      break;

    case "delivery_man":
      navigation = [{ name: "Orders", href: "/dashboard/orders" }];
      break;

    default:
      navigation = []; // Unauthorized role
  }

  return (
    <>
      <MobileMenu
        role={role!}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <header className="bg-white border-b print:hidden">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between md:px-6 container py-4 px-2"
          aria-label="Global"
        >
          <div className="block sm:hidden">
            <Button onClick={toggleMenu} variant="ghost" size={"icon"}>
              <span className="sr-only">Open menu</span>
              <AlignJustify />
            </Button>
          </div>
          <div className="flex">
            <Link href="/">
              <span className="font-semibold text-center text-xl">
                Catering Name
              </span>
            </Link>
          </div>
          <div className="hidden gap-x-5 sm:flex">
            {navigation.map((item, index) => (
              <Link
                key={`${index}-${item.name}`}
                href={item.href}
                className={`text-sm font-semibold leading-6 ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                } hover:text-primary`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex justify-end p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar}
                      alt="User"
                      width={32}
                      height={32}
                    />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.name || "Please Log out before logging in"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email || "anam@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link
                    href={`/profile`}
                    className="flex items-center space-x-2 w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteAlert
              confirmText="Log out"
              isOpen={open}
              setOpen={setOpen}
              cb={logoutHandler}
            />
          </div>
        </nav>
      </header>
    </>
  );
};

export default HeaderComponent;
