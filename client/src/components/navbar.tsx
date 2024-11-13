import VanceSVG from "../assets/vance.svg";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="w-full p-4  border-b border-b-neutral-50/15">
      <div className="mx-auto max-w-5xl flex items-center">
        <div className="flex items-center">
          <img src={VanceSVG} alt="Vance" className="w-18" />
        </div>
        <div className="flex items-center ml-auto">
          <a
            href="#"
          >
            <Button className="font-bold">Get Started</Button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
