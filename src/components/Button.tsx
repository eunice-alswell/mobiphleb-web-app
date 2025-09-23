
type VariantStyle = "defualtStyle" | "secondaryStyle" | "outlineStyle" | "secondaryOutlineStyle" | "iconstyle" | "noBgStyle" | "whiteStyle" | "disabledStyle";

type ButtonProps = {
    variantStyle?: VariantStyle;
    size?: "small" | "medium" | "large";
    onClick?: () => void;
    label?: string;
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    type?: "button" | "submit" | "reset";
    customStyle?: string;
    disable?: boolean;
};
export default function Button({variantStyle = "defualtStyle", size = "medium", onClick, label, rightIcon, leftIcon, type = "button", customStyle, disable}: ButtonProps) {
    // This is a simple button component that can be used in the in any part of the website.
    const variantStyles = {
        defualtStyle: "text-white bg-primaryColor hover:bg-transparent hover:border-2 hover:border-primaryColor hover:text-primaryColor focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center dark:bg-primaryColor dark:hover:bg-transparent dark:hover:border-2 dark:hover:border-primaryColor dark:hover:text-primaryColor dark:focus:ring-primaryColor transition-colors duration-300 ease-in-out",
        noBgStyle: "text-primaryColor bg-none hover:bg-transparent hover:border-2 hover:border-primaryColor hover:text-primaryColor focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm text-center dark:bg-none dark:hover:bg-transparent dark:hover:border-2 dark:hover:border-primaryColor dark:hover:text-primaryColor dark:focus:ring-primaryColor transition-colors duration-300 ease-in-out",
        secondaryStyle: "text-primaryColor bg-white hover:bg-transparent hover:border-2 hover:border-white hover:text-white focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-4xl text-sm text-center dark:bg-white dark:hover:bg-transparent dark:hover:border-2 dark:hover:border-white dark:hover:text-white dark:focus:ring-primaryColor transition-colors duration-300 ease-in-out",
        outlineStyle: "text-primaryColor border border-primaryColor bg-transparent hover:bg-primaryColor hover:text-white focus:ring-4 focus:outline-none focus:ring-primaryColor font-medium rounded-4xl text-sm px-5 py-2 text-center transition-colors duration-300 ease-in-out",
        secondaryOutlineStyle: "text-white border border-white bg-transparent hover:bg-white hover:text-primaryColor focus:ring-4 focus:outline-none focus:ring-w font-medium rounded-4xl text-sm px-5 py-2 text-center transition-colors duration-300 ease-in-out",
        iconstyle: "text-primaryColor bg-transparent hover:bg-transparent hover:outline-2 hover:outline-primaryColor focus:ring-2 focus:outline-none focus:ring-primaryColor font-medium rounded-full text-sm px-5 py-2 text-center dark:bg-primaryColor dark:hover:bg-primaryColor dark:focus:ring-primaryColor transition-colors duration-300 ease-in-out",
        disabledStyle: "opacity-50 cursor-not-allowed",
        whiteStyle: "text-white bg-transparent hover:bg-transparent hover:border-2 hover:border-white focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-4xl text-sm text-center dark:bg-none dark:hover:bg-transparent dark:hover:border-2 dark:hover:border-white dark:focus:ring-white transition-colors duration-300 ease-in-out",
    };

    const sizeStyle = {
        small: "text-xs px-3 py-1",
        medium: "text-sm px-5 py-2",
        large: "text-lg px-6 py-3",
    };
    const appliedVariantStyle = variantStyles[variantStyle]||variantStyles.defualtStyle; // You can change this to any variant you want
    const appliedSizeStyle = sizeStyle[size] || sizeStyle.medium; // Default to medium if size is not specified
  return (
    <button 
        disabled={disable}
        type={type}
        className={`flex items-center justify-center ${appliedVariantStyle} ${appliedSizeStyle} ${customStyle}`}
        onClick={onClick}>
        {leftIcon && <span className="inline-flex items-center mr-2">{leftIcon}</span>}
        <span className="inline-flex items-center">{label}</span>
        {rightIcon && <span className="inline-flex items-center ml-2">{rightIcon}</span>}
        {disable && <span className="absolute inset-0 bg-gray-200 opacity-50 rounded-md"></span>}
    </button>
  )
}