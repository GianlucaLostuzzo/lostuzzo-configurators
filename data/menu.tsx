import { BiHome, BiPackage } from "react-icons/bi";
import { BsUmbrella } from "react-icons/bs";
import { GiTowTruck, GiCarWheel, GiCarBattery } from "react-icons/gi";
import { MdOutlineSdCard } from "react-icons/md";
import { LiaRoadSolid, LiaOilCanSolid } from "react-icons/lia";
import { FaTaxi, FaTruck } from "react-icons/fa";

export const menuEntries = [
  {
    label: "Home",
    href: "/",
    icon: <BiHome />,
  },
  {
    label: "Batterie",
    href: "/batteries",
    icon: <GiCarBattery />,
  },
  {
    label: "Catene da neve",
    href: "/snow-chains",
    icon: <GiCarWheel />,
  },
  {
    label: "Bauli per auto",
    href: "/car-trunks",
    icon: <FaTaxi />,
  },
  {
    label: "Teli copriauto",
    href: "/car-covers",
    icon: <BsUmbrella />,
  },
  {
    label: "Oli lubrificanti",
    href: "/lubricating-oils",
    icon: <LiaOilCanSolid />,
  },
  {
    label: "Portaggio e carico",
    href: "/roof-bars",
    icon: <BiPackage />,
  },
  {
    label: "Portaggio veicoli commerciali",
    href: "/professional-bars",
    icon: <FaTruck />,
  },
  {
    label: "Tappetini auto",
    href: "/auto-mats",
    icon: <MdOutlineSdCard />,
  },
  {
    label: "Vasche baule",
    href: "/trunk-liners",
    icon: <LiaRoadSolid />,
  },
  {
    label: "Ganci Traino",
    href: "/towbars",
    icon: <GiTowTruck />,
  },
];
