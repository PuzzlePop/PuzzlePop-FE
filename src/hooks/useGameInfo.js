import { atom, useRecoilState } from "recoil";

const GameInfoState = atom({
  key: "GameInfoState",
  default:
    "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp",
});

export const useGameInfo = () => {
  const [image, setImage] = useRecoilState(GameInfoState);
  return { image, setImage };
};
