import { BiBattery, BiCar, BiHome, BiPackage } from "react-icons/bi";
import { BsSnow, BsUmbrella } from "react-icons/bs";
import { RiOilFill } from "react-icons/ri";
import { PiRug } from "react-icons/pi";
import { GoContainer } from "react-icons/go";

export const menuEntries = [
  {
    label: "Home",
    href: "/",
    icon: <BiHome />,
  },
  {
    label: "Batterie",
    href: "/batteries",
    icon: <BiBattery />,
  },
  {
    label: "Catene da neve",
    href: "/snow-chains",
    icon: <BsSnow />,
  },
  {
    label: "Bauli per auto",
    href: "/car-trunks",
    icon: <BiCar />,
  },
  {
    label: "Teli copriauto",
    href: "/car-covers",
    icon: <BsUmbrella />,
  },
  {
    label: "Oli lubrificanti",
    href: "/lubricating-oils",
    icon: <RiOilFill />,
  },
  {
    label: "Portaggio e carico",
    href: "/roof-bars",
    icon: <BiPackage />,
  },
  {
    label: "Tappetini auto",
    href: "/auto-mats",
    icon: <PiRug />,
  },
  {
    label: "Vasche baule",
    href: "/trunk-liners",
    icon: <GoContainer />,
  },
];
