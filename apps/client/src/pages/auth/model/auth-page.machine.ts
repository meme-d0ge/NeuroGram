import { assign, setup } from "xstate";

export const AuthPageMachine = setup({
	types: {
		context: {} as { otpToken: null | string },
		events: {} as {
			type: "SEND_OTP";
			otpToken: string;
		},
	},
}).createMachine({
	id: "auth-page",
	initial: "phoneStep",
	context: {
		otpToken: null,
	},
	states: {
		phoneStep: {
			on: {
				SEND_OTP: {
					actions: assign({
						otpToken: ({ event }) => event.otpToken,
					}),
					target: "otpStep",
				},
			},
		},
		otpStep: {},
		registerStep: {},
	},
});
