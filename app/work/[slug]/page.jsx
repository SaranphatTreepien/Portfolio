import works from "@/data/works";
import Link from "next/link";
import ProjectContent from "./ProjectContent";

export default async function WorkDetailPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const project = works.find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="p-10 text-red-500">
        Project not found.
        <Link href="/">
          <button className="mt-4 px-6 py-3 bg-green-500 text-white rounded">
            กลับหน้า Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-20 px-4 overflow-hidden bg-gradient-to-b from-[#f0f7f6] to-[#e6f1ef]">

      {/* Floating circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#cde7e3] rounded-full opacity-25 blur-3xl -z-10 animate-spin-slow"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#bde1dc] rounded-full opacity-20 blur-2xl -z-10 animate-spin-slow-reverse"></div>

      {/* Back Button */}
      <Link href="/">
        <button className="fixed top-6 left-6 z-50 p-3 bg-[#7edad2] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition backdrop-blur-md">
          ←
        </button>
      </Link>

      {/* Title Centered */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          {project.title}
        </h1>

        {/* 🔥 Underline Style */}
        <div className="w-28 h-1 bg-gradient-to-r from-[#7edad2] to-[#79d3cc] mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Project Content */}
      <div className="max-w-4xl mx-auto">
        <ProjectContent content={project.content} />
      </div>

    </div>
  );
}
