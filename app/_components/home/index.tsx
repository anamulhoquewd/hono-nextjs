"use client";

import Footer from "@/app/_components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import {
  Smartphone,
  Users,
  Utensils,
  Truck,
  Crown,
  UserCog,
  Truck as TruckDelivery,
  UserCircle,
  ClipboardList,
  UtensilsCrossed,
  AlignJustify,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./mobileMenu";

interface MenuItemProps {
  name: string;
  href: string;
}
const menu: MenuItemProps[] = [
  { name: "Features", href: "#features" },
  { name: "Who Can Use", href: "#who-can-use" },
  { name: " Why Use", href: "#why-use" },
];

function HomeComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} menu={menu} />
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AlignJustify
            onClick={toggleMenu}
            className="h-6 w-6 text-primary block sm:hidden cursor-pointer"
          />
          <Link href="/" className="flex items-center gap-4">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="text-xl block font-bold text-primary">
              Home Catering Service
            </span>
          </Link>
        </div>
        <nav className="hidden sm:flex items-center gap-1">
          {menu.map((item, index) => (
            <Link
              key={index + item.name}
              href={item.href}
              className="text-sm px-4 py-2 font-medium transition-colors duration-300 text-primary rounded-md"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Streamline Your Catering Business with CaterEase
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Manage orders, and delight customers - all in one powerful app.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 bg-white text-black hover:bg-white/90 hover:text-black "
              >
                <Link href="/dashboard">Start Your Free Trial</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
              Key Features
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Order Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>
                      Centralize all catering orders in one place for easy
                      tracking and management.
                    </li>
                    <li>
                      Allow filtering, sorting, and viewing order statuses,
                      history, and details.
                    </li>
                    <li>
                      Enable both managers and owners to create, edit, and
                      invoice orders.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Managers Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>
                      Add a module for owners to create, assign roles, and
                      manage managers.
                    </li>
                    <li>
                      Allow managers to access relevant data like client lists,
                      order history, and delivery schedules.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Delivery Personnel Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>
                      Enable owners and managers to add and oversee delivery
                      personnel, assigning specific orders and routes.
                    </li>
                    <li>
                      Provide tracking capabilities to monitor delivery statuses
                      in real-time.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    Client Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>
                      Store client preferences, past orders, and contact
                      information to provide a personalized service experience.
                    </li>
                    <li>
                      Add notes or special instructions tied to each client to
                      enhance service quality.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Mobile Friendly
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>
                      Make the platform responsive or develop a dedicated mobile
                      app so users can manage their catering business from any
                      device.
                    </li>
                    <li>
                      Ensure managers and delivery personnel can access orders
                      and updates on-the-go.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="who-can-use"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
        >
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Who Can Use CaterEase?
              </h2>
              <p className="text-gray-500 md:text-lg">
                This app aims to simplify the management of catering services,
                making it a powerful tool for everyone involved in the process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Catering Business Owners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Manage your orders, customers, and staff with ease, all in one
                  place.
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Restaurant Managers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Seamlessly handle catering services alongside regular
                  restaurant operations.
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Food Truck Operators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Organize and expand your catering options while keeping track
                  of orders and customer preferences.
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Owners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Register, log in, and oversee all aspects of their catering
                  operations, including managing managers, delivery personnel,
                  customers, and orders.
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-primary" />
                    Managers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Assigned managers can help streamline daily operations by
                  handling customer interactions, managing orders, and
                  coordinating with delivery personnel.
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TruckDelivery className="h-5 w-5 text-primary" />
                    Delivery Personnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Delivery personnel have access to customer and order details
                  to ensure timely and accurate deliveries, helping maintain a
                  smooth delivery process.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="why-use" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Why Use CaterEase?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Streamline Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  CaterEase centralizes all aspects of your catering business,
                  reducing manual work and potential errors.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Increase Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  Automate routine tasks, allowing you to focus on creating
                  exceptional culinary experiences.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enhance Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  Deliver consistent, high-quality service with organized
                  operations and personalized client management.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data-Driven Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  Gain insights into your business performance to make informed
                  decisions and optimize your operations.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Ready to Transform Your Catering Business?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl mb-8">
              Join thousands of satisfied catering professionals using CaterEase
              to grow their business.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 hover:text-black "
            >
              <Link href="/auth/users/log-in">Start Your Free Trial Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomeComponent;
