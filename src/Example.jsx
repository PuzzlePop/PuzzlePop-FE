import viteLogo from "/vite.svg";
import reactLogo from "@/assets/react.svg";
import SampleButton from "@/components/SampleButton";
import { useSample } from "@/hooks/useSample";

export default function Example() {
  const { count, increase, decrease } = useSample();

  return (
    <>
      <header>
        <div>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </header>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "30px" }}>
        <SampleButton onClick={decrease} style={{ fontSize: "24px" }}>
          -
        </SampleButton>
        <h1>{count}</h1>
        <SampleButton onClick={increase} style={{ fontSize: "24px" }}>
          +
        </SampleButton>
      </div>
    </>
  );
}
