import {atom, useRecoilState} from "recoil"

const GameInfoState = atom({
    key: "GameInfoState",
    default: null
})

export const useGameInfo = () => {
    const [image, setImage] = useRecoilState(GameInfoState)
    return {image, setImage}
}