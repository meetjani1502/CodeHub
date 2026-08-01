function Button({ children, ...props }) {

    return (

        <button

            {...props}

            className="w-full bg-green-600 hover:bg-green-500 transition rounded-md py-2 text-white font-semibold"

        >

            {children}

        </button>

    );

}

export default Button;