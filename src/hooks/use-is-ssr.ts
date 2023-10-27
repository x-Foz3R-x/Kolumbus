export default function useIsSSR(): boolean {
  const isSSR = !(typeof window !== "undefined" && window.document && window.document.createElement);
  return isSSR;
}
