import { FaBell, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Navbar() {

return (

<header className="h-16 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-8">


<input
type="text"
placeholder="Search repositories..."
className="w-96 bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 text-white"
/>



<div className="flex items-center gap-5">


<Link
to="/create-repository"
className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md flex items-center gap-2"
>

<FaPlus/>

New

</Link>



<FaBell className="text-xl"/>


<div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
M
</div>


</div>


</header>

);

}


export default Navbar;