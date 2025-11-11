export default function Loading()
{
    return (
            <div className="flex flex-col items-center my-70">
                <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-gray-700 my-7">
                    Loading, please wait...
                </p>
            </div>
       
    )
}