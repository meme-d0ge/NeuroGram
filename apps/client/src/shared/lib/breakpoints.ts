import {
	DESKTOP_ABOVE_QUERY,
	DESKTOP_L_ABOVE_QUERY,
	DESKTOP_L_QUERY,
	DESKTOP_QUERY,
	MOBILE_ABOVE_QUERY,
	MOBILE_QUERY,
	MOBILE_S_ABOVE_QUERY,
	MOBILE_S_QUERY,
	TABLET_ABOVE_QUERY,
	TABLET_QUERY,
} from "@/shared/config";
import { useMediaQuery } from "@/shared/lib/useMediaQuery.ts";

export const useIsAboveDesktopL = () => useMediaQuery(DESKTOP_L_ABOVE_QUERY);
export const useIsDesktopL = () => useMediaQuery(DESKTOP_L_QUERY);

export const useIsAboveDesktop = () => useMediaQuery(DESKTOP_ABOVE_QUERY);
export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY);

export const useIsAboveTablet = () => useMediaQuery(TABLET_ABOVE_QUERY);
export const useIsTablet = () => useMediaQuery(TABLET_QUERY);

export const useIsAboveMobile = () => useMediaQuery(MOBILE_ABOVE_QUERY);
export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);

export const useIsAboveMobileS = () => useMediaQuery(MOBILE_S_ABOVE_QUERY);
export const useIsMobileS = () => useMediaQuery(MOBILE_S_QUERY);
