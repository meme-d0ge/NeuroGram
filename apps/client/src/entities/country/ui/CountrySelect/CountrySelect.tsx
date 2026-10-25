import { Dialog } from "@base-ui/react";
import { Combobox } from "@base-ui/react/combobox";
import { ArrowLeft, Check, ChevronDown, Search } from "lucide-react";
import { Fragment, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { useCountryNames } from "@/entities/country/lib/useCountryNames.ts";
import {
	type CountryCode,
	getDialCode,
} from "@/entities/country/model/countries.ts";
import { CountryFlag } from "@/entities/country/ui/CountryFlag/CountryFlag.tsx";
import { useMediaQuery } from "@/shared/lib/useMediaQuery.ts";
import styles from "./CountrySelect.module.scss";

const CountryList = () => {
	const { searchCountryOrCode } = useIntlayer("country-select");
	const { getName } = useCountryNames();

	return (
		<Fragment>
			<div className={styles["country-list__input-container"]}>
				<Search className={styles["country-list__input-icon"]} />
				<Combobox.Input
					className={styles["country-list__input"]}
					placeholder={searchCountryOrCode}
				/>
			</div>
			<Combobox.List className={styles["country-list"]}>
				{(code: CountryCode) => (
					<Combobox.Item
						key={code}
						value={code}
						className={styles["country-list__item"]}
					>
						<div className={styles["country-list__item-left"]}>
							<CountryFlag
								code={code}
								className={styles["country-list__item-left-flag"]}
							/>
							<span className={styles["country-list__item-left-name"]}>
								{getName(code)}
							</span>
						</div>
						<div className={styles["country-list__item-right"]}>
							<span className={styles["country-list__item-right-dialCode"]}>
								{getDialCode(code)}
							</span>
							<Combobox.ItemIndicator
								className={styles["country-list__item-right-indicator"]}
							>
								<Check />
							</Combobox.ItemIndicator>
						</div>
					</Combobox.Item>
				)}
			</Combobox.List>
		</Fragment>
	);
};
const TriggerContent = ({ value }: { value: CountryCode }) => {
	const { getName } = useCountryNames();
	return (
		<Fragment>
			<CountryFlag code={value} className={styles.trigger__flag} />
			<span className={styles.trigger__name}>{getName(value)}</span>
			<ChevronDown className={styles.trigger__icon} />
		</Fragment>
	);
};

interface CountrySelectProps {
	id?: string;
	value: CountryCode;
	onChange: (value: CountryCode) => void;
}
export const CountrySelect = (props: CountrySelectProps) => {
	const { back, selectCountry } = useIntlayer("country-select");
	const { codes, getName } = useCountryNames();
	const isMobile = useMediaQuery(`(max-width: 767px)`);
	const [open, setOpen] = useState(false);

	return (
		<Combobox.Root
			id={props.id}
			items={codes}
			open={open}
			onOpenChange={setOpen}
			value={props.value}
			onValueChange={(v) => {
				if (v) props.onChange(v);
			}}
			itemToStringLabel={getName}
			inline={isMobile}
		>
			{isMobile ? (
				<Dialog.Root open={open} onOpenChange={setOpen}>
					<Dialog.Trigger id={props.id} className={styles.trigger}>
						<TriggerContent value={props.value} />
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Popup className={styles.dialog}>
							<div className={styles.dialog__header}>
								<Dialog.Close
									className={styles["dialog__header-close"]}
									aria-label={back}
								>
									<ArrowLeft />
								</Dialog.Close>
								<Dialog.Title className={styles["dialog__header-title"]}>
									{selectCountry}
								</Dialog.Title>
							</div>
							<CountryList />
						</Dialog.Popup>
					</Dialog.Portal>
				</Dialog.Root>
			) : (
				<Fragment>
					<Combobox.Trigger className={styles.trigger}>
						<Combobox.Value placeholder={selectCountry}>
							<TriggerContent value={props.value} />
						</Combobox.Value>
					</Combobox.Trigger>
					<Combobox.Portal>
						<Combobox.Positioner className={styles.positioner}>
							<Combobox.Popup className={styles.popup}>
								<CountryList />
							</Combobox.Popup>
						</Combobox.Positioner>
					</Combobox.Portal>
				</Fragment>
			)}
		</Combobox.Root>
	);
};
