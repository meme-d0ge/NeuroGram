import { AddressNotFoundError, ReaderModel } from "@maxmind/geoip2-node";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { GEOIP_READER } from "./geo-ip.constant.js";

@Injectable()
export class GeoIpService {
	private logger = new Logger(GeoIpService.name);
	constructor(
		@Inject(GEOIP_READER) private readonly geoipReader: ReaderModel,
	) {}

	getLocationFromIp(ip: string) {
		try {
			const city = this.geoipReader.city(ip);
			this.logger.debug(city);
			return `${city.country?.names?.en ?? ""} ${city?.city?.names?.en ?? ""}`;
		} catch (err) {
			if (err instanceof AddressNotFoundError) {
				this.logger.warn(`AddressNotFoundError - ${ip}`);
				return "Unknown";
			}

			this.logger.error(err);
			return "Unknown";
		}
	}
}
