import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
