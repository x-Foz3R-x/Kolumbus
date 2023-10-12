// id\s*=\s*"[^"]*"
// class\s*=\s*"[^"]*"
// < g[^>]*>
// < /g[^>]*>

import { SvgProps } from "@/types";

// name: ({ ...props }: SvgProps) => (),

const Icon = {
  defaultTrip: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
      <path d="M10.5,2L8,0V14l2.5-2h3.5V2h-3.5Zm1.5,8h-1.5V4h1.5v6ZM4,2.6667V11.3333l-2-.5833V3.25l2-.5833M6,0L0,1.75V12.25l6,1.75V0h0Z" />
    </svg>
  ),
  x: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <g id="X">
        <rect
          x="-4.8958"
          y="12.735"
          width="41.7917"
          height="6.53"
          rx="2.6177"
          ry="2.6177"
          transform="translate(-6.6274 16) rotate(-45)"
        />
        <rect
          x="-4.8958"
          y="12.735"
          width="41.7917"
          height="6.53"
          rx="2.6177"
          ry="2.6177"
          transform="translate(16 38.6274) rotate(-135)"
        />
      </g>
    </svg>
  ),
  pin: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.2142 16" {...props}>
      <path d="M4.4935,12.7604c.3417,.3163,.8936,.3195,1.2417,.0094,1.3652-1.215,4.4791-4.3862,4.4791-8.0405-.0016-2.6109-2.2877-4.7292-5.1079-4.7292S0,2.1183,0,4.7292c0,3.508,3.1363,6.7799,4.4935,8.0311Zm.6129-9.6931c.9128,0,1.654,.7271,1.654,1.6226s-.7411,1.6226-1.654,1.6226-1.654-.7271-1.654-1.6226,.7411-1.6226,1.654-1.6226Z" />
      <ellipse cx="5.1071" cy="15.125" rx="3.5" ry=".875" />
    </svg>
  ),
  forkKnife: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 32" {...props}>
      <path d="m8.7719,1v8c0,.5523-.4477,1-1,1h0c-.5523,0-1-.4477-1-1V1C6.7719.4477,6.3242,0,5.7719,0h0C5.2196,0,4.7719.4477,4.7719,1v8c0,.5523-.4477,1-1,1h0c-.5523,0-1-.4477-1-1V1C2.7719.4477,2.3242,0,1.7719,0h-.074C1.1754,0,.741.4023.7009.9233L.0192,9.7857c-.1544,2.0069.6299,3.972,2.1236,5.3212l.0387.0349c1.319,1.1914,2.0196,2.9212,1.9014,4.6947l-.6446,9.6691c-.09,1.35.9807,2.4945,2.3337,2.4945h0c1.353,0,2.4237-1.1445,2.3337-2.4945l-.6664-9.9957c-.1122-1.683.6061-3.3144,1.9232-4.368h0c1.5172-1.2137,2.3359-3.0992,2.1868-5.0364l-.7063-9.1821C10.8029.4023,10.3684,0,9.8459,0h-.074c-.5523,0-1,.4477-1,1Z" />
      <path d="m24.2388.1334l-1.5863,1.4421c-2.0712,1.8829-3.4335,4.4197-3.8591,7.1863l-1.0828,7.0383c-.1664,1.0814.5477,2.1023,1.6206,2.3169h0c1.7956.3591,3.0157,2.0352,2.8058,3.8542l-.8529,7.392c-.1621,1.4047.9361,2.6369,2.3502,2.6369h0c1.3355,0,2.4063-1.1048,2.3646-2.4396L25.0905.4943c-.0136-.4345-.5301-.6534-.8517-.361Z" />
    </svg>
  ),
  bed: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 21" {...props}>
      <g id="Layer_7">
        <path d="m14,6.4914v5.5069c0,.5532-.4485,1.0017-1.0017,1.0017H4.5021c-.5534,0-1.0021-.4486-1.0021-1.0021V1.2494c0-.69-.5594-1.2494-1.2494-1.2494h-1.0011C.5594,0,0,.5594,0,1.2494v18.5054c0,.6877.5575,1.2451,1.2451,1.2451h1.0098c.6877,0,1.2451-.5575,1.2451-1.2451v-1.2528c0-.5534.4486-1.0021,1.0021-1.0021h22.9959c.5534,0,1.0021.4486,1.0021,1.0021v1.2528c0,.6877.5575,1.2451,1.2451,1.2451h1.0098c.6877,0,1.2451-.5575,1.2451-1.2451v-8.7566c0-3.865-3.1332-6.9983-6.9983-6.9983h-8.5103c-1.376,0-2.4914,1.1155-2.4914,2.4914Z" />
        <circle cx="8.75" cy="8" r="3.5" />
      </g>
    </svg>
  ),
  carPlane: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 23" {...props}>
      <g id="car-plane">
        <path d="m30.6257,13.1788l-1.329-3.6916c-.4292-1.1923-1.5602-1.9872-2.8274-1.9872h-6.9387c-1.2672,0-2.3982.7949-2.8274,1.9872l-1.3289,3.6916c-.8077.343-1.3743,1.1433-1.3743,2.0762v6.743c0,.5534.4487,1.0021,1.0021,1.0021h1.4958c.5534,0,1.0021-.4487,1.0021-1.0021v-1.5023c0-.2737.2219-.4956.4956-.4956h10.0088c.2737,0,.4956.2219.4956.4956v1.5023c0,.5534.4487,1.0021,1.0021,1.0021h1.4958c.5534,0,1.0021-.4487,1.0021-1.0021v-6.743c0-.9329-.5665-1.7332-1.3743-2.0762Zm-12.6761-.511l.8707-2.4185c.1078-.2996.392-.4993.7104-.4993h6.9387c.3184,0,.6025.1997.7104.4993l.8707,2.4185c.0582.1617-.0616.3322-.2335.3322h-9.6339c-.1718,0-.2916-.1705-.2335-.3322Zm.0504,4.9572c-.6213,0-1.125-.5037-1.125-1.125s.5037-1.125,1.125-1.125,1.125.5037,1.125,1.125-.5037,1.125-1.125,1.125Zm10,0c-.6213,0-1.125-.5037-1.125-1.125s.5037-1.125,1.125-1.125,1.125.5037,1.125,1.125-.5037,1.125-1.125,1.125Z" />
        <path d="m12,21.9979v-6.743c0-1.3763.6586-2.6404,1.7361-3.4304l.8456-2.3489-1.8172-1.0463V3.8534c.2194-2.2509-1.2703-3.8534-2.4084-3.8534s-2.6279,1.6025-2.4084,3.8534v4.576L.7238,12.5886c-.4478.2578-.7238.7352-.7238,1.2518v2.1477c0,.3171.3016.5475.6076.4641l7.3401-2.0018v3.6293c0,.142-.063.2767-.1721.3676l-2.3702,1.9752c-.2203.1836-.3478.4556-.3478.7424v1.3569c0,.3068.2849.5341.584.4662l4.501-1.023c.1406-.0319.2865-.0319.4271,0l1.4606.332c-.0101-.0998-.0302-.1966-.0302-.299Z" />
      </g>
    </svg>
  ),
  signOut: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30.4509" {...props}>
      <g id="signOut">
        <path d="m9.3632.1043L1.3698,2.7688c-.818.2726-1.3698,1.0381-1.3698,1.9004v21.1123c0,.8623.5518,1.6278,1.3698,1.9005l7.9933,2.6646c1.2972.4324,2.6368-.5331,2.6368-1.9005V2.0049c0-1.3674-1.3396-2.3329-2.6368-1.9005Zm-.8632,17.1211c-1.1046,0-2-.8955-2-2s.8954-2,2-2,2,.8954,2,2-.8954,2-2,2Z" />
        <path d="m18.9938,1.2254h-4.4971c-.2743,0-.4967.2224-.4967.4967v1.0067c0,.2743.2224.4967.4967.4967h4.4971c.5557,0,1.0062.4505,1.0062,1.0062v4.4948c0,.2756.2234.499.499.499h1.002c.2756,0,.499-.2234.499-.499v-4.4948c0-1.6603-1.3459-3.0062-3.0062-3.0062Z" />
        <path d="m20,23.2254v2.9937c0,.5558-.4506,1.0063-1.0063,1.0063h-4.4946c-.2756,0-.499.2234-.499.499v1.002c0,.2756.2234.499.499.499h4.4948c1.6603,0,3.0062-1.3459,3.0062-3.0062v-4.4948c0-.2756-.2234-.499-.499-.499h-1.002c-.2756,0-.499.2234-.499.499v1.501Z" />
        <path d="m31.7148,14.6263l-6.6502-5.4033c-.3361-.273-.8385-.0339-.8385.3991v3.2897h-7.7119c-.284,0-.5142.2302-.5142.5142v3.5987c0,.284.2302.5142.5142.5142h7.7119v3.2897c0,.433.5024.6722.8385.3991l6.6502-5.4033c.3803-.309.3803-.8894,0-1.1984Z" />
      </g>
    </svg>
  ),

  //#region alert
  exclamationTriangle: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 28.3316" {...props}>
      <g id="exclamation-triangle">
        <path d="m16,2.5c.6242,0,1.2485.302,1.6052.9059l5.8199,9.8539,5.8199,9.8539c.7134,1.2079-.1784,2.7178-1.6052,2.7178H4.3602c-1.4268,0-2.3186-1.5099-1.6052-2.7178l5.8199-9.8539L14.3948,3.4059c.3567-.604.981-.9059,1.6052-.9059m0-2.5c-1.5636,0-2.9684.798-3.7578,2.1346l-5.8199,9.8539L.6024,21.8424c-.7916,1.3403-.8037,2.9474-.0323,4.2989.7711,1.351,2.2234,2.1903,3.7901,2.1903h23.2796c1.5667,0,3.019-.8393,3.7901-2.1903.7714-1.3515.7593-2.9586-.0323-4.2989l-5.8199-9.8539-5.8199-9.8539c-.7894-1.3366-2.1942-2.1346-3.7578-2.1346h0Z" />
        <rect
          x="12"
          y="12.9158"
          width="8"
          height="2.5"
          rx=".9838"
          ry=".9838"
          transform="translate(1.8342 30.1658) rotate(-90)"
        />
        <rect
          x="14.75"
          y="20.9158"
          width="2.5"
          height="2.5"
          rx=".9973"
          ry=".9973"
          transform="translate(-6.1658 38.1658) rotate(-90)"
        />
      </g>
    </svg>
  ),
  //#endregion

  //#region arrows
  arrowRight: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24.4742" {...props}>
      <path d="m31.4296,11.0387L18.1293.2322c-.6721-.5461-1.677-.0678-1.677.7982v6.5795H1.0285c-.568,0-1.0285.4605-1.0285,1.0285v7.1975c0,.568.4605,1.0285,1.0285,1.0285h15.4238v6.5795c0,.866,1.0049,1.3443,1.677.7982l13.3004-10.8065c.7605-.6179.7605-1.7788,0-2.3967Z" />
    </svg>
  ),
  arrowTopRight: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path d="m29.5008,0H7.5049c-.8312,0-1.5049.6738-1.5049,1.5049v.9901c0,.8312.6738,1.505,1.5049,1.505h17.313L.4407,28.3773c-.5876.5876-.5876,1.5403,0,2.1279l1.054,1.0541c.5876.5876,1.5403.5876,2.1279,0L28,7.182v17.313c0,.8312.6738,1.505,1.5049,1.505h.9901c.8312,0,1.5049-.6738,1.5049-1.505V2.4992c0-1.3803-1.119-2.4992-2.4992-2.4992Z" />
    </svg>
  ),
  chevronLight: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 17.4402" {...props}>
      <path
        id="light"
        d="m31.6328,1.0691l-.7018-.7018c-.4896-.4896-1.2835-.4896-1.7731,0l-13.1579,13.1579L2.8421.3672C2.3525-.1224,1.5587-.1224,1.069.3672l-.7018.7018c-.4896.4896-.4896,1.2834,0,1.773,4.6222,4.6222,9.2444,9.2444,13.8666,13.8666.9754.9755,2.557.9755,3.5324,0,4.6222-4.6222,9.2444-9.2444,13.8666-13.8666.4896-.4896.4896-1.2834,0-1.773Z"
      />
    </svg>
  ),
  chevron: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 17.857" {...props}>
      <path
        id="regular"
        d="m31.5301,1.3833l-.9135-.9135c-.6264-.6264-1.6421-.6264-2.2685,0l-12.3482,12.3483L3.6518.4698c-.6264-.6264-1.6421-.6264-2.2685,0l-.9135.9135c-.6264.6264-.6264,1.6421,0,2.2686l13.2683,13.2683c1.2492,1.2492,3.2746,1.2492,4.5238,0L31.5301,3.6518c.6264-.6264.6264-1.6421,0-2.2686Z"
      />
    </svg>
  ),
  chevronBold: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.3009 18.9047" {...props}>
      <path
        id="bold"
        d="m31.6406,5.2777c.8804-.8804.8804-2.3078,0-3.1882l-1.4292-1.4292c-.8804-.8804-2.3078-.8804-3.1882,0l-10.8728,10.8728L5.2777.6603c-.8804-.8804-2.3078-.8804-3.1882,0l-1.4292,1.4292c-.8804.8804-.8804,2.3078,0,3.1882l12.3096,12.3096c1.7566,1.7566,4.6046,1.7566,6.3612,0l12.3096-12.3096Z"
      />
    </svg>
  ),
  //#endregion

  //#region brands
  google: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
      <path
        d="M19.9996 10.2297C19.9996 9.54995 19.9434 8.8665 19.8234 8.19775H10.2002V12.0486H15.711C15.4823 13.2905 14.7475 14.3892 13.6716 15.0873V17.586H16.9593C18.89 15.8443 19.9996 13.2722 19.9996 10.2297Z"
        fill="#4285F4"
      ></path>
      <path
        d="M10.2002 20.0003C12.9518 20.0003 15.2723 19.1147 16.963 17.5862L13.6753 15.0875C12.7606 15.6975 11.5797 16.0429 10.2039 16.0429C7.54224 16.0429 5.28544 14.2828 4.4757 11.9165H1.08301V14.4923C2.81497 17.8691 6.34261 20.0003 10.2002 20.0003Z"
        fill="#34A853"
      ></path>
      <path
        d="M4.47227 11.9163C4.04491 10.6743 4.04491 9.32947 4.47227 8.0875V5.51172H1.08333C-0.363715 8.33737 -0.363715 11.6664 1.08333 14.4921L4.47227 11.9163Z"
        fill="#FBBC04"
      ></path>
      <path
        d="M10.2002 3.95756C11.6547 3.93552 13.0605 4.47198 14.1139 5.45674L17.0268 2.60169C15.1824 0.904099 12.7344 -0.0292099 10.2002 0.000185607C6.34261 0.000185607 2.81497 2.13136 1.08301 5.51185L4.47195 8.08764C5.27795 5.71762 7.53849 3.95756 10.2002 3.95756Z"
        fill="#EA4335"
      ></path>
    </svg>
  ),
  //#endregion

  //#region editing
  check: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 21.9586" {...props}>
      <g id="check">
        <path d="m31.4796,1.3547l-.8344-.8343c-.6938-.6939-1.8189-.6939-2.5128,0l-15.4793,15.4793L3.8671,7.2136c-.6932-.6933-1.8173-.6933-2.5106,0l-.8365.8365c-.6932.6933-.6932,1.8173,0,2.5107l10.8779,10.8779c.6933.6933,1.8173.6933,2.5107,0l.0011-.0011h0L31.4796,3.8676c.6939-.6939.6939-1.8189,0-2.5128Z" />
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
  pinPen: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.2286 16" {...props}>
      <path d="M4.6836,12.4844L11.8039,3.035c-1.067-1.8078-3.1381-3.035-5.5192-3.035C2.8135,0,0,2.6072,0,5.8206c0,3.3355,2.3015,6.4922,4.1198,8.4681l.5638-1.8044ZM6.2847,3.7751c1.1235,0,2.0356,.8949,2.0356,1.997s-.9122,1.9971-2.0356,1.9971-2.0357-.8949-2.0357-1.9971,.9122-1.997,2.0357-1.997Zm7.2965,.2249l1.6474,1.2415-7.0937,9.4137-1.9689,1.2945c-.0994,.0655-.2184,.0673-.3015,.0047-.0831-.0627-.1142-.1775-.0787-.2911l.7033-2.2516L13.5812,4Z" />
    </svg>
  ),
  plus: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <g id="plus">
        <path d="m29.9956,13.5h-11.4957V2.0043c0-1.1069-.8973-2.0043-2.0043-2.0043h-.9913c-1.1069,0-2.0043.8974-2.0044,2.0043v11.4956H2.0043c-1.1069,0-2.0043.8975-2.0043,2.0044v.9913c0,1.107.8974,2.0044,2.0043,2.0043h11.4956v11.4957c0,1.107.8975,2.0043,2.0045,2.0043h.9912c1.107,0,2.0044-.8973,2.0044-2.0043v-11.4956h11.4956c1.107,0,2.0044-.8974,2.0044-2.0044v-.9913c0-1.107-.8974-2.0043-2.0044-2.0043Z" />
      </g>
    </svg>
  ),
  calendar: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" {...props}>
      <path d="M30.5,3h-3V1.5c0-.8284,.6716-1.5,1.5-1.5s1.5,.6716,1.5,1.5v1.5ZM8.5,1.5c0-.8284-.6716-1.5-1.5-1.5s-1.5,.6716-1.5,1.5v1.5h3V1.5Zm27.5,31.5007c0,1.6564-1.3428,2.9993-2.9993,2.9993H2.9993c-1.6564,0-2.9993-1.3428-2.9993-2.9993V6c0-1.6569,1.3431-3,3-3h2.5v.5c0,.8284,.6716,1.5,1.5,1.5s1.5-.6716,1.5-1.5v-.5H27.5v.5c0,.8284,.6716,1.5,1.5,1.5s1.5-.6716,1.5-1.5v-.5h2.5c1.6569,0,3,1.3431,3,3v27.0007Zm-2.5-14.5015c0-.2753-.224-.4993-.4993-.4993H2.9993c-.2753,0-.4993,.2239-.4993,.4993v14.5015c0,.2753,.224,.4993,.4993,.4993h30.0015c.2753,0,.4993-.224,.4993-.4993v-14.5015Z" />
    </svg>
  ),
  rangeCalendar: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 36" {...props}>
      <path d="M8.5,3h-3V1.5c0-.8284,.6716-1.5,1.5-1.5s1.5,.6716,1.5,1.5v1.5ZM30.5,1.5c0-.8284-.6716-1.5-1.5-1.5s-1.5,.6716-1.5,1.5v1.5h3V1.5Zm23,0c0-.8284-.6716-1.5-1.5-1.5s-1.5,.6716-1.5,1.5v1.5h3V1.5Zm22,0c0-.8284-.6716-1.5-1.5-1.5s-1.5,.6716-1.5,1.5v1.5h3V1.5Zm-29.6382,23.2764l-4.191-2.0955c-.1663-.0831-.3618,.0377-.3618,.2236v1.3455h-5.8212c-.2701,0-.4888,.3297-.4879,.7353,.001,.4028,.2183,.7288,.4865,.73l5.8226,.0252v1.355c0,.1859,.1956,.3068,.3618,.2236l4.191-2.0955c.1843-.0921,.1843-.355,0-.4472ZM81,6v27.0007c0,1.6564-1.3428,2.9993-2.9993,2.9993H2.9993c-1.6564,0-2.9993-1.3428-2.9993-2.9993V6c0-1.6569,1.3431-3,3-3h2.5v.5c0,.8284,.6716,1.5,1.5,1.5s1.5-.6716,1.5-1.5v-.5H27.5v.5c0,.8284,.6716,1.5,1.5,1.5s1.5-.6716,1.5-1.5v-.5h20v.5c0,.8284,.6716,1.5,1.5,1.5s1.5-.6716,1.5-1.5v-.5h19v.5c0,.8284,.6716,1.5,1.5,1.5s1.5-.6716,1.5-1.5v-.5h2.5c1.6569,0,3,1.3431,3,3Zm-2.5,12.4993c0-.2753-.224-.4993-.4993-.4993H2.9993c-.2753,0-.4993,.2239-.4993,.4993v14.5015c0,.2753,.224,.4993,.4993,.4993H78.0007c.2753,0,.4993-.224,.4993-.4993v-14.5015Z" />
    </svg>
  ),
  //#endregion

  //#region Pages
  explore: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 400,400" {...props}>
      <path d="M175.000 1.185 C 11.855 21.387,-58.386 221.341,56.207 339.352 C 162.324 448.634,347.623 403.882,391.747 258.315 C 433.723 119.831,318.710 -16.610,175.000 1.185 M318.543 81.836 C 318.379 82.158,301.413 118.651,280.842 162.931 L 243.439 243.439 162.931 280.842 C 118.651 301.413,82.104 318.412,81.715 318.618 C 81.327 318.823,81.177 318.673,81.382 318.285 C 81.588 317.896,98.587 281.349,119.159 237.068 L 156.562 156.558 237.461 118.912 C 322.940 79.134,319.003 80.935,318.543 81.836 M195.581 178.149 C 169.526 183.371,173.406 222.122,199.982 222.101 C 212.742 222.090,222.111 212.736,222.101 200.018 C 222.089 185.767,209.475 175.365,195.581 178.149 "></path>
    </svg>
  ),
  library: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
      <path d="M10,2.6667l2,.5833V12h-2V2.6667M8,0V14h6V1.75L8,0h0Z" />
      <polygon points="2 14 0 14 0 1 2 0 2 14" />
      <polygon points="6 14 4 14 4 1 6 0 6 14" />
    </svg>
  ),
  market: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" {...props}>
      <path d="M14,11h-2V2h2V11Z" />
      <path d="M4,2.7749v6.2251H2V3.4415l2-.6667M6,0L0,2V11H6V0h0Z" />
      <path d="M10,11V2c-.6667-.6667-1.3333-1.3334-2-2V11h2Z" />
      <rect y="12" width="14" height="2" />
    </svg>
  ),
  showcase: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path d="M0,16l1-3H15l1,3H0Z" />
      <path d="M8,1c3.8598,0,7,3.1402,7,7,0,1.0356-.2343,2.0621-.6815,3H1.6815c-.4472-.9379-.6815-1.9644-.6815-3C1,4.1402,4.1402,1,8,1m0-1C3.5817,0,0,3.5817,0,8c0,1.4589,.3968,2.8224,1.079,4H14.921c.6822-1.1776,1.079-2.5411,1.079-4C16,3.5817,12.4183,0,8,0h0Z" />
      <path d="M5.3215,1.1953c-.4004,.0084-1.5238,.1015-2.6207,1.1589-1.1376,1.0965-1.5455,2.554-1.6668,3.053,.0412,.1467,.1134,.3634,.2392,.595,.0002,.0002,.1214,.2235,.2791,.4098,.5156,.6093,1.9985,.3748,2.3662,1.1748,.2706,.5887-.219,1.3825,.185,1.9468,.1137,.1587,.1514,.0895,.289,.2512,.5179,.6081,.1126,1.4824,.5163,1.8563,.2069,.1917,.5376,.1392,.7264-.031,.328-.2957,.158-.5763,.4614-1.0453,.3373-.5212,.7417-.2278,1.0779-.6602,.4434-.5703,.441-1.983-.0414-2.5392-.4136-.4768-.9332,.0848-2.0828-.357-.0226-.0086-.3737-.1478-.7574-.5038-.244-.2264-.5002-.4705-.4883-.78,.0067-.1773,.1011-.3639,.2292-.4613,.4583-.3481,1.1117,.6397,1.5248,.2762,.1058-.0932,.1847-.2582,.1993-.423,.0482-.5437-.6315-.7639-.6481-1.3223-.0152-.5124,.5504-.6662,.6353-1.2993,.0677-.505-.204-.9888-.4236-1.2993v-.0002Z" />
      <path d="M10.5482,1.2659l-.7765,.5882c-.1217,.197-.0973,.4178,.0235,.5176,.0835,.069,.1927,.0634,.2353,.0588l.7647-.5294c.0953-.0761,.2351-.058,.3059,.0353,.0672,.0886,.0532,.2196-.0353,.2941-.2212,.307-.4485,.4472-.6235,.5176-.2373,.0956-.4651,.098-.6353,.3059-.0734,.0896-.0451,.1064-.1412,.2588-.1812,.2875-.3228,.2929-.4235,.4706-.1314,.2317-.1252,.6362,.1176,.8235,.1764,.1361,.4664,.1489,.6353,.0235,.1943-.1443,.1656-.4251,.3647-.4824,.076-.0219,.1436,.0008,.1765,.0118,.2821,.0944,.252,.4767,.4941,.5412,.085,.0227,.1927,.0032,.2471-.0588,.105-.1199-.0775-.2983,0-.4706,.1061-.2358,.5444-.1156,.6941-.3882,.0772-.1405-.0074-.2302,.0941-.3529,.1006-.1216,.2702-.138,.4235-.1529,.097-.0094,.2602-.0128,.4588,.0471,.0189,.0079,.1463,.0631,.1765,.1882,.0254,.1055-.03,.212-.0941,.2706-.1697,.1551-.3856-.0379-.7059,.0941-.0261,.0108-.311,.1321-.3176,.3294-.0003,.0087-.0021,.1095,.0706,.1765,.1115,.1026,.2537-.0072,.4471,.0588,.1484,.0507,.309,.1988,.3059,.3412-.0034,.1556-.1998,.1985-.2471,.4235-.0197,.0938-.0048,.1776,.0118,.2353,.0646,.1162,.313,.53,.8,.6588,.1414,.0374,.2709,.0423,.3765,.0353l1.0588-.1059-1.0353-2.8706-2.2235-1.6941-1.0235-.2Z" />
      <path d="M8.6953,3.4541c.1636,.0971,.4483-.0527,.5824-.2382,.2254-.312,.0278-.7294,.0176-.75-.0195-.1402-.1501-.2279-.2647-.2029-.0921,.0201-.1652,.111-.1676,.2206,.1186,.2315,.106,.3668,.0618,.45-.0879,.1652-.3207,.1629-.3441,.3088-.0133,.0832,.0483,.1724,.1147,.2118Z" />
      <path d="M8.607,6.5159c.0563-.2777,.1929-.4597,.2735-.5647,.349-.4544,.8414-.5931,1.0324-.6441,.1861-.0497,.4932-.1316,.8559-.0441,.3821,.0922,.686,.3519,.8029,.45,.2111,.177,.2441,.2649,.4302,.343,.254,.1066,.3272-.0006,.5647,.0997,.2669,.1126,.2412,.2762,.5448,.4252,.2565,.1259,.3635,.0527,.4185,.1462,.0994,.1687-.219,.4591-.7574,1.2822-.1767,.2702-.2651,.4053-.3122,.5248-.23,.5828,.0238,.8355-.1329,1.3021-.1895,.5643-.8397,1.025-1.2357,.8902-.2141-.0729-.3137-.3062-.3787-.4584-.2398-.5617,.0787-.8962-.1262-1.6277-.0662-.2363-.1051-.3679-.2325-.4584-.2602-.1849-.552,.0413-.9367-.1594-.1055-.055-.1833-.1297-.3388-.279-.1836-.1763-.2973-.2854-.3835-.4599-.1552-.3143-.1163-.629-.0882-.7676Z" />
      <path d="M5.86,1.0012c-.0065,.1017,.6325,.1238,.7059,.4412,.0657,.2843-.3877,.5218-.2875,.8267,.0397,.121,.1569,.223,.2699,.2321,.1375,.0111,.24-.1176,.3347-.2122,.3631-.3627,.6146-.2266,1.0771-.5643,.1435-.1048,.5888-.4297,.5294-.6529-.1305-.4909-2.6164-.2734-2.6294-.0706Z" />
    </svg>
  ),
  itinerary: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path d="M4,2.7749V13.2251l-.3675-.1225-1.6325-.5442V3.4415l1.6325-.5442,.3675-.1225M6,0C4,.6667,2,1.3333,0,2V14l6,2V0h0Z" />
      <path d="M11,14l-3,2V0l3,2V14Z" />
      <path d="M16,14h-3v-5h3v5Z" />
      <path d="M16,7h-3V2h3V7Z" />
    </svg>
  ),
  structure: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path d="M4,2.7751V13.2254l-.3675-.1225-1.6325-.5442V3.4417l1.6325-.5442,.3675-.1225M6,.0002C4,.6669,2,1.3335,0,2.0002V14.0002l6,2V.0002h0Z" />
      <path d="M11,14.0002l-3,2V8.0002h3v6Z" />
      <path d="M15,14.0002h-2V3.0002h2V14.0002Z" />
      <path d="M16,4.0002H7l2-2h7v2Z" />
      <path d="M10,6.0002h-1V3.0002h1v3Z" />
      <path d="M15,2.0002h-2l.375-1L13.75,.0002h.5l.375,1,.375,1Z" />
      <path d="M10.0328,2.4929l-.1504-.2605L13.7492,0l.1504,.2605-3.8668,2.2325Z" />
    </svg>
  ),
  map: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16" {...props}>
      <path d="M0,2v14l5-2V0L0,2Z" />
      <path d="M10,2v14l5-2V0l-5,2Z" />
      <path d="M5,14c1.6667,.6666,3.3333,1.3333,5,2v-1c-1.6667-.6667-3.3333-1.3334-5-2v1Z" />
      <path d="M5,0V1c1.6667,.6666,3.3333,1.3333,5,2v-1c-1.6667-.6667-3.3333-1.3334-5-2Z" />
    </svg>
  ),
  costs: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.9854 15.7876" {...props}>
      <path d="M5.9678,10.8823c0-.4707-.1494-.8594-.4482-1.166-.2988-.3076-.7969-.584-1.4941-.8301-.6973-.2466-1.2393-.4746-1.627-.6851-1.2891-.6919-1.9336-1.7153-1.9336-3.0713,0-.9185,.2793-1.6738,.8379-2.2661,.5596-.5923,1.3174-.9434,2.2744-1.0542V0h1.3281V1.8262c.9629,.1382,1.707,.5464,2.2334,1.2241,.5254,.6782,.7881,1.5596,.7881,2.644h-2.0088c0-.6973-.1562-1.2466-.4688-1.6479-.3125-.4009-.7373-.6016-1.2744-.6016-.5312,0-.9463,.144-1.2451,.4316s-.4482,.7002-.4482,1.2368c0,.4814,.1484,.8677,.4443,1.1577,.2959,.291,.7979,.5659,1.5068,.8262,.708,.2603,1.2646,.501,1.668,.7222,.4043,.2212,.7441,.4746,1.0215,.7593,.2764,.2852,.4893,.6133,.6387,.9834,.1494,.3711,.2246,.8057,.2246,1.3037,0,.9346-.2861,1.6934-.8594,2.2744-.5723,.5811-1.3711,.9238-2.3945,1.0293v1.6182h-1.3203v-1.6104c-1.0957-.1211-1.9375-.5146-2.5273-1.1787-.5889-.6641-.8838-1.5439-.8838-2.6396H2.0166c0,.6973,.1758,1.2373,.5273,1.6191s.8477,.5723,1.4902,.5723c.6309,0,1.1104-.1523,1.4404-.4561,.3291-.3047,.4932-.709,.4932-1.2119Z" />
    </svg>
  ),
  packingList: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path d="M0,7v6c0,1.6569,1.1193,3,2.5,3h0V4h0c-1.3807,0-2.5,1.3431-2.5,3Z" />
      <path d="M11.9996,4c-.0023-2.2095-1.7937-4-4.0037-4-2.2068,0-3.9958,1.789-3.9958,3.9958v12.0042H12V4h-.0004Zm-6.4996-.0042c0-1.3762,1.1196-2.4958,2.4958-2.4958,1.3794,0,2.5014,1.1211,2.5037,2.5H5.5v-.0042Z" />
      <path d="M16,7v6c0,1.6569-1.1193,3-2.5,3h0V4h0c1.3807,0,2.5,1.3431,2.5,3Z" />
    </svg>
  ),
  //#endregion

  //#region user
  userSettings: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 13.5" {...props}>
      <path d="m7.167,12.9965c-.4688.0011-.9376.0021-1.4065.0032v.0002c-.0172,0-.0343,0-.0515-.0002-.0172.0001-.0343.0001-.0515.0002v-.0002c-1.5386-.0035-3.0773-.0071-4.616-.0107-.1132-.0229-.4151-.0997-.6741-.3697-.2259-.2354-.3004-.4938-.3262-.6088-.0339-.3107-.0612-.7535-.0218-1.283.0346-.4636.0588-.787.2067-1.1852.2637-.7104.7273-1.1365.9025-1.2939.1659-.149.6324-.539,1.3483-.7502.29-.0855.5229-.1128,1.3047-.1413.4896-.0178,1.1431-.0341,1.9196-.0325h0c.0029-.0001.0051,0,.008,0s.005,0,.0079,0h0c.1071,0,.2058.0008.308.0012.0378.343.1819.6747.4474.9231l.5114.48c-.0059.0905-.0092.181-.0092.2728s.0033.1823.0092.2727l-.512.48c-.4472.4209-.5927,1.074-.3619,1.6247.2032.4865.4714.9481.7973,1.3716.0741.0966.1658.1734.2598.2462ZM5.709,0h0c-1.5966,0-2.891,1.2943-2.891,2.891v.2409c0,1.5966,1.2943,2.891,2.891,2.891h0c1.5966,0,2.891-1.2943,2.891-2.891v-.2409c0-1.5966-1.2943-2.891-2.891-2.891Zm10.1084,10.1228c.1658.1557.2314.3993.1434.609-.1506.3591-.3469.6939-.581.9986-.1382.1798-.3804.2445-.6649.1585l-.8121-.2454c-.2564.2035-.5428.3697-.852.4923l-.2098.8953c-.0547.2334-.2505.4058-.4884.4352-.1783.022-.3597.0336-.544.0336s-.3658-.0116-.5441-.0336c-.2379-.0294-.4337-.2017-.4883-.4351-.0873-.3727-.2098-.8953-.2098-.8953-.3092-.1226-.5956-.2888-.852-.4923l-.8794.2657c-.217.0656-.4595.0009-.5976-.1789-.2341-.3046-.4304-.6395-.581-.9986-.088-.2098-.0224-.4534.1434-.609l.6734-.6321c-.0234-.1606-.0397-.3236-.0397-.4907s.0162-.3301.0397-.4907l-.6734-.6321c-.1658-.1557-.2314-.3993-.1434-.609.1506-.3591.3469-.694.581-.9986.1382-.1798.3804-.2444.6649-.1585l.8121.2454c.2564-.2035.5428-.3697.852-.4923l.21-.8962c.0539-.2301.2476-.4047.4822-.4339.2052-.0255.3906-.0341.5501-.0341.2047,0,.3935.0141.5637.0357.2309.0294.4152.2044.4844.4999l.1941.8284c.3092.1226.5956.2888.852.4923l.8794-.2657c.217-.0656.4595-.0009.5976.1788.2341.3047.4304.6395.581.9986.088.2098.0224.4534-.1434.609l-.6734.6321c.0234.1606.0397.3236.0397.4907s-.0162.3301-.0397.4907l.6734.6321Zm-2.6025-1.1228c0-.7767-.6296-1.4062-1.4062-1.4062s-1.4062.6296-1.4062,1.4062.6296,1.4062,1.4062,1.4062,1.4062-.6296,1.4062-1.4062Z" />
    </svg>
  ),
  user: ({ ...props }: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" {...props}>
      <path d="M24,11.5v.5c0,3.3137-2.6863,6-6,6h0c-3.3137,0-6-2.6863-6-6v-.5c0-3.3137,2.6863-6,6-6h0c3.3137,0,6,2.6863,6,6Zm12,6.4999h0c0,9.9412-8.0589,18.0001-18,18.0001S0,27.9411,0,18H0C0,8.0588,8.0589,0,18,0s18,8.0588,18,17.9999Zm-2.0571,0c0-8.791-7.1519-15.9429-15.9429-15.9429S2.0571,9.209,2.0571,17.9999c0,3.2397,.9771,6.2531,2.6438,8.7717,.8987-1.0248,2.209-2.2765,4.0162-3.3588,3.7684-2.2568,7.4761-2.4474,9.2829-2.4128,1.6603-.0388,4.9311,.1163,8.4269,1.9476,2.3188,1.2147,3.905,2.7311,4.8723,3.8237,1.6667-2.5186,2.6436-5.5317,2.6436-8.7713Z" />
    </svg>
  ),
  //#endregion

  // #region kolumbus
  logo: ({ ...props }: SvgProps) => (
    <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1799.2988 399.0643" {...props}>
      <g id="FULL_LOGO">
        <g id="PARTS">
          <path
            style={{ fill: "#1973cc" }}
            d="m379.9221,299.9709c-2.4557,1.1588-4.7095,1.3704-7.9529,1.6471-.7678.0655-1.8784.1443-3.2305.1818-2.436,7.8817-5.5951,16.5579-9.7272,25.7366-5.4407,12.0854-11.3856,22.4146-17.0187,30.9874-19.421,6.4003-50.3922,13.5276-85.9927,13.7256-35.6005-.198-66.5718-7.3253-85.9927-13.7256-5.6331-8.5728-11.578-18.902-17.0187-30.9874-4.1321-9.1788-7.2912-17.8549-9.7272-25.7366-1.3521-.0375-2.4626-.1163-3.2305-.1818-3.2435-.2767-5.4972-.4883-7.9529-1.6471-.825-.3892-1.4561-.7831-1.8353-1.0353,1.7726,12.7098,3.5451,25.4196,5.3177,38.1293,1.6923,9.66,6.2747,26.5213,20.1528,40.4117,22.7739,22.7939,64.3688,28.0223,100.2869,13.3647,35.918,14.6577,77.513,9.4293,100.2869-13.3647,13.8782-13.8904,18.4606-30.7517,20.1528-40.4117,1.7726-12.7098,3.5451-25.4196,5.3177-38.1293-.3793.2521-1.0104.6461-1.8353,1.0353Z"
          />
          <path
            style={{ fill: "#2a87e5" }}
            d="m313.6151,317.2321s-3.5436,6.8239-10.1882,6.3371c-6.6516-.4867-13.7388-16.088-27.0386-20.9651-13.2964-4.8771-20.3904,2.9234-20.3904,2.9234,0,0-7.0906-7.8007-20.3834-2.9234-13.2964,4.8771-20.3868,20.4784-27.035,20.9651-6.6482.4867-10.1952-6.3371-10.1952-6.3371,0,0-2.216,5.8504,3.9931,14.1379,6.2021,8.2873,23.4843,11.7719,34.5681,8.2873,12.4042-3.9003,19.0523-13.6475,19.0523-13.6475,0,0,6.2057,10.2374,19.0594,13.6475,11.2041,2.9768,28.3696,0,34.5717-8.2873,6.2021-8.2873,3.9861-14.1379,3.9861-14.1379Z"
          />
          <path
            style={{ fill: "#2a87e5" }}
            d="m120.9543,263.1167c-2.5635-.1449-5.2935-.3052-8.4417-1.0107,1.6746,6.0723,3.7118,10.8458,5.3076,14.1216,3.5173,7.2206,5.7029,11.7073,10.6483,14.7303,4.9251,3.0107,10.1404,3.0739,13.0187,2.8641-2.2014-10.4727-4.4029-20.9454-6.6043-31.4182-2.3931,1.3597-6.316,1.1429-13.9286.7127Z"
          />
          <path
            style={{ fill: "#2a87e5" }}
            d="m391.0457,263.1167c2.5635-.1449,5.2935-.3052,8.4417-1.0107-1.6746,6.0723-3.7118,10.8458-5.3076,14.1216-3.5173,7.2206-5.7029,11.7073-10.6483,14.7303-4.9251,3.0107-10.1404,3.0739-13.0187,2.8641,2.2014-10.4727,4.4029-20.9454,6.6043-31.4182,2.3931,1.3597,6.316,1.1429,13.9286.7127Z"
          />
          <path
            style={{ fill: "#4b9ae9" }}
            d="m481,115c-19.8745-1.7174-40.1378-6.8325-92-31-16.0436-7.4762-37.2822-17.7874-62-31,1.9873,3.1919,4.8568,8.8261,5,16,.1122,5.6236-1.4305,13.195-10,24-18.7028,23.5817-59.3585,48.0452-66,52-6.6415-3.9548-47.2973-28.4183-66-52-8.5695-10.805-10.1122-18.3764-10-24,.1431-7.1739,3.0127-12.8081,5-16-24.7178,13.2126-45.9564,23.5238-62,31-51.8622,24.1675-72.1255,29.2826-92,31-13.1781,1.1388-24.0541.5996-31,0,39.5482,70.4995,73.4528,119.175,84.5679,127.9217,10.081,7.9329,20.6139,11.0473,20.614,11.0473,5.2212,1.5438,9.8553,2.0516,12.6489,2.2372,7.7639.5157,11.6459.7736,14.1647-.8471,7.5458-4.8552,1.4723-17.8651,12.047-31.9999,0,0,.9281-1.2406,2.4332-2.9219,19.1908-21.4373,109.5241-21.4373,109.5242-21.4373,0,0,90.3334,0,109.5242,21.4373,1.5051,1.6813,2.4332,2.9218,2.4332,2.9219,10.5673,14.1248,4.5959,27.2415,12.047,31.9999,2.4652,1.5743,6.365,1.3319,14.1647.8471,1.4996-.0932,6.2149-.4421,11.3524-1.7903,0,0,11.0834-2.9086,21.9105-11.4941,11.1904-8.8736,45.1319-57.4501,84.5679-127.9217-6.9459.5996-17.8219,1.1388-31,0Z"
          />
          <polygon
            style={{ fill: "#e8ad4a" }}
            points="256 0 274 55 332 73 274 91 256 146 238 91 180 73 238 55 256 0"
          />
        </g>
        <g id="TEXT">
          <path
            style={{ fill: "#2f2f2d" }}
            d="m600,120.8325c0-6.2998.4199-10.9199,6.7197-13.4404l27.7207-9.6602c2.9395-1.2598,4.6191-1.6797,6.2998-1.6797,2.9395,0,3.7803,1.6797,3.7803,5.46v262.9189h-31.5c-10.5,0-13.0205-3.3604-13.0205-13.4404V120.8325Zm55.8604,117.1787c-2.5205-6.7197-2.5205-11.7598,0-18.4795l39.8994-114.6592c1.6797-5.8799,5.46-8.8203,11.7598-8.8203,4.6201,0,11.3398,2.9404,16.7998,5.46l18.4805,8.4004c-14.2803,32.3398-34.0205,85.6797-45.3604,117.5996,14.7002,39.0596,33.1807,90.2988,49.1396,123.0586l-21.4189,11.7607c-3.7803,2.0996-10.0801,5.04-15.54,5.04-7.9805,0-10.0801-4.2002-12.1807-10.0801l-41.5791-119.2803Z"
          />
          <path
            style={{ fill: "#2f2f2d" }}
            d="m784.7979,357.2914c-17.2197-4.6201-22.2598-13.8604-22.2598-33.1797v-115.5c0-17.6396,2.1006-25.2002,10.5-35.2803,8.4004-10.499,20.1602-19.7393,33.5996-26.0391,5.04-2.5205,10.0801-3.7803,15.54-3.7803s9.2402.8398,14.2803,2.0996l26.8799,7.9805c17.2197,4.6201,22.2598,13.8594,22.2598,33.1797v115.499c0,17.6406-2.0996,25.2002-10.5,35.2803-8.3994,10.5-19.7393,19.7402-33.5996,26.04-5.04,2.5195-10.0801,3.7803-15.54,3.7803s-9.2402-.8408-14.2803-2.1006l-26.8799-7.9795Zm28.1406-36.96l7.9795,2.0996c6.7197,1.6807,11.3398,1.6807,15.54-1.6797,3.7803-2.5205,5.46-6.7197,5.46-13.0205v-104.999c0-7.1396-.8398-10.5-6.7197-12.1797l-7.9805-2.1006c-6.2998-1.6797-11.3398-1.6797-15.54,1.6807-3.3594,2.5195-5.46,6.7197-5.46,13.0195v105c0,7.1396.8408,10.499,6.7207,12.1797Z"
          />
          <path
            style={{ fill: "#2f2f2d" }}
            d="m917.5146,71.6928h31.0791c9.6602,0,12.6006,2.9395,12.6006,12.5996v280.1387h-31.0801c-9.2402,0-12.5996-2.9404-12.5996-12.5996V71.6928Z"
          />
          <path
            style={{ fill: "#2f2f2d" }}
            d="m993.1094,146.4516h31.0791c9.6602,0,12.6006,2.9404,12.6006,12.6006v149.5195c0,7.1396.8398,10.0791,6.7197,12.1797l7.9795,2.0996c6.3008,1.6807,11.3408,1.2607,15.1201-1.2598,2.9404-2.5195,5.04-6.7197,5.04-13.4395v-161.7002h30.6602c9.6602,0,12.5996,2.9404,12.5996,12.6006v138.5996c0,13.8594,0,19.7393,6.7197,27.2998l12.1807,14.6992-25.6201,22.6807c-4.2002,3.7793-6.7197,5.04-9.6602,5.04-3.3594,0-5.04-1.6807-7.9795-4.6201l-7.1406-8.4004c-2.5195-2.9395-5.04-3.3604-7.9795-.4199-.8398.4199-8.8203,8.4004-9.6602,8.8203-3.3604,2.9395-6.7197,4.6201-11.7598,4.6201-4.2002,0-7.5605-.8408-12.5996-2.1006l-25.6201-7.5596c-17.2197-4.6201-22.6797-13.8604-22.6797-33.1797v-178.0801Z"
          />
          <path
            style={{ fill: "#2f2f2d" }}
            d="m1153.543,213.2319c0-13.8604-.4199-19.7402-6.7197-27.2998l-12.1797-14.7002,26.46-23.0996c3.7803-3.3604,5.8799-4.6201,8.8203-4.6201,3.3594,0,5.8799,2.5195,7.5596,4.6201l7.5596,8.3994c2.5205,2.9404,5.04,3.3604,7.9805.4199.4199-.4199,8.8193-8.3994,9.6602-8.8193,3.3594-2.9404,7.1396-4.6201,11.7598-4.6201,5.04,0,8.3994.8398,13.4395,2.0996l28.9805,8.4004c5.46,1.6797,8.8193,4.2002,11.7598,6.7197,3.3604-3.7803,8.8203-8.8203,13.0195-12.5996,3.7803-2.9404,7.1406-4.6201,12.1807-4.6201s7.9795.8398,13.4395,2.0996l28.9795,8.4004c14.7002,4.2002,18.9004,12.1797,18.9004,31.5v178.9189h-30.6602c-9.6602,0-12.5996-2.9404-12.5996-12.5996v-149.5195c0-7.1396-.8398-10.0801-6.7197-12.1797l-8.4004-2.1006c-6.2998-1.6797-11.3398-1.6797-15.96,2.1006-2.9395,2.5195-4.6201,6.7197-4.6201,13.0195v161.2793h-31.0801c-9.6592,0-12.5996-2.9404-12.5996-12.5996v-149.5195c0-7.1396-.8398-10.0801-6.7197-12.1797l-7.9805-2.1006c-6.7197-1.6797-11.7598-1.6797-15.96,2.1006-3.3594,2.5195-5.0391,6.7197-5.0391,13.0195v161.2793h-31.0801c-9.2402,0-12.1807-2.9404-12.1807-12.5996v-138.5996Z"
          />
          <path
            style={{ fill: "#2f2f2d" }}
            d="m1387.4814,71.6928h31.0791c9.6602,0,12.6006,2.9395,12.6006,12.5996v68.46c.8398-.4199,4.6201-3.7803,5.46-4.6201,3.7793-2.9404,7.5596-4.6201,12.1797-4.6201,5.04,0,8.3994.8398,13.4395,2.0996l25.6201,7.5605c17.2197,4.6201,22.6797,13.8594,22.6797,33.1797v115.9189c0,17.6406-2.0996,25.2002-10.5,35.2803-8.3994,10.5-19.7393,19.7402-33.5996,26.04-5.04,2.5195-10.0801,3.7803-15.54,3.7803s-9.2393-.8408-14.2793-2.1006l-26.8799-7.9795c-17.2207-4.6201-22.2598-13.8604-22.2598-33.1797V71.6928Zm58.3789,250.7383c6.7207,1.6807,11.3398,1.6807,15.96-2.0996,3.3604-2.5205,5.04-6.2998,5.04-13.0205v-104.999c0-7.1396-.8398-10.0801-6.7197-12.1797l-7.9795-2.1006c-6.7207-1.6797-11.7607-1.6797-15.96,2.1006-3.3604,2.5195-5.04,6.7197-5.04,13.0195v105c0,7.1396.8398,10.499,6.7197,12.1797l7.9795,2.0996Z"
          />
          <path
            style={{ fill: "#2f2f2d" }}
            d="m1542.46,146.4516h31.0791c9.6602,0,12.6006,2.9404,12.6006,12.6006v149.5195c0,7.1396.8398,10.0791,6.7197,12.1797l7.9795,2.0996c6.3008,1.6807,11.3398,1.2607,15.1201-1.2598,2.9404-2.5195,5.04-6.7197,5.04-13.4395v-161.7002h30.6602c9.6602,0,12.5996,2.9404,12.5996,12.6006v138.5996c0,13.8594,0,19.7393,6.7197,27.2998l12.1807,14.6992-25.6201,22.6807c-4.2002,3.7793-6.7197,5.04-9.6602,5.04-3.3594,0-5.04-1.6807-7.9795-4.6201l-7.1406-8.4004c-2.5195-2.9395-5.04-3.3604-7.9795-.4199-.8398.4199-8.8203,8.4004-9.6602,8.8203-3.3604,2.9395-6.7197,4.6201-11.7598,4.6201-4.2002,0-7.5605-.8408-12.5996-2.1006l-25.6201-7.5596c-17.2197-4.6201-22.6797-13.8604-22.6797-33.1797v-178.0801Z"
          />
          <path
            style={{ fill: "#2f2f2d" }}
            d="m1683.1553,347.2114l16.3799-25.2002c2.9395-4.2002,7.1396-5.8799,13.8594-3.7803l15.54,4.2002c9.2402,2.5205,16.7998.8398,21.8398-4.6201,3.7803-3.7793,6.3008-9.6592,6.3008-16.3799,0-11.7598-8.8203-17.2197-24.7803-30.2393l-14.7002-12.6006c-18.0596-14.2793-28.5596-28.5596-28.5596-52.0791,0-21,13.0195-42.8398,42.8398-58.3799,5.8799-3.3604,11.3398-4.6201,16.3799-4.6201,4.6201,0,7.9795.4199,13.0195,2.0996l33.1797,9.2402c5.4609,1.6797,5.8809,5.04,3.3604,8.8203l-16.3799,24.7793c-2.5195,4.6201-7.5596,5.8799-14.7002,3.7803l-12.5996-3.7803c-7.1396-1.6797-13.0195-.8398-16.3799,2.1006-4.6201,2.9395-6.7197,8.3994-6.7197,13.4395,0,8.8203,5.46,14.2803,17.2197,23.9404l19.3203,15.5391c19.7393,15.54,30.6592,31.5,30.6592,55.4404,0,30.2393-22.6797,51.6592-49.1396,65.0996-5.8799,2.9395-10.0801,3.3604-15.54,3.3604-4.6201,0-8.8193-.8408-13.8594-2.1006l-34.0205-9.6602c-4.6201-1.2598-5.04-5.04-2.5195-8.3994Z"
          />
        </g>
      </g>
    </svg>
  ),
  //#endregion
};

// name: ({ ...props }: SvgProps) => (),

export default Icon;
