export default function SampleButton({ children, ...buttonProps }) {
  return <button {...buttonProps}>{children}</button>;
}
