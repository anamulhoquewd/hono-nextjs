import React from "react";
import Header from "../_components/header";
import Footer from "../_components/footer";

function ProfileLayout({
  children,
}: Readonly<React.PropsWithChildren<{ children: React.ReactNode }>>) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default ProfileLayout;
