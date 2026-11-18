"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { isShowcase } from "~/config/site";
import { placeFallbackImageUrl } from "~/lib/constants";
import { PlacesDetailsResponse } from "~/lib/validations/google";

export default function PlaceImage(props: {
  src?: string | null;
  size?: number;
  googleId?: string | null;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const photo = useQuery({
    queryKey: ["google-place-photo", props.googleId],
    enabled: isShowcase && !!props.googleId,
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ action: "photo", placeId: props.googleId! });
      const response = await fetch(`/api/places?${params.toString()}`, { signal });
      if (!response.ok) throw new Error("Photo unavailable");
      const data = PlacesDetailsResponse.parse(await response.json());
      const photo = data.result.photos?.[0];
      if (data.status !== "OK" || !photo) return null;

      return {
        src: `/api/places?${new URLSearchParams({ action: "image", reference: photo.photo_reference }).toString()}`,
        attributions: [...data.html_attributions, ...photo.html_attributions].map((html) => {
          const document = new DOMParser().parseFromString(html, "text/html");
          const href = document.querySelector("a")?.getAttribute("href");
          return {
            label: document.body.textContent ?? "Photo",
            href: href?.startsWith("https://") ? href : undefined,
          };
        }),
      };
    },
  });
  const imageUrl = photo.data?.src ?? resolveImageUrl(props.src);
  const failed = imageUrl === failedSource;
  const source = failed ? "/place-fallback.png" : imageUrl;

  if (source.startsWith("/") || source.startsWith(placeFallbackImageUrl)) {
    return (
      <>
        <Image
          src={source}
          alt="Place Image"
          className="select-none object-cover object-center"
          sizes={props?.size ? `${props.size * 4}px` : undefined}
          onError={() => setFailedSource(imageUrl)}
          priority
          fill
        />
        {!failed && photo.data && (
          <span className="absolute bottom-0 right-0 max-w-full bg-white/90 px-1 text-xs text-gray-700">
            <span translate="no" className="block whitespace-nowrap">
              Google Maps
            </span>
            {photo.data.attributions.map((attribution, index) => (
              <a
                key={index}
                className="block"
                href={attribution.href}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
              >
                {attribution.label}
              </a>
            ))}
          </span>
        )}
      </>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="Place Image" className="select-none object-cover object-center" />
  );
}

function resolveImageUrl(imageUrl?: string | null) {
  if (isShowcase) return "/place-fallback.png";
  if (!imageUrl || imageUrl.startsWith(placeFallbackImageUrl)) return placeFallbackImageUrl;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("ref:")) {
    return `/api/get-google-image?imageRef=${imageUrl.split("ref:")[1]}&width=156&height=82`;
  }

  return placeFallbackImageUrl;
}
