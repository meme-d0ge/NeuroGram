import { UaHeaders } from "./pickUaHeaders.js";

export type ClientDescription = {
	device: string;
	platform: string;
	application: string;
};

import DeviceDetectorModule, { type DetectResult } from "node-device-detector";
import ClientHintsModule from "node-device-detector/client-hints.js";

const DeviceDetector =
	DeviceDetectorModule as unknown as typeof DeviceDetectorModule.default;
const ClientHints =
	ClientHintsModule as unknown as typeof ClientHintsModule.default;

const detector = new DeviceDetector({
	deviceIndexes: true,
	clientIndexes: true,
	osIndexes: true,
});
const clientHints = new ClientHints();

type HonestResult = { [K in keyof DetectResult]: Partial<DetectResult[K]> };

export function describeClient(uaHeaders: UaHeaders): ClientDescription {
	const result: HonestResult = detector.detect(
		uaHeaders["user-agent"] ?? "",
		clientHints.parse(uaHeaders, {}),
	);

	const appName = result.client.name || "Unknown";
	const appVersion = result.client.version ? ` ${result.client.version}` : "";

	const osName = result.os.name || "Unknown";
	const osVersion = result.os.version ? ` ${result.os.version}` : "";

	let device = "Desktop";
	if (result.device.model) {
		device = result.device.brand
			? `${result.device.brand} ${result.device.model}`
			: result.device.model;
	} else if (result.device.type && result.device.type !== "desktop") {
		device =
			result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1);
	}

	return {
		device,
		platform: `${osName}${osVersion}`,
		application: `${appName}${appVersion}`,
	};
}
