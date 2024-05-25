import type { SvgProps } from "~/types";

export const EditingIcons = {
  cancel: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path d="M16 3c7.168 0 13 5.832 13 13s-5.832 13-13 13S3 23.168 3 16 8.832 3 16 3m0-3C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0Z" />
      <path d="m18.083 16 5.629-5.629a.984.984 0 0 0 0-1.391l-.692-.692a.984.984 0 0 0-1.391 0L16 13.917l-5.629-5.629a.984.984 0 0 0-1.391 0l-.692.692a.984.984 0 0 0 0 1.391L13.917 16l-5.629 5.629a.984.984 0 0 0 0 1.391l.692.692a.984.984 0 0 0 1.391 0L16 18.083l5.629 5.629a.984.984 0 0 0 1.391 0l.692-.692a.984.984 0 0 0 0-1.391L18.083 16Z" />
    </svg>
  ),
  check: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 21.9586" {...props}>
      <g id="check">
        <path d="m31.4796,1.3547l-.8344-.8343c-.6938-.6939-1.8189-.6939-2.5128,0l-15.4793,15.4793L3.8671,7.2136c-.6932-.6933-1.8173-.6933-2.5106,0l-.8365.8365c-.6932.6933-.6932,1.8173,0,2.5107l10.8779,10.8779c.6933.6933,1.8173.6933,2.5107,0l.0011-.0011h0L31.4796,3.8676c.6939-.6939.6939-1.8189,0-2.5128Z" />
      </g>
    </svg>
  ),
  clipboardPin: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.9995 32" {...props}>
      <g id="clipboardPin">
        <path d="m17.3335,16.9128c.0039-.0679.0084-.1521.0084-.2419,0-4.4401-3.3368-8.0949-7.6398-8.6045-.0344-.0041-.0689-.0105-.069-.0105-.257-.0374-.4756-.0506-.9598-.0559,0,0-.6199.0058-.9646.0559,0,0-.0346.0064-.069.0105C3.3368,8.576,0,12.2308,0,16.6709c0,.0898.0046.174.0084.2419.1066,1.8792.7128,3.2576,1.1767,4.2868,0,0,.8806,2.0349,2.3366,3.7743.735.8781,1.4192,1.7975,2.1404,2.6869.4827.5952.9711,1.1925,1.4209,2.104.2101.4258.3901.8665.5556,1.3116.1155.3105.221.6254.5234.7969.2162.1226.4536.1268.5088.1268.0552,0,.2924-.0043.5085-.1267.3025-.1714.4082-.4864.5237-.797.1655-.445.3455-.8858.5556-1.3116.4498-.9115.9382-1.5087,1.4209-2.104.7212-.8894,1.4054-1.8088,2.1404-2.6869,1.456-1.7394,2.3366-3.7742,2.3366-3.7743.4639-1.0292,1.0702-2.4076,1.1767-4.2868Zm-11.5504-.6548c0-1.5955,1.2927-2.8887,2.8879-2.89,1.5952.0013,2.8879,1.2946,2.8879,2.89s-1.2927,2.8888-2.8879,2.8901c-1.5952-.0013-2.8879-1.2946-2.8879-2.8901Z" />
        <path d="m26.2359,2.7692h-.4983c-.2311,0-.428-.1736-.4532-.4033-.2036-1.8564-1.7737-2.3659-3.674-2.3659h-3.6833c-1.9008,0-3.4704.5095-3.674,2.3659-.0252.2297-.2221.4033-.4532.4033h-.4982c-1.0601,0-1.9737.5991-2.4337,1.4762-.2281.4349.0107.9713.4887,1.0837,5.203,1.2231,8.9848,5.8801,8.9848,11.3418,0,.1527-.0067.2959-.0132.4118-.1403,2.4731-.952,4.2739-1.4196,5.3105-.0271.0625-.1102.2505-.2459.5287-.2429.4979.123,1.0782.677,1.0782h6.8961c1.5263,0,2.7637-1.2373,2.7637-2.7637V5.5328c0-1.5263-1.2373-2.7636-2.7636-2.7636Zm-3.2337.9231h-6.1023c-.6221,0-.8255-.2136-.8234-.4711.0063-.7606.6248-1.3751,1.3868-1.3751h4.6108c.7622,0,1.3807.6148,1.3868,1.3755.0021.2573-.2015.4707-.4588.4707Z" />
      </g>
    </svg>
  ),
  copy: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 32" {...props}>
      <g id="copy">
        <path d="m0,10.0043v19.9914c0,1.1069.8973,2.0043,2.0043,2.0043h15.9914c1.1069,0,2.0043-.8973,2.0043-2.0043v-13.1655c0-.5316-.2112-1.0414-.587-1.4172l-6.8259-6.8259c-.3759-.3759-.8857-.587-1.4172-.587H2.0043c-1.1069,0-2.0043.8973-2.0043,2.0043Z" />
        <path d="m28.006,3h-.5398c-.2621,0-.4636-.2056-.4943-.4659-.2337-1.9874-1.9281-2.5341-3.9769-2.5341h-3.9902c-2.0492,0-3.7432.5466-3.9769,2.5341-.0306.2603-.2322.4659-.4943.4659h-.5398c-.8274,0-1.5719.3377-2.1104.8818-.4177.422-.1637,1.1136.4151,1.2462.9055.2074,1.7367.6646,2.4098,1.3376l6.8259,6.8259c.9385.9385,1.4657,2.2114,1.4657,3.5386v8.4186c0,.4149.3363.7512.7512.7512h4.2548c1.6535,0,2.994-1.3404,2.994-2.994V5.994c0-1.6535-1.3404-2.994-2.994-2.994Zm-3.5036,1h-7.0049c-.2748,0-.4976-.2228-.4976-.4976,0-.8298.6727-1.5024,1.5024-1.5024h4.9951c.8298,0,1.5024.6727,1.5024,1.5024,0,.2748-.2228.4976-.4976.4976Z" />
      </g>
    </svg>
  ),
  duplicate: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32" {...props}>
      <g id="Layer_17">
        <path d="m0,10.0043v19.9914c0,1.1069.8973,2.0043,2.0043,2.0043h15.9914c1.1069,0,2.0043-.8973,2.0043-2.0043v-13.1655c0-.5316-.2112-1.0414-.587-1.4172l-6.8259-6.8259c-.3759-.3759-.8857-.587-1.4172-.587H2.0043c-1.1069,0-2.0043.8973-2.0043,2.0043Z" />
        <path d="m27.413,7.413L20.587.587c-.3759-.3759-.8857-.587-1.4172-.587h-9.1655c-1.1069,0-2.0043.8973-2.0043,2.0043v1.9954c0,.5525.4479,1.0003,1.0003,1.0003h2.1695c1.3272,0,2.6.5272,3.5385,1.4657l6.8259,6.8259c.9385.9385,1.4657,2.2113,1.4657,3.5385v6.1695c0,.5525.4479,1.0003,1.0003,1.0003h1.9954c1.1069,0,2.0043-.8973,2.0043-2.0043v-13.1655c0-.5316-.2112-1.0414-.587-1.4172Z" />
      </g>
    </svg>
  ),
  gripDots: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 32" {...props}>
      <g id="grip-dots">
        <rect x="0" y="0" width="7" height="7" rx="3.5" ry="3.5" />
        <rect x="0" y="12.5" width="7" height="7" rx="3.5" ry="3.5" />
        <rect x="0" y="25" width="7" height="7" rx="3.5" ry="3.5" />
        <rect x="14" y="0" width="7" height="7" rx="3.5" ry="3.5" />
        <rect x="14" y="12.5" width="7" height="7" rx="3.5" ry="3.5" />
        <rect x="14" y="25" width="7" height="7" rx="3.5" ry="3.5" />
      </g>
    </svg>
  ),
  gripLines: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 14" {...props}>
      <g id="grip-lines">
        <rect y="0" width="32" height="4" rx="1.4953" ry="1.4953" />
        <rect y="10" width="32" height="4" rx="1.4953" ry="1.4953" />
      </g>
    </svg>
  ),
  horizontalDots: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 3" {...props}>
      <path d="M3,1.5h0c0,.825-.675,1.5-1.5,1.5h0c-.825,0-1.5-.675-1.5-1.5H0C0,.675,.675,0,1.5,0h0c.825,0,1.5,.675,1.5,1.5ZM7,0h0c-.825,0-1.5,.675-1.5,1.5h0c0,.825,.675,1.5,1.5,1.5h0c.825,0,1.5-.675,1.5-1.5h0c0-.825-.675-1.5-1.5-1.5Zm5.5,0h0c-.825,0-1.5,.675-1.5,1.5h0c0,.825,.675,1.5,1.5,1.5h0c.825,0,1.5-.675,1.5-1.5h0c0-.825-.675-1.5-1.5-1.5Z" />
    </svg>
  ),
  plus: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path d="M30.5 13.75H18.25V1.5a1.5 1.5 0 0 0-1.5-1.5h-1.5a1.5 1.5 0 0 0-1.5 1.5v12.25H1.5a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5h12.25V30.5a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5-1.5V18.25H30.5a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5Z" />
    </svg>
  ),
  plus_bold: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path d="M30.001 13H19V1.999A1.999 1.999 0 0 0 17.001 0H15A1.999 1.999 0 0 0 13 1.999V13H1.999A1.999 1.999 0 0 0 0 14.999V17C0 18.105.895 19 1.999 19H13v11.001c0 1.104.895 1.999 1.999 1.999H17A1.999 1.999 0 0 0 19 30.001V19h11.001A1.999 1.999 0 0 0 32 17.001V15A1.999 1.999 0 0 0 30.001 13Z" />
    </svg>
  ),
  redo: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.942 26.946" {...props}>
      <path d="M28.243 5.42 21.175.242c-.938-.687-2.117.163-2.117 1.527v3.176h-8.526C4.715 4.946 0 9.66 0 15.477v.937c0 5.637 4.432 10.226 10 10.505v.017c0 .005.004.01.01.01H22.5a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5H10.533A6.54 6.54 0 0 1 4 16.414v-.937a6.54 6.54 0 0 1 6.532-6.531h8.526v3.175c0 1.364 1.179 2.214 2.118 1.527l7.067-5.176c.932-.682.932-2.37 0-3.053Z" />
    </svg>
  ),
  rangeCalendar: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 24" {...props}>
      <path fill="none" d="M0 0h68v24H0z" />
      <path d="M61.13 1.5H64a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3h2.88v.37a1.12 1.12 0 1 0 2.25 0V1.5h5.25v.37a1.12 1.12 0 1 0 2.25 0V1.5h5.25v.37a1.12 1.12 0 1 0 2.25 0V1.5h5.25v.37a1.12 1.12 0 1 0 2.25 0V1.5h5.25v.37a1.13 1.13 0 0 0 2.25 0V1.5h10.25v.37a1.13 1.13 0 0 0 2.25 0V1.5h7.25v.37a1.13 1.13 0 0 0 2.25 0V1.5ZM45 13v7c0 .83.67 1.5 1.5 1.5H64c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5H46.5c-.83 0-1.5.67-1.5 1.5Zm-1.5 0c0-.83-.67-1.5-1.5-1.5H4c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5h38c.83 0 1.5-.67 1.5-1.5v-7Z" />
      <path d="M23.63.63v1.25a.63.63 0 0 1-1.26 0V.63a.63.63 0 0 1 1.26 0Zm-7.5 0v1.25a.63.63 0 0 1-1.25 0V.63a.63.63 0 0 1 1.25 0Zm-7.5 0v1.25a.63.63 0 0 1-1.25 0V.63a.63.63 0 0 1 1.25 0Zm22.49 0v1.25a.63.63 0 0 1-1.24 0V.63a.63.63 0 0 1 1.24 0Zm7.51 0v1.25a.63.63 0 0 1-1.26 0V.63a.63.63 0 0 1 1.26 0Zm12.5 0v1.25a.63.63 0 0 1-1.25 0V.63a.63.63 0 0 1 1.25 0Zm9.5 0v1.25a.63.63 0 0 1-1.25 0V.63a.63.63 0 0 1 1.25 0Zm-39.8 16.7a.83.83 0 0 1 0-1.67H23v-1.13a.25.25 0 0 1 .42-.19l2.35 1.97a.25.25 0 0 1 0 .38l-2.35 1.97a.25.25 0 0 1-.27.04.25.25 0 0 1-.14-.23L23 17.33h-2.17Z" />
    </svg>
  ),
  rangeCalendar10: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 24" {...props}>
      <path fill="none" d="M0 0h72v24H0z" />
      <path d="M65.62 2.5H68a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5.5a3 3 0 0 1 3-3h2.87v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.26v.38a1.13 1.13 0 0 0 2.24 0V2.5h5.26v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.25v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.24v.38a1.13 1.13 0 0 0 2.26 0V2.5h9.24v.38a1.13 1.13 0 0 0 2.26 0V2.5h5.24v.38a1.13 1.13 0 0 0 2.26 0V2.5h5.25v.38a1.13 1.13 0 0 0 2.24 0V2.5ZM45 14v6c0 .83.67 1.5 1.5 1.5H68c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5H46.5c-.83 0-1.5.67-1.5 1.5Zm-1.5 0c0-.83-.67-1.5-1.5-1.5H4c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5h38c.83 0 1.5-.67 1.5-1.5v-6Z" />
      <path d="M23.63 1.63v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0Zm-7.51 0v1.25a.63.63 0 0 1-1.24 0V1.63a.63.63 0 0 1 1.24 0Zm-7.49 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0Zm22.49 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm7.51 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0Zm11.49 0v1.25a.63.63 0 0 1-1.24 0V1.63a.63.63 0 0 1 1.24 0Zm7.51 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0Zm7.49 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-44.29 16.2a.83.83 0 0 1 0-1.67H23v-1.13a.25.25 0 0 1 .42-.19l2.35 1.97a.25.25 0 0 1 0 .38l-2.35 1.97a.25.25 0 0 1-.27.04.25.25 0 0 1-.14-.23L23 17.83h-2.17Z" />
    </svg>
  ),
  rangeCalendar9: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 24" {...props}>
      <path fill="none" d="M0 0h64v24H0z" />
      <path d="M60 23H4a3 3 0 0 1-3-3V5.5a3 3 0 0 1 3-3h2.87v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.25v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.25v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.25v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.25v.38a1.13 1.13 0 0 0 2.25 0V2.5h9.25v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.25v.38a1.13 1.13 0 0 0 2.25 0V2.5H60a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3Zm-16.5-9c0-.83-.67-1.5-1.5-1.5H4c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5h38c.83 0 1.5-.67 1.5-1.5v-6Zm1.5 0v6c0 .83.67 1.5 1.5 1.5H60c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5H46.5c-.83 0-1.5.67-1.5 1.5Z" />
      <path d="M23.62 1.63v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-7.5 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-7.5 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm22.5 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm7.5 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm11.5 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm7.5 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-36.79 16.2a.83.83 0 0 1 0-1.67H23v-1.13c0-.1.06-.19.15-.23.09-.04.2-.02.26.04l2.36 1.97a.25.25 0 0 1 0 .38l-2.36 1.97a.25.25 0 0 1-.26.04.25.25 0 0 1-.15-.23v-1.14h-2.17Z" />
    </svg>
  ),
  rangeCalendar8: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" {...props}>
      <path fill="none" d="M0 0h48v24H0z" />
      <path fill="#fff" d="M2.5 12.5h43v9h-43z" />
      <path d="M1 20V5.5a3 3 0 0 1 3-3h2.88v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5H44a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3Zm25.25 1.5H44a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H26.25a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5Zm-4.5-9H4A1.5 1.5 0 0 0 2.5 14v6A1.5 1.5 0 0 0 4 21.5h17.75a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5ZM7.37 2.5h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.26 0V2.5Z" />
      <path d="M24.63 1.63v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-8 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.24 0Zm-8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm24 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0Z" />
    </svg>
  ),
  rangeCalendar7: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" {...props}>
      <path fill="none" d="M0 0h48v24H0z" />
      <path fill="#fff" d="M2.5 12.5h43v9h-43z" />
      <path d="M1 20V5.5a3 3 0 0 1 3-3h2.88v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5H44a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3Zm30 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H31a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5Zm-14-9H4A1.5 1.5 0 0 0 2.5 14v6A1.5 1.5 0 0 0 4 21.5h13a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5Zm-9.63-10h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.26 0V2.5Z" />
      <path d="M24.63 1.63v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-8 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.24 0Zm-8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm24 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0Z" />
      <path
        fill="#fff"
        d="M20.75 13.25a.75.75 0 0 1 0-1.5h3.24L24 10a.25.25 0 0 1 .4-.2l3.32 2.51c.07.05.1.12.1.2 0 .08-.03.15-.1.2-.68.52-2.5 1.9-3.32 2.5a.25.25 0 0 1-.4-.2v-1.75h-3.24Z"
      />
    </svg>
  ),
  rangeCalendar6: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" {...props}>
      <path d="M13.25 1.5H14a3 3 0 0 1 3 3V19a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3h.75v.75a1.5 1.5 0 0 0 3 0V1.5h3.5v.75a1.5 1.5 0 0 0 3 0V1.5Zm-8.75 0H6v.75a.75.75 0 0 1-1.5 0V1.5Zm6.5 0h1.5v.75a.75.75 0 0 1-1.5 0V1.5Z" />
      <path d="M6 .75v1.5a.75.75 0 0 1-1.5 0V.75a.75.75 0 0 1 1.5 0Zm6.5 0v1.5a.75.75 0 0 1-1.5 0V.75a.75.75 0 0 1 1.5 0Zm28.75.75H42a3 3 0 0 1 3 3V19a3 3 0 0 1-3 3H31a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3h.75v.75a1.5 1.5 0 0 0 3 0V1.5h3.5v.75a1.5 1.5 0 0 0 3 0V1.5Zm-8.75 0H34v.75a.75.75 0 0 1-1.5 0V1.5Zm6.5 0h1.5v.75a.75.75 0 0 1-1.5 0V1.5Z" />
      <path d="M34 .75v1.5a.75.75 0 0 1-1.5 0V.75a.75.75 0 0 1 1.5 0Zm6.5 0v1.5a.75.75 0 0 1-1.5 0V.75a.75.75 0 0 1 1.5 0Zm-21.25 11.5a.75.75 0 0 1 0-1.5h3.24L22.5 9a.25.25 0 0 1 .4-.2l3.32 2.51c.07.05.1.12.1.2 0 .08-.03.15-.1.2-.68.52-2.5 1.9-3.32 2.5a.25.25 0 0 1-.4-.2l-.02-1.75h-3.24Z" />
    </svg>
  ),
  rangeCalendar5: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" {...props}>
      <path fill="none" d="M0 0h48v24H0z" />
      <path d="M41.63 2.5H44a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5.5a3 3 0 0 1 3-3h2.38v.38a1.63 1.63 0 0 0 3.25 0V2.5h4.74v.38a1.63 1.63 0 0 0 3.26 0V2.5h4.75v.38a1.63 1.63 0 0 0 3.25 0V2.5h4.75v.38a1.63 1.63 0 0 0 3.25 0V2.5h4.74v.38a1.63 1.63 0 0 0 3.26 0V2.5Zm-34.5 0h1.75v.38a.88.88 0 0 1-1.76 0V2.5Zm8 0h1.74v.38a.88.88 0 0 1-1.75 0V2.5Zm8 0h1.75v.38a.88.88 0 0 1-1.75 0V2.5Zm8 0h1.75v.38a.88.88 0 0 1-1.76 0V2.5Zm8 0h1.74v.38a.88.88 0 0 1-1.74 0V2.5Z" />
      <path d="M24.88 1.63v1.25a.88.88 0 0 1-1.75 0V1.63a.88.88 0 0 1 1.75 0Zm-8 0v1.25a.88.88 0 0 1-1.75 0V1.63a.88.88 0 0 1 1.74 0Zm-8 0v1.25a.88.88 0 0 1-1.76 0V1.63a.88.88 0 0 1 1.75 0Zm24 0v1.25a.88.88 0 0 1-1.76 0V1.63a.88.88 0 0 1 1.75 0Zm8 0v1.25a.88.88 0 0 1-1.76 0V1.63a.88.88 0 0 1 1.76 0Z" />
      <path
        fill="#fff"
        d="M20.75 13.25a.75.75 0 0 1 0-1.5h3.24L24 10a.25.25 0 0 1 .4-.2l3.32 2.51c.07.05.1.12.1.2 0 .08-.03.15-.1.2-.68.52-2.5 1.9-3.32 2.5a.25.25 0 0 1-.4-.2v-1.75h-3.24Z"
      />
    </svg>
  ),
  rangeCalendar4: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" {...props}>
      <path fill="none" d="M0 0h48v24H0z" />
      <path d="M41.13 2.5H44a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5.5a3 3 0 0 1 3-3h2.88v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5Zm-33.76 0h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.26 0V2.5ZM2.5 14v6c0 .83.67 1.5 1.5 1.5h40c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5H4c-.83 0-1.5.67-1.5 1.5Z" />
      <path d="M24.63 1.63v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-8 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.24 0Zm-8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm24 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0Z" />
      <path
        fill="#fff"
        d="M20.05 9.32v-.95c0-.14.11-.25.25-.25h3.75v-2.2a.25.25 0 0 1 .43-.17l3.4 3.4c.04.04.07.1.07.17h-7.9Z"
      />
      <path d="M20.05 16.4v.96c0 .14.11.25.25.25h3.75v2.19a.25.25 0 0 0 .43.18l3.4-3.4a.25.25 0 0 0 .07-.18h-7.9Z" />
      <path fill="#fff" d="M2.5 5.5h43v16h-43z" />
      <path d="M41.13 2.5H44a3 3 0 0 1 3 3V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5.5a3 3 0 0 1 3-3h2.88v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.75v.38a1.13 1.13 0 0 0 2.25 0V2.5h5.74v.38a1.13 1.13 0 0 0 2.26 0V2.5ZM2.5 14v6c0 .83.67 1.5 1.5 1.5h40c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5H4c-.83 0-1.5.67-1.5 1.5Zm17.55-4.68h7.9a.25.25 0 0 0-.07-.17l-3.4-3.4a.25.25 0 0 0-.43.18v2.19H20.3a.25.25 0 0 0-.25.25v.95ZM7.37 2.5h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.25 0V2.5Zm8 0h1.25v.38a.63.63 0 0 1-1.24 0V2.5Zm8 0h1.26v.38a.63.63 0 0 1-1.26 0V2.5Z" />
      <path d="M24.63 1.63v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.25 0Zm-8 0v1.25a.63.63 0 0 1-1.25 0V1.63a.63.63 0 0 1 1.24 0Zm-8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm24 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.25 0Zm8 0v1.25a.63.63 0 0 1-1.26 0V1.63a.63.63 0 0 1 1.26 0ZM20.05 16.4v.96c0 .14.11.25.25.25h3.75v2.19a.25.25 0 0 0 .43.18l3.4-3.4a.25.25 0 0 0 .07-.18h-7.9Z" />
    </svg>
  ),
  rangeCalendar3: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" {...props}>
      <path fill="none" d="M0 0h48v24H0z" />
      <path fill="#fff" d="M2 9.5h44V22H2z" />
      <path d="M41.25 2.5h3.25A2.5 2.5 0 0 1 47 5v15.5a2.5 2.5 0 0 1-2.5 2.5h-41A2.5 2.5 0 0 1 1 20.5V5a2.5 2.5 0 0 1 2.5-2.5h3.25v.25a1.25 1.25 0 0 0 2.5 0V2.5h5.5v.25a1.25 1.25 0 0 0 2.5 0V2.5h5.5v.25a1.25 1.25 0 0 0 2.5 0V2.5h5.5v.25a1.25 1.25 0 0 0 2.5 0V2.5h5.5v.25a1.25 1.25 0 0 0 2.5 0V2.5ZM20 13.5H3.5A1.5 1.5 0 0 0 2 15v5.5A1.5 1.5 0 0 0 3.5 22h41a1.5 1.5 0 0 0 1.5-1.5V15a1.5 1.5 0 0 0-1.5-1.5H27.9c0 .06-.03.13-.08.18l-3.4 3.4a.25.25 0 0 1-.42-.18v-2.2h-3.75a.25.25 0 0 1-.25-.25v-.95Zm0 0h7.9a.25.25 0 0 0-.08-.18l-3.4-3.4a.25.25 0 0 0-.42.18v2.2h-3.75a.25.25 0 0 0-.25.25v.95ZM7.25 2.5h1.5v.25a.75.75 0 0 1-1.5 0V2.5Zm8 0h1.5v.25a.75.75 0 0 1-1.5 0V2.5Zm8 0h1.5v.25a.75.75 0 0 1-1.5 0V2.5Zm8 0h1.5v.25a.75.75 0 0 1-1.5 0V2.5Zm8 0h1.5v.25a.75.75 0 0 1-1.5 0V2.5Z" />
      <path d="M24.75 1.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 1.5 0Zm-8 0v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 1.5 0Zm-8 0v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 1.5 0Zm24 0v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 1.5 0Zm8 0v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 1.5 0Z" />
    </svg>
  ),
  rangeCalendar2: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" {...props}>
      <path fill="none" d="M0 0H48V24H0z" />
      <path fill="#fff" d="M3.5 10H44.5V20.5H3.5z" />
      <path d="M41.5,3L43,3C44.657,3 46,4.343 46,6L46,19C46,20.657 44.657,22 43,22L5,22C3.343,22 2,20.657 2,19L2,6C2,4.343 3.343,3 5,3L6.5,3L6.5,3.5C6.5,4.328 7.172,5 8,5C8.828,5 9.5,4.328 9.5,3.5L9.5,3L14.5,3L14.5,3.5C14.5,4.328 15.172,5 16,5C16.828,5 17.5,4.328 17.5,3.5L17.5,3L22.5,3L22.5,3.5C22.5,4.328 23.172,5 24,5C24.828,5 25.5,4.328 25.5,3.5L25.5,3L30.5,3L30.5,3.5C30.5,4.328 31.172,5 32,5C32.828,5 33.5,4.328 33.5,3.5L33.5,3L38.5,3L38.5,3.5C38.5,4.328 39.172,5 40,5C40.828,5 41.5,4.328 41.5,3.5L41.5,3ZM7,3L9,3L9,3.5C9,4.052 8.552,4.5 8,4.5C7.448,4.5 7,4.052 7,3.5L7,3ZM15,3L17,3L17,3.5C17,4.052 16.552,4.5 16,4.5C15.448,4.5 15,4.052 15,3.5L15,3ZM23,3L25,3L25,3.5C25,4.052 24.552,4.5 24,4.5C23.448,4.5 23,4.052 23,3.5L23,3ZM31,3L33,3L33,3.5C33,4.052 32.552,4.5 32,4.5C31.448,4.5 31,4.052 31,3.5L31,3ZM39,3L41,3L41,3.5C41,4.052 40.552,4.5 40,4.5C39.448,4.5 39,4.052 39,3.5L39,3ZM20,13L5,13C4.448,13 4,13.448 4,14L4,19C4,19.552 4.448,20 5,20L43,20C43.552,20 44,19.552 44,19L44,14C44,13.448 43.552,13 43,13L27.83,13C27.83,13.08 27.792,13.156 27.727,13.204L24.405,15.697C24.328,15.754 24.225,15.763 24.14,15.72C24.054,15.678 24,15.59 24,15.494L24,13.75L20.283,13.75C20.127,13.75 20,13.623 20,13.467L20,13ZM27.83,13C27.83,12.92 27.792,12.844 27.727,12.796L24.424,10.318C24.344,10.258 24.236,10.248 24.147,10.293C24.057,10.338 24,10.43 24,10.53L24,12.25L20.283,12.25C20.127,12.25 20,12.377 20,12.533L20,13L27.83,13Z" />
      <path d="M25 2 25 3.5C25 4.05 24.55 4.5 24 4.5 23.45 4.5 23 4.05 23 3.5L23 2C23 1.45 23.45 1 24 1 24.55 1 25 1.45 25 2ZM17 2 17 3.5C17 4.05 16.55 4.5 16 4.5 15.45 4.5 15 4.05 15 3.5L15 2C15 1.45 15.45 1 16 1 16.55 1 17 1.45 17 2ZM9 2 9 3.5C9 4.05 8.55 4.5 8 4.5 7.45 4.5 7 4.05 7 3.5L7 2C7 1.45 7.45 1 8 1 8.55 1 9 1.45 9 2ZM33 2 33 3.5C33 4.05 32.55 4.5 32 4.5 31.45 4.5 31 4.05 31 3.5L31 2C31 1.45 31.45 1 32 1 32.55 1 33 1.45 33 2ZM41 2 41 3.5C41 4.05 40.55 4.5 40 4.5 39.45 4.5 39 4.05 39 3.5L39 2C39 1.45 39.45 1 40 1 40.55 1 41 1.45 41 2Z" />
    </svg>
  ),
  rangeCalendarOg: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 34.5" {...props}>
      <path d="M9 4a1 1 0 0 0 1-1V1a1 1 0 1 0-2 0v2a1 1 0 0 0 1 1ZM16 4a1 1 0 0 0 1-1V1a1 1 0 1 0-2 0v2a1 1 0 0 0 1 1ZM23 4a1 1 0 0 0 1-1V1a1 1 0 1 0-2 0v2a1 1 0 0 0 1 1ZM41.822 24.206l-4.157-2.65c-.21-.133-.524-.016-.524.197v1.613h-4.82c-.177 0-.321.112-.321.252v1.764c0 .14.144.252.321.252h4.82v1.613c0 .213.314.33.524.196l4.157-2.65c.238-.15.238-.435 0-.587Z" />
      <path d="M69.002 2.5H67V3c0 1.103-.897 2-2 2s-2-.897-2-2v-.5h-3V3c0 1.103-.897 2-2 2s-2-.897-2-2v-.5h-3V3c0 1.103-.897 2-2 2s-2-.897-2-2v-.5H25V3c0 1.103-.897 2-2 2s-2-.897-2-2v-.5h-3V3c0 1.103-.897 2-2 2s-2-.897-2-2v-.5h-3V3c0 1.103-.897 2-2 2s-2-.897-2-2v-.5H4.998A4.998 4.998 0 0 0 0 7.498v22.004A4.998 4.998 0 0 0 4.998 34.5h64.004A4.998 4.998 0 0 0 74 29.502V7.498A4.998 4.998 0 0 0 69.002 2.5ZM72 29.499a3.001 3.001 0 0 1-3.001 3.001H5A3.001 3.001 0 0 1 2 29.499V17.504c0-.555.45-1.004 1.003-1.004h67.993c.555 0 1.004.45 1.004 1.004v11.995Z" />
      <path d="M51 4a1 1 0 0 0 1-1V1a1 1 0 1 0-2 0v2a1 1 0 0 0 1 1ZM58 4a1 1 0 0 0 1-1V1a1 1 0 1 0-2 0v2a1 1 0 0 0 1 1ZM65 4a1 1 0 0 0 1-1V1a1 1 0 1 0-2 0v2a1 1 0 0 0 1 1Z" />
    </svg>
  ),
  select: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.682 32" {...props}>
      <path d="M10.222 24H7.556a1 1 0 1 1 0-2h2.666a1 1 0 1 1 0 2ZM4 24a4 4 0 0 1-4-4 1 1 0 1 1 2 0 2 2 0 0 0 2 2 1 1 0 1 1 0 2ZM1 17.444a1 1 0 0 1-1-1v-2.666a1 1 0 0 1 2 0v2.666a1 1 0 0 1-1 1Zm0-6.222a1 1 0 0 1-1-1V7.556a1 1 0 0 1 2 0v2.666a1 1 0 0 1-1 1ZM1 5a1 1 0 0 1-1-1 4 4 0 0 1 4-4 1 1 0 0 1 0 2 2 2 0 0 0-2 2 1 1 0 0 1-1 1ZM16.444 2h-2.666a1 1 0 0 1 0-2h2.666a1 1 0 0 1 0 2Zm-6.222 0H7.556a1 1 0 0 1 0-2h2.666a1 1 0 0 1 0 2ZM23 5a1 1 0 0 1-1-1 2 2 0 0 0-2-2 1 1 0 1 1 0-2 4 4 0 0 1 4 4 1 1 0 0 1-1 1ZM23 17.444a1 1 0 0 1-1-1v-2.666a1 1 0 1 1 2 0v2.666a1 1 0 0 1-1 1Zm0-6.222a1 1 0 0 1-1-1V7.556a1 1 0 1 1 2 0v2.666a1 1 0 0 1-1 1ZM27.354 22.786l-13.43-12.87c-.673-.646-1.792-.169-1.792.764v17.908a1.059 1.059 0 0 0 1.72.827l4.196-3.94 2.795 5.732a1.412 1.412 0 1 0 2.538-1.238l-2.694-5.524 6.01.162c.916-.065 1.32-1.186.657-1.82Z" />
    </svg>
  ),
  slash: ({ ...props }: SvgProps) => (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M16.88 3.549L7.12 20.451"></path>
    </svg>
  ),
  trash: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.5 15.325" {...props}>
      <path d="M12.9,2.6h-3.15V1.5604c0-.8618-.6986-1.5604-1.5604-1.5604h-2.8793c-.8618,0-1.5604,.6986-1.5604,1.5604v1.0396H.6c-.3314,0-.6,.2687-.6,.6s.2686,.6,.6,.6h.7208l.5821,9.8762c.0546,.9259,.8214,1.6489,1.7489,1.6489h6.1965c.9276,0,1.6943-.723,1.7489-1.6489l.5821-9.8762h.7208c.3314,0,.6-.2686,.6-.6s-.2686-.6-.6-.6ZM4.8744,1.5604c0-.2404,.1956-.436,.436-.436h2.8793c.2404,0,.436,.1956,.436,.436v1.0396h-3.7512V1.5604Zm-.4296,11.7604l-.093,.0032c-.2779,.0097-.511-.2077-.5207-.4856l-.2615-7.4885c-.0097-.2779,.2077-.511,.4856-.5207l.093-.0032c.2779-.0097,.511,.2076,.5207,.4855l.2615,7.4885c.0097,.2779-.2077,.511-.4856,.5208Zm2.8552-.4993c0,.2781-.2254,.5035-.5034,.5035h-.0931c-.278,0-.5034-.2254-.5034-.5035V5.3284c0-.278,.2254-.5034,.5034-.5034h.0931c.278,0,.5034,.2254,.5034,.5034v7.4931Zm2.3689,.0169c-.0097,.2779-.2428,.4953-.5207,.4856l-.093-.0032c-.2779-.0097-.4953-.2429-.4856-.5208l.2615-7.4885c.0097-.2779,.2428-.4952,.5207-.4855l.093,.0032c.2779,.0097,.4953,.2428,.4856,.5207l-.2615,7.4885Z" />
    </svg>
  ),
  undo: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.942 26.946" {...props}>
      <path d="M.698 5.42 7.766.242c.939-.687 2.117.163 2.117 1.527v3.176h8.527c5.816 0 10.532 4.715 10.532 10.531v.937c0 5.637-4.433 10.226-10 10.505v.017a.01.01 0 0 1-.01.01H6.442a1.5 1.5 0 0 1-1.5-1.5v-1a1.5 1.5 0 0 1 1.5-1.5H18.41a6.54 6.54 0 0 0 6.532-6.532v-.937a6.54 6.54 0 0 0-6.532-6.531H9.883v3.175c0 1.364-1.178 2.214-2.117 1.527L.698 8.472c-.93-.682-.93-2.37 0-3.053Z" />
    </svg>
  ),
  x_bold: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path d="M20.166 16 31.424 4.743a1.968 1.968 0 0 0 0-2.783L30.04.576a1.968 1.968 0 0 0-2.783 0L16 11.834 4.743.576a1.968 1.968 0 0 0-2.783 0L.576 1.96a1.968 1.968 0 0 0 0 2.783L11.834 16 .576 27.257a1.968 1.968 0 0 0 0 2.783l1.384 1.384a1.968 1.968 0 0 0 2.783 0L16 20.166l11.257 11.258a1.968 1.968 0 0 0 2.783 0l1.384-1.384a1.968 1.968 0 0 0 0-2.783L20.166 16Z" />
    </svg>
  ),
  x: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.003 32.003" {...props}>
      <path d="M19.19 16.001 31.561 3.63a1.504 1.504 0 0 0 0-2.128l-1.06-1.06a1.504 1.504 0 0 0-2.128 0L16.001 12.813 3.631.443a1.508 1.508 0 0 0-2.132 0L.443 1.499a1.507 1.507 0 0 0 0 2.132l12.37 12.37L.441 28.374a1.504 1.504 0 0 0 0 2.127l1.06 1.061c.588.588 1.54.588 2.128 0L16 19.19l12.37 12.37a1.508 1.508 0 0 0 2.133 0l1.056-1.055a1.508 1.508 0 0 0 0-2.132l-12.37-12.37Z" />
    </svg>
  ),
};
