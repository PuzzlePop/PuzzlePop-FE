import { useUID } from "react-uid";

export default function useId(givenId) {
  const id = useUID();

  return givenId !== undefined ? `${"puzzlepop-id-"}${id}` : id;
}
