type Hero = {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: "str" | "agi" | "int" | "all"; // اگر دقیق باشی
  attack_type: "Melee" | "Ranged";
  roles: string[];
  legs: number;
};
import { useHeroSelection } from "./context/heroSelectionContext";
import Image from "next/image";

type Props = {
  heroes: Hero[];
};

export default function HeroList({ heroes }: Props) {
  const { handleHeroSelect } = useHeroSelection();

  return (
    <ul className="text-white p-4">
      <div className="grid grid-cols-5 gap-3">
        {heroes.map((hero) => {
          const heroShortName = hero.name.replace("npc_dota_hero_", "");
          const imageUrl = `http://cdn.dota2.com/apps/dota2/images/heroes/${heroShortName}_full.png`;

          return (
            <div
              onClick={() => {
                handleHeroSelect(hero);
              }}
              key={hero.id}
              className="cursor-pointer"
            >
              <div className="">
                <Image
                  src={imageUrl}
                  alt={hero.localized_name}
                  width={80}
                  height={45}
                  className="rounded"
                />
                <li className="text-[12px] text-center">
                  {hero.localized_name}
                </li>
              </div>
            </div>
          );
        })}
      </div>
    </ul>
  );
}
