import works from "@/data/works";
import Link from "next/link";
import ProjectContent from "./ProjectContent";

export default async function WorkDetailPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const project = works.find((item) => item.slug === slug);

 if (!project) {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col text-center p-4">
      <p className="text-red-500 text-lg mb-4">Project not found.</p>
      <Link href="/">
        <button className="px-6 py-3 bg-gradient-to-r from-[#7edad2] to-[#79d3cc] text-white rounded-lg shadow-md hover:scale-105 transition-transform">
          กลับหน้า Home
        </button>
      </Link>
    </div>
  );
}


  return (
    <div className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-[#f0f7f6] to-[#e6f1ef] overflow-x-hidden">

      {/* Floating Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#cde7e3] rounded-full opacity-25 blur-3xl -z-10 animate-spin-slow"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#bde1dc] rounded-full opacity-20 blur-2xl -z-10 animate-spin-slow-reverse"></div>

      {/* Back Button */}
      <Link href="/">
        <button className="fixed top-6 left-6 z-50 p-3 bg-[#7edad2] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition">
          ←
        </button>
      </Link>

      {/* Title + Info Card */}
      <div className="max-w-4xl mx-auto text-center mb-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 drop-shadow-md">
          {project.title}
        </h1>
        <div className="w-28 h-1 bg-gradient-to-r from-[#7edad2] to-[#79d3cc] mx-auto mt-4 rounded-full"></div>

        {/* Info Card */}
        <div className="mt-8 p-6 bg-white text-gray-800 rounded-3xl shadow-xl max-w-2xl mx-auto relative hover:shadow-2xl transition-transform duration-300">
          <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center tracking-wide">Project Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-inner">
              <span className="mr-2 text-lg">📅</span>
              <span className="font-semibold">Year:</span>&nbsp;{project.info.year}
            </div>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-inner">
              <span className="mr-2 text-lg">💼</span>
              <span className="font-semibold">Role:</span>&nbsp;{project.info.role}
            </div>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-inner">
              <span className="mr-2 text-lg">🛠️</span>
              <span className="font-semibold">Tools:</span>&nbsp;{project.info.tools}
            </div>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-inner">
              <span className="mr-2 text-lg">⏱️</span>
              <span className="font-semibold">Duration:</span>&nbsp;{project.info.duration}
            </div>
          </div>
 
        </div>
      </div>

      {/* Project Content */}
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        <ProjectContent content={project.content} />
      </div>
    </div>
  );
}
