import type { SvgProps } from "~/types";

export const MacosIcons = {
  controlCenter: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path fill="none" d="M0 0h23.967v24H0z" />
      <path d="M22.983 17.75a4.4 4.4 0 0 1-4.4 4.4H5.385a4.401 4.401 0 0 1-4.4-4.4c0-2.428 1.971-4.4 4.4-4.4h13.2c2.428 0 4.4 1.972 4.4 4.4ZM18.507 15a2.75 2.75 0 1 0 2.75 2.75 2.75 2.75 0 0 0-2.75-2.75Zm4.476-8.25c0 2.705-2.195 4.9-4.899 4.9h-12.2a4.902 4.902 0 0 1-4.9-4.9c0-2.704 2.196-4.9 4.9-4.9h12.2c2.704 0 4.9 2.196 4.9 4.9Zm-1.65 0a3.252 3.252 0 0 0-3.249-3.25h-12.2a3.251 3.251 0 0 0 0 6.5h12.2a3.252 3.252 0 0 0 3.25-3.25Z" />
      <circle cx={6.033} cy={6.743} r={2.5} transform="translate(-.073 .007)" />
    </svg>
  ),
};
