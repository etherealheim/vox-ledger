import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import Logo from "@/components/custom/Logo";


export default function Home() {
  return (
    <div>
      <div className="dark flex justify-between h-16 p-4">
        <Logo />
        <Button variant="secondary">Login</Button>
      </div>
      <section className="h-screen grid grid-cols-12 align-middle">
        <h1 className="text-8xl">Hello World. Be Prepared.</h1>
      </section>


    </div >
  );
}
