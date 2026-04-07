import type {FC, ReactNode} from "react";

type Props = {
	onClick?: () => void
	children?: ReactNode
	disabled?: boolean
}

const Button: FC<Props> = ({onClick, children, disabled = false}) => {
	return (
		<button onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
}

export default Button;