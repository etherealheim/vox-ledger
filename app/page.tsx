import HelloAnimation from "@/components/custom/hello-animation";
import MenubarInit from "@/components/custom/menubar-init";


export default function Home() {
  return (
    <div>
      <div className="absolute bottom-4 left-4">
        <MenubarInit />
      </div>
      <section>
        <HelloAnimation />
      </section>
    </div >
  );
}
