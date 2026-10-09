import { Reader, ReaderModel } from "@maxmind/geoip2-node";
import { Module } from "@nestjs/common";
import { ENV } from "../../config/config.module.js";
import { Env } from "../../config/env.js";
import { GEOIP_READER } from "./geo-ip.constant.js";
import { GeoIpService } from "./geo-ip.service.js";

@Module({
	providers: [
		{
			provide: GEOIP_READER,
			inject: [ENV],
			useFactory: (env: Env): Promise<ReaderModel> =>
				Reader.open(env.GEOIP_DB_PATH),
		},
		GeoIpService,
	],
	exports: [GeoIpService],
})
export class GeoIpModule {}
