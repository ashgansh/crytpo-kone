import React, { useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetContent,
} from "@/components/ui/Sheet";
import { ArrowUpRight, BurgerMenu, Close } from "@/icons";
import { Button, Dropdown } from "../common";
import { truncateAddress } from "@/utils/walletUtils";

const Navbar = () => {
  const router = useRouter();
  const [{ wallet }, connect] = useConnectWallet();
  const [isDocsHovered, setIsDocsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/" },
    // { name: "Company", href: "/company" },
    // { name: "Billing", href: "/billing" },
    { name: "Invoices", href: "/invoices" },
    // { name: "Banking", href: "/banking" },
  ];

  const supportLinks = [
    { name: "Github Discussions", href: "https://github.com/orgs/RequestNetwork/discussions" },
    { name: "Discord", href: "https://discord.com/channels/468974345222619136/1103420140181274645" },
  ];

  return (
    <nav className="flex justify-between items-center border-b border-gray-300 pb-4 max-w-7xl mx-auto pt-4">
      <div className="flex space-x-4 overflow-x-auto">
        {links.map((item) => (
          <Link key={item.name} href={item.href}>
            <button className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors whitespace-nowrap">
              {item.name}
            </button>
          </Link>
        ))}
      </div>
      
      <div className="hidden tablet:flex items-center gap-[15px] lg:gap-[35px]">
        {/* Docs link */}
        <div
          onMouseEnter={() => setIsDocsHovered(true)}
          onMouseLeave={() => setIsDocsHovered(false)}
        >

          <div
            className={`${
              isDocsHovered ? "h-[1.5px]" : "h-[0px]"
            } w-100 bg-green`}
          ></div>
        </div>
        
        
        <Button
          className="px-[14px] lg:px-[20px] text-14px lg:text-[16px] py-[8px]"
          text={wallet ? truncateAddress(wallet.accounts[0].address) : "Connect Wallet"}
          onClick={() => connect()}
        />
      </div>
      
      <BurgerMenu
        className="block tablet:hidden"
        onClick={() => setIsMobileMenuOpen(true)}
      />
      
      {/* Mobile menu sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent>
          <SheetTitle hidden>Menu</SheetTitle>
          <SheetClose className="absolute right-5 top-5">
            <Close />
          </SheetClose>
          <ul className="flex flex-col gap-7 text-[16px] w-full">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  className={`w-[80%] block h-[30px] ${
                    router.pathname === link.href &&
                    "border-b-[1px] border-solid border-green"
                  }`}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://docs.request.network/building-blocks/templates"
                className="flex items-center gap-[5px] bg-transparent text-green font-medium text-[16px] w-[100%] h-[30px]"
              >
                Integrate in your app
                <ArrowUpRight />
              </a>
            </li>
            <li>
              <Dropdown title="Need help?" items={supportLinks} />
            </li>
            <li>
              <Button
                className="w-[122px] justify-center text-[16px]  py-[8px]"
                text={
                  wallet
                    ? truncateAddress(wallet.accounts[0].address)
                    : "Connect Wallet"
                }
                onClick={() => {
                  connect();
                  setIsMobileMenuOpen(false);
                }}
              />
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
